// 组件导入模板
// const 组件名 = () => import(/* webpackChunkName: "report" */ '路径')


// 路由：开始

import {queryTypeStoreConfigs} from './query-type/config'


// import QueryType from './query-type/QueryType'
const QueryType = () => import(/* webpackChunkName: "report" */ './query-type/QueryType')

export let reportChildRoutes = [
  {
    path: '/queryType',
    name: 'QueryType',
    meta:{
      title: "查报告",
      isShow: true
    },
    component:QueryType
  },

];

// 路由：结束





// store：开始

export let reportStoreConfigs = [

  ...queryTypeStoreConfigs
]
// store：结束
