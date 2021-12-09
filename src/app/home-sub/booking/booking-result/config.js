// 路由：开始


// 路由：结束




// store：开始
import {regcancel} from '@network/Api'
export let bookingResultStoreConfigs = [
  {
    state:{

    },
    mutations:{

    },
    actions:{
      regCancel:function({commit,state},params){
        return regcancel(params).then((res)=>{
          return res;
        })
      }
    }
  }
]
// store：结束
