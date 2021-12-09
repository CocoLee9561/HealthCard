// 组件导入模板
// const 组件名 = () => import(/* webpackChunkName: "outpatient" */ '路径')


export let rechargeDetailChildRoutes = [

];

// 路由：结束





// store：开始
import {getrechargedetail} from '@network/Api'
export let rechargeDetailStoreConfigs = [
  {
    state:{
      rechargeDetail:{}
    },
    mutations:{

    },
    actions:{
      getRechargeDetail:function({commit,state},params){
        return getrechargedetail(params).then((res)=>{
          state.rechargeDetail=res
          return res;
        })
      }
    }
  },
]
// store：结束
