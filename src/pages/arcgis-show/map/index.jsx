import React, { useEffect } from 'react';
import { Row, Col, Card, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';

import MyBasemap from '../components/MyBasemap';

import MyFeatureLayer from '../components/MyFeatureLayer';
import MyImageLayer from '../components/MyImageLayer';


export default connect(({ remoteSensing, layer }) => ({
  geomotry: remoteSensing.geomotry,
  layerUrl: layer.layerUrl,
}))(props => {
  const { dispatch, match, geomotry, layerUrl } = props;

  let basemap1;
  let basemap2;

  useEffect(() => {
    dispatch({
      type: 'remoteSensing/fetchChangespotGeomotry',
      payload: match?.params
    });

    dispatch({
      type: 'layer/fetchLayerGetLayerUrl',
      payload: match?.params
    });

  }, []);

  return (
    <PageHeaderWrapper title={false}>
      <Card bodyStyle={{ margin: -25, padding: 0 }}>
        <Row>
          <Col span={12} style={{ border: '1px solid #888888' }}>
            <Button type='primary' style={{ position: 'absolute', right: 15, top: 15, zIndex: 5 }}>
              {layerUrl.length > 0 ? layerUrl[0].title : ''}
            </Button>
            <MyBasemap
              id="basemap1"
              height='calc(100vh - 120px)'
              handleLoad={(map, view) => {
                basemap1 = view;
                basemap1.ui.remove('attribution')
                basemap1.watch('extent', () => {
                  if (basemap1.focused) {
                    basemap2.extent = basemap1.extent;
                    basemap2.rotation = basemap1.rotation;
                  }
                });
              }}
            >
              {layerUrl.length > 0 ? <MyImageLayer imgLayer={layerUrl[0]} /> : <MyImageLayer />}
              {geomotry ? <MyFeatureLayer geo={geomotry} /> :  <MyFeatureLayer />}
            </MyBasemap>
          </Col>
          <Col span={12} style={{ border: '1px solid #888888' }}>
            <Button type='primary' style={{ position: 'absolute', right: 15, top: 15, zIndex: 5 }}>
              {layerUrl.length > 0 ? layerUrl[1].title : ''}
            </Button>
            <MyBasemap
              id="basemap2"
              height='calc(100vh - 120px)'
              handleLoad={(map, view) => {
                basemap2 = view;
                basemap2.ui.remove('attribution')
                basemap2.watch('extent', () => {
                  if (basemap2.focused) {
                    basemap1.extent = basemap2.extent;
                    basemap1.rotation = basemap2.rotation;
                  }
                });
              }}
            >
              {layerUrl.length > 0 ? <MyImageLayer imgLayer={layerUrl[1]} /> : <MyImageLayer />}
              {geomotry ? <MyFeatureLayer geo={geomotry} /> : <MyFeatureLayer />}
            </MyBasemap>
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
});
