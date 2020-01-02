import { Card } from 'antd';
import React from 'react';
// import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import { Chart, Geom, Tooltip } from 'bizcharts';
import DataSet from '@antv/data-set';

const data = [
  {
    name: '前一月',
    'Jan.': 18.9,
    'Feb.': 28.8,
    'Mar.': 39.3,
    'Apr.': 81.4,
    'May.': 47,
    'Jun.': 20.3,
    'Jul.': 24,
    'Aug.': 35.6,
    'Sep.': 42.4,
    'Oct.': 42.4,
    'Nov.': 42.4,
    'Dec.': 42.4,
  },
  {
    name: '后一月',
    'Jan.': 12.4,
    'Feb.': 23.2,
    'Mar.': 34.5,
    'Apr.': 99.7,
    'May.': 52.6,
    'Jun.': 35.5,
    'Jul.': 37.4,
    'Aug.': 42.4,
    'Sep.': 42.4,
    'Oct.': 42.4,
    'Nov.': 42.4,
    'Dec.': 42.4,
  },
];
const ds = new DataSet();
const dv = ds.createView().source(data);
dv.transform({
  type: 'fold',
  fields: [
    'Jan.',
    'Feb.',
    'Mar.',
    'Apr.',
    'May.',
    'Jun.',
    'Jul.',
    'Aug.',
    'Sep.',
    'Oct.',
    'Nov.',
    'Dec.',
  ],
  // 展开字段集
  key: '月份',
  // key字段
  value: '月均降雨量', // value字段
});

const SecondChart = ({ cardProps, loading }) => (
  <Card
    {...cardProps}
    loading={loading}
    bordered={false}
    style={{
      height: '260px',
    }}
    extra={<a>详情</a>}
  >
    <Chart style={{ margin: '-45px -20px 0 -80px' }} height={280} data={dv} forceFit>
      {/* <Legend />
      <Axis name="月份" />
      <Axis name="月均降雨量" /> */}
      <Tooltip />
      <Geom
        type="intervalStack"
        position="月份*月均降雨量"
        color="name"
        style={{
          stroke: '#fff',
          lineWidth: 1,
        }}
      />
    </Chart>
  </Card>
);

export default SecondChart;
