// eslint-disable-next-line import/no-extraneous-dependencies
import { Random } from 'mockjs';
import { TBBMs } from './feedback';
import user from './user';
import { time } from './basicGroup';

export const reportTypes = [
  '市级图斑接收',
  '市级审核',
  '区县图斑接收',
  '区县审核',
  '执法大队接收',
  '执法处理',
  '区县成果审核',
  '市级审核',
  '归档',
];

export const info = () => ({
  TBBM: Random.pick(TBBMs),
  id: Random.guid(),
  desc: Random.cparagraph(),
  reportType: Random.pick(reportTypes),
  reporter: user(),
  time: time().update_time,
});

export default [...Random.string(60, 100)].map(() => info());
