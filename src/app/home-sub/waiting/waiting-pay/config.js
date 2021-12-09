// 路由：开始


export let waitingPayChildRoutes = [

];

// 路由：结束





// store：开始
import {takenosign} from '@network/Api'
export let waitingPayStoreConfigs = [
  {
    state:{

    },
    mutations:{

    },
    actions:{
      takeNoSign:function({commit,state},params){
        return takenosign(params).then((res)=>{

          return res;
        })
      }
    }
  }
]
// store：结束
