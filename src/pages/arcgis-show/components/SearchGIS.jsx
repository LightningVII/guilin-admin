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
    this.inputValChange = debounce(this.inputValChange, 100)
    // 设置 initial state
    this.state = {
      isToggleOn: true,
      height: 0,
      searchPanelVisiable: 'hidden',
      searchData: [],
      treeDatas: treeData
    };

    loadModules([
      'esri/layers/FeatureLayer',
      'esri/layers/WebTileLayer'
    ]).then(([FeatureLayer, WebTileLayer]) => {
      EsriFeatureLayer = FeatureLayer;
      EsriWebTileLayer = WebTileLayer;
      flag = false;
    });
  }

  componentDidMount() {
    const { dispatch, layerTree } = this.props;
    
    dispatch({
      type: 'layer/fetchLayerTree'
    }).then(() => {
      
      this.setState({
        treeDatas:layerTree.ok?layerTree:treeData
      })
    });
  }


  handleInputSearch = e => {
    this.inputValChange(e.target.value)
  }


  onCheck = (checkedKeys, e) => {
    this.loadToMap(checkedKeys, e);
    this.triggerAction();
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
  }


  loadToMap = (checkedKeys, e) => {
    this.props.view.map.removeAll();
    e.checkedNodes.forEach(checkedNode => {
      const type = checkedNode.loadType;
      if (type) {
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
      }
    });
  }

  inputValChange = value => {
    const { dispatch, fuzzyChangespot } = this.props;
    this.setState({
      isToggleOn: false,
      height: 0,
      searchPanelVisiable: 'visible',
      searchData: []
    }, () => {
      const str = value.replace(/\s*/g, '')
      const temp = [];
      if (str !== '') {
        dispatch({
          type: 'remoteSensing/fetchChangespotFuzzyQuery',
          payload: { term: str }
        }).then(() => {
          if (fuzzyChangespot) {
            fuzzyChangespot.forEach(item => {
              const obj = {};
              obj.BATCH = item.BATCH;
              obj.COUNTY = item.COUNTY;
              obj.LOCATION = item.LOCATION;
              obj.TBBM = item.TBBM;
              temp.push(obj);
            })
            this.setState({
              searchData: temp
            });
          }
        });
      } else {
        this.setState({
          searchPanelVisiable: 'hidden',
          searchData: []
        });
      }
    });
  };

  handleClick = () => {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn,
      height: !prevState.isToggleOn ? 0 : 600,
    }));
  };

  serchItemClick = TBBM => {
    const { dispatch, geomotry } = this.props;
    dispatch({
      type: 'remoteSensing/fetchChangespotGeomotry',
      payload: { tbbm: TBBM }
    }).then(() => {
      console.log(geomotry)
    })
  }

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
          prefix={
            <Tooltip placement="bottom" title="图层">
              <UnorderedListOutlined
                style={{ cursor: 'pointer' }}
                onClick={this.handleClick} />
            </Tooltip>
          }
        />
        <div className={style.searchList} style={{ visibility: this.state.searchPanelVisiable }}>
          <List
            style={{ maxHeight: '35vh', overflowY: 'scroll' }}
            bordered
            dataSource={this.state.searchData}
            renderItem={item => (
              <List.Item style={{ cursor: 'pointer' }} onClick={() => this.serchItemClick(item.TBBM)}>
                {item.TBBM}
                <Typography.Text code>{item.COUNTY}</Typography.Text>
                <Typography.Text code>{item.BATCH}</Typography.Text>
              </List.Item>
            )}
          />
        </div>

        <div style={{ width: 240, overflow: 'hidden' }}>
          <Tree
            checkable
            onCheck={this.onCheck}
            defaultExpandedKeys={['0-0-0', 'bhtb', 'rs-layer', 'base-layer']}
            treeData={this.state.treeDatas}
            style={{
              background: '#FFF',
              height: this.state.height,
              transition: '.3s all ease-in',
            }}
          />
        </div>
      </>
    );
  }
}

export default SearchGIS;
