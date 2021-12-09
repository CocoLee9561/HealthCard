// 路由：开始


// 路由：结束




// store：开始
import {registersign} from '@network/Api'
export let bookingPayStoreConfigs = [
  {
    state:{

    },
    mutations:{

    },
    actions:{
      registerSign:function({commit,state},params){
        return registersign(params).then((res)=>{
          return res;
        })
      }
    }
  }
];
// store：结束
