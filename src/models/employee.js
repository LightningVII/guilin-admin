import { queryEmployeeData } from '@/services/employee';

const EmployeeModel = {
  namespace: 'employee',

  state: {
    employeeList: [],
    deptList: [],
  },

  effects: {
    *fetchEmployeeData({ payload }, { call, put }) {
      const response = yield call(queryEmployeeData, payload);

      yield put({
        type: 'saveEmployeeData',
        payload: response,
      });
    },
  },

  reducers: {
    saveEmployeeData(state, action) {
      return {
        ...state,
        employeeList:
          action.payload.deptUser.map(item => ({
            ...item,
            checkable: item.checkable === 'true',
          })) || state.employeeList,
        deptList: action.payload.dept,
      };
    },
  },
};

export default EmployeeModel;
