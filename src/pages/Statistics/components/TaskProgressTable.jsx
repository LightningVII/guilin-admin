import { EllipsisOutlined } from '@ant-design/icons';
import { Card, Menu, Dropdown, Table, Badge, Progress } from 'antd';
import React from 'react';
import { statusEnum } from '@/constants/basicEnum';

const menu = (
  <Menu>
    <Menu.Item>操作一</Menu.Item>
    <Menu.Item>操作二</Menu.Item>
  </Menu>
);
const dropdownGroup = (
  <span>
    <Dropdown overlay={menu} placement="bottomRight">
      <EllipsisOutlined />
    </Dropdown>
  </span>
);

const progressValueEnum = {
  0: {
    text: '正常',
    status: 'normal',
  },
  1: {
    text: '运行中',
    status: 'active',
  },
  2: {
    text: '已上线',
    status: 'success',
  },
  3: {
    text: '异常',
    status: 'exception',
  },
};

const columns = [
  {
    title: '序号',
    dataIndex: 'key',
    width: 150,
  },
  {
    title: '区县',
    dataIndex: 'address',
    width: 150,
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
    title: '进度',
    dataIndex: 'progress',
    render: (record, row) => {
      const { status } = progressValueEnum[row.status];
      return <Progress percent={record} status={status} />;
    },
  },
  {
    title: '已结束',
    dataIndex: 'finish',
  },
  {
    title: '效率',
    dataIndex: 'updatedAt',
    sorter: true,
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
  <Card
    title="任务"
    bordered={false}
    style={{
      height: '100%',
      marginTop: '24px',
    }}
    extra={dropdownGroup}
  >
    <Table columns={columns} dataSource={data} pagination={{ pageSize: 50 }} scroll={{ y: 240 }} />
  </Card>
);

export default TaskProgressTable;
