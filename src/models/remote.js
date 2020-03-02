import {
  queryRemoteData,
  queryChangespotIssue,
  queryChangespotApproval,
  queryRemoteSensingDetail,
} from '@/services/remote';

const RemoteModel = {
  namespace: 'remoteSensing',

  state: {
    remoteSensingData: null,
    changespot: null,
  },

  effects: {
    *fetchRemoteData({ payload }, { call, put, select }) {
      const userid = yield select(state => state?.user?.currentUser?.userid);
      const response = yield call(queryRemoteData, {
        ...payload,
        userid,
      });
      if (response?.code === 200 && response?.content) {
        return yield put({
          type: 'saveRemoteData',
          payload: {
            totalCount: response?.content?.total,
            data: response?.content?.list,
          },
        });
      }
      return {};
    },
    *fetchChangespotIssue({ payload }, { call }) {
      return yield call(queryChangespotIssue, payload);
    },
    *fetchChangespotApproval({ payload }, { call }) {
      return yield call(queryChangespotApproval, payload);
    },
    *fetchRemoteSensingDetail({ payload }, { call, put }) {
      const data = yield call(queryRemoteSensingDetail, payload);
      console.log('fetchRemoteSensingDetail  data', data);
      yield put({
        type: 'show',
        payload: data?.content,
      });
    },
  },

  reducers: {
    saveRemoteData(state, action) {
      return {
        ...state,
        remoteSensingData: action.payload || state.remoteSensingData,
      };
    },
    show(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};

export default RemoteModel;
