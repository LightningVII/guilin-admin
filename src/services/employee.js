import request from '@/utils/request';
import { stringify } from 'querystring';

export async function queryEmployeeData() {
  const dept = await request('/strapi/sys/dept/all');
  const { content: role } = await request('/strapi/sys/role/all');
  const deptUser = await request('/strapi/sys/dept/deptUser');
  return { dept, role, deptUser };
}

export async function queryRoleDelete(payload) {
  return request(`/strapi/sys/role/delete`, {
    method: 'POST',
    data: stringify(payload),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;',
    },
  });
}

export async function queryDeptDelete(payload) {
  return request(`/strapi/sys/dept/delete`, {
    method: 'POST',
    data: stringify(payload),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;',
    },
  });
}

export async function queryRoleUpdate(payload) {
  return request(`/strapi/sys/role/update`, {
    method: 'POST',
    data: stringify(payload),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;',
    },
  });
}

export async function queryDeptUpdate(payload) {
  return request(`/strapi/sys/dept/update`, {
    method: 'POST',
    data: stringify(payload),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;',
    },
  });
}

export async function queryRoleAdd(payload) {
  return request(`/strapi/sys/role/add`, {
    method: 'POST',
    data: stringify(payload),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;',
    },
  });
}

export async function queryDeptAdd(payload) {
  return request(`/strapi/sys/dept/add`, {
    method: 'POST',
    data: stringify(payload),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;',
    },
  });
}
