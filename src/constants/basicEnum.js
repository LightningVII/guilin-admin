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

const defaultAction = item => (
  <>
    <Fragment>{item?.originator?.username}</Fragment>
    <div>2016-12-12 12:32</div>
  </>
);

const processingAction = item => (
  <>
    <Fragment>{item?.executor?.username}</Fragment>
    <div>2016-12-12 12:32</div>
  </>
);

export const implementationEnum = [defaultAction, defaultAction, processingAction, defaultAction];

export const TabsEnum = [
  { tab: '全部', index: 0 },
  ...statusEnum.map(({ text }, index) => ({ tab: text, index: index + 1 })),
];
