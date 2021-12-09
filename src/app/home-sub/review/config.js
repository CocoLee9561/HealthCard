// 组件导入模板
// const 组件名 = () => import(/* webpackChunkName: "review" */ '路径')

// 路由：开始

import {doctorListStoreConfigs} from './doctor-list/config'
import {reviewDoctorStoreConfigs} from "./review-doctor/config";

// import ReviewDoctorList from './doctor-list/DoctorList'
const ReviewDoctorList = () => import(/* webpackChunkName: "review" */ './doctor-list/DoctorList')
// import ReviewDoctor from './review-doctor/ReviewDoctor'
const ReviewDoctor = () => import(/* webpackChunkName: "review" */ './review-doctor/ReviewDoctor')

export let reviewChildRoutes = [
  {
    path: '/reviewDoctorList',
    name: 'ReviewDoctorList',
    meta:{
      title: "查报告",
      isShow: true,
      showLoading:true
    },
    component:ReviewDoctorList
  },{
    path: '/reviewDoctor',
    name: 'ReviewDoctor',
    meta:{
      title: "查报告",
      isShow: true,
      showLoading:true
    },
    component:ReviewDoctor
  },
];

// 路由：结束





// store：开始
import {gettakeno} from '@network/Api'
export let reviewStoreConfigs = [
  {
    state:{

    },
    mutations:{

    },
    actions:{

    }
  },
  ...doctorListStoreConfigs,
  ...reviewDoctorStoreConfigs
]
// store：结束
