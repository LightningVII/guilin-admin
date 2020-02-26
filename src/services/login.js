import request from '@/utils/request';
// import user from '@/constants/user';
import { stringify } from 'querystring';
// import { stringify as qstr } from 'qs';

export async function fakeAccountLogin(params) {
  const { userName: username, password } = params;

  request(`/strapi/changespot/issue`, {
    method: 'POST',
    data: stringify({
      userIds: ['1', 'a'],
      spotIds: ['1', 'a'],
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;',
    },
  });

  // return new Promise(resolve => setTimeout(() => resolve(user()), 1000));
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
