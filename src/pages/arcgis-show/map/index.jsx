import React from 'react';
import { Row, Col, Card, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import Link from 'umi/link';
import MyBasemap from '../components/MyBasemap';

import MyFeatureLayer from '../components/MyFeatureLayer';
import MyImageLayer from '../components/MyImageLayer';

const routes = [
  {
    path: '',
    breadcrumbName: '首页',
  },
  {
    path: '/remote-sensing',
    breadcrumbName: '监测列表',
  },
  {
    path: '/remote-sensing/details',
    breadcrumbName: '监测详情',
  },
  {
    breadcrumbName: '遥感监测',
  },
];

function itemRender(route, params, routeList) {
  const last = routeList.indexOf(route) === routeList.length - 1;

  return last ? (
    <span>{route.breadcrumbName}</span>
  ) : (
    <Link
      to={route.path === '/remote-sensing/details' ? `${route.path}/${params.tbbm}` : route.path}
    >
      {route.breadcrumbName}
    </Link>
  );
}

let basemap1;
let basemap2;

class CompareMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      geomotry: null,
      layerUrl: null,
    };
  }

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'remoteSensing/fetchChangespotGeomotry',
      payload: match?.params,
    }).then(res => {
      this.setState({
        geomotry: res,
      });
    });

    dispatch({
      type: 'layer/fetchLayerGetLayerUrl',
      payload: match?.params,
    }).then(res => {
      this.setState({
        layerUrl: res,
      });
    });
  }

  render() {
    const { match } = this.props;
    return (
      <>
        {/* <PageHeaderWrapper onBack={() => window.history.back()} title={"qq"}> */}
        <PageHeaderWrapper
          onBack={() => window.history.back()}
          breadcrumb={{
            routes,
            itemRender,
            params: match?.params,
          }}
          title={false}
        >
          <Card bodyStyle={{ margin: -25, padding: 0 }}>
            <Row>
              <Col span={12} style={{ border: '1px solid #888888' }}>
                <Button
                  type="primary"
                  style={{ position: 'absolute', right: 15, top: 15, zIndex: 5 }}
                >
                  {this.state.layerUrl ? this.state.layerUrl[0].title : ''}
                </Button>
                <MyBasemap
                  id="basemap1"
                  height="calc(100vh - 120px)"
                  handleLoad={(map, view) => {
                    basemap1 = view;
                    basemap1.ui.remove('attribution');
                    basemap1.watch('extent', () => {
                      if (basemap1.focused) {
                        basemap2.extent = basemap1.extent;
                      }
                    });
                  }}
                >
                  {this.state.layerUrl ? <MyImageLayer imgLayer={this.state.layerUrl[0]} /> : <></>}
                  {this.state.geomotry ? <MyFeatureLayer geo={this.state.geomotry} /> : <></>}
                </MyBasemap>
              </Col>
              <Col span={12} style={{ border: '1px solid #888888' }}>
                <Button
                  type="primary"
                  style={{ position: 'absolute', right: 15, top: 15, zIndex: 5 }}
                >
                  {this.state.layerUrl ? this.state.layerUrl[1].title : ''}
                </Button>
                <MyBasemap
                  id="basemap2"
                  height="calc(100vh - 120px)"
                  handleLoad={(map, view) => {
                    basemap2 = view;
                    basemap2.ui.remove('attribution');
                    basemap2.watch('extent', () => {
                      if (basemap2.focused) {
                        basemap1.extent = basemap2.extent;
                      }
                    });
                  }}
                >
                  {this.state.layerUrl ? <MyImageLayer imgLayer={this.state.layerUrl[1]} /> : <></>}
                  {this.state.geomotry ? <MyFeatureLayer geo={this.state.geomotry} /> : <></>}
                </MyBasemap>
              </Col>
            </Row>
          </Card>
        </PageHeaderWrapper>
      </>
    );
  }
}

export default connect(({ remoteSensing, layer }) => ({
  geomotry: remoteSensing.geomotry,
  layerUrl: layer.layerUrl,
}))(CompareMap);
