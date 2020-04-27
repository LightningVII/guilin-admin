import { queryCity, queryProvince, query as queryUsers } from './service';

const Model = {
  namespace: 'userAndAccountSettings',
  state: {
    currentUser: {},
    province: [],
    city: [],
    isLoading: false,
    staffList: [],
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchProvince(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryProvince);
      yield put({
        type: 'setProvince',
        payload: response,
      });
    },

    *fetchCity({ payload }, { call, put }) {
      const response = yield call(queryCity, payload);
      yield put({
        type: 'setCity',
        payload: response,
      });
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },

    changeNotifyCount(state = {}, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },

    setProvince(state, action) {
      return { ...state, province: action.payload };
    },

    setCity(state, action) {
      return { ...state, city: action.payload };
    },

    changeLoading(state, action) {
      return { ...state, isLoading: action.payload };
    },

    saveStaff(state, action) {
      const { row, key } = action.payload;
      const { staffList } = state;
      const index = staffList.findIndex(item => key === item.key);

      if (index > -1) {
        const { unsave, ...item } = staffList[index];
        staffList.splice(index, 1, { ...item, ...row });
      } else {
        staffList.push(row);
      }
      return { ...state, staffList };
    },

    cancelEditStaff(state) {
      return { ...state, staffList: state.staffList.filter(({ unsave }) => !unsave) };
    },

    addStaff(state, action) {
      return { ...state, staffList: [{ ...action.payload, unsave: true }, ...state.staffList] };
    },

    deleteStaff(state, action) {
      return { ...state, staffList: state.staffList.filter(item => item.key !== action.payload) };
    },
  },
};
export default Model;
