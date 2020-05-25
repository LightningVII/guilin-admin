import request from '@/utils/request';
import { stringify as str } from 'querystring';

export const query = async () => request('/strapi/users');

export const queryCurrent = async params => request.get('/strapi/sys/user/info', { params });

export const queryStaffList = async params => request.get('/strapi/sys/user/list', { params });

export const queryUserAdd = async params =>
  request.post('/strapi/sys/user/add', { data: str(params) });

export const queryUserUpdate = async params =>
  request.post('/strapi/sys/user/update', { data: str(params) });

export const queryStaffDelete = async params =>
  request.post('/strapi/sys/user/delete', { data: str(params) });
