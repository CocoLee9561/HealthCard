// 组件导入模板
// const 组件名 = () => import(/* webpackChunkName: "review" */ '路径')

// 路由：开始

import {departmentIntroStoreConfigs} from "./department-intro/config";
import {doctorIntroStoreConfigs} from "./doctor-intro/config";

const DepartmentIntro = () => import(/* webpackChunkName: "intro" */ './department-intro/DepartmentIntro')

const DoctorIntro = () => import(/* webpackChunkName: "intro" */ './doctor-intro/DoctorIntro')


export let introChildRoutes = [
  {
    path: '/departmentIntro',
    name: 'DepartmentIntro',
    meta:{
      title: "科室简介",
      isShow: true,
      showLoading:true
    },
    component:DepartmentIntro
  },
  {
    path: '/doctorIntro',
    name: 'DoctorIntro',
    meta:{
      title: "医生简介",
      isShow: true,
      showLoading:true
    },
    component:DoctorIntro
  }
];

// 路由：结束





// store：开始
export let introStoreConfigs = [
  ...departmentIntroStoreConfigs,
  ...doctorIntroStoreConfigs
]
// store：结束
