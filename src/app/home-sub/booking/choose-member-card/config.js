// 路由：开始


// 路由：结束




// store：开始

import {regconfirmation} from '@network/Api'
export let chooseMemberCardStoreConfigs = [
  {
    state: {
      // selectedMember:{},
      selectedCard:{},
    },
    mutations:{
      updateSelectedMember(state,data){
        state.selectedMember=data;
      },
      updateSelectedCard(state,data){
        state.selectedCard=data;
      }
    },
    actions:{
      regConfirmation({commit,state},params){
        return regconfirmation(params).then((res)=>{
          return res
        })
      }
    }

  },
]
// store：结束
