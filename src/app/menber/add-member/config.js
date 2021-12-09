// 路由：开始



// 路由：结束





// store：开始
import {saverelative,saverelativeext,hintText} from '@network/Api'
export let addMemberStoreConfigs = [
  {
    state:{
      memberCardInfo:{},
      hintText:''
    },
    mutations:{

    },
    actions:{
      saverelativeext:function({commit,state},params){
        return saverelativeext(params).then((res)=>{
          state.memberCardInfo = res
          return res;
        })
      },
      saveRelative:function({commit,state},params){
        return saverelative(params).then((res)=>{
          return res;
        })
      },
      loadHintText:function({commit,state},params){
        return hintText(params).then((res)=>{
          state.hintText=res
          return res;
        })
      }
    }
  }
];
// store：结束
