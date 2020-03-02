import { querylogsInfo } from '@/services/logsInfo';

export default {
  namespace: 'logInfo',
  state: { logsInfo: [] },
  effects: {
    *fetchlogsInfo({ payload }, { call, put }) {
      const response = yield call(querylogsInfo, payload);
      yield put({
        type: 'savelogsInfo',
        payload: response?.logsInfo?.filter(item => item.TBBM === payload.TBBM),
      });
    },
  },
  reducers: {
    savelogsInfo(state, { payload }) {
      return { ...state, logsInfo: payload };
    },
  },
};
