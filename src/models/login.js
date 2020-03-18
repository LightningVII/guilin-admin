import { stringify } from 'querystring';
import router from 'umi/router';
import { fakeAccountLogin, getFakeCaptcha } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'login',

  state: {
    // status: undefined,
    permissions: null,
  },
  // ?.user?.roles?.[0]
  effects: {
    *login({ payload }, { call, put }) {
      const { content } = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: content,
      });
      yield put({
        type: 'user/saveCurrentUser',
        payload: content?.user,
      });

      sessionStorage.setItem('user', JSON.stringify(content?.user));

      // Login successfully
      if (content?.user?.roles?.[0]) {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        if (content?.menus.find(({ perms }) => perms === 'HOME')) router.replace('/');
      } else {
        router.replace('/404');
      }
    },
    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
    logout() {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note

      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      const { user, menus } = payload;
      console.log('user?.roles?.[0]?.rolecode', user?.roles?.[0]?.rolecode);
      setAuthority(user?.roles?.[0]?.rolecode);
      // localStorage.setItem('token', payload.jwt);
      return {
        ...state,
        // status: payload.jwt ? 'ok' : 'error',
        // type: payload.jwt,
        permissions: menus,
      };
    },
  },
};

export default Model;
