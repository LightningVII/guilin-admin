import { queryCurrent, query as queryUsers, queryStaffList, queryUserAdd } from '@/services/user';

const UserModel = {
  namespace: 'user',

  state: {
    currentUser: null,
    staffList: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put, select }) {
      if (!sessionStorage.getItem('user') || sessionStorage.getItem('user') === 'undefined')
        sessionStorage.setItem('user', '{}');
      const { userid } = JSON.parse(sessionStorage.getItem('user'));
      const id = yield select(state => state?.user?.currentUser?.userid || userid);
      const response = yield call(queryCurrent, { id });
      yield put({
        type: 'saveCurrentUser',
        payload: response.content,
      });
    },
    *fetchStaffList({ payload }, { call, put }) {
      const response = yield call(queryStaffList, payload);

      yield put({
        type: 'saveStaffList',
        payload: response.content,
      });
    },
    *fetchUserAdd({ payload }, { call, put }) {
      const res = yield call(queryUserAdd, payload);
      console.log('res', res);
      yield put({
        type: 'addStaff',
        payload,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser:
          {
            ...state.currentUser,
            ...action.payload,
          } || state.currentUser,
      };
    },
    saveStaffList(state, action) {
      return {
        ...state,
        staffList: action.payload,
      };
    },
    addStaff(state, action) {
      return {
        ...state,
        staffList: {
          ...state.staffList,
          list: [{ ...action.payload, unsave: true }, ...(state?.staffList?.list || [])],
        },
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
