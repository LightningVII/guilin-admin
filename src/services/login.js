import request from '@/utils/request';

export async function fakeAccountLogin(params) {
  // const { userName: identifier, password } = params;
  console.log('params', params);

  return new Promise(resolve => {
    console.log('fakeAccountLogin');
    setTimeout(
      () =>
        resolve({
          name: 'Serati Ma',
          avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
          userid: '00000001',
          email: 'antdesign@alipay.com',
          notifyCount: 12,
          unreadCount: 11,
          phone: '0752-268888888',
          role: {
            name: 'admin',
          },
        }),
      1000,
    );
  });

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
