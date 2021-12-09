// 路由：开始



export let doctorListChildRoutes = [

];

// 路由：结束





// store：开始
import {gettodayreview} from '@network/Api'
export let doctorListStoreConfigs = [
  {
    state:{
      reviewList:[]
    },
    mutations:{

    },
    actions:{
      getTodayReview:function({commit,state},params){
        return gettodayreview(params).then((res)=>{
          state.reviewList=res
          return res;
        })
      }
    }
  }
]
// store：结束
