// 路由：开始


// 路由：结束


// store：开始

import {getallcustomerhospital} from '@network/Api'

import {payMethodMap,osName} from  '@constant.js' ;

export function getUrlKey (name) {
  console.log("configjsinitUrl:",window.location.href)
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(window.location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
}
let hospitalStoreConfigs = {
  state: {
    all: [],
    current: {}
  },
  getters: {
    allowPayMethods: function (state) {
      console.log("allowPayMethods begin ")
      let isqrCode = getUrlKey("isqrCode");
      let payTypes = state.current.payTypes;
      console.log("after-----state.current.payTypes:",payTypes);

      let allowPayMethods = [];
      // let clientId = shareInst.store.state.hospital.current.clientId
      if (payTypes) {
        payTypes.map(function (typeInfo) {
          let type = typeInfo.payType;
          console.log("type111:",type);
          let method = payMethodMap.getMethodForType(type);
          if (isqrCode) {
            method = payMethodMap.getMethodForType(5);
          }
          // let method4 = payMethodMap.getMethodForType(4);
          // console.log("method111:",method);
          // console.log("method444:",method4);
          if(!method){
            return;
          }
          method.selected = false;
          // if(isqrCode){
          //   method.selected = true;
          // }

          // if(type==5&&clientId=='S-511800-53584'){
          //   method.name="四川农信收银台"
          // }
          console.log("shareInst.client.osName:",shareInst.client.osName)
          if(osName.alipay==shareInst.client.osName){
            if(type!=5){
              allowPayMethods.push(method)
            }
          }else if(osName.weChat==shareInst.client.osName){
            if(type!=6){
              allowPayMethods.push(method)
            }
          }else{
            allowPayMethods.push(method)
          }

          if(isqrCode){
            return ;
          }
        });
      }


      // allowPayMethods.sort(function (methodA,methodB) {
      //   return methodA.orderNo > methodB.orderNo ;
      // });

      let firstPM = allowPayMethods[0];
      if (firstPM){
        firstPM.selected = true;
      }



      return allowPayMethods;
    }
  },
  mutations: {
    allHospital: function (state, hospitalList) {
      state.all = hospitalList;
    },
    currentHospital: function (state, hospitalInfo) {
      let clientId = state.current.clientId
      state.current = hospitalInfo;
      state.current.clientId = clientId
    }
  },
  actions: {
    reqAllHospital: function ({commit}) {
      let params = {

      };

      return getallcustomerhospital(params).then((data)=> {
        commit("allHospital", data);
        return data
      });
    }
  }
};


export let chooseHospitalStoreConfigs = [{
  modules: {
    hospital: hospitalStoreConfigs
  }
}
];
// store：结束



