import { stringify } from 'querystring';
import router from 'umi/router';
import { fakeAccountLogin, getFakeCaptcha } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

/* const aaa = {
  code: 200,
  message: '成功',
  content: {
    menus: [
      { menuid: '1', pid: '0', menuname: '首页', perms: 'HOME', type: 1, orderNum: 1 },
      { menuid: '2', pid: '0', menuname: '展示中心', perms: 'SHOW', type: 1, orderNum: 2 },
      { menuid: '3', pid: '0', menuname: '任务审批', perms: 'TASK', type: 1, orderNum: 3 },
      { menuid: '4', pid: '0', menuname: '消息中心', perms: 'MESSAGE', type: 1, orderNum: 4 },
      { menuid: '5', pid: '0', menuname: '系统管理', perms: 'SYSTEM', type: 1, orderNum: 5 },
      { menuid: '6', pid: '0', menuname: '数据中心', perms: 'DATA', type: 1, orderNum: 6 },
      { menuid: '7', pid: '0', menuname: '图斑台账管理', perms: 'SPOT', type: 1, orderNum: 7 },
      { menuid: '8', pid: '0', menuname: '统计分析', perms: 'COUNT', type: 1, orderNum: 8 },
      {
        menuid: '607f073283584517b4ccc0ec8e57dadc',
        pid: '3',
        menuname: '审批',
        perms: 'HOME:APPROVAL',
        type: 2,
        orderNum: 1,
      },
      {
        menuid: '8610110699504bc3bb87b0d8b5d02bec',
        pid: '3',
        menuname: '导出',
        perms: 'HOME:EXPORT',
        type: 2,
        orderNum: 2,
      },
      {
        menuid: 'c78dad15ac4c4c4fae4bfbb850c027c1',
        pid: '3',
        menuname: '查看详情',
        perms: 'HOME:INFO',
        type: 2,
        orderNum: 3,
      },
      {
        menuid: '0ebb516c4d834e14a160347c0ab8a0d9',
        pid: '3',
        menuname: '地图查看',
        perms: 'HOME:MAP',
        type: 2,
        orderNum: 4,
      },
      {
        menuid: 'c714a4f2035c4bb3a0afea118c40b8a4',
        pid: '3',
        menuname: '分发',
        perms: 'HOME:ISSUE',
        type: 2,
        orderNum: 5,
      },
      {
        menuid: 'd87a8f452602499b8d56cbe9171dc80e',
        pid: '3',
        menuname: '归档',
        perms: 'HOME:FILE',
        type: 2,
        orderNum: 6,
      },
      {
        menuid: 'd77b6cfbfa0745d9ab10f120784ad56e',
        pid: '3',
        menuname: '填写反馈报告',
        perms: 'HOME:FEEDBACK',
        type: 2,
        orderNum: 7,
      },
    ],
    user: {
      userid: '1',
      usercode: 'admin',
      username: 'admin',
      password: '6c5de1b510e8bdd0bc40eff99dcd03f8',
      phone: '15371613326',
      createTime: null,
      depts: [{ deptid: '1', deptname: '测试部门', address: null, createTime: null }],
      roles: [
        { roleid: '1', rolename: '系统管理员', createTime: null, remark: null, rolecode: 'XTGLY' },
      ],
    },
  },
}; */

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
        console.log('404', content?.user?.roles?.[0]);
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
