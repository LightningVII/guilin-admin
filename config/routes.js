export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
      {
        name: '个人设置',
        icon: 'smile',
        path: '/user/accountsettings',
        component: './user/AccountSettings',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/remote-sensing',
          },
          {
            path: '/feedback/list',
          },
          {
            path: '/remote-sensing/list',
          },
          {
            icon: 'crown',
            name: 'home',
            path: '/statistics',
            component: './Statistics', // authority: ['admin'],
          },
          {
            name: 'data.center',
            icon: 'smile',
            path: '/listsearchprojects',
            component: './ListSearchProjects',
            // hideInMenu: true,
          },
          {
            icon: 'crown',
            name: 'map-show.center',
            path: '/global-map-show',
            component: './arcgis-show/global-map-show', // authority: ['admin'],
          },
          {
            name: 'monitoring-results',
            icon: 'smile',
            path: '/remote-sensing',
            component: './remote-sensing/list',
            authority: ['guest'],
            hideInMenu: true,
          },
          {
            path: '/remote-sensing/details/arcgis-show',
            name: 'map-show',
            icon: 'crown',
            component: './arcgis-show/map',
            hideInMenu: true,
          },
          {
            name: 'task.center',
            icon: 'smile',
            path: '/remote-sensing/details',
            component: './remote-sensing/details',
            hideInMenu: true,
          },
          {
            name: 'feedback-list',
            icon: 'smile',
            path: '/feedback',
            component: './feedback/list',
            hideInMenu: true,
          },
          {
            name: 'create-feedback',
            icon: 'smile',
            path: '/feedback/create',
            component: './feedback/create',
            hideInMenu: true,
          },
          {
            name: 'feedback-details',
            icon: 'smile',
            path: '/feedback/details',
            component: './feedback/details',
            hideInMenu: true,
          },
          {
            name: 'list.search-list',
            icon: 'smile',
            path: '/listsearch',
            component: './ListSearch',
            hideInMenu: true,
          },
          {
            name: 'account.center',
            icon: 'smile',
            path: '/account/center',
            component: './user/AccountSettings',
            hideInMenu: true,
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
