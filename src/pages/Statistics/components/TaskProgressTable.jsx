import { Table } from 'antd';
import React from 'react';
import { connect } from 'dva';

const columns = [
  {
    title: '区县',
    dataIndex: 'COUNTY',
  },
  {
    title: '图斑数量',
    dataIndex: 'TBSL',
  },
  {
    title: '未启动',
    dataIndex: 'WQDSL',
  },
  {
    title: '正在执行',
    dataIndex: 'ZXSL',
  },
  {
    title: '已结束',
    dataIndex: 'JSSL',
  },
  {
    title: '执行率',
    dataIndex: 'zxxl',
  },
];

const TaskProgressTable = ({ data }) => (
  <Table
    rowKey="COUNTY"
    style={{ marginTop: '24px' }}
    columns={columns}
    dataSource={data}
    pagination={false}
    scroll={{ y: 240 }}
  />
);

export default connect(({ dashboardAnalysis, loading }) => ({
  data: dashboardAnalysis.rwtjData,
  loading: loading.effects['dashboardAnalysis/fetch'],
}))(TaskProgressTable);
