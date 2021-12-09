// 组件导入模板
// const 组件名 = () => import(/* webpackChunkName: "query-report" */ '路径')


const ReportList = () => import(/* webpackChunkName: "query-report" */ './report-list/ReportList')
import {reportListStoreConfigs} from './report-list/config'


const ReportDetails = () => import(/* webpackChunkName: "query-report" */ './report-details/ReportDetails')
import {reportDetailsStoreConfigs} from './report-details/config'


// 路由：开始



export let queryReportChildRoutes = [
  {
    path: '/ReportList',
    name: 'ReportList',
    component:ReportList
  },
  {
    path: '/ReportDetails',
    name: 'ReportDetails',
    component:ReportDetails
  }

];

// 路由：结束





// store：开始

export let queryReportStoreConfigs = [
  ...reportListStoreConfigs,
  ...reportDetailsStoreConfigs
]
// store：结束
