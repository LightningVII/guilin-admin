import React from 'react';
import { Icon, message, Input, Card } from 'antd';

const { Search } = Input;

class SearchGIS extends React.Component {
    constructor(props) {
        super(props);

        // 设置 initial state
        this.state = {
            isToggleOn: false,
            display: 'none'
        };

        // 这个绑定是必要的，使`this`在回调中起作用
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState(prevState => ({
            isToggleOn: !prevState.isToggleOn,
            display: prevState.isToggleOn ? 'none' : 'block'
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
                    prefix={<Icon type="unordered-list" style={{ cursor: "pointer" }} onClick={this.handleClick}
                    />}
                >
                </Search>

                <div style={{ background: '#ECECEC', display: this.state.display }}>
                    <Card bordered={false} style={{ width: 240 }}>
                        <p>Card content</p>
                        <p>Card content</p>
                        <p>Card content</p>
                    </Card>
                </div>


            </>
        );
    }
}

export default SearchGIS;