// eslint-disable-next-line import/no-extraneous-dependencies
import { Random } from 'mockjs';

export const time = () => ({
  create_time: Random.date('T'),
  update_time: Random.date('T'),
});
