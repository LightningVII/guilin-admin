import { queryFeedbackData, queryFeedbackTBBM } from '@/services/feedback';

export default {
  namespace: 'feedback',

  state: {
    feedbackData: [],
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
      const content = yield call(queryFeedbackTBBM, payload);
      return yield put({
        type: 'saveTBBMData',
        payload: content,
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
        feedbackData:
          state.feedbackData.indexOf(r => r?.tbbm === action?.payload?.[0].tbbm) < 0
            ? [...state.feedbackData, ...action?.payload]
            : [
                ...state.feedbackData.filter(r => r.tbbm !== action?.payload?.[0].tbbm),
                ...action?.payload,
              ],
        feedbackTBBM: action.payload || state.feedbackTBBM,
      };
    },
  },
};
