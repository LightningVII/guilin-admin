import React from 'react';
import { Row, Col, Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// import { Map } from '@esri/react-arcgis';
// import { WebMapView } from './BaseMap';
import MyBasemap from './MyBasemap';
import BermudaTriangle from './BermudaTriangle';
import MyFeatureLayer from './MyFeatureLayer';

export default () => {
  // const [extent, setExtent] = useState();
  let basemap1;
  let basemap2;
  return (
    <PageHeaderWrapper content="遥感图斑对比">
      <Card>
        <Row>
          <Col span={12}>
            <MyBasemap
              id="basemap1"
              handleLoad={(map, view) => {
                basemap1 = view;
                basemap1.watch('extent', () => {
                  if (basemap1.focused) basemap2.extent = basemap1.extent;
                });
              }}
              // handleDrag={() => {
              //   basemap2.extent = basemap1.extent;
              // }}
            >
              <MyFeatureLayer />
            </MyBasemap>
          </Col>
          <Col span={12}>
            <MyBasemap
              id="basemap2"
              handleLoad={(map, view) => {
                basemap2 = view;
                function extentCallBack() {
                  if (basemap2.focused) {
                    basemap1.extent = basemap2.extent;
                  }
                }
                basemap2.watch('extent', extentCallBack);
              }}
              // handleDrag={() => {
              //   basemap1.extent = basemap2.extent;
              // }}
            >
              <BermudaTriangle />
              <MyFeatureLayer />
            </MyBasemap>
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
};
