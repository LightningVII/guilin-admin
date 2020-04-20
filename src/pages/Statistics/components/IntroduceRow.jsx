import { Col, Row } from 'antd';
import React, { Suspense } from 'react';
import { connect } from 'dva';

const ProportionSales = React.lazy(() => import('./ProportionSales'));
const Proportion = React.lazy(() => import('./Proportion'));
const SecondChart = React.lazy(() => import('./SecondChart'));

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 8,
  style: {
    marginBottom: 24,
  },
};

const salesType = 'all';

const title = (a, b) => (
  <>
    {a}
    <p
      style={{
        fontWeight: 'normal',
        margin: 0,
        fontSize: '14px',
      }}
      className="ant-card-meta-description"
    >
      {b}
    </p>
  </>
);

const IntroduceRow = ({ proportionData, proportionSalesData, secondChartData, loading }) => (
  <Row gutter={24} type="flex">
    <Col {...topColResponsiveProps}>
      <Suspense fallback={null}>
        <Proportion
          cardProps={{
            title: title('数据统计', '系统中数据统计占比情况'),
          }}
          loading={loading}
          data={proportionData}
        />
      </Suspense>
    </Col>
    <Col {...topColResponsiveProps}>
      <Suspense fallback={null}>
        <SecondChart
          cardProps={{
            title: title('变化图斑类型分布', '汇总历史变化图斑类型的分布情况'),
          }}
          loading={loading}
          data={secondChartData}
        />
      </Suspense>
    </Col>
    <Col {...topColResponsiveProps}>
      <Suspense fallback={null}>
        <ProportionSales
          cardProps={{
            title: title('任务执行', '汇总当前所有任务执行情况'),
          }}
          salesType={salesType}
          loading={loading}
          data={proportionSalesData}
        />
      </Suspense>
    </Col>
  </Row>
);

export default connect(({ dashboardAnalysis, loading }) => ({
  proportionData: dashboardAnalysis.proportionData,
  proportionSalesData: dashboardAnalysis.proportionSalesData,
  secondChartData: dashboardAnalysis.secondChartData,
  loading: loading.effects['dashboardAnalysis/fetch'],
}))(IntroduceRow);
