import { queryRemoteData } from '@/services/remote';

const RemoteModel = {
  namespace: 'remoteSensing',

  state: {
    remoteSensingData: null,
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
        remoteSensingData: action.payload || state.remoteSensingData,
      };
    },
  },
};

export default RemoteModel;
