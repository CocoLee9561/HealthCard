// 路由：开始

const BuffetBusiness = () => import(/* webpackChunkName: "dean-daily" */ './BuffetBusiness')
// 路由：结束


export let buffetBusinessChildRoutes = [
  {
    path: '/buffetBusiness',
    name: 'BuffetBusiness',
    component:BuffetBusiness,
    meta:{
      title: "自助业务统计",
      isShow: true
    },
  }
];


// store：开始

import {selfMachineCount} from '@network/Api'
export let buffetBusinessStoreConfigs = [
  {
    state:{
      buffetBusiness:{}
    },
    mutations:{

    },
    actions:{
      selfMachineCount:function({commit,state},params){
        return selfMachineCount(params).then((res)=>{
          if(res.result){
            state.buffetBusiness=res.data
          }
          return res;
        })
      }
    }
  }
];
// store：结束
