import { queryRemoteData } from '@/services/remote';

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
      yield put({
        type: 'saveRemoteData',
        payload: response,
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
  },
};

export default RemoteModel;
