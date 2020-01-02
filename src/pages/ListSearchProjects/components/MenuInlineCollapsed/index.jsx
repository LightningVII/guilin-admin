import React from 'react';
// import { Menu, Icon, Button } from 'antd';
import { Menu, Icon } from 'antd';

// const { SubMenu } = Menu;

class App extends React.Component {
  state = {
    collapsed: false,
  };

  toggleCollapsed = () => {
    this.setState(({ collapsed }) => ({
      collapsed: !collapsed,
    }));
  };

  render() {
    return (
      <div style={{ width: 256 }}>
        {/* <Button
          type="primary"
          onClick={this.toggleCollapsed}
          style={{
            marginBottom: 16,
          }}
        >
          <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
        </Button> */}

        <Menu
          defaultSelectedKeys={['a']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="light"
          // inlineCollapsed={this.state.collapsed}
        >
          <Menu.Item key="a">
            <Icon type="pie-chart" />
            <span>影像数据</span>
          </Menu.Item>
          <Menu.Item key="b">
            <Icon type="desktop" />
            <span>变化图斑</span>
          </Menu.Item>
          <Menu.Item key="c">
            <Icon type="inbox" />
            <span>多媒体数据</span>
          </Menu.Item>
          <Menu.Item key="d">
            <Icon type="inbox" />
            <span>报告</span>
          </Menu.Item>
          <Menu.Item key="e">
            <Icon type="inbox" />
            <span>基础地理数据</span>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default () => (
  <div id="components-menu-demo-inline-collapsed">
    <App />
  </div>
);
