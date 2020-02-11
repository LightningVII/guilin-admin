import request from '@/utils/request';

export async function query() {
  return request('/strapi/users');
}

export async function queryCurrent() {
  // return request.get('/strapi/users/me');
  return request('https://randomapi.com/api/5gh173ft?key=GCCC-DTU1-0IMQ-939X').then(
    res => res.results[0],
  );
}

export async function queryNotices() {
  return request('/api/notices');
}
