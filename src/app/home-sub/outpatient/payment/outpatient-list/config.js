// 路由：开始



// 路由：结束





// store：开始
import {pendingpaylist,alreadypaylist,outpatientHint} from '@network/Api'
export let outpatientListStoreConfigs = [
  {
    state:{
      pendingPayList:[],
      alreadyPayList:[],
      hint:{},
      pendingPayTip:'暂只支持自费,使用医保请到窗口缴费',
      alreadyPayTip:'如需发票、退费，请于就诊当天到收费窗口办理',
      reporttypeinfo: "可查报告类型:放射、超声、检验、病历" ,
      jcreportinfo:"",
      jyreportinfo:"",
      report4jcinfo:"",
      report4jyinfo:"",
      outids:'',
      outpatientMember:{},
      outpatientCard:{}
    },
    mutations:{
      updateOutids:function(state,outids){
        state.outids=outids
      },
      updateOutpatientMember:function(state,data){
        state.outpatientMember[data.hospCode]=data.member
        state.outpatientCard[data.hospCode]=data.card
      },
      setPendingPayList:function (state,pendingPayList) {
        if(state.hospital.current.isSinglePay==0){
          pendingPayList.forEach((item)=>{
            item.isselected = true ;
          });
        }
        state.pendingPayList = pendingPayList
      }
    },
    actions:{
      getPendingPayList:function({commit,state},params){
        return pendingpaylist(params).then((res)=>{
          commit("setPendingPayList",res);
          return res;
        })
      },
      getAlreadyPayList:function({commit,state},params){
        return alreadypaylist(params).then((res)=>{
          state.alreadyPayList=res
          return res;
        })
      },
      outpatientHint:function({commit,state},params){
        return outpatientHint({
          hospitalcode:state.hospital.current.hospitalcode
        }).then((res)=>{
          state.hint=res;
          state.pendingPayTip=res.pendingpay ;
          state.alreadyPayTip=res.alreadypay ;
          state.reporttypeinfo= res.reporttypeinfo || "可查报告类型:放射、超声、检验、病历" ;
          state.report4jyinfo=res.report4jyinfo||''
          state.report4jcinfo=res.report4jcinfo||''
          state.jcreportinfo=res.jcreportinfo||''
          state.jyreportinfo=res.jyreportinfo||''
          return res;
        })
      }
    }
  }
]
// store：结束
