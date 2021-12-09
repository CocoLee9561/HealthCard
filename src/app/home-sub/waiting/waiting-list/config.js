// 路由：开始


export let waitingListChildRoutes = [

];

// 路由：结束





// store：开始
import {gettodaytakenolist,ispayorder} from '@network/Api'
export let waitingListStoreConfigs = [
  {
    state:{
      waitingList:[],
      waitingItem:{}
    },
    mutations:{
      updateWaitItem:function(state,data){
        state.waitingItem=data
      }
    },
    actions:{
      getTodayTakeNoList:function({commit,state},params){
        return gettodaytakenolist(params).then((res)=>{
          state.waitingList=res
          return res;
        })
      },
      isPayOrder:function({commit,state},params){
        return ispayorder(params).then((res)=>{
          return res;
        })
      }
    }
  }
]
// store：结束
