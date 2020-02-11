// import request from '@/utils/request';

export async function queryEmployeeData(params) {
  const employeeList = [];

  for (let index = 0; index < 3; index += 1) {
    const item = {
      title: `第${index + 1}大队人员`,
      value: `0-${index}`,
      key: `0-${index}`,
      checkable: false,
      children: [],
    };

    for (let i = 0; i < 5; i += 1) {
      item.children.push({
        title: `第${index + 1}队-N${i + 1}`,
        value: `0-${index}-${i}`,
        key: `0-${index}-${i}`,
      });
    }
    employeeList.push(item);
  }

  /* return request('/api/rule', {
      params,
    }); */
  return new Promise(resolve => {
    console.log('queryEmployeeData', params);
    setTimeout(() => resolve(employeeList), 1000);
  });
}
