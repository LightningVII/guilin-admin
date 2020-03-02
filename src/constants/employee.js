// eslint-disable-next-line import/no-extraneous-dependencies
import { Random } from 'mockjs';

export const info = () => {
  const id = Random.guid();
  return {
    title: Random.cname(),
    value: id,
    key: id,
  };
};

export default [...Random.string(3, 3)].map((item, i) => {
  const id = Random.guid();
  return {
    title: `第${['一', '二', '三'][i]}大队人员`,
    value: id,
    key: id,
    checkable: false,
    children: [...Random.string(3, 7)].map(() => info()),
  };
});
