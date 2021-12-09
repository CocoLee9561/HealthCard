
// 路由：开始


export let depositListChildRoutes=[

]


// 路由：结束





// store：开始
import {depositlist} from '@network/Api'
export let depositListStoreConfigs = [
  {
    state:{
      depositList:[],
      totalDeposit:0.0,
      aveDepositFee:0.0
    },
    mutations:{

    },
    actions:{
      getDepositList:function({commit,state},params){
        state.totalDeposit=0.0
        state.depositList=[]
        return depositlist(params).then((res)=>{
          state.depositList=res
          let total=0.0
          res.forEach((val)=>{
            total+=parseFloat(val.amount);
          })
          state.totalDeposit=total.toFixed(2)
          return res;
        })
      }
    }
  }
]

// store：结束
