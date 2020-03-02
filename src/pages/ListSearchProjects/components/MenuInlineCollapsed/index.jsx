import React from 'react';
import { DesktopOutlined, InboxOutlined, PieChartOutlined } from '@ant-design/icons';
// import { Menu, Icon, Button } from 'antd';
import { Menu } from 'antd';

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
            <PieChartOutlined />
            <span>影像数据</span>
          </Menu.Item>
          <Menu.Item key="b">
            <DesktopOutlined />
            <span>变化图斑</span>
          </Menu.Item>
          <Menu.Item key="c">
            <InboxOutlined />
            <span>多媒体数据</span>
          </Menu.Item>
          <Menu.Item key="d">
            <InboxOutlined />
            <span>报告</span>
          </Menu.Item>
          <Menu.Item key="e">
            <InboxOutlined />
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
