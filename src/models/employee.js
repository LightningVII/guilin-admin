import { queryEmployeeData } from '@/services/employee';

const EmployeeModel = {
  namespace: 'employee',

  state: {
    employeeList: [],
  },

  effects: {
    *fetchEmployeeData({ payload }, { call, put }) {
      const response = yield call(queryEmployeeData, payload);
      console.log('response', response);
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
        employeeList: action.payload || state.employeeList,
      };
    },
  },
};

export default EmployeeModel;
