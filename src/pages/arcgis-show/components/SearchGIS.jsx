import React from 'react';
import { Icon, message, Input, Tree, Tooltip } from 'antd';
import { loadModules } from 'esri-loader';

const { Search } = Input;
const { TreeNode } = Tree;
let EsriFeatureLayer;
let EsriWebTileLayer;
const treeData = [
  {
    title: '影像图层',
    key: 'rs-layer',
    children: [
      {
        title: '2020年1月',
        key: '0-0-1',
        loadType: "tile",
        layerUrl: "http://218.3.176.6:6080/arcgis/rest/services/Raster/MS_SG_GF_201805/MapServer/tile/{level}/{row}/{col}"
      },
      {
        title: '2020年2月',
        key: '0-0-2',
        loadType: "tile",
        layerUrl: "http://218.3.176.6:6080/arcgis/rest/services/Raster/MS_SG_GF_201809/MapServer/tile/{level}/{row}/{col}"
      },
      {
        title: '2020年3月',
        key: '0-0-3',
        loadType: "tile",
        layerUrl: "http://218.3.176.6:6080/arcgis/rest/services/Raster/MS_SG_GF_201812/MapServer/tile/{level}/{row}/{col}"
      },
    ],
  },
  {
    title: '变化图斑',
    key: 'bhtb',
    children: [
      {
        title: '2020年第1期',
        key: '0-1-0',
        loadType:"feature",
        layerUrl:"http://218.3.176.6:6080/arcgis/rest/services/BHTuBan/MS_SL_BHTuBan_201801/MapServer/0"
      },
      {
        title: '2020年第2期',
        key: '0-1-1',
        loadType:"feature",
        layerUrl:"http://218.3.176.6:6080/arcgis/rest/services/BHTuBan/MS_SL_BHTuBan_201806/MapServer/0"
      },
      {
        title: '2020年第3期',
        key: '0-1-2',
        loadType:"feature",
        layerUrl:"http://218.3.176.6:6080/arcgis/rest/services/BHTuBan/MS_SL_BHTuBan_201812/MapServer/0"
      },
    ],
  }
];
class SearchGIS extends React.Component {
  constructor(props) {
    super(props);
    // 设置 initial state
    this.state = {
      isToggleOn: true,
      marginTop: -20,
      height: 0
    };

    // 这个绑定是必要的，使`this`在回调中起作用
    this.handleClick = this.handleClick.bind(this);

    loadModules(['esri/layers/FeatureLayer','esri/layers/WebTileLayer'])
      .then(([FeatureLayer,WebTileLayer]) => { 
        EsriFeatureLayer = FeatureLayer ;
        EsriWebTileLayer = WebTileLayer;
      })

  }

  onCheck = (checkedKeys, e) => {
    this.loadToMap(checkedKeys, e);
    console.log(checkedKeys);
  };

  loadToMap = (checkedKeys, e) => {
    this.props.view.map.removeAll();
    e.checkedNodes.forEach(checkedNode => {
      const type = checkedNode.props.loadType;
      if (type) {
        const nodeUrl = checkedNode.props.layerUrl;
        const nodeId = checkedNode.key;
        switch (type) {
          case "tile":
            this.props.view.map.add(new EsriWebTileLayer({ urlTemplate:nodeUrl,id:nodeId}));
            break;
          case "feature":
            this.props.view.map.add(new EsriFeatureLayer({ url:nodeUrl,id:nodeId}));
            break;

          default:
            break;
        }
      }
    });
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn,
      marginTop: !prevState.isToggleOn ? -20 : 0,
      height: !prevState.isToggleOn ? 0 : 600
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
          onSearch={value => message.info(value)}
          style={{ width: 240 }}
          allowClear
          prefix={
            <Tooltip placement="bottom" title="图层">
              <Icon type="unordered-list" style={{ cursor: "pointer" }} onClick={this.handleClick} />
            </Tooltip>
          }
        >
        </Search>

        <div style={{ width: 240, overflow: "hidden" }}>
          <Tree
            showLine
            showIcon
            checkable
            onCheck={this.onCheck}
            defaultExpandedKeys={['0-0-0', 'bhtb', 'rs-layer']}
            style={{ overflow: "hidden" }}
          >
            <TreeNode
              checkable
              style={{
                background: '#FFF',
                height: this.state.height,
                marginTop: this.state.marginTop,
                transition: ".3s all ease-in"
              }}
              icon={<Icon type="carry-out" />} title="所有图层" key="0-0">
              {this.renderTreeNodes(treeData)}
            </TreeNode>

          </Tree>


        </div>


      </>
    );
  }
}

export default SearchGIS;