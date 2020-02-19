import React from 'react';
import { statusEnum } from '@/constants/basicEnum';
import { Badge, Divider } from 'antd';
import router from 'umi/router';

export const remoteSensingListColumns = () => [
  {
    title: '批次',
    dataIndex: 'properties.BATCH',
  },
  {
    title: '区县',
    dataIndex: 'properties.COUNTY',
  },
  {
    title: '位置',
    dataIndex: 'properties.LOCATION',
  },
  {
    title: '前时相',
    dataIndex: 'properties.QSXDLMC',
  },
  {
    title: '后时相',
    dataIndex: 'properties.HSXDLMC',
  },
  {
    title: '占地面积',
    dataIndex: 'properties.AREA',
    render: val => `${val.toFixed(2)}亩`,
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: record => {
      const { text, status } = statusEnum[record];
      return <Badge text={text} status={status} />;
    },
  },
  {
    title: '操作',
    dataIndex: 'option',
    valueType: 'option',
    align: 'right',
    render: (record, item) => (
      <>
        <a onClick={() => router.push(`/remote-sensing/details/${item.properties.TBBM}`)}>
          查看详情
        </a>
        <Divider type="vertical" />
        <a onClick={() => router.push('/remote-sensing/details/arcgis-show')}>地图查看</a>
        {/* <Divider type="vertical" />
        <a onClick={() => router.push('/feedback/create')}>填写报告</a> */}
      </>
    ),
  },
];
