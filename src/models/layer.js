import { queryLayerTree, queryLayerGetLayerUrl } from '@/services/layer';

const LayerModel = {
  namespace: 'layer',

  state: {
    layerTree: [],
    layerUrl: [],
  },

  effects: {
    *fetchLayerTree(_, { call, put }) {
      const payload = yield call(queryLayerTree);

      yield put({
        type: 'saveLayerTree',
        payload,
      });
    },
    *fetchLayerGetLayerUrl({ payload }, { call, put }) {
      const { content } = yield call(queryLayerGetLayerUrl, payload);

      yield put({
        type: 'saveLayerUrl',
        payload: content,
      });
    },
  },

  reducers: {
    saveLayerTree(state, { payload }) {
      return {
        ...state,
        layerTree: payload,
      };
    },
    saveLayerUrl(state, { payload }) {
      return {
        ...state,
        layerUrl: payload,
      };
    },
  },
};

export default LayerModel;
