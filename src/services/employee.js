import request from '@/utils/request';
import { stringify as str } from 'querystring';

export async function queryDeptData() {
  const content = await request('/strapi/sys/dept/all');
  return content;
}

export async function queryRoleData() {
  const { content } = await request('/strapi/sys/role/all');
  return content;
}

export async function queryDeptUserData() {
  const content = await request('/strapi/sys/dept/deptUser');
  return content;
}

export async function queryEmployeeData() {
  const dept = await request('/strapi/sys/dept/all');
  const { content: role } = await request('/strapi/sys/role/all');
  const deptUser = await request('/strapi/sys/dept/deptUser');
  return { dept, role, deptUser };
}

export const queryRoleAdd = async params =>
  request.post('/strapi/sys/role/add', { data: str(params) });

export const queryRoleDelete = async params =>
  request.post('/strapi/sys/role/delete', { data: str(params) });

export const queryRoleUpdate = async params =>
  request.post('/strapi/sys/role/update', { data: str(params) });

export const queryDeptAdd = async params =>
  request.post('/strapi/sys/dept/add', { data: str(params) });

export const queryDeptDelete = async params =>
  request.post('/strapi/sys/dept/delete', { data: str(params) });

export const queryDeptUpdate = async params =>
  request.post('/strapi/sys/dept/update', { data: str(params) });

export const queryMenuData = async () => {
  const { content } = await request.get('/strapi/sys/menu/list');
  return content;
};

export const queryMenuAdd = async params =>
  request.post('/strapi/sys/menu/add', { data: str(params) });

export const queryMenuDelete = async params =>
  request.post('/strapi/sys/menu/delete', { data: str(params) });

export const queryMenuUpdate = async params =>
  request.post('/strapi/sys/menu/update', { data: str(params) });
