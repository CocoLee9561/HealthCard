// 路由：开始

import {outpatientListMessageStoreConfigs} from "./outpatient-list/config";
const MOutpatientList = () => import(/* webpackChunkName: "message-outpatient" */ './outpatient-list/OutpatientList')

import {outpatientDetailMessageStoreConfigs} from "./outpatient-detail/config";
const MOutpatientDetail = () => import(/* webpackChunkName: "message-outpatient" */ './outpatient-detail/OutpatientDetail')

export let outpatientMessageChildRoutes = [
  {
    path: '/message/outpatientList',
    name: 'MOutpatientList',
    component:MOutpatientList,
    meta:{
      title: "门诊缴费",
      isShow: true
    },
  },
  {
    path: '/message/outpatientDetail',
    name: 'MOutpatientDetail',
    component:MOutpatientDetail,
    meta:{
      title: "门诊缴费",
      isShow: true
    },
  },
];

// 路由：结束





// store：开始

export let outpatientMessageStoreConfigs = [
  ...outpatientListMessageStoreConfigs,
  ...outpatientDetailMessageStoreConfigs
]
// store：结束
