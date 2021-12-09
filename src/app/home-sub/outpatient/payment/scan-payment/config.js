// 路由：开始


export let outpatientChildRoutes = [

];

// 路由：结束





// store：开始

import {getscandata} from "@network/Api"

export let scanPaymentStoreConfigs = [
  {
    state:{
      scanPaymentList:[],
      scanPayent:{}
    },
    mutations:{

    },
    actions:{
      getScanData:function({commit,state},params){
        return getscandata(params).then((res)=>{
          if(res.result){
            state.scanPayent=JSON.parse(res.data.requestData)
            state.scanPaymentList=state.scanPayent.data
          }
          return res;
        })
      }
    }
  }
]
// store：结束
