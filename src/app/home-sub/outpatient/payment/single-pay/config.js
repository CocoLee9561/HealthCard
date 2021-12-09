// 路由：开始



// 路由：结束





// store：开始

import {pendingpaydetail} from '@network/Api'

export let singlePaymentStoreConfigs = [
  {
    state:{
      pendingPayDetail:{},
      pendingPayDetails:{},
      mergerTotalFee:0.0,
    },
    mutations:{

    },
    actions:{
      getPendingPayDetail:function({commit,state},params){
        state.mergerTotalFee=0.0;
        return pendingpaydetail(params).then((res)=>{
          state.pendingPayDetails=res
          if(res.length==0){
            state.pendingPayDetail={}
          }else{
            state.pendingPayDetail=res[0]
            state.detailsList=res[0].detailslist
            let totalFee=0.0;
            res.forEach((val)=>{
              totalFee+=parseFloat(val.amount)*100
            })
            totalFee=(totalFee/100).toFixed(2)
            state.mergerTotalFee=totalFee
          }
          return res
        })
      }
    }
  }
]
// store：结束
