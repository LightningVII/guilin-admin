import React from 'react';
import { debounce } from 'lodash';
import { UnorderedListOutlined } from '@ant-design/icons';
import { Input, Tree, Tooltip, List, Typography, Empty } from 'antd';
import { loadModules } from 'esri-loader';
import { connect } from 'dva';
// import router from 'umi/router';

import { template } from './json/featureTemplate.js';
import { bhtblLineSymbol } from './json/lineSymbol.js'
import style from './css/style.css';

const { Search } = Input;
let EsriFeatureLayer;
let EsriWebTileLayer;
let EsriGraphic;
let EsriPolygon;
let flag = false;


@connect(({ remoteSensing, layer }) => ({
  fuzzyChangespot: remoteSensing.fuzzyChangespot,
  geomotry: remoteSensing.geomotry,
  layerTree: layer.layerTree,
  layerUrl: layer.layerUrl,
  remoteSensing
}))


class SearchGIS extends React.Component {
  constructor(props) {
    super(props);
    // const { dispatch, fuzzyChangespot } = props;
    this.inputValChange = debounce(this.inputValChange, 10);
    // 设置 initial state
    this.state = {
      isToggleOn: true,
      height: 0,
      paddingTop: 0,
      searchPanelVisiable: 'hidden',
      searchData: [],
      treeDatas: [],
      expandedKeys: []
    };
  }

  componentDidMount() {
    loadModules(['esri/layers/FeatureLayer', 'esri/layers/WebTileLayer', "esri/Graphic", "esri/geometry/Polygon"]).then(
      ([FeatureLayer, WebTileLayer, Graphic, Polygon]) => {
        EsriFeatureLayer = FeatureLayer;
        EsriWebTileLayer = WebTileLayer;
        EsriGraphic = Graphic;
        EsriPolygon = Polygon;
        flag = false;
        this.triggerAction();

        const { dispatch } = this.props;

        // 图层数据
        dispatch({
          type: 'layer/fetchLayerTree'
        }).then(res => {
          const expandKeys = [];
          res.forEach(t => {
            expandKeys.push(t.key)
          })
          this.setState({
            treeDatas: res,
            expandedKeys: expandKeys
          });
        });
      },
    );
  }

  handleInputSearch = e => {
    this.inputValChange(e.target.value);
  };

  onCheck = (checkedKeys, e) => {
    this.loadToMap(checkedKeys, e);
  };

  triggerAction = () => {
    if (!flag) {
      flag = true;
      this.props.view.popup.on('trigger-action', evt => {
        const featureGraphic = evt.target.content.graphic;
        if (evt.action.id === 'show-detail') {
          window.open(`#/remote-sensing/details/${featureGraphic.attributes.TBBM}`);
        } else if (evt.action.id === 'show-compare') {
          this.props.addFeature(featureGraphic);
        }
      });
    }
  };

  loadToMap = (checkedKeys, e) => {
    this.props.view.map.removeAll();
    e.checkedNodes.forEach(checkedNode => {
      const type = checkedNode.loadType;
      const nodeUrl = checkedNode.layerUrl;
      const nodeId = checkedNode.key;
      switch (type) {
        case 'tile':
          this.props.view.map.add(new EsriWebTileLayer({ urlTemplate: nodeUrl, id: nodeId }));
          break;
        case 'feature':
          if(checkedNode.title==="行政区划") 
          this.props.view.map.add(
            new EsriFeatureLayer({ url: nodeUrl, id: nodeId}),
          );else
          this.props.view.map.add(
            new EsriFeatureLayer({ url: nodeUrl, id: nodeId, popupTemplate: template }),
          );
          break;

        default:
          break;
      }
    });
  };

  inputValChange = value => {

    const { dispatch } = this.props;
    this.setState(
      {
        isToggleOn: false,
        height: 0,
        paddingTop: 0,
        searchPanelVisiable: 'visible',
        searchData: [],
      },
      () => {
        const str = value.replace(/\s*/g, '');
        const temp = [];
        if (str !== '') {
          dispatch({
            type: 'remoteSensing/fetchChangespotFuzzyQuery',
            payload: { term: str },
          }).then(res => {
            if (res?.code === 200) {
              res.content.forEach(item => {
                temp.push(item);
              });
              this.setState({
                searchData: temp,
              });
            }
          })
        } else {
          this.props.view.graphics.removeAll()
          this.setState({
            searchPanelVisiable: 'hidden',
            searchData: [],
          });
        }
      },
    );
  };

  handleClick = () => {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn,
      height: !prevState.isToggleOn ? 0 : 'calc( 100vh - 260px )',
      paddingTop: !prevState.isToggleOn ? 0 : 12
    }));
  };

  serchItemClick = item => {
    const mapView = this.props.view;
    const tbbm = item.TBBM
    const { dispatch } = this.props;
    dispatch({
      type: 'remoteSensing/fetchChangespotGeomotry',
      payload: { tbbm },
    }).then(res => {
      if (res?.code === 200) {
        const geomotry = res.content;
        const polygon = new EsriPolygon({
          hasZ: true,
          hasM: true,
          rings: geomotry.coordinates,
        });
        const g = new EsriGraphic({
          geometry: polygon,
          symbol: bhtblLineSymbol,
        });
        mapView.extent = polygon.extent
        mapView.graphics.removeAll()
        mapView.graphics.add(g);
        mapView.popup.open({
          location: polygon.extent.center,
          title: item.LOCATION,
          content: `<div class="table-a"> 
          <table width="400" border="0" cellspacing="0" cellpadding="10">  
          <tr> <td>图斑编码：</td> <td>${item.TBBM}</td> </tr>
          <tr> <td>区县：</td> <td>${item.COUNTY}</td> </tr>
          <tr> <td>批次：</td> <td>${item.BATCH}</td> </tr>
          <tr> <td>前时相：</td> <td>${item.QSX}</td> </tr>
          <tr> <td>后时相：</td> <td>${item.HSX}</td> </tr>
          <tr> <td>前时相地类名称：</td> <td>${item.QSXDLMC}</td> </tr>
          <tr> <td>后时相地类名称：</td> <td>${item.HSXDLMC}</td> </tr>
          <tr> <td>状态：</td> <td>${item.STATE}</td> </tr>
          <tr> <td>面积：</td> <td>${item.AREA}</td> </tr>
          </table></div>`,
        });
      }
    });

  };

  render() {
    return (
      <>
        <Search
          placeholder="输入查询关键字..."
          onChange={this.handleInputSearch}
          onPressEnter={this.handleInputSearch}
          onSearch={this.inputValChange}
          onClick={this.handleClick}
          className={style.search}
          allowClear
          size="large"
          prefix={
            <Tooltip placement="bottom" title="图层">
              <UnorderedListOutlined style={{ cursor: 'pointer' }} onClick={this.handleClick} />
            </Tooltip>
          }
        />
        <div className={style.searchList} style={{ visibility: this.state.searchPanelVisiable }}>
          <List
            style={{ maxHeight: '35vh', overflowY: 'scroll' }}
            bordered
            dataSource={this.state.searchData}
            renderItem={item => (
              <List.Item
                style={{ cursor: 'pointer' }}
                onClick={() => this.serchItemClick(item)}
              >
                {item.TBBM}
                <Typography.Text code>{item.COUNTY}</Typography.Text>
                <Typography.Text code>{item.BATCH}</Typography.Text>
              </List.Item>
            )}
          />
        </div>

        <div style={{
          width: 300,
          overflow: 'hidden',
          overflowY: 'auto',
          height: this.state.height,
          transition: '.3s all ease-in',
          paddingTop: this.state.paddingTop,
          backgroundColor: 'white',
          boxShadow: '2px 2px 1px #888888'
        }}>

          {
            this.state.treeDatas ? (
              <Tree
                checkable
                showLine
                onCheck={this.onCheck}
                treeData={this.state.treeDatas}
                expandedKeys={this.state.expandedKeys}
                defaultExpandAll
                style={{
                  background: '#FFF',
                  paddingLeft: 12,
                  fontSize: 16
                }}
              />

            ) : (<Empty />)
          }

        </div>
      </>
    );
  }
}

export default SearchGIS;
