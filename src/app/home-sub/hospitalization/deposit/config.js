// 组件导入模板
// const 组件名 = () => import(/* webpackChunkName: "hospitalization" */ '路径')


// 路由：开始

import {hospitalizationDepositStoreConfigs} from "./hospitalization-deposit/config";
import {hospitalizationHistoryStoreConfigs} from "./hospitalization-history/config"
import {depositListStoreConfigs} from './deposit-list/config'
import {complementDepositStoreConfigs} from './complement-deposit/config'
import {depositResultStoreConfigs} from "./deposit-result/config";

// import HospitalizationDeposit from './hospitalization-deposit/HospitalizationDeposit'
const HospitalizationDeposit = () => import(/* webpackChunkName: "hospitalization" */ './hospitalization-deposit/HospitalizationDeposit')
// import HospitalizationHistory from './hospitalization-history/HospitalizationHistory'
const HospitalizationHistory = () => import(/* webpackChunkName: "hospitalization" */ './hospitalization-history/HospitalizationHistory')
// import DepositList from './deposit-list/DepositList'
const DepositList = () => import(/* webpackChunkName: "hospitalization" */ './deposit-list/DepositList')
// import ComplementDeposit from './complement-deposit/ComplementDeposit'
const ComplementDeposit = () => import(/* webpackChunkName: "hospitalization" */ './complement-deposit/ComplementDeposit')
// import DepositResult from './deposit-result/DepositResult'
const DepositResult = () => import(/* webpackChunkName: "hospitalization" */ './deposit-result/DepositResult')
const AllDepositList = () => import(/* webpackChunkName: "hospitalization" */ './deposit-list/AllDepositList')
const AGHospitalizationHistory = () => import(/* webpackChunkName: "hospitalization" */ './hospitalization-history/AGHospitalizationHistory')
export let depositChildRoutes=[
  {
    path: '/hospitalizationDeposit',
    name: 'HospitalizationDeposit',
    meta:{
      title: "住院预交金",
      isShow: true,
      showLoading:true
    },
    component:HospitalizationDeposit
  },
  {
    path: '/hospitalizationHistory',
    name: 'HospitalizationHistory',
    meta:{
      title: "住院历史",
      isShow: true,
      showLoading:true
    },
    component:HospitalizationHistory
  },
  {
    path: '/AGhospitalizationHistory',
    name: 'AGHospitalizationHistory',
    meta:{
      title: "住院历史",
      isShow: true,
      showLoading:true
    },
    component:AGHospitalizationHistory
  },
  {
    path: '/depositList',
    name: 'DepositList',
    meta:{
      title: "预交记录",
      isShow: true,
      showLoading:true
    },
    component:DepositList
  },
  {
    path: '/allDepositList',
    name: 'AllDepositList',
    meta:{
      title: "预交记录",
      isShow: true,
      showLoading:true
    },
    component:AllDepositList
  },
  {
    path: '/complementDeposit',
    name: 'ComplementDeposit',
    meta:{
      title: "补交押金",
      isShow: true,
      showLoading:true
    },
    component:ComplementDeposit
  },
  {
    path: '/depositResult',
    name: 'DepositResult',
    meta:{
      title: "住院预交金",
      isShow: true,
      showLoading:true
    },
    component:DepositResult
  },
]


// 路由：结束





// store：开始

export let depositStoreConfigs = [
  {
    state:{
      isNewPage:true,
      isCardNewPage:true,
    },
    mutations:{
      updateIsNewPage:function(state,data){
        state.isNewPage=data
      },
      updateCardIsNewPage:function(state,data){
        state.isCardNewPage=data
      }
    }
  },
  ...hospitalizationDepositStoreConfigs,
  ...hospitalizationHistoryStoreConfigs,
  ...depositListStoreConfigs,
  ...complementDepositStoreConfigs,
  ...depositResultStoreConfigs
]

// store：结束
