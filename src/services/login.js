import request from '@/utils/request';
import { stringify as str } from 'querystring';

export const fakeAccountLogin = async params =>
  request.post('/strapi/login', { data: str(params) });

export const updatePassword = async params =>
  request.post('/strapi/sys/user/updatePassword', { data: str(params) });
