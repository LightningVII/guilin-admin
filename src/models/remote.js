import {
  queryRemoteData,
  queryChangespotIssue,
  queryChangespotApproval,
  queryRemoteSensingDetail,
  queryChangespotFuzzyQuery,
  queryChangespotGeomotry,
} from '@/services/remote';

const RemoteModel = {
  namespace: 'remoteSensing',

  state: {
    remoteSensingData: null,
    changespot: null,
    fuzzyChangespot: null,
    geomotry: null,
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
      let { userIds } = payload;
      if (userIds) {
        const u = userIds.split('-');
        userIds = u[u.length - 1];
      }
      return yield call(queryChangespotIssue, {
        ...payload,
        userIds,
      });
    },
    *fetchChangespotApproval({ payload }, { call }) {
      return yield call(queryChangespotApproval, payload);
    },
    *fetchRemoteSensingDetail({ payload }, { call, put }) {
      const data = yield call(queryRemoteSensingDetail, payload);
      yield put({
        type: 'show',
        payload: data?.content,
      });
    },
    *fetchChangespotFuzzyQuery({ payload }, { call, put }) {
      const data = yield call(queryChangespotFuzzyQuery, payload);
      yield put({
        type: 'saveFuzzyChangespot',
        payload: data?.content,
      });
    },
    *fetchChangespotGeomotry({ payload }, { call, put }) {
      const data = yield call(queryChangespotGeomotry, payload);
      yield put({
        type: 'saveGeomotry',
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
    saveFuzzyChangespot(state, { payload }) {
      return { ...state, fuzzyChangespot: payload };
    },
    saveGeomotry(state, { payload }) {
      return { ...state, geomotry: payload };
    },
  },
};

export default RemoteModel;
