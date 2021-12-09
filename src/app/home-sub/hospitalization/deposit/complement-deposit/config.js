
// 路由：开始


export let complementDepositChildRoutes=[

]


// 路由：结束





// store：开始
import {depositlist,stayhosordersign} from '@network/Api'
export let complementDepositStoreConfigs = [
  {
    state:{
      depositPayResult:{}
    },
    mutations:{
      updateDepositPayResult:function(state,data){
        state.depositPayResult=data
      }
    },
    actions:{
      stayHosOrderSign:function({commit,state},params){
        return stayhosordersign(params).then((res)=>{
          return res;
        })
      }
    }
  }
]

// store：结束
