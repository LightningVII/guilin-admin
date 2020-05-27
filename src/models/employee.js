import {
  queryRoleDelete,
  queryDeptDelete,
  queryRoleUpdate,
  queryDeptUpdate,
  queryRoleAdd,
  queryDeptAdd,
  queryMenuData,
  queryDeptData,
  queryRoleData,
  queryDeptUserData,
} from '@/services/employee';

const EmployeeModel = {
  namespace: 'employee',

  state: {
    employeeList: [],
    deptList: [],
    roleList: [],
  },

  effects: {
    *fetchEmployeeData(_, { call, put, all }) {
      const [dept, role, deptUser, menu] = yield all([
        call(queryDeptData),
        call(queryRoleData),
        call(queryDeptUserData),
        call(queryMenuData),
      ]);

      yield put({ type: 'saveEmployeeData', payload: [dept, role, deptUser, menu] });
    },
    *fetchRoleDelete({ payload }, { call, put }) {
      const { code } = yield call(queryRoleDelete, payload);
      if (code === 200) yield put({ type: 'deleteRole', payload: payload.roleIds[0] });
    },
    *fetchDeptDelete({ payload }, { call, put }) {
      const { code } = yield call(queryDeptDelete, payload);
      if (code === 200) yield put({ type: 'deleteDept', payload: payload.ids[0] });
    },
    *fetchRoleSave({ payload }, { call, put }) {
      const { roleid, ...param } = payload;
      if (roleid === 'new-roleid') return yield call(queryRoleAdd, param);
      const { code } = yield call(queryRoleUpdate, payload);
      if (code === 200) return yield put({ type: 'saveRole', payload });
      return null;
    },
    *fetchDeptSave({ payload }, { call, put }) {
      const { deptid, ...param } = payload;
      if (deptid === 'new-deptid') return yield call(queryDeptAdd, param);
      const { code } = yield call(queryDeptUpdate, payload);
      if (code === 200) return yield put({ type: 'saveDept', payload });
      return null;
    },
  },

  reducers: {
    saveEmployeeData(state, action) {
      const [dept, role, deptUser, menu] = action.payload;
      return {
        ...state,
        employeeList:
          deptUser.map(item => ({
            ...item,
            checkable: item.checkable === 'true',
          })) || state.employeeList,
        deptList: dept,
        roleList: role,
        menuList: menu.list,
      };
    },
    addRole(state, action) {
      return { ...state, roleList: [{ ...action.payload, unsave: true }, ...state.roleList] };
    },
    addDept(state, action) {
      return { ...state, deptList: [{ ...action.payload, unsave: true }, ...state.deptList] };
    },
    cancelEditRole(state) {
      return { ...state, roleList: state.roleList.filter(({ unsave }) => !unsave) };
    },
    cancelEditDept(state) {
      return { ...state, deptList: state.deptList.filter(({ unsave }) => !unsave) };
    },
    deleteRole(state, action) {
      return { ...state, roleList: state.roleList.filter(item => item.roleid !== action.payload) };
    },
    deleteDept(state, action) {
      return { ...state, deptList: state.deptList.filter(item => item.deptid !== action.payload) };
    },
    saveRole(state, action) {
      const { row, key } = action.payload;
      const { roleList } = state;
      const index = roleList.findIndex(item => key === item.key);

      if (index > -1) {
        const { unsave, ...item } = roleList[index];
        roleList.splice(index, 1, { ...item, ...row });
      } else {
        roleList.push(row);
      }
      return { ...state, roleList };
    },
    saveDept(state, action) {
      const { row, key } = action.payload;
      const { deptList } = state;
      const index = deptList.findIndex(item => key === item.key);

      if (index > -1) {
        const { unsave, ...item } = deptList[index];
        deptList.splice(index, 1, { ...item, ...row });
      } else {
        deptList.push(row);
      }
      return { ...state, deptList };
    },
  },
};

export default EmployeeModel;
