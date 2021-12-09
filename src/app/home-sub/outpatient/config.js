// 路由：开始
import {rechargeChildRoutes,rechargeStoreConfigs} from './recharge/config'
import {outpatientPaymentChildRoutes,outpatientPaymentStoreConfigs} from './payment/config'

export let outpatientChildRoutes = [
  ...rechargeChildRoutes,
  ...outpatientPaymentChildRoutes
];

// 路由：结束





// store：开始

export let outpatientStoreConfigs = [
  ...rechargeStoreConfigs,
  ...outpatientPaymentStoreConfigs
]
// store：结束
