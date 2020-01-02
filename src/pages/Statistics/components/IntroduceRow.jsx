import { Col, Row } from 'antd';
import React, { Suspense } from 'react';

const ProportionSales = React.lazy(() => import('./ProportionSales'));
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

const IntroduceRow = ({ loading }) => (
  <Row gutter={24} type="flex">
    <Col {...topColResponsiveProps}>
      <Suspense fallback={null}>
        <ProportionSales
          cardProps={{
            title: (
              <>
                数据统计
                <p
                  style={{
                    fontWeight: 'normal',
                    margin: 0,
                    fontSize: '14px',
                  }}
                  className="ant-card-meta-description"
                >
                  系统中数据统计占比情况
                </p>
              </>
            ),
          }}
          salesType={salesType}
          loading={loading}
          salesPieData={[
            {
              x: '遥感数据',
              y: 12,
            },
            {
              x: '监测数据',
              y: 13,
            },
            {
              x: '其他数据',
              y: 15,
            },
          ]}
        />
      </Suspense>
    </Col>
    <Col {...topColResponsiveProps}>
      <Suspense fallback={null}>
        <SecondChart
          cardProps={{
            title: (
              <>
                变化图斑类型分布
                <p
                  style={{
                    fontWeight: 'normal',
                    margin: 0,
                    fontSize: '14px',
                  }}
                  className="ant-card-meta-description"
                >
                  汇总历史变化图斑类型的分布情况
                </p>
              </>
            ),
          }}
          loading={loading}
        />
      </Suspense>
    </Col>
    <Col {...topColResponsiveProps}>
      <Suspense fallback={null}>
        <ProportionSales
          cardProps={{
            title: (
              <>
                任务执行
                <p
                  style={{
                    fontWeight: 'normal',
                    margin: 0,
                    fontSize: '14px',
                  }}
                  className="ant-card-meta-description"
                >
                  汇总当前所有任务执行情况
                </p>
              </>
            ),
          }}
          salesType={salesType}
          loading={loading}
          salesPieData={[
            {
              x: '未启动',
              y: 4544,
            },
            {
              x: '正在执行',
              y: 3321,
            },
            {
              x: '已结束',
              y: 3113,
            },
          ]}
        />
      </Suspense>
    </Col>
  </Row>
);

export default IntroduceRow;
