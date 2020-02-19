import { queryFeedbackData, queryFeedbackTBBM } from '@/services/feedback';

export default {
  namespace: 'feedback',

  state: {
    feedbackData: null,
    feedbackTBBM: null,
  },

  effects: {
    *fetchFeedbackData({ payload }, { call, put }) {
      const response = yield call(queryFeedbackData, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *fetchFeedbackTBBM({ payload }, { call, put }) {
      const response = yield call(queryFeedbackTBBM, payload);
      yield put({
        type: 'saveTBBMData',
        payload: response,
      });
    },
  },

  reducers: {
    saveData(state, action) {
      return {
        ...state,
        feedbackData: action.payload || state.feedbackData,
      };
    },
    saveTBBMData(state, action) {
      return {
        ...state,
        feedbackTBBM: action.payload || state.feedbackTBBM,
      };
    },
  },
};
