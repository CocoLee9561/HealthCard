// 路由：开始


export let waitingDoctorChildRoutes = [

];

// 路由：结束





// store：开始
import {waitingList} from '@network/Api'
export let waitingDoctorStoreConfigs = [
  {
    state:{
      waitingDoctorList:[],
    },
    mutations:{

    },
    actions:{
      getWaitingList:function({commit,state},params){
        state.waitingDoctorList=[]
        return waitingList(params,params.showLoading).then((res)=>{
          state.waitingDoctorList=res
          return res;
        })
      }
    }
  }
]
// store：结束
