import React, { Suspense } from 'react';
import {
  InfoCircleOutlined,
  SnippetsOutlined,
  ToolOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Row, Col, Affix, Menu, Button, Dropdown, Card } from 'antd';
// import { Map } from '@esri/react-arcgis';
// import { WebMapView } from './BaseMap';
// import MyBasemap from '../components/MyBasemap';

import SearchGIS from '../components/SearchGIS';
import Compass from '../components/Compass';
import MapMeasure from '../components/MapMeasure';
// import MapSwipe from '../components/MapSwipe';

const MyBasemap = React.lazy(() => import('../components/MyBasemap'));

export default class GlobeMapShow extends React.Component {
  constructor() {
    super();
    this.state = {
      mapView: null,
      showMeasure: false,
      // showSwipe:false
    };
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
  }

  handleMenuClick = ({ key }) => {
    switch (key) {
      case 'cl':
        this.setState(prevState => ({
          showMeasure: !prevState.showMeasure,
        }));
        break;
      case 'jl':
        this.setState(prevState => ({
          showMeasure: !prevState.showMeasure,
        }));
        break;
      default:
        break;
    }
  };

  handleMenuClose = () => {
    this.setState(prevState => ({
      showMeasure: !prevState.showMeasure,
    }));
  };

  render() {
    return (
      <>
        <Affix style={{ position: 'absolute', right: 0 }} offsetTop={80}>
          <Button.Group>
            <Dropdown
              overlay={
                <Menu onClick={this.handleMenuClick}>
                  <Menu.Item key="cl">
                    <UserOutlined />
                    测量
                  </Menu.Item>
                  <Menu.Item key="2">
                    <UserOutlined />
                    全屏
                  </Menu.Item>
                  <Menu.Item key="3">
                    <UserOutlined />
                    截图
                  </Menu.Item>
                </Menu>
              }
            >
              <Button icon={<ToolOutlined />}>常用</Button>
            </Dropdown>
            <Dropdown
              overlay={
                <Menu onClick={this.handleMenuClick}>
                  <Menu.Item key="cl">
                    <UserOutlined />
                    点选
                  </Menu.Item>
                  <Menu.Item key="2">
                    <UserOutlined />
                    2nd menu item
                  </Menu.Item>
                  <Menu.Item key="3">
                    <UserOutlined />
                    3rd item
                  </Menu.Item>
                </Menu>
              }
            >
              <Button icon={<InfoCircleOutlined />}>查询</Button>
            </Dropdown>
            <Dropdown
              overlay={
                <Menu onClick={this.handleMenuClick}>
                  <Menu.Item key="jl">
                    <UserOutlined />
                    卷帘
                  </Menu.Item>
                  <Menu.Item key="2">
                    {/* <LegacyIcon type="dp" /> */}
                    多屏
                  </Menu.Item>
                  <Menu.Item key="3">
                    <UserOutlined />
                    3rd item
                  </Menu.Item>
                </Menu>
              }
            >
              <Button icon={<SnippetsOutlined />}>分析</Button>
            </Dropdown>
          </Button.Group>
        </Affix>
        <Affix style={{ position: 'absolute', left: 0 }} offsetTop={80}>
          <SearchGIS view={this.state.mapView} />
        </Affix>
        <Affix
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
          }}
          offsetBottom={50}
        >
          <Compass view={this.state.mapView} />
        </Affix>
        <Affix
          style={{
            position: 'absolute',
            right: 0,
            visibility: this.state.showMeasure ? 'visible' : 'hidden',
          }}
          offsetTop={150}
        >
          <Card
            size="small"
            title="选择测量工具"
            extra={
              <a
                href="#"
                onClick={() =>
                  this.setState({
                    showMeasure: false,
                  })
                }
              >
                X
              </a>
            }
            style={{ width: 300 }}
          >
            <MapMeasure view={this.state.mapView} showMeasure2={this.state.showMeasure} />
          </Card>
        </Affix>
        {/* <Row style={{visibility: this.state.showSwipe? 'visible' : 'hidden'}}>
        <MapSwipe />
      </Row> */}

        <Row style={{ margin: '-24px' }}>
          <Col span={24}>
            <Suspense fallback="...loading">
              <MyBasemap
                handleLoad={(map, view) => {
                  this.setState({ mapView: view });
                  // view.ui.remove("zoom");
                }}
              />
            </Suspense>
          </Col>
        </Row>
      </>
    );
  }
}
