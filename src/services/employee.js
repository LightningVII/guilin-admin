import request from '@/utils/request';

export async function queryEmployeeData() {
  const dept = await request('/strapi/sys/dept/all');
  const deptUser = await request('/strapi/sys/dept/deptUser');
  return { dept, deptUser };
}
