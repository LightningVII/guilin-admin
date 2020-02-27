import { queryRemoteData, queryChangespotIssue } from '@/services/remote';

const RemoteModel = {
  namespace: 'remoteSensing',

  state: {
    remoteSensingData: null,
  },

  effects: {
    *fetchRemoteData({ payload }, { call, put, select }) {
      const userId = yield select(state => state?.user?.currentUser?.userid);
      const response = yield call(queryRemoteData, {
        ...payload,
        userId,
      });
      if (response?.code === 200 && response?.content) {
        yield put({
          type: 'saveRemoteData',
          payload: {
            totalCount: response?.content?.total,
            data: response?.content?.list,
          },
        });
      }
    },
    *fetchChangespotIssue({ payload }, { call }) {
      return yield call(queryChangespotIssue, payload);
    },
  },

  reducers: {
    saveRemoteData(state, action) {
      return {
        ...state,
        remoteSensingData: action.payload || state.remoteSensingData,
      };
    },
  },
};

export default RemoteModel;
