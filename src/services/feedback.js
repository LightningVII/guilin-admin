import request from '@/utils/request';
import feedback from '@/constants/feedback';
import { stringify } from 'querystring';

export async function queryFeedbackData(params) {
  console.log('queryFeedbackData', params);
  return new Promise(resolve => setTimeout(() => resolve(feedback), 1000));
}

export async function queryFeedbackTBBM(tbbm) {
  return request(`/strapi/changespot/implementInfo?${stringify(tbbm)}`);
}
