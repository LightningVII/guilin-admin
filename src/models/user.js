import { queryCurrent, query as queryUsers } from '@/services/user';

const UserModel = {
  namespace: 'user',

  state: {
    currentUser: null,
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
      if (sessionStorage.getItem('user') === 'undefined') sessionStorage.setItem('user', '{}');
      const { userid } = JSON.parse(sessionStorage.getItem('user'));
      const id = yield select(state => state?.user?.currentUser?.userid || userid);
      const response = yield call(queryCurrent, { id });
      yield put({
        type: 'saveCurrentUser',
        payload: response.content,
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
