// 路由：开始

import {reportListStoreConfigs} from "./report-list/config";
const MReportList = () => import(/* webpackChunkName: "message-report" */ './report-list/ReportList')

import {reportDetailStoreConfigs} from "./report-detail/config";
const MReportDetail = () => import(/* webpackChunkName: "message-report" */ './report-detail/ReportDetail')

export let reportMessageChildRoutes = [
  {
    path: '/message/reportList',
    name: 'MReportList',
    component:MReportList,
    meta:{
      title: "报告",
      isShow: true
    },
  },
  {
    path: '/message/reportDetail',
    name: 'MReportDetail',
    component:MReportDetail,
    meta:{
      title: "报告",
      isShow: true
    },
  }
];

// 路由：结束





// store：开始

export let reportMessageStoreConfigs = [
  ...reportListStoreConfigs,
  ...reportDetailStoreConfigs
]
// store：结束
