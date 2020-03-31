import React from 'react';
import { debounce } from 'lodash';
import { UnorderedListOutlined } from '@ant-design/icons';
import { Input, Tree, Tooltip, List, Typography } from 'antd';
import { loadModules } from 'esri-loader';
import { connect } from 'dva';
// import router from 'umi/router';

import { treeData } from './treeData.js';
import { template } from './featureTemplate.js';
import style from './style.css';

const { Search } = Input;
const { TreeNode } = Tree;
let EsriFeatureLayer;
let EsriWebTileLayer;
let flag = false;
let tempFeatureLayer = null;


@connect(({ remoteSensing, layer }) => ({
  fuzzyChangespot: remoteSensing.fuzzyChangespot,
  geomotry: remoteSensing.geomotry,
  layerTree: layer.layerTree,
  layerUrl: layer.layerUrl,
}))


class SearchGIS extends React.Component {
  constructor(props) {
    super(props);
    // const { dispatch, fuzzyChangespot } = props;
    this.inputValChange = debounce(this.inputValChange, 100);
    // 设置 initial state
    this.state = {
      isToggleOn: true,
      height: 0,
      paddingTop: 0,
      searchPanelVisiable: 'hidden',
      searchData: [],
      treeDatas: treeData,
    };
  }

  componentDidMount() {

    loadModules(['esri/layers/FeatureLayer', 'esri/layers/WebTileLayer']).then(
      ([FeatureLayer, WebTileLayer]) => {
        EsriFeatureLayer = FeatureLayer;
        EsriWebTileLayer = WebTileLayer;
        flag = false;
        this.triggerAction();

        const { dispatch } = this.props;

        // 图层数据
        // dispatch({
        //   type: 'layer/fetchLayerTree'
        // }).then(tree => {
        //   this.setState({
        //     treeDatas: tree,
        //   });
        //   console.log(tree)
        // });

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
      // if (type!== 'parent') {
      const nodeUrl = checkedNode.layerUrl;
      const nodeId = checkedNode.key;
      switch (type) {
        case 'tile':
          this.props.view.map.add(new EsriWebTileLayer({ urlTemplate: nodeUrl, id: nodeId }));
          break;
        case 'feature':
          this.props.view.map.add(
            new EsriFeatureLayer({ url: nodeUrl, id: nodeId, popupTemplate: template }),
          );
          break;

        default:
          break;
      }
      // }
    });
  };

  inputValChange = value => {
    const { dispatch, fuzzyChangespot } = this.props;
    this.setState(
      {
        isToggleOn: false,
        height: 0,
        paddingTop:0,
        searchPanelVisiable: 'visible',
        searchData: [],
      },
      () => {
        const str = value.replace(/\s*/g, '');
        const temp = [];
        if (str !== '') {

          const obj2 = {};
          obj2.BATCH = '2020年第一期';
          obj2.COUNTY = '沛县';
          obj2.LOCATION = '沛县';
          obj2.TBBM = 'Y18103231071N02';
          temp.push(obj2);
          this.setState({
            searchData: temp,
          });
          dispatch({
            type: 'remoteSensing/fetchChangespotFuzzyQuery',
            payload: { term: str },
          }).then(() => {
            if (fuzzyChangespot) {
              fuzzyChangespot.forEach(item => {
                const obj = {};
                obj.BATCH = item.BATCH;
                obj.COUNTY = item.COUNTY;
                obj.LOCATION = item.LOCATION;
                obj.TBBM = item.TBBM;
                temp.push(obj);
              });
              this.setState({
                searchData: temp,
              });
            }
          });
        } else {
          if (tempFeatureLayer)
            this.props.view.map.remove(
              tempFeatureLayer
            );
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

  serchItemClick = TBBM => {
    const { dispatch, geomotry } = this.props;
    dispatch({
      type: 'remoteSensing/fetchChangespotGeomotry',
      payload: { tbbm: TBBM },
    }).then(() => {
      console.log(geomotry);
    });


    if (tempFeatureLayer)
      this.props.view.map.remove(
        tempFeatureLayer
      );
    tempFeatureLayer = new EsriFeatureLayer({ url: 'http://218.3.176.6:6080/arcgis/rest/services/GL/GLBHTB_Test/MapServer/0', id: 'test', popupTemplate: template });
    this.props.view.map.add(
      tempFeatureLayer
    )

    this.props.view.extent = {
      type: "extent",
      xmax: 13026057.551445255,
      xmin: 13025591.166139795,
      ymax: 4077224.692780885,
      ymin: 4076708.145675606,
      spatialReference: { wkid: 102100 }
    }

  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} />;
    });

  render() {
    return (
      <>
        <Search
          placeholder="输入查询关键字..."
          onChange={this.handleInputSearch}
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
                onClick={() => this.serchItemClick(item.TBBM)}
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
          overflowY:'auto',
          paddingTop: this.state.paddingTop,
          backgroundColor: 'white',
          boxShadow: '2px 2px 1px #888888'
        }}>

          <Tree
            checkable
            showLine
            onCheck={this.onCheck}
            treeData={this.state.treeDatas}
            defaultExpandAll
            style={{
              background: '#FFF',
              height: this.state.height,
              transition: '.3s all ease-in',
              paddingLeft: 12,
              fontSize: 16
            }}
          />

        </div>
      </>
    );
  }
}

export default SearchGIS;
