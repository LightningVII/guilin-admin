import React, { Suspense } from 'react';
import { Row, Col, Affix, Menu, Button, Dropdown, Icon, message, Input, Card } from 'antd';
// import { Map } from '@esri/react-arcgis';
// import { WebMapView } from './BaseMap';
// import MyBasemap from '../components/MyBasemap';
import MyFeatureLayer from '../components/MyFeatureLayer';
// import Search from './components/Search';

const MyBasemap = React.lazy(() => import('../components/MyBasemap'));
const { Search } = Input;
let layerTreeShow = false;
// function handleButtonClick(e) {
//   message.info('Click on left button.');
//   console.log('click left button', e);
// }

function handleMenuClick(e) {
  message.info('Click on menu item.');
  console.log('click', e);
}

function handleLayerClick() {
  layerTreeShow = !layerTreeShow;
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
    <Affix style={{ position: 'absolute', left: 0 }} offsetTop={80}>

      <Search
        placeholder="输入查询内容..."
        onSearch={value => message.info(value)}
        style={{ width: 220 }}
        allowClear
        prefix={<Icon type="unordered-list" style={{ cursor: "pointer" }}
          onClick={handleLayerClick} />}
      >
      </Search>
      <div style={{ background: '#ECECEC', display: layerTreeShow?"block":"none" }}>
        <Card bordered={false} style={{ width: 220 }}>
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
      </div>

    </Affix>
    <Row style={{ margin: '-24px' }}>
      <Col span={24}>
        <Suspense fallback="...loading">
          <MyBasemap
            handleLoad={(map, view) => {
              view.ui.remove("zoom");
            }}
          >
            <MyFeatureLayer />
          </MyBasemap>

        </Suspense>
      </Col>
    </Row>
  </>
);
