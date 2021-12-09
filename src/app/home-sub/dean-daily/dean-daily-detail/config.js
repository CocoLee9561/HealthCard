// 路由：开始


// 路由：结束




// store：开始
import {presidentLogs} from '@network/Api'
export let deanDailyDetailStoreConfigs = [
  {
    state:{
      deanDaily:{}
    },
    mutations:{

    },
    actions:{
      presidentLogs:function({commit,state},params){
        // state.deanDaily={}
        return presidentLogs(params).then((res)=>{
          if(res.result){
            state.deanDaily=res.data
          }
          return res;
        })
      }
    }
  }
];
// store：结束
