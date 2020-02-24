import request from '@/utils/request';
import user from '@/constants/user';

export async function fakeAccountLogin(params) {
  // const { userName: identifier, password } = params;
  console.log('params', params);
  return new Promise(resolve => setTimeout(() => resolve(user()), 1000));

  /* return request('/strapi/auth/local', {
    method: 'POST',
    data: {
      identifier,
      password,
    },
  }); */
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
