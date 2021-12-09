// 组件导入模板
// const 组件名 = () => import(/* webpackChunkName: "outpatient" */ '路径')


export let rechargeListChildRoutes = [

];

// 路由：结束





// store：开始
import {getrechargelist} from '@network/Api'
export let rechargeListStoreConfigs = [
  {
    state:{
      rechargeList:{}
    },
    mutations:{

    },
    actions:{
      getRechargeList:function({commit,state},params){
        return getrechargelist(params).then((res)=>{
          if(params.page==1) {
            state.rechargeList = res.rechargeList;
          }else{
            let list=state.rechargeList
            state.rechargeList=list.concat(res.rechargeList)
          }
          return res;
        })
      }
    }
  },
]
// store：结束
