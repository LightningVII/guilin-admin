import { Table, Badge } from 'antd';
import React from 'react';
import { statusEnum } from '@/constants/basicEnum';

const columns = [
  {
    title: '区县',
    dataIndex: 'address',
  },
  {
    title: '图斑数量',
    dataIndex: 'age',
  },
  {
    title: '未启动',
    dataIndex: 'init',
  },
  {
    title: '正在执行',
    dataIndex: 'status',
    render: record => {
      const { text, status } = statusEnum[record];
      return <Badge text={text} status={status} />;
    },
  },
  {
    title: '已结束',
    dataIndex: 'finish',
  },
  {
    title: '执行率',
    dataIndex: 'updatedAt',
    valueType: 'dateTime',
  },
];

const data = [];
for (let i = 0; i < 10; i += 1) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `徐州.云龙区. ${i}`,
    status: Math.floor(Math.random() * 10) % 4,
    progress: Math.floor(Math.random() * 100),
    finish: Math.floor(Math.random() * 300),
    init: Math.floor(Math.random() * 300),
    updatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).getTime(),
  });
}

const TaskProgressTable = () => (
  <Table
    style={{ marginTop: '24px' }}
    columns={columns}
    dataSource={data}
    pagination={false}
    scroll={{ y: 240 }}
  />
);

export default TaskProgressTable;
