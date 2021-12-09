// 路由：开始



// 路由：结束

// store：开始


import {registerpayresult,syncvalidate,rechargepayresult,mergepayorderresult,stayhospayresult,takenopayresult} from '@network/Api'
export let confirmLoadingStoreConfigs = [
  {
    state:{

    },
    mutations:{

    },
    actions:{
      syncValiDate:function({commit,state},params){
        return syncvalidate(params).then((res)=>{
          return res;
        })
      },
      registerPayResult:function({commit,state},params){
        return registerpayresult(params).then((res)=>{
          return res;
        })
      },
      rechargePayResult:function({commit,state},params){
        return rechargepayresult(params).then((res)=>{
          return res;
        })
      },
      mergePayOrderResult:function({commit,state},params){
        return mergepayorderresult(params).then((res)=>{
          return res;
        })
      },
      stayHosPayResult:function({commit,state},params){
        return stayhospayresult(params).then((res)=>{
          return res;
        })
      },
      takeNoPayResult:function({commit,state},params){
        return takenopayresult(params).then((res)=>{
          return res;
        })
      }
    }
  }
];

// store：结束
