import { Card } from 'antd';
import React from 'react';
import { DataStatistics } from './Charts';
import styles from '../style.less';

const ProportionSales = ({
  // salesType,
  loading,
  salesPieData,
  cardProps,
  // handleChangeSalesType,
}) => (
  <Card
    {...cardProps}
    loading={loading}
    className={styles.salesCard}
    bodyStyle={{ padding: 0 }}
    bordered={false}
    style={{
      height: '260px',
    }}
    extra={<a>详情</a>}
  >
    <DataStatistics
      hasLegend
      // subTitle={<FormattedMessage id="dashboardanalysis.analysis.sales" defaultMessage="Sales" />}
      total={() => salesPieData.reduce((pre, now) => now.y + pre, 0)}
      data={salesPieData}
      valueFormat={value => value}
      height={148}
      lineWidth={4}
      // style={{ marginTop: '-60px' }}
    />
  </Card>
);

export default ProportionSales;
