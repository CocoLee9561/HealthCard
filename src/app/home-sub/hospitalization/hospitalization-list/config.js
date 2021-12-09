
// 路由：开始

export let hospitalizationListChildRoutes=[

]


// 路由：结束





// store：开始
import {stayhospitallist,outpatientlist} from '@network/Api'
export let hospitalizationListStoreConfigs = [
  {
    state:{

    },
    mutations:{

    },
    actions:{
      loadStayHospitalList:function({commit,state},params){
        return stayhospitallist(params).then((res)=>{
          return res;
        })
      },
      loadOutpatientList:function({commit,state},params){
        return outpatientlist(params).then((res)=>{
          return res;
        })
      }
    }
  }
]

// store：结束
