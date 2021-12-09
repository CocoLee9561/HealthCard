// 路由：开始


// 路由：结束




// store：开始
import {regreviewlist} from '@network/Api'
export let reviewListStoreConfigs = [
  {
    state:{
      reviewList:[],
      reviewItem:{},
      reviewDetail:{},
    },
    mutations:{
      updateReviewItem:function(state,params){
        state.reviewItem=params
      }
    },
    actions:{
      regReviewList:function({commit,state},params){
        return regreviewlist(params).then((res)=>{
          if (JSON.stringify(res) !== '{}') {
            state.reviewDetail = res
            if (params.page == 1) {
              state.reviewList = res.appraislist || []
            } else {
              let list = state.reviewList
              state.reviewList = list.concat(res.appraislist);
            }
          }else{
            if(params.page>1){
              let list = state.reviewList
              state.reviewList = list.concat(res.appraislist);
            }else{
              state.reviewDetail={}
              state.reviewList=[]
            }
          }
          return res
        })
      },

    }
  }
]
// store：结束
