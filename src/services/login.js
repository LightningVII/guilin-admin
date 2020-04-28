import request from '@/utils/request';
import { stringify } from 'querystring';

export async function fakeAccountLogin(params) {
  return request(`/strapi/login`, {
    method: 'POST',
    data: stringify(params),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;',
    },
  });
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function updatePassword(params) {
  return request('/strapi/sys/user/updatePassword', {
    method: 'POST',
    data: stringify(params),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;',
    },
  });
}
