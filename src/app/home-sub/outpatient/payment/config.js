// 组件导入模板
// const 组件名 = () => import(/* webpackChunkName: "outpatient" */ '路径')


// 路由：开始
import {outpatientListStoreConfigs} from './outpatient-list/config'
import {singlePaymentStoreConfigs} from './single-pay/config'
import {mergePaymentStoreConfigs} from './merge-pay/config'
import {feeDetailStoreConfigs} from './fee-detail/config'
import {outpatientPayResultStoreConfigs} from './outpatient-pay-result/config'
import {mergerPayResultStoreConfigs} from "./merger-pay-result/config";
import {outpatientDetailStoreConfigs} from './outpatient-detail/config'
import {scanPaymentStoreConfigs} from "./scan-payment/config";
import {scanPaymentDetailStoreConfigs} from "./scan-payment-detail/config";

// import OutpatientList from './outpatient-list/OutpatientList'
const OutpatientList = () => import(/* webpackChunkName: "outpatient" */ './outpatient-list/OutpatientList')
// import SinglePay from './single-pay/SinglePay'
const SinglePay = () => import(/* webpackChunkName: "outpatient" */ './single-pay/SinglePay')
// import MergePay from './merge-pay/MergePay'
const MergePay = () => import(/* webpackChunkName: "outpatient" */ './merge-pay/MergePay')
// import FeeDetail from './fee-detail/FeeDetail'
const FeeDetail = () => import(/* webpackChunkName: "outpatient" */ './fee-detail/FeeDetail')
// import OutpatientPayResult from './outpatient-pay-result/OutpatientPayResult'
const OutpatientPayResult = () => import(/* webpackChunkName: "outpatient" */ './outpatient-pay-result/OutpatientPayResult')
// import MergerPayResult from './merger-pay-result/MergerPayResult'
const MergerPayResult = () => import(/* webpackChunkName: "outpatient" */ './merger-pay-result/MergerPayResult')
// import OutpatientDetail from './outpatient-detail/OutpatientDetail'
const OutpatientDetail = () => import(/* webpackChunkName: "outpatient" */ './outpatient-detail/OutpatientDetail')

const ScanPayment = () => import(/* webpackChunkName: "outpatient" */ './scan-payment/ScanPayment')

const ScanPaymentDetail = () => import(/* webpackChunkName: "outpatient" */ './scan-payment-detail/ScanPaymentDetail')

const AlreadyPayList = () => import(/* webpackChunkName: "outpatient" */ './outpatient-list/AlreadyPayList')

export let outpatientPaymentChildRoutes = [
  {
    path: '/outpatientList',
    name: 'OutpatientList',
    meta:{
      title: "门诊缴费",
      isShow: true,
      showLoading:true
    },
    component:OutpatientList
  },
  {
    path: '/singlePay',
    name: 'SinglePay',
    meta:{
      title: "门诊缴费",
      isShow: true,
      showLoading:true
    },
    component:SinglePay
  },
  {
    path: '/mergePay',
    name: 'MergePay',
    meta:{
      title: "门诊缴费",
      isShow: true,
      showLoading:true
    },
    component:MergePay
  },
  {
    path: '/feeDetail',
    name: 'FeeDetail',
    meta:{
      title: "费用明细",
      isShow: true,
      showLoading:true
    },
    component:FeeDetail
  },
  {
    path: '/outpatientPayResult',
    name: 'OutpatientPayResult',
    meta:{
      title: "缴费结果",
      isShow: true,
      showLoading:true
    },
    component:OutpatientPayResult
  },
  {
    path: '/mergerPayResult',
    name: 'MergerPayResult',
    meta:{
      title: "缴费结果",
      isShow: true,
      showLoading:true
    },
    component:MergerPayResult
  },
  {
    path: '/outpatientDetail',
    name: 'OutpatientDetail',
    meta:{
      title: "费用详情",
      isShow: true,
      showLoading:true
    },
    component:OutpatientDetail
  },
  {
    path: '/scanPayment',
    name: 'ScanPayment',
    meta:{
      title: "扫码付",
      isShow: true,
      showLoading:true
    },
    component:ScanPayment
  },
  {
    path: '/scanPaymentDetail',
    name: 'ScanPaymentDetail',
    meta:{
      title: "扫码付",
      isShow: true,
      showLoading:true
    },
    component:ScanPaymentDetail
  },
  {
    path: '/alreadyPayList',
    name: 'AlreadyPayList',
    meta:{
      title: "缴费记录",
      isShow: true,
      showLoading:true
    },
    component:AlreadyPayList
  },
];

// 路由：结束





// store：开始

import {mergeordersign} from '@network/Api'

export let outpatientPaymentStoreConfigs = [
  {
    state:{
      outpatientPayResults:[],
      outpatientPayResult:{}
    },
    mutations:{
      updateOutpatientPayResult:function(state,data){
        state.outpatientPayResult=data
        state.detailsList=data.detailslist
      },
      updateOutpatientPayResults:function(state,data){
        state.outpatientPayResults=data
      }
    },
    actions:{
      mergeOrderSign:function({commit,state},params){
        return mergeordersign(params).then((res)=>{

          return res;
        })
      }
    }
  },
  ...outpatientListStoreConfigs,
  ...singlePaymentStoreConfigs,
  ...mergePaymentStoreConfigs,
  ...feeDetailStoreConfigs,
  ...outpatientPayResultStoreConfigs,
  ...mergerPayResultStoreConfigs,
  ...outpatientDetailStoreConfigs,
  ...scanPaymentStoreConfigs,
  ...scanPaymentDetailStoreConfigs
]
// store：结束
