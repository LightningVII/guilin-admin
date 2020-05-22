import { Col, Row, Card } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import { connect } from 'dva';

// import MyBasemap from '../../arcgis-show/components/MyBasemap';
// import MyFeatureLayer from '../../arcgis-show/components/MyFeatureLayer';
import MapCharts from '../../arcgis-show/components/MapCharts';
import DVChart from './Charts/DVChart';


const SalesCard = ({ loading, data }) => (
  <>
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      <Col span={16}>
        <Card
          loading={loading}
          bordered={false}
          bodyStyle={{
            padding: 0,
            height: "328px"
          }}
          title={
            <FormattedMessage
              id="dashboardanalysis.analysis.graph-comparison"
              defaultMessage="Sales"
            />
          }
        >
          <MapCharts height="328px" />
        </Card>
      </Col>

      <Col span={8}>
        <Card
          loading={loading}
          bordered={false}
          bodyStyle={{
            padding: 0,
            height: '328px',
          }}
          title={
            <FormattedMessage
              id="dashboardanalysis.analysis.graph-comparison-list"
              defaultMessage="Sales Ranking"
            />
          }
        >
          <DVChart data={data} />
        </Card>
      </Col>
    </Row>
  </>
);

export default connect(({ dashboardAnalysis, loading }) => ({
  data: dashboardAnalysis.bhlxtjData,
  loading: loading.effects['dashboardAnalysis/fetch'],
}))(SalesCard);
