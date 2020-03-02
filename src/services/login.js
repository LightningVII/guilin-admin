import request from '@/utils/request';
// import user from '@/constants/user';
import { stringify } from 'querystring';
// import { stringify as qstr } from 'qs';

export async function fakeAccountLogin(params) {
  const { userName: username, password } = params;

  return request(`/strapi/login`, {
    method: 'POST',
    data: stringify({
      username,
      password,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;',
    },
  });
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
