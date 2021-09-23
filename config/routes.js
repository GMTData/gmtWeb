export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          }, {
            name: 'register',
            path: '/user/register',
            component: './User/register',
          }, {
            name: 'forgetPassword',
            path: '/user/forgetPassword',
            component: './User/forgetPassword',
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
                redirect: '/home',
              },
              {
                path: '/home',
                name: 'welcome',
                component: './Welcome',
                hideInBreadcrumb: true 
              },
              {
                path: '/admin',
                name: 'admin',
                component: './Admin',
                authority: ['admin'],
                routes: [
                  {
                    path: '/admin/sub-page',
                    name: 'sub-page',
                    component: './Welcome',
                    authority: ['admin'],
                  },
                ],
              },
              {
                path: '/news',
                name: 'news.information',
                routes: [
                  {
                    path: '/news',
                    redirect: '/news/financial',
                  },
                  {
                    name: 'financial',
                    path: '/news/financial',
                    component: './NewsInfo/FinancialNews',
                    hideInBreadcrumb: true 
                  },
                  {
                    name: 'newsDetails',
                    path: '/news/details/:newsId',
                    hideInMenu: true,
                    component: './NewsInfo/NewsDetails',
                    hideInBreadcrumb: true 
                  },
                  {
                    name: 'companyNotice',
                    path: '/news/companyNotice',
                    component: './NewsInfo/CompanyNotice',
                    hideInBreadcrumb: true 
                  },
                  {
                    name: 'economicCalenda',
                    path: '/news/economicCalenda',
                    component: './NewsInfo/EconomicCalenda',
                    hideInBreadcrumb: true 
                  },
                ]
              },
              {
                name: 'dataAnalysis',
                path: '/dataAnalysis',
                component: './DataAnalysis',
                hideInBreadcrumb: true 
              },
              {
                name: 'chartingLibrary',
                path: '/chartingLibrary',
                component: './ChartingLibrary',
                hideInBreadcrumb: true ,
              },
              {
                name: 'personCenter',
                path: '/personCenter',
                component: './PersonCenter',
                hideInBreadcrumb: true ,
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
    ],
  },
  {
    component: './404',
  },
];
