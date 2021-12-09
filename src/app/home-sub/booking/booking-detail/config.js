// 路由：开始


// 路由：结束




// store：开始
import {getreghistorydetail} from '@network/Api'
export let bookingDetailStoreConfigs = [
  {
    state:{
      bookingDetail:{}
    },
    mutations:{

    },
    actions:{
      getRegHistoryDetail:function({commit,state},params){
        return getreghistorydetail(params).then((res)=>{
          state.bookingDetail=res
          return res;
        })
      }
    }
  }
]
// store：结束
