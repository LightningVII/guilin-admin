// import request from '@/utils/request';
import employeeList from '@/constants/employee';

export async function queryEmployeeData(params) {
  /* return request('/api/rule', {
      params,
    }); */
  return new Promise(resolve => {
    console.log('queryEmployeeData', params);
    setTimeout(() => resolve(employeeList), 1000);
  });
}
