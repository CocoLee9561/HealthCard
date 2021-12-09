// 路由：开始



// 路由：结束





// store：开始

import {updaterelationship,updatecerttype,updaterealname,updateidcard,updatemobilenumber,updateheight,updatebloodtype,updategender,updatebirthday,updateguardianname,updateguardiancardno,updateguardianphone,updateguardiancerttype,deleterelativeinfo} from '@network/Api'
export let editMemberStoreConfigs = [
  {
    state:{
      tabSelected:0
    },
    mutations:{
      updateTabSelected:function(state,tabSelected){
        state.tabSelected=tabSelected
      },
    },
    actions:{
      updateRealName:function({commit,state},params){
        return updaterealname(params).then((res)=>{
          commit('selectMember',res);
          return res;
        })
      },
      updateIdCard:function({commit,state},params){
        return updateidcard(params).then((res)=>{
          commit('selectMember',res);
          return res;
        })
      },
      updateMobileNumber:function({commit,state},params){
        return updatemobilenumber(params).then((res)=>{
          commit('selectMember',res);
          return res;
        })
      },
      updateHeight:function({commit,state},params){
        return updateheight(params).then((res)=>{
          commit('selectMember',res);
          return res;
        })
      },
      updateBloodType:function({commit,state},params){
        return updatebloodtype(params).then((res)=>{
          commit('selectMember',res);
          return res;
        })
      },
      updateGender:function({commit,state},params){
        return updategender(params).then((res)=>{
          commit('selectMember',res);
          return res;
        })
      },
      updateBirthday:function({commit,state},params){
        return updatebirthday(params).then((res)=>{
          commit('selectMember',res);
          return res;
        })
      },
      updateGuardianName:function({commit,state},params){
        return updateguardianname(params).then((res)=>{
          commit('selectMember',res);
          return res;
        })
      },
      updateGuardianCardNo:function({commit,state},params){
        return updateguardiancardno(params).then((res)=>{
          commit('selectMember',res);
          return res;
        })
      },
      updateGuardianPhone:function({commit,state},params){
        return updateguardianphone(params).then((res)=>{
          commit('selectMember',res);
          return res;
        })
      },
      updateGuardianCertType:function({commit,state},params){
        return updateguardiancerttype(params).then((res)=>{
          commit('selectMember',res);
          return res;
        })
      },
      deleteRelativeInfo:function({commit,state},params){
        return deleterelativeinfo(params).then((res)=>{
          return res;
        })
      },
      updateCertType:function({commit,state},params){
        return updatecerttype(params).then((res)=>{
          commit('selectMember',res);
          return res;
        })
      },
      updateRelationShip:function({commit,state},params){
        return updaterelationship(params).then((res)=>{
          if(res.result){
            commit('selectMember',res.data);
          }
          return res;
        })
      }
    }
  }
]
// store：结束
