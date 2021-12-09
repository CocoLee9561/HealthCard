// 路由：开始

import Error from './error/error'

import Entry from './entry/Entry'
import {entryChildRoutes,entryStoreConfigs} from './entry/config'

import Login from './login/Login'
import {loginStoreConfigs} from './login/config'


import {paymentChildRoutes,paymentStoreConfigs} from './payment/config'
import {homeSubChildRoutes,homeSubStoreConfigs} from './home-sub/config'
import {mySubChildRoutes,mySubStoreConfigs} from './my-sub/config'
import {menberChildRoutes,menberStoreConfigs} from './menber/config'
import {messageChildRoutes,messageStoreConfigs} from "./message-sub/config";
import {cardtype} from '@network/Api'

import My from './entry/my/My'
import Home from './entry/home/Home'
import Home1 from './entry/home/Home1'
import Home2 from './entry/home/Home2'
export let appChildRoutes = [
    {
        path: '/',
        name: 'Entry',
        component: Entry,
        children:entryChildRoutes
    },
    {
        path: '/logIn',
        name: 'LogIn',
        component:Login,
        meta:{
          title: "登录/注册",
          isShow: true
        },
    },
    {
      path: '/wxMy',
      name: 'WxMy',
      component:My,
      meta:{
        title: "个人中心",
        isShow: true
      },
    },
	{
      path: '/wxHome',
      name: 'WxHome',
      component:Home,
      meta:{
        title: "首页",
        isShow: true
      },
    },
  {
    path: '/mzHome',
    name: 'MzHome',
    component:Home1,
    meta:{
      title: "首页",
      isShow: true,
      type:'mz'
    },
  },
  {
    path: '/zyHome',
    name: 'ZyHome',
    component:Home1,
    meta:{
      title: "首页",
      isShow: true,
      type:'zy'
    },
  },
  {
    path: '/home2',
    name: 'Home2',
    component:Home2,
    meta:{
      title: "首页",
      isShow: true,
    },
  },
  {
    path:'/error',
    name:'Error',
    component:Error,
    meta:{
      title:'提示',
      isShow:true
    }
  },
  ...homeSubChildRoutes,
  ...mySubChildRoutes,
  ...paymentChildRoutes,
  ...menberChildRoutes,
  ...messageChildRoutes
];

// 路由：结束




// store：开始

import tool from '@common/libs/tool'
import {hospitalInfo} from '@network/Api'

let routeDataStoreConfig = {
  state:{
    data:{},
    lastDataKey:null
  },
  mutations:{
    setRouteData:function (state,keyAndData) {
      let {key,data} = keyAndData ;
      state.data[key] = data ;
      state.lastDataKey = key ;
    }
  }

};




export let appStoreConfigs = [
  {
    state: {
      selectedDepartment:{},
      bookingDoctor:{}
    },
    mutations:{
      updateSelectDepartment(state,data){
        state.selectedDepartment = data;
        tool.setStoreData(state,'selectedDepartment',data);
      },
      updateBookingDoctorInfo(state,data){
        tool.setStoreData(state,'bookingDoctor',data);
      }
    },
    actions:{
      getHospitalInfo:function({commit,state},payload){
        let {dependent,...params} = payload ;
        return hospitalInfo(params,dependent).then((res)=>{
          if(res){
            if(res.isSingleHospital==0){
              let current = state.hospital.current;
              Object.assign(current,res)
              current.hospitalname=res.hospitalName
              current.hospitalcode=res.hospitalCode
              current.pkregHospitalId=res.regHospitalId
              state.hospital.current = current;
            }else{
              state.hospital.current.clientId = res.clientId.replace(/(^\s*)/g, "");
              state.hospital.current.disChild = res.disChild
            }
            shareInst.clientId=res.clientId.replace(/(^\s*)/g, "");
            shareData.clientId=res.clientId.replace(/(^\s*)/g, "");
            localStorage.setItem("clientId",res.clientId.replace(/(^\s*)/g, ""));
          }
          return res;
        })
      }
    }

  },
  {
    modules:{
      route:routeDataStoreConfig
    }
  },
  ...entryStoreConfigs,
  ...loginStoreConfigs,
  ...homeSubStoreConfigs,
  ...mySubStoreConfigs,
  ...paymentStoreConfigs,
  ...menberStoreConfigs,
  ...messageStoreConfigs
]

// store：结束
