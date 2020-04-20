import { Card } from 'antd';
import React from 'react';
import { DataStatistics } from './Charts';
import styles from '../style.less';

const Proportion = ({ loading, data, cardProps }) => (
  <Card
    {...cardProps}
    loading={loading}
    className={styles.salesCard}
    bodyStyle={{ padding: 0 }}
    bordered={false}
    style={{ height: '260px' }}
    extra={<a>详情</a>}
  >
    <DataStatistics
      hasLegend
      total={() => data.reduce((pre, now) => now.y + pre, 0)}
      data={data}
      valueFormat={value => value}
      height={148}
      lineWidth={4}
    />
  </Card>
);

export default Proportion;
