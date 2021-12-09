// 路由：开始



export let reviewDoctorChildRoutes = [

];

// 路由：结束





// store：开始
import {review} from '@network/Api'
export let reviewDoctorStoreConfigs = [
  {
    state:{
      reviewDoctorInfo:{}
    },
    mutations:{
      updateReviewDoctorInfo:function(state,data){
        state.reviewDoctorInfo=data
      }
    },
    actions:{
      review:function({commit,state},params){
        return review(params).then((res)=>{
          return res;
        })
      }
    }
  }
]
// store：结束
