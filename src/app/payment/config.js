import ConfirmLoading from './confirm-loading/ConfirmLoading'
import {confirmLoadingStoreConfigs} from './confirm-loading/config'

import PayComplete from './pay-complete/PayComplete'
import {payCompleteStoreConfigs} from './pay-complete/config'


import PaymentPage from './payment-page/PaymentPage'
import {paymentPageStoreConfigs} from "./payment-page/config";
// 路由：开始




export let paymentChildRoutes = [
  {
    path: '/confirmLoading',
    name: 'ConfirmLoading',
    component:ConfirmLoading,
    meta:{
      title: "支付确认",
      isShow: true
    },
  },
  {
    path: '/PayComplete',
    name: 'PayComplete',
    component:PayComplete
  },
  {
    path: '/paymentPage',
    name: 'PaymentPage',
    component:PaymentPage
  }
];


// 路由：结束







// store：开始

export let paymentStoreConfigs = [
  ...confirmLoadingStoreConfigs,
  ...payCompleteStoreConfigs,
  ...paymentPageStoreConfigs
];
// store：结束
