// import request from '@/utils/request';
import feedback from '@/constants/feedback';

export async function queryFeedbackData(params) {
  console.log('queryFeedbackData', params);
  return new Promise(resolve => setTimeout(() => resolve(feedback), 1000));
}
