// 路由：开始


// 路由：结束





// store：开始
import {alreadypayresult} from '@network/Api'
export let outpatientPayResultStoreConfigs = [
  {
    state:{
      alreadyPayResult:{}
    },
    getters:{

    },
    mutations:{

    },
    actions:{
      getAlreadyPayResult:function({commit,state},params){
        return alreadypayresult(params).then((res)=>{
          state.alreadyPayResult=res
          return res;
        })
      }
    }
  }
]
// store：结束
