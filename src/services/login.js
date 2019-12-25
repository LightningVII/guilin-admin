import request from '@/utils/request';

export async function fakeAccountLogin(params) {
  const { userName: identifier, password } = params;
  return request('/strapi/auth/local', {
    method: 'POST',
    data: {
      identifier,
      password,
    },
  });
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
