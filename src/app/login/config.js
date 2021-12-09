// 路由：开始



// 路由：结束





// store：开始
import {getverificationcode,loginorregister} from '@network/Api'

let lgStoreConfig = {
  // initState:true,
  state:{
    userInfo:{},
    token:"",
    devicenum:"",
    uid:"",
    mobile:"",
    nickname:"",
    headshoturl:"",
    islogin:0
  },

  mutations:{
    saveLoginResult:function (state,result) {
      state.userInfo=result
//    localStorage.setItem("userInfo",JSON.stringify(result))
      Object.keys(result).forEach(function (resKey) {
        state[resKey] = result[resKey];
      });
    }
  },

  actions:{
    sendVerificationCode:function ({commit,state},mobile) {
      return getverificationcode({
        mobile:mobile,
        hospitalname:shareInst.store.state.hospital.current.hospitalName
      });
    },

    logIn:function ({ commit },params) {
      return loginorregister(params).then(function (result) {
        commit("saveLoginResult",result);

        return true;
      });
    }
  }


}



export let loginStoreConfigs = [{
  modules:{
    user:lgStoreConfig
  }
}];
// store：结束
