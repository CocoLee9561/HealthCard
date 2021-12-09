// 路由：开始

import {intelligentGuidanceStoreConfigs} from "./intelligent-guidance/config";
const IntelligentGuidance = () => import(/* webpackChunkName: "guidance" */ './intelligent-guidance/IntelligentGuidance')

import {questionGuidanceStoreConfigs} from "./question-guidance/config";
const QuestionGuidance = () => import(/* webpackChunkName: "guidance" */ './question-guidance/QuestionGuidance')

import {recommentDepartmentStoreConfigs} from './recommend-department/config'
const RecommentDepartment = () => import(/* webpackChunkName: "guidance" */ './recommend-department/RecommendDepartment')

export let guidanceChildRoutes = [
  {
    path: '/intelligentGuidance',
    name: 'IntelligentGuidance',
    component:IntelligentGuidance,
    meta:{
      title: "智能导诊",
      isShow: true
    },
  },
  {
    path: '/questionGuidance',
    name: 'QuestionGuidance',
    component:QuestionGuidance,
    meta:{
      title: "智能导诊",
      isShow: true
    },
  },
  {
    path: '/recommentDepartment',
    name: 'RecommentDepartment',
    component:RecommentDepartment,
    meta:{
      title: "智能导诊",
      isShow: true
    },
  },
];

// 路由：结束





// store：开始

export let guidanceStoreConfigs = [

  ...intelligentGuidanceStoreConfigs,
  ...questionGuidanceStoreConfigs,
  ...recommentDepartmentStoreConfigs
]
// store：结束
