// 路由：开始

import {deanDailyDetailStoreConfigs} from "./dean-daily-detail/config";
const DeanDaily = () => import(/* webpackChunkName: "dean-daily" */ './dean-daily-detail/DeanDailyDetail')
// 路由：结束

import {chooseDateStoreConfigs} from "./choose-date/config";
const ChooseDate = () => import(/* webpackChunkName: "dean-daily" */ './choose-date/ChooseDate')

import {deptDetailStoreConfigs} from "./dept-detail/config";
const DeptDetail = () => import(/* webpackChunkName: "dean-daily" */ './dept-detail/DeptDetail')

export let deanDailyChildRoutes = [
  {
    path: '/deanDaily',
    name: 'DeanDaily',
    component:DeanDaily,
    meta:{
      title: "院长日报",
      isShow: true
    },
  },
  {
    path: '/chooseDate',
    name: 'ChooseDate',
    component:ChooseDate,
    meta:{
      title: "院长日报",
      isShow: true
    },
  },
  {
    path: '/deptDetail',
    name: 'DeptDetail',
    component:DeptDetail,
    meta:{
      title: "科室详情",
      isShow: true
    },
  }
];


// store：开始

export let deanDailyStoreConfigs = [

  ...deanDailyDetailStoreConfigs,
  ...chooseDateStoreConfigs,
  ...deptDetailStoreConfigs
];
// store：结束
