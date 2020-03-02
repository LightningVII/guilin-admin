import React from 'react';
import { Modal, Tree, Icon } from 'antd';

import { treeData } from './treeData.js';

const { TreeNode } = Tree;

class ModalSwipeTree extends React.Component {
    constructor(props) {
        super(props);

        // 设置 initial state
        this.state = {
            rCount: 0,
            fCount: 0,
            checkedTempArray: []
        }
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

    onCheck = (checkedKeys, e) => {
        const rA = [];
        const fA = [];

        e.checkedNodes.forEach(checkedNode => {
            const type = checkedNode.props.loadType;
            switch (type) {
                case "tile":
                    rA.push(checkedNode)
                    break;
                case "feature":
                    fA.push(checkedNode)
                    break;
                default:
                    break;
            }
        })

        this.setState({
            rCount: rA.length,
            fCount: fA.length,
            checkedTempArray: e.checkedNodes
        })
    }

    render() {
        return (
            <>
                <Modal
                    title="卷帘设置"
                    visible
                    onOk={() =>
                         this.props.onSetSwipe(
                        this.state.checkedTempArray,
                        this.state.rCount
                    )}
                    onCancel={() => this.props.onSetSwipe([],-1)}
                    style={{ width: '40vw' }}
                >
                    <Tree
                        showLine
                        showIcon
                        checkable
                        defaultExpandedKeys={['0-0-0', 'bhtb', 'rs-layer', 'base-layer']}
                        style={{ overflowY: "scroll", maxHeight: '50vh' }}
                        onCheck={this.onCheck}
                    >
                        <TreeNode
                            checkable
                            icon={<Icon type="carry-out" />} title="所有图层" key="0-0">
                            {this.renderTreeNodes(treeData)}
                        </TreeNode>

                    </Tree>
                    <p>
                        <span>
                            已选图层：{this.state.fCount + this.state.rCount}（{this.state.rCount}栅格，{this.state.fCount}矢量）
                                </span>
                    </p>
                </Modal>
            </>
        )
    }
}


export default ModalSwipeTree;