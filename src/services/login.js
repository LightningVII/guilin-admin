import request from '@/utils/request';
// import user from '@/constants/user';
import { stringify } from 'querystring';

export async function fakeAccountLogin(params) {
  const { userName: username, password } = params;
  // return new Promise(resolve => setTimeout(() => resolve(user()), 1000));
  return request(`http://qs.vipgz4.idcfengye.com/login`, {
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
