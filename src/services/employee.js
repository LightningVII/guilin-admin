import request from '@/utils/request';
import { stringify } from 'querystring';

const headers = {
  'Content-Type': 'application/x-www-form-urlencoded;',
};

const postParams = payload => ({
  method: 'POST',
  data: stringify(payload),
  headers,
});

export async function queryEmployeeData() {
  const dept = await request('/strapi/sys/dept/all');
  const { content: role } = await request('/strapi/sys/role/all');
  const deptUser = await request('/strapi/sys/dept/deptUser');
  return { dept, role, deptUser };
}

export async function queryRoleAdd(payload) {
  return request(`/strapi/sys/role/add`, postParams(payload));
}

export async function queryRoleDelete(payload) {
  return request(`/strapi/sys/role/delete`, postParams(payload));
}

export async function queryRoleUpdate(payload) {
  return request(`/strapi/sys/role/update`, postParams(payload));
}

export async function queryDeptAdd(payload) {
  return request(`/strapi/sys/dept/add`, postParams(payload));
}

export async function queryDeptDelete(payload) {
  return request(`/strapi/sys/dept/delete`, postParams(payload));
}

export async function queryDeptUpdate(payload) {
  return request(`/strapi/sys/dept/update`, postParams(payload));
}

export async function queryMenuData() {
  const { content } = await request('/strapi/sys/menu/list');
  return content;
}

export async function queryMenuAdd(payload) {
  return request(`/strapi/sys/menu/add`, postParams(payload));
}

export async function queryMenuDelete(payload) {
  return request(`/strapi/sys/menu/delete`, postParams(payload));
}

export async function queryMenuUpdate(payload) {
  return request(`/strapi/sys/menu/update`, postParams(payload));
}
