import React, { useEffect } from 'react';
import { Row, Col, Card, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
// import { Map } from '@esri/react-arcgis';
// import { WebMapView } from './BaseMap';
import MyBasemap from '../components/MyBasemap';
// import BaseMap from '../components/BaseMap';
// import BermudaTriangle from '../components/BermudaTriangle';
import MyFeatureLayer from '../components/MyFeatureLayer';
import MyImageLayer from '../components/MyImageLayer';


export default connect(({ remoteSensing, layer }) => ({
  geomotry: remoteSensing.geomotry,
  layerUrl: layer.layerUrl,
}))(props => {
  const { dispatch, match, geomotry, layerUrl } = props;
  // const [extent, setExtent] = useState();
  let basemap1;
  let basemap2;
  const img1 = {
    layerUrl:
      'http://218.3.176.6:6080/arcgis/rest/services/Raster/MS_SG_GF_201810/MapServer/tile/{level}/{row}/{col}',
    id: '201810',
    title: '2018年10月影像',
  };

  const img2 = {
    layerUrl:
      'http://218.3.176.6:6080/arcgis/rest/services/Raster/MS_SG_GF_201812/MapServer/tile/{level}/{row}/{col}',
    id: '201812',
    title: '2018年12月影像',
  };

  useEffect(() => {
    dispatch({
      type: 'remoteSensing/fetchChangespotGeomotry',
      payload: match?.params,
    }).then(res => {
      console.log('geo', res)
    });


    dispatch({
      type: 'layer/fetchLayerGetLayerUrl',
      payload: {
        qsx: '202001',
        hsx: '202002',
      },
    }).then(res => {
      console.log('url', res)
    });


  }, []);


  return (
    <PageHeaderWrapper title={false}>
      <Card bodyStyle={{ margin: -25, padding: 0 }}>
        <Row>
          <Col span={12} style={{ border: '1px solid #888888' }}>
            <Button type='primary' style={{ position: 'absolute', right: 15, top: 15, zIndex: 5 }}>
              {img1.title}
            </Button>
            {/* <BaseMap
              id="basemap1"
              handleLoad={(map, view) => {
                basemap1 = view;
                basemap1.watch('extent', () => {
                  if (basemap1.focused) {
                    basemap2.extent = basemap1.extent;
                    basemap2.rotation = basemap1.rotation;
                  }
                });
              }}
            >
              <MyImageLayer imgLayer={img1 || layerUrl[0]} />
              <MyFeatureLayer geomotry={geomotry} />
            </BaseMap> */}
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
              <MyImageLayer imgLayer={img1 || layerUrl[0]} />
              <MyFeatureLayer geomotry={geomotry} />
            </MyBasemap>
          </Col>
          <Col span={12} style={{ border: '1px solid #888888' }}>
            <Button type='primary' style={{ position: 'absolute', right: 15, top: 15, zIndex: 5 }}>
              {img2.title}
            </Button>
            {/* <BaseMap
              id="basemap2"
              handleLoad={(map, view) => {
                basemap2 = view;
                basemap2.watch('extent', () => {
                  if (basemap2.focused) {
                    basemap1.extent = basemap2.extent;
                    basemap1.rotation = basemap2.rotation;
                  }
                });
              }}
            >
              <MyImageLayer imgLayer={img2 || layerUrl[1]} />
              <MyFeatureLayer geomotry={geomotry} />
            </BaseMap> */}
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
              <MyImageLayer imgLayer={img2 || layerUrl[1]} />
              <MyFeatureLayer geomotry={geomotry} />
            </MyBasemap>
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
});
