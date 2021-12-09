// 路由：开始


// 路由：结束





// store：开始

export let feeDetailStoreConfigs = [
  {
    state:{
      detailsList:[]
    },
    getters:{
      detailsList:function(state){
        if(state.pendingPayDetail) {
          return state.pendingPayDetail.detailslist
        }else{
          return []
        }
      }
    },
    mutations:{

    },
    actions:{

    }
  }
]
// store：结束
