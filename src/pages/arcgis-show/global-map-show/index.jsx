import React, { Suspense } from 'react';
import { Row, Col, Affix, Menu, Button, Dropdown, Icon, message } from 'antd';
// import { Map } from '@esri/react-arcgis';
// import { WebMapView } from './BaseMap';
// import MyBasemap from '../components/MyBasemap';
import MyFeatureLayer from '../components/MyFeatureLayer';

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

export default () => (
  <>
    <Affix style={{ position: 'absolute', right: 0 }} offsetTop={80}>
      <Button.Group>
        <Dropdown overlay={menu}>
          <Button icon="eye">标尺</Button>
        </Dropdown>
        <Dropdown overlay={menu}>
          <Button icon="eye">标尺</Button>
        </Dropdown>
        <Dropdown overlay={menu}>
          <Button icon="eye">标尺</Button>
        </Dropdown>
      </Button.Group>
    </Affix>
    <Row style={{ margin: '0' }}>
      <Col span={24}>
        <Suspense fallback="...loading">
          <MyBasemap>
            <MyFeatureLayer />
          </MyBasemap>
        </Suspense>
      </Col>
    </Row>
  </>
);
