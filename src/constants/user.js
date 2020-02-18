// eslint-disable-next-line import/no-extraneous-dependencies
import { Random } from 'mockjs';

export default () => ({
  username: Random.cname(),
  age: 7,
  dogYears: 49,
  userid: Random.guid(),
  avatar: Random.image(),
  email: Random.email(),
  role: Random.pick(['admin', 'user', 'guest']),
  title: 'Senior Division Director',
  signature: 'Reprehenderit mollitia odit non laboriosam sunt explicabo ipsam sed voluptas.',
  group: 'Central',
  tags: [
    { key: '0', label: 'natus' },
    { key: '1', label: 'quis' },
    { key: '2', label: 'sapiente' },
    { key: '3', label: 'odio' },
    { key: '4', label: 'aliquid' },
  ],
  notifyCount: 8,
  unreadCount: 8,
  country: 'Cocos (Keeling) Islands',
  geographic: {
    province: { label: '浙江省', key: '275883' },
    city: { label: '上 叶', key: '083584' },
  },
  address: '侯汉市, 绍辉 桥 8964 君浩 侬 藏',
});
