import { Col, Row, Card } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React from 'react';
import { connect } from 'dva';

// import MyBasemap from '../../arcgis-show/components/MyBasemap';
// import MyFeatureLayer from '../../arcgis-show/components/MyFeatureLayer';
import MapCharts from '../../arcgis-show/components/charts/MapCharts';
import DVChart from './Charts/DVChart';

const rankingListData = [];

for (let i = 0; i < 5; i += 1) {
  rankingListData.push({
    key: i,
    title: formatMessage(
      {
        id: 'dashboardanalysis.analysis.test',
      },
      {
        no: i,
      },
    ),
    age: Math.floor(Math.random() * 1000),
    address: '徐州市云龙区',
    type: '类型',
    status: Math.floor(Math.random() * 10) % 4,
  });
}

const SalesCard = ({ loading, data }) => (
  <>
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      <Col span={16}>
        <Card
          loading={loading}
          bordered={false}
          bodyStyle={{
            padding: 0,
          }}
          title={
            <FormattedMessage
              id="dashboardanalysis.analysis.graph-comparison"
              defaultMessage="Sales"
            />
          }
        >
          <MapCharts height="328px" />
          {JSON.stringify(data)}
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
          <DVChart />
        </Card>
      </Col>
    </Row>
  </>
);

export default connect(({ dashboardAnalysis, loading }) => ({
  data: dashboardAnalysis.bhlxtjData,
  loading: loading.effects['dashboardAnalysis/fetch'],
}))(SalesCard);
