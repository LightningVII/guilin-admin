import React, { Fragment } from 'react';

export const statusEnum = [
  {
    text: '接收任务',
    status: 'default',
  },
  {
    text: '任务下发',
    status: 'processing',
  },
  {
    text: '执行',
    status: 'success',
  },
  {
    text: '关闭',
    status: 'error',
  },
];

const processingAction = item => (
  <>
    <Fragment>{item?.username}</Fragment>
    <div>{item?.time}</div>
  </>
);

export const implementationEnum = [
  processingAction,
  processingAction,
  processingAction,
  processingAction,
];

export const TabsEnum = [
  { tab: '全部', index: 0 },
  ...statusEnum.map(({ text }, index) => ({ tab: text, index: index + 1 })),
];
