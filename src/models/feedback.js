import { queryFeedbackData } from '@/services/feedback';

export default {
  namespace: 'feedback',

  state: {
    feedbackData: null,
  },

  effects: {
    *fetchFeedbackData({ payload }, { call, put }) {
      const response = yield call(queryFeedbackData, payload);
      yield put({
        type: 'saveData',
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
  },
};
