// 路由：开始


// 路由：结束





// store：开始

export let mergePaymentStoreConfigs = [
  {
    state:{

    },
    mutations:{
      updatePedingPayDetail:function(state,data){
        state.pendingPayDetail=data
        state.detailsList=data.detailslist
      }
    },
    actions:{

    }
  }
]
// store：结束
