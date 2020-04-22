import {
  querybhlxtj,
  querybhtblx,
  queryrwtj,
  queryrwzx,
  querysjtj,
  fakeChartData,
} from './service';

const initState = {
  visitData: [],
  visitData2: [],
  salesData: [],
  searchData: [],
  offlineData: [],
  offlineChartData: [],
  salesTypeData: [],
  salesTypeDataOnline: [],
  salesTypeDataOffline: [],
  radarData: [],
  secondChartData: [],
  proportionData: [],
  proportionSalesData: [],
  rwtjData: [],
};
const Model = {
  namespace: 'dashboardAnalysis',
  state: initState,
  effects: {
    *fetch(_, { call, put }) {
      const response = yield [
        // call(fakeChartData),
        call(querybhlxtj),
        call(querybhtblx),
        call(queryrwtj),
        call(queryrwzx),
        call(querysjtj),
      ];

      const { other, ygsj, jcsj } = response?.[4]?.content;
      const { yjs, wqd, zxz } = response?.[3]?.content;

      yield put({
        type: 'save',
        payload: {
          proportionData: [
            {
              item: '遥感数据',
              count: ygsj,
            },
            {
              item: '监测数据',
              count: jcsj,
            },
            {
              item: '其他数据',
              count: other,
            },
          ],
          secondChartData: response?.[1]?.content.map(({ MONTH, TBSL }) => ({
            month: MONTH,
            value: TBSL,
          })),
          proportionSalesData: [
            {
              x: '未启动',
              y: wqd,
            },
            {
              x: '正在执行',
              y: zxz,
            },
            {
              x: '已结束',
              y: yjs,
            },
          ],
          rwtjData: response?.[2]?.content,
          bhlxtjData: response?.[0]?.content,
        },
      });
    },

    *fetchSalesData(_, { call, put }) {
      const response = yield call(fakeChartData);

      yield put({
        type: 'save',
        payload: {
          salesData: response.salesData,
        },
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    clear() {
      return initState;
    },
  },
};
export default Model;
