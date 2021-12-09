// 路由：开始




export let reportListChildRoutes = [

];

// 路由：结束





// store：开始

import {getreportdata} from '@network/Api'
export let reportListStoreConfigs = [
  {
    state:{
      reportMessageList:[]
    },
    mutations:{

    },
    actions:{
      getReportData:function({commit,state},params){
        return getreportdata(params).then((res)=>{
          state.reportMessageList=JSON.parse(res).data
          return JSON.parse(res);
        })
      }
    }
  }
]
// store：结束
