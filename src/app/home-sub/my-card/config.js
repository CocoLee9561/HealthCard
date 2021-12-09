// 路由：开始

import {myCardListStoreConfigs} from "./my-card-list/config";
const MyCardList = () => import(/* webpackChunkName: "myCard" */ './my-card-list/MyCardList')

import {myCardInfoStoreConfigs} from "./my-card-info/config";
const MyCardInfo = () => import(/* webpackChunkName: "myCard" */ './my-card-info/MyCardInfo')

export let myCardChildRoutes = [
  {
    path: '/myCardList',
    name: 'MyCardList',
    component:MyCardList,
    meta:{
      title: "我的就诊卡",
      isShow: true
    },
  },
  {
    path: '/myCardInfo',
    name: 'MyCardInfo',
    component:MyCardInfo,
    meta:{
      title: "我的就诊卡",
      isShow: true
    },
  }
];

// 路由：结束





// store：开始

export let myCardStoreConfigs = [
  ...myCardListStoreConfigs,
  ...myCardInfoStoreConfigs
]
// store：结束
