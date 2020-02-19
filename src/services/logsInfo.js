// import request from '@/utils/request';
import logsInfo from '@/constants/logInfo';

export async function querylogsInfo() {
  //   return request.get('/strapi/users/me');
  return new Promise(resolve => setTimeout(() => resolve({ logsInfo }), 1000));
}
