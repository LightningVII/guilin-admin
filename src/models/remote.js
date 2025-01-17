import {
  queryRemoteData,
  querySpotIssue,
  querySpotApproval,
  queryRemoteSensingDetail,
  querySpotFuzzyQuery,
  querySpotGeomotry,
  querySpotTBCount,
  querySpotBZTTJ,
  querySpotGeoJson,
} from '@/services/remote';

const RemoteModel = {
  namespace: 'remoteSensing',

  state: {
    remoteSensingData: null,
    changespot: null,
    fuzzyChangespot: null,
    geomotry: null,
    geoJson: null,
  },

  effects: {
    *fetchRemoteData({ payload }, { call, put, select }) {
      const userid = yield select(state => state?.user?.currentUser?.userid);
      const response = yield call(queryRemoteData, { ...payload, userid });
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
      return yield call(querySpotIssue, {
        ...payload,
        userIds,
      });
    },
    *fetchChangespotApproval({ payload }, { call }) {
      return yield call(querySpotApproval, payload);
    },
    *fetchRemoteSensingDetail({ payload }, { call, put }) {
      const data = yield call(queryRemoteSensingDetail, payload);
      yield put({
        type: 'show',
        payload: data?.content,
      });
    },
    *fetchChangespotFuzzyQuery({ payload }, { call, put }) {
      const data = yield call(querySpotFuzzyQuery, payload);
      yield put({
        type: 'saveFuzzyChangespot',
        payload: data?.content,
      });
      return data;
    },
    *fetchChangespotGeomotry({ payload }, { call, put }) {
      const data = yield call(querySpotGeomotry, payload);
      yield put({
        type: 'saveGeomotry',
        payload: data?.content,
      });
      return data;
    },
    *fetchChangespotTBCount({ payload }, { call, put }) {
      const data = yield call(querySpotTBCount, payload);
      yield put({
        type: 'saveTBCount',
        payload: data?.content,
      });
      return data;
    },
    *fetchChangespotBZTTJ({ payload }, { call, put }) {
      const data = yield call(querySpotBZTTJ, payload);
      yield put({
        type: 'saveBZTTJ',
        payload: data?.content,
      });
      return data;
    },
    *fetchChangespotGeoJson({ payload }, { call, put }) {
      const data = yield call(querySpotGeoJson, payload);
      yield put({
        type: 'saveGeoJson',
        payload: data,
      });
      return data;
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
    saveTBCount(state, { payload }) {
      return { ...state, tbcount: payload };
    },
    saveBZTTJ(state, { payload }) {
      return { ...state, bzttj: payload };
    },
    saveGeoJson(state, { payload }) {
      return { ...state, geoJson: payload };
    },
  },
};

export default RemoteModel;
