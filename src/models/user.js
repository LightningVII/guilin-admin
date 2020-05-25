import {
  queryCurrent,
  query as queryUsers,
  queryStaffList,
  queryUserAdd,
  queryUserUpdate,
  queryStaffDelete,
} from '@/services/user';

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
    *fetchStaffDelete({ payload }, { call, put }) {
      const { code } = yield call(queryStaffDelete, { ids: [payload] });
      if (code === 200) yield put({ type: 'deleteStaff', payload });
    },
    *fetchCurrent(_, { call, put, select }) {
      const storage = sessionStorage;
      if (!storage.getItem('user') || storage.getItem('user') === 'undefined')
        storage.setItem('user', '{}');

      const { userid } = JSON.parse(storage.getItem('user'));
      const id = yield select(({ user }) => user?.currentUser?.userid || userid);
      if (!id) return;

      const { content } = yield call(queryCurrent, { id });
      yield put({ type: 'saveCurrentUser', payload: content });
    },
    *fetchStaffList({ payload }, { call, put }) {
      const response = yield call(queryStaffList, payload);

      yield put({
        type: 'saveStaffList',
        payload: response.content,
      });
    },
    *fetchUserSave({ payload }, { call, put }) {
      let res;
      const { userid, unsave, ...other } = payload;
      if (payload.userid === 'new-userid')
        res = yield call(queryUserAdd, { password: 888888, ...other });
      else res = yield call(queryUserUpdate, payload);
      if (res.code === 200) {
        yield put({ type: 'fetchCurrent' });
        yield put({ type: 'fetchStaffList', payload: { pageNum: 1, pageSize: 10 } });
      }
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
    deleteStaff(state, action) {
      return {
        ...state,
        staffList: {
          ...state.staffList,
          list: state.staffList.list.filter(item => item.userid !== action.payload),
        },
      };
    },
    cancelEditStaff(state) {
      return {
        ...state,
        staffList: {
          ...state.staffList,
          list: state.staffList.list.filter(({ unsave }) => !unsave),
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
