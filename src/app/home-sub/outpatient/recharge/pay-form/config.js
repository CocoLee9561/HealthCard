// 路由：开始



// 路由：结束





// store：开始
import {unifiedorder,payinfo} from '@network/Api'
import tool from '@common/libs/tool'
import {payMethodMap,osName} from '@constant.js'
export let payFormStoreConfigs = [{
  state:{
    payinfo:{},
    allbalance:'0.00'
  },
  getters: {
    allPayMethods:function(state){
      let allowPayMethods = [];
      let clientId = shareInst.store.state.hospital.current.clientId
      if(osName.alipay==shareInst.client.osName){
        allowPayMethods.push(payMethodMap.getMethodForType(6))
      }else if(osName.weChat==shareInst.client.osName){
        let method = payMethodMap.getMethodForType(5)
        // if(clientId=='S-511800-53584'){
        //   method.name="四川农信收银台"
        // }
        allowPayMethods.push(method)
      }else{
        allowPayMethods.push(payMethodMap.getMethodForType(6))
        allowPayMethods.push(payMethodMap.getMethodForType(7))
      }
      if(clientId=='S-511800-53584'){
        allowPayMethods.push(payMethodMap.getMethodForType(10))
      }

      return allowPayMethods;
    },
    totalBalance:function(state){
      if(state.payinfo){
        return state.payinfo.enablebalance||'0.00'
      }else{
        return '0.00'
      }
    }
  },
  actions: {
    cardRechargeSign:function({commit,state},payload) {

      let {funKey,money,payType} = payload ;

      let {riid,realname} = state.selectedMember;
      let {pkregHospitalId,hospitalcode,hospitalname} = state.hospital.current ;
      let {cardno,cardtype} = state.selectedCards[funKey];

      let  cid=state.selectedMember.cid||state.selectedMember.guardiancardno;

      let params = {
        riid,cid,cardno,realname,hospitalcode,hospitalname,cardtype,
        pkreghospital:pkregHospitalId,
        thridpayfee:money,
        paytype:payType,
        biztype:funKey
      };

      return unifiedorder(params).then(function (res) {
        return res;

        // let payInfo = {
        //   orderNo:"",
        //   cardNo:cardno,
        //   regPayType:payType,
        //   routeName:"RechargeResult"
        // };
        //
        // localStorage.setAnyItem("pay-info",payInfo);
        //
        //
        // let nextRoute = {
        //   name:"ConfirmLoading"
        // };
        //
        // res.nextLocation = nextRoute ;
        //
        // shareInst.client.payment(res);
      });

    },
    payinfo:function ({commit,state},params) {
      state.payinfo={}
      state.allbalance=0.00
      return payinfo(params).then((res)=>{
        state.payinfo=res
        state.allbalance=res.allbalance
        return res;
      })
    },

  }
}]
// store：结束


// shareInst.store.commit("currentHospital",{})
//
// shareInst.gby.allPayMethods
//
// shareInst.store.getters.allPayMethods
//
// shareInst.store.state.hospital.current.payTypes
