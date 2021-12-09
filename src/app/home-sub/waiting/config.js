// 组件导入模板
// const 组件名 = () => import(/* webpackChunkName: "review" */ '路径')

// 路由：开始

import {waitingListStoreConfigs} from './waiting-list/config'
import {waitingPayStoreConfigs} from "./waiting-pay/config";
import {waitingSelectedCardStoreConfigs} from "./waiting-selected-card/config";
import {waitingDoctorStoreConfigs} from "./waiting-doctor/config";

// import WaitingList from './waiting-list/WaitingList'
const WaitingList = () => import(/* webpackChunkName: "waiting" */ './waiting-list/WaitingList')
const WaitingDoctor = () => import(/* webpackChunkName: "waiting" */ './waiting-doctor/WaitingDoctor')
// import WaitingPay from './waiting-pay/WaitingPay'
const WaitingPay = () => import(/* webpackChunkName: "waiting" */ './waiting-pay/WaitingPay')

const WaitingSelectCard = () => import(/* webpackChunkName: "waiting" */ './waiting-selected-card/WaitingSelectCard')

export let waitingChildRoutes = [
  {
    path: '/waitingList',
    name: 'WaitingList',
    meta:{
      title: "取号候诊",
      isShow: true,
      showLoading:true
    },
    component:WaitingList
  },
  {
    path: '/waitingDoctor',
    name: 'WaitingDoctor',
    meta:{
      title: "候诊",
      isShow: true,
      showLoading:true
    },
    component:WaitingDoctor
  },
  {
    path: '/waitingPay',
    name: 'WaitingPay',
    meta:{
      title: "预约挂号",
      isShow: true,
      showLoading:true
    },
    component:WaitingPay
  },
  {
    path: '/waitingSelectCard',
    name: 'WaitingSelectCard',
    meta:{
      title: "取号候诊",
      isShow: true,
      showLoading:true
    },
    component:WaitingSelectCard
  },
];

// 路由：结束





// store：开始
import {gettakeno} from '@network/Api'
export let waitingStoreConfigs = [
  {
    state:{
      isCanTakeNo:false
    },
    mutations:{
      updateIsCanTakeNo:function(state,data){
        state.isCanTakeNo=data
      }
    },
    actions:{
      getTakeNo:function({commit,state},params){
        return gettakeno(params).then((res)=>{
          return res;
        })
      }
    }
  },
  ...waitingListStoreConfigs,
  ...waitingPayStoreConfigs,
  ...waitingSelectedCardStoreConfigs,
  ...waitingDoctorStoreConfigs
]
// store：结束
