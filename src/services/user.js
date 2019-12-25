import request from '@/utils/request';

export async function query() {
  return request('/strapi/users');
}

export async function queryCurrent() {
  return request.get('/strapi/users/me');
}
