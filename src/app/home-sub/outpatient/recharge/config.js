// 组件导入模板
// const 组件名 = () => import(/* webpackChunkName: "outpatient" */ '路径')


// 路由：开始
// import PayForm from './pay-form/PayForm'
const PayForm = () => import(/* webpackChunkName: "outpatient" */ './pay-form/PayForm')
import {payFormStoreConfigs} from './pay-form/config'


// import RechargeResult from './recharge-result/RechargeResult'
const RechargeResult = () => import(/* webpackChunkName: "outpatient" */ './recharge-result/RechargeResult')

const RechargeList = () => import(/* webpackChunkName: "outpatient" */ './recharge-list/RechargeList')
import {rechargeListStoreConfigs} from "./recharge-list/config";

const RechargeDetail = () => import(/* webpackChunkName: "outpatient" */ './recharge-detail/RechargeDetail')
import {rechargeDetailStoreConfigs} from "./recharge-detail/config";

export let rechargeChildRoutes = [
  {
    path: '/PayForm',
    name: 'PayForm',
    component:PayForm,
    meta:{
      title: "门诊充值",
      isShow: true,
      showLoading:true
    },
  },
  {
    path: '/RechargeResult',
    name: 'RechargeResult',
    component:RechargeResult,
    meta:{
      title: "门诊充值",
      isShow: true,
      showLoading:true
    },
  },
  {
    path: '/rechargeList',
    name: 'RechargeList',
    component:RechargeList,
    meta:{
      title: "充值记录",
      isShow: true,
      showLoading:true
    },
  },
  {
    path: '/rechargeDetail',
    name: 'RechargeDetail',
    component:RechargeDetail,
    meta:{
      title: "充值记录",
      isShow: true,
      showLoading:true
    },
  }
];

// 路由：结束





// store：开始

export let rechargeStoreConfigs = [
  {
    state:{
      rechargeResult:{}
    },
    mutations:{
      updateRechargeResult:function(state,result){
        state.rechargeResult=result
      }
    }
  },
  ...payFormStoreConfigs,
  ...rechargeListStoreConfigs,
  ...rechargeDetailStoreConfigs
]
// store：结束
