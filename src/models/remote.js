import { queryRemoteData } from '@/services/remote';

const RemoteModel = {
  namespace: 'remoteSensing',

  state: {
    remoteData: null,
  },

  effects: {
    *fetchRemoteData({ payload }, { call, put }) {
      const response = yield call(queryRemoteData, payload);
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
        remoteData: action.payload || state.remoteData,
      };
    },
  },
};

export default RemoteModel;
