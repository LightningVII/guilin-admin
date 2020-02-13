import React, { Suspense } from 'react';
import { Row, Col, Affix, Menu, Button, Dropdown, Icon, message } from 'antd';
// import { Map } from '@esri/react-arcgis';
// import { WebMapView } from './BaseMap';
// import MyBasemap from '../components/MyBasemap';

import SearchGIS from '../components/SearchGIS';
import Compass from '../components/Compass';

const MyBasemap = React.lazy(() => import('../components/MyBasemap'));


// function handleButtonClick(e) {
//   message.info('Click on left button.');
//   console.log('click left button', e);
// }

function handleMenuClick(e) {
  message.info('Click on menu item.');
  console.log('click', e);
}


const menu = (
  <Menu onClick={handleMenuClick}>
    <Menu.Item key="1">
      <Icon type="user" />
      测量
    </Menu.Item>
    <Menu.Item key="2">
      <Icon type="user" />
      2nd menu item
    </Menu.Item>
    <Menu.Item key="3">
      <Icon type="user" />
      3rd item
    </Menu.Item>
  </Menu>
);


const menu2 = (
  <Menu onClick={handleMenuClick}>
    <Menu.Item key="1">
      <Icon type="user" />
      1st menu item
    </Menu.Item>
    <Menu.Item key="2">
      <Icon type="user" />
      2nd menu item
    </Menu.Item>
    <Menu.Item key="3">
      <Icon type="user" />
      3rd item
    </Menu.Item>
  </Menu>
);

const menu3 = (
  <Menu onClick={handleMenuClick}>
    <Menu.Item key="1">
      <Icon type="user" />
      1st menu item
    </Menu.Item>
    <Menu.Item key="2">
      <Icon type="user" />
      2nd menu item
    </Menu.Item>
    <Menu.Item key="3">
      <Icon type="user" />
      3rd item
    </Menu.Item>
  </Menu>
);

export default class GlobeMapShow extends React.Component {
  constructor() {
    super();
    this.state = {
      mapView: null,
    };
  }

  render() {
    return (
      <>
        <Affix style={{ position: 'absolute', right: 0 }} offsetTop={80}>
          <Button.Group>
            <Dropdown overlay={menu}>
              <Button icon="eye">常用</Button>
            </Dropdown>
            <Dropdown overlay={menu2}>
              <Button icon="eye">查询</Button>
            </Dropdown>
            <Dropdown overlay={menu3}>
              <Button icon="eye">分析</Button>
            </Dropdown>
          </Button.Group>
        </Affix>
        <Affix style={{ position: 'absolute', left: 0 }} offsetTop={80}>
          <SearchGIS view={this.state.mapView}/>
        </Affix>
        <Affix style={{ position: 'absolute', right: 0, bottom: 0 }} offsetBottom={80}>
          <Compass view={this.state.mapView}/>
        </Affix>
        <Row style={{ margin: '-24px' }}>
          <Col span={24}>
            <Suspense fallback="...loading">
              <MyBasemap
                handleLoad={(map, view) => {
                  this.setState({ mapView:view });
                  view.ui.remove("zoom");
                }}
              >
              </MyBasemap>

            </Suspense>
          </Col>
        </Row>
      </>
    )
  }
} 
