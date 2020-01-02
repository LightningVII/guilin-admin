import React from 'react';
import { Row, Col } from 'antd';
// import { Map } from '@esri/react-arcgis';
// import { WebMapView } from './BaseMap';
import MyBasemap from '../components/MyBasemap';
import MyFeatureLayer from '../components/MyFeatureLayer';

export default () => {
  let basemap1;
  let basemap2;
  return (
    <Row>
      <Col span={24}>
        <MyBasemap
          id="basemap1"
          handleLoad={(map, view) => {
            basemap1 = view;
            basemap1.watch('extent', () => {
              if (basemap1.focused) basemap2.extent = basemap1.extent;
            });
          }}
        >
          <MyFeatureLayer />
        </MyBasemap>
      </Col>
    </Row>
  );
};
