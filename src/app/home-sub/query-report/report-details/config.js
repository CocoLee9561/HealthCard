// 路由：开始


// 路由：结束



import {queryReportDetail} from '@network/Api'

// store：开始

export let reportDetailsStoreConfigs = [{
  state:{
    reportDetail:{}
  },
  mutations:{
    setReportDetail(state,reportDetail){
      state.reportDetail = reportDetail;
    }
  },

  actions:{
    reqReportDetail:function ({commit,state}) {

      let {hospitalcode} = state.hospital.current ;
      let {reportid,checktype} = state.selectedReport ;
      let {cardno,cardtype} = state.selectedCards["BGCX"] || {};

      let params = {
        reportid:reportid,
        hospitalcode:hospitalcode,
        cardno:cardno,
        cardtype:cardtype,
        checktype:checktype
      };
      state.reportDetail={}
      queryReportDetail(params).then(function (mainData) {
        commit("setReportDetail",mainData);
      });
    }
  }

}]
// store：结束
