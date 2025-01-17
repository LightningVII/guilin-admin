import { stringify } from 'querystring';
import router from 'umi/router';
import { message } from 'antd';
import { fakeAccountLogin, getFakeCaptcha, updatePassword } from '@/services/login';
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
      const response = yield call(fakeAccountLogin, payload);
      const { content, message: msg } = response;

      if (['账号不存在', '密码不正确'].includes(msg)) {
        message.warning(msg);
        return null;
      }

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
            return null;
          }
        }
        if (content?.menus.find(({ perms }) => perms === 'HOME')) router.replace('/');
        else router.replace('/');
      } else {
        router.replace('/404');
      }
      return null;
    },
    *checkLogin({ payload }, { call, select }) {
      const { username } = yield select(state => state?.user?.currentUser);
      return yield call(fakeAccountLogin, { username, password: payload });
    },
    *updatePassword({ payload }, { call }) {
      return yield call(updatePassword, payload);
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
