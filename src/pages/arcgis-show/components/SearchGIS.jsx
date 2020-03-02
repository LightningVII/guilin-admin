import React from 'react';
import { Icon, Input, Tree, Tooltip, List, Typography } from 'antd';
import { loadModules } from 'esri-loader';
// import router from 'umi/router';

import { treeData } from './treeData.js';
import { template } from './featureTemplate.js';
import style from './style.css';

const { Search } = Input;
const { TreeNode } = Tree;
let EsriFeatureLayer;
let EsriWebTileLayer;
let EsriQueryTask;
let EsriQuery;
let flag = false;

class SearchGIS extends React.Component {
  constructor(props) {
    super(props);
    // 设置 initial state
    this.state = {
      isToggleOn: true,
      marginTop: -20,
      height: 0,
      searchPanelVisiable: 'hidden',
      searchData: [],
    };

    loadModules([
      'esri/layers/FeatureLayer',
      'esri/layers/WebTileLayer',
      'esri/tasks/QueryTask',
      'esri/tasks/support/Query',
    ]).then(([FeatureLayer, WebTileLayer, QueryTask, Query]) => {
      EsriFeatureLayer = FeatureLayer;
      EsriWebTileLayer = WebTileLayer;
      EsriQueryTask = QueryTask;
      EsriQuery = Query;
      flag = false;
    });
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
  };

  loadToMap = (checkedKeys, e) => {
    this.props.view.map.removeAll();
    e.checkedNodes.forEach(checkedNode => {
      const type = checkedNode.props.loadType;
      if (type) {
        const nodeUrl = checkedNode.props.layerUrl;
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
  };

  inputValChange = evt => {
    const that = this;
    const str = evt.target.value.replace(/\s*/g, '');
    if (str !== '') {
      this.setState({
        isToggleOn: false,
        marginTop: -20,
        height: 0,
        searchPanelVisiable: 'visible',
        searchData: [],
      });
      const queryTask = new EsriQueryTask({
        url:
          'http://218.3.176.6:6080/arcgis/rest/services/BHTuBan/MS_SL_BHTuBan_201812/MapServer/0',
      });
      const query = new EsriQuery();
      query.returnGeometry = true;
      query.outFields = ['*'];
      query.where = `hxmc like '%${str}%'`;
      queryTask.execute(query).then(results => {
        const temp = [];
        results.features.forEach(feature => {
          const obj = {};
          obj.text = feature.attributes.hxmc;
          obj.type = '变化图斑';
          temp.push(obj);
        });
        if (temp.length > 0)
          that.setState({
            searchData: temp,
          });
      });
    } else {
      this.setState(prevState => ({
        isToggleOn: !prevState.isToggleOn,
        marginTop: !prevState.isToggleOn ? -20 : 0,
        height: !prevState.isToggleOn ? 0 : 600,
        searchPanelVisiable: 'hidden',
      }));
    }
  };

  handleClick = () => {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn,
      marginTop: !prevState.isToggleOn ? -20 : 0,
      height: !prevState.isToggleOn ? 0 : 600,
    }));
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
          onChange={this.inputValChange}
          onClick={this.handleClick}
          className={style.search}
          allowClear
          prefix={
            <Tooltip placement="bottom" title="图层">
              <Icon
                type="unordered-list"
                style={{ cursor: 'pointer' }}
                onClick={this.handleClick}
              />
            </Tooltip>
          }
        />
        <div className={style.searchList} style={{ visibility: this.state.searchPanelVisiable }}>
          <List
            style={{ maxHeight: '35vh', overflowY: 'scroll' }}
            bordered
            dataSource={this.state.searchData}
            renderItem={item => (
              <List.Item style={{ cursor: 'pointer' }}>
                {item.text} <Typography.Text code>{item.type}</Typography.Text>
              </List.Item>
            )}
          />
        </div>

        <div style={{ width: 240, overflow: 'hidden' }}>
          <Tree
            showLine
            showIcon
            checkable
            onCheck={this.onCheck}
            defaultExpandedKeys={['0-0-0', 'bhtb', 'rs-layer', 'base-layer']}
            style={{ overflow: 'hidden' }}
          >
            <TreeNode
              checkable
              style={{
                background: '#FFF',
                height: this.state.height,
                marginTop: this.state.marginTop,
                transition: '.3s all ease-in',
              }}
              icon={<Icon type="carry-out" />}
              title="所有图层"
              key="0-0"
            >
              {this.renderTreeNodes(treeData)}
            </TreeNode>
          </Tree>
        </div>
      </>
    );
  }
}

export default SearchGIS;
