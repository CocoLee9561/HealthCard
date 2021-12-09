// 组件导入模板
// const 组件名 = () => import(/* webpackChunkName: "hospital" */ '路径')



import ChooseHospital from './choose-hospital/ChooseHospital'
// const ChooseHospital = () => import(/* webpackChunkName: "hospital" */ './choose-hospital/ChooseHospital')
import {chooseHospitalStoreConfigs} from './choose-hospital/config'

// import HospitalInfo from './hospital-info/HospitalInfo'
const HospitalInfo = () => import(/* webpackChunkName: "hospital" */ './hospital-info/HospitalInfo')
import {hospitalInfoStoreConfigs} from './hospital-info/config'


// 路由：开始
export let hospitalRoutesConfigs = [
  {
    path: '/chooseHospital',
    name: 'ChooseHospital',
    component:ChooseHospital,
    meta:{
      title: "选择医院",
      isShow: true
    },
  },
  {
    path: '/hospitalInfo',
    name: 'HospitalInfo',
    component:HospitalInfo,
    meta:{
      title: "医院简介",
      isShow: true,
      showLoading:true
    },
  }
];

// 路由：结束









// store：开始



export let hospitalStoreConfigs = [
  ...chooseHospitalStoreConfigs,
  ...hospitalInfoStoreConfigs
];

// store：结束

