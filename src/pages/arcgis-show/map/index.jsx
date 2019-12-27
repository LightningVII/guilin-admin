import React from 'react';
import { Row, Col, Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// import { Map } from '@esri/react-arcgis';
// import { WebMapView } from './BaseMap';
import MyBasemap from './MyBasemap';

export default () => (
  <PageHeaderWrapper content="遥感图斑对比">
    <Card>
      <Row>
        <Col span={12}>
          <MyBasemap />
        </Col>
        <Col span={12}>
          <MyBasemap />
        </Col>
      </Row>
    </Card>
  </PageHeaderWrapper>
);
