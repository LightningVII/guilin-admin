// eslint-disable-next-line import/no-extraneous-dependencies
import { Random } from 'mockjs';
import React from 'react';
import { statusEnum } from '@/constants/basicEnum';
import { Badge, Divider, Tag } from 'antd';
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
        <a
          onClick={() => router.push(`/remote-sensing/details/arcgis-show/${item.properties.TBBM}`)}
        >
          地图查看
        </a>
        {/* <Divider type="vertical" />
        <a onClick={() => router.push('/feedback/create')}>填写报告</a> */}
      </>
    ),
  },
];

export const mockImages = handleImagesClick => {
  const images = [...Random.string(0, 4)].map(() => Random.image());
  return images.map((i, index) => (
    <img
      key={index.toString()}
      alt=""
      style={{ width: '30px', height: '40px', margin: '0 2px' }}
      src={i}
      onClick={() => handleImagesClick(images)}
    />
  ));
};

export const feedbackListColumns = handleImagesClick => [
  {
    title: '',
    dataIndex: 'isIllegal',
    render: isIllegal => (isIllegal ? <Tag color="red">违法</Tag> : <Tag color="green">合法</Tag>),
  },
  {
    title: '上传图片',
    dataIndex: 'selectedImages',
    width: 200,
    render: () => mockImages(handleImagesClick),
  },
  {
    title: '反馈内容',
    dataIndex: 'content',
  },
  {
    title: '执行人',
    width: 100,
    dataIndex: 'executor["username"]',
  },
  {
    title: '发起人',
    width: 100,
    dataIndex: 'originator["username"]',
  },
];
