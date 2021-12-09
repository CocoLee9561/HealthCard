// 组件导入模板
// const 组件名 = () => import(/* webpackChunkName: "hospitalization" */ '路径')




// 路由：开始
import {depositChildRoutes,depositStoreConfigs} from './deposit/config'
import {hospitalizationListChildRoutes,hospitalizationListStoreConfigs} from './hospitalization-list/config'

// import HospitalizationList from './hospitalization-list/HospitalizationList'
const HospitalizationList = () => import(/* webpackChunkName: "hospitalization" */ './hospitalization-list/HospitalizationList')

export let hospitalizationChildRoutes=[
  {
    path: '/hospitalizationList',
    name: 'HospitalizationList',
    meta:{
      title: "住院清单",
      isShow: true,
      showLoading:true
    },
    component:HospitalizationList
  },
  ...depositChildRoutes,
  ...hospitalizationListChildRoutes
]


// 路由：结束





// store：开始

export let hospitalizationStoreConfigs = [

  ...depositStoreConfigs,
  ...hospitalizationListStoreConfigs
]

// store：结束
