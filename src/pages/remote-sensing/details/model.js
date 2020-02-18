import { queryRemoteSensingDetail } from './service';

export default {
  namespace: 'remoteSensingDetails',
  state: { remoteSensingDetail: null },
  effects: {
    *findRemoteSensingDetail({ payload }, { call, put }) {
      // const data = yield select(({ remoteSensing }) => remoteSensing?.remoteSensingData?.data.find(
      //   item => payload?.TBBM === item?.properties?.TBBM
      // ));
      const data = yield call(queryRemoteSensingDetail, payload);
      console.log(' remoteSensingDetails  data', data);
      yield put({
        type: 'show',
        payload: data,
      });
    },
  },
  reducers: {
    show(state, { payload }) {
      return { ...state, remoteSensingDetail: payload };
    },
  },
};
