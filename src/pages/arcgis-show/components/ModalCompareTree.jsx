import React from 'react';
import { Modal, Tree } from 'antd';

import { treeData } from './json/treeData.js';



class ModalCompareTree extends React.Component {
  constructor(props) {
    super(props);

    // 设置 initial state
    this.state = {
      rCount: 0,
      fCount: 0,
      checkedTempArray: [],
    };
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
          title="多屏设置"
          visible
          onOk={() => this.props.onSetCompare(this.state.checkedTempArray)}
          onCancel={() => this.props.onSetCompare([])}
          style={{ width: '40vw' }}
        >
          <Tree
            showLine
            showIcon
            checkable
            onCheck={this.onCheck}
            defaultExpandAll
            treeData={treeData}
            style={{ overflowY: 'scroll', maxHeight: '50vh' }}
          />
          <p>
            <span>
              已选图层：{this.state.fCount + this.state.rCount}（{this.state.rCount}栅格，
              {this.state.fCount}矢量）
            </span>
            <span style={{ float: 'right' }}>分屏数量：{this.state.rCount}</span>
          </p>
        </Modal>
      </>
    );
  }
}

export default ModalCompareTree;
