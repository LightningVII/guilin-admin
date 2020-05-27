import React from 'react';
import { Modal, Tree } from 'antd';
// import { treeData } from './json/treeData.js';

import { connect } from 'dva';

@connect(({ layer }) => ({
  layerTree: layer.layerTree
}))

class ModalSwipeTree extends React.Component {
  constructor(props) {
    super(props);

    // 设置 initial state
    this.state = {
      rCount: 0,
      fCount: 0,
      checkedTempArray: []
    };

    const { dispatch } = props;

    dispatch({
      type: 'layer/fetchLayerTree'
    })

  }

  onCheck = (checkedKeys, e) => {
    const rA = [];
    const fA = [];

    e.checkedNodes.forEach(checkedNode => {
      const type = checkedNode.loadType;
      switch (type) {
        case 'tile':
          rA.push(checkedNode);
          break;
        case 'feature':
          fA.push(checkedNode);
          break;
        default:
          break;
      }
    });

    this.setState({
      rCount: rA.length,
      fCount: fA.length,
      checkedTempArray: e.checkedNodes,
    });
  };

  render() {
    return (
      <>
        <Modal
          title="卷帘设置"
          visible
          onOk={() => this.props.onSetSwipe(this.state.checkedTempArray, this.state.rCount)}
          onCancel={() => this.props.onSetSwipe([], -1)}
          style={{ width: '40vw' }}
        >
          <Tree
            showLine
            showIcon
            checkable
            onCheck={this.onCheck}
            defaultExpandAll
            treeData={this.props.layerTree}
            style={{ overflowY: 'scroll', maxHeight: '50vh' }}
          />
          <p>
            <span>
              已选图层：{this.state.fCount + this.state.rCount}（{this.state.rCount}栅格，
              {this.state.fCount}矢量）
            </span>
          </p>
        </Modal>
      </>
    );
  }
}

export default ModalSwipeTree;
