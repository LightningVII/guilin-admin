import {
  queryLayerTree,
  queryLayerGetLayerUrl,
  queryLayerAdd,
  queryLayerUpdate,
  queryLayerDelete
} from '@/services/layer';

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

      return payload;
    },
    *fetchLayerGetLayerUrl({ payload }, { call, put }) {
      const { content } = yield call(queryLayerGetLayerUrl, payload);

      yield put({
        type: 'saveLayerUrl',
        payload: content,
      });

      return content
    },
    *fetchLayerAdd({ payload }, { call }) {
      return yield call(queryLayerAdd, payload);
    },
    *fetchLayerUpdate({ payload }, { call }) {
      return yield call(queryLayerUpdate, payload);
    },
    *fetchLayerDelete({ payload }, { call }) {
      return yield call(queryLayerDelete, payload);
    }
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
