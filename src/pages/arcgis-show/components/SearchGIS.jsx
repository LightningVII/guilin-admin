import React from 'react';
import { Icon, message, Input, Tree, Tooltip } from 'antd';


const { Search } = Input;
const { TreeNode } = Tree;
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
    }

    handleClick() {
        this.setState(prevState => ({
            isToggleOn: !prevState.isToggleOn,
            marginTop: !prevState.isToggleOn ? -20 : 0,
            height: !prevState.isToggleOn ? 0 : 600
        }));
    }

    render() {
        return (
            <>

                <Search
                    placeholder="输入查询内容..."
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
                        defaultExpandedKeys={['0-0-0', '0-0-1', '0-0-2']}
                        style={{ overflow: "hidden" }}
                    >
                        <TreeNode style={{
                            background: '#FFF',
                            height: this.state.height,
                            marginTop: this.state.marginTop,
                            transition: ".3s all ease-in"
                        }}
                            icon={<Icon type="carry-out" />} title="parent 1" key="0-0">
                            <TreeNode icon={<Icon type="carry-out" />} title="parent 1-0" key="0-0-0">
                                <TreeNode icon={<Icon type="carry-out" />} title="leaf" key="0-0-0-0" />
                                <TreeNode icon={<Icon type="carry-out" />} title="leaf" key="0-0-0-1" />
                                <TreeNode icon={<Icon type="carry-out" />} title="leaf" key="0-0-0-2" />
                            </TreeNode>
                            <TreeNode icon={<Icon type="carry-out" />} title="parent 1-1" key="0-0-1">
                                <TreeNode icon={<Icon type="carry-out" />} title="leaf" key="0-0-1-0" />
                            </TreeNode>
                            <TreeNode icon={<Icon type="carry-out" />} title="parent 1-2" key="0-0-2">
                                <TreeNode icon={<Icon type="carry-out" />} title="leaf" key="0-0-2-0" />
                                <TreeNode
                                    switcherIcon={<Icon type="form" />}
                                    icon={<Icon type="carry-out" />}
                                    title="leaf"
                                    key="0-0-2-1"
                                />
                            </TreeNode>
                        </TreeNode>
                    </Tree>


                </div>


            </>
        );
    }
}

export default SearchGIS;