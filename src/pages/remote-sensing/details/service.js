// import request from '@/utils/request';
import { remoteSensing } from '@/constants/remoteSensing';

export async function queryRemoteSensingDetail() {
  return new Promise(resolve => setTimeout(() => resolve(remoteSensing()), 1000));

  // return request('/api/profile/advanced');
}
