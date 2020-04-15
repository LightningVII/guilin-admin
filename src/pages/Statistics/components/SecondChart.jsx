import { Card } from 'antd';
import React from 'react';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';

const data = [
  {
    month: '1',
    value: 3,
  },
  {
    month: '2',
    value: 4,
  },
  {
    month: '3',
    value: 3.5,
  },
  {
    month: '4',
    value: 5,
  },
  {
    month: '5',
    value: 4.9,
  },
  {
    month: '6',
    value: 6,
  },
  {
    month: '7',
    value: 7,
  },
  {
    month: '8',
    value: 9,
  },
  {
    month: '9',
    value: 13,
  },
];
const cols = {
  value: {
    alias: '新增数量',
  },
  month: {
    alias: '月份',
  },
};

const tooltip = [
  'month*value',
  (month, value) => ({
    name: '图斑数量', // 要显示的名字
    value,
    title: `${month}月新增`,
  }),
];

const SecondChart = ({ cardProps, loading }) => (
  <Card
    {...cardProps}
    loading={loading}
    bordered={false}
    style={{
      height: '260px',
    }}
    extra={<a>详情</a>}
    bodyStyle={{ padding: 0 }}
  >
    <Chart height={180} padding={[20, 32, 32, 32]} data={data} scale={cols} forceFit>
      <Axis
        name="month"
        title={{
          position: 'end',
          offset: 15,
          textStyle: {
            fontSize: '12',
            textAlign: 'left',
            fill: '#333',
            fontWeight: 'bold',
            rotate: 0,
          },
        }}
      />
      <Axis
        name="value"
        title={{
          position: 'end',
          offset: -20,
          textStyle: {
            fontSize: '12',
            fill: '#333',
            fontWeight: 'bold',
            rotate: 0,
            textBaseline: 'bottom',
          },
        }}
      />
      <Tooltip
        crosshairs={{
          type: 'y',
        }}
      />
      <Geom type="line" position="month*value" size={2} shape="smooth" tooltip={tooltip} />
      <Geom
        type="point"
        position="month*value"
        size={4}
        shape="circle"
        style={{
          stroke: '#fff',
          lineWidth: 1,
        }}
        tooltip={tooltip}
      />
    </Chart>
  </Card>
);

export default SecondChart;
