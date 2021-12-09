// 路由：开始


// 路由：结束



import {queryReportList} from '@network/Api'

// store：开始

export let reportListStoreConfigs = [{
  state:{
    // reportList:[],
    selectedReport:{},
    badgeReport:{},
    reportStartDate:'',
    reportEndDate:'',
    reportDateType:1
  },
  mutations:{
    // setReportList(state,reportList){
    //   state.reportList = reportList;
    // },
    updateReportStartDate(state,date){
      state.reportStartDate=date
    },
    updateReportEndDate(state,date){
      state.reportEndDate=date
    },
    updateReportDateType(state,type){
      state.reportDateType=type
    },
    setSelectedReport(state,report){
      state.selectedReport = report;
    },
    addBadgeReport(state,report){
      state.badgeReport[report.reportid]=report
    }
  },


  actions:{
    reqQueryReportList:function ({commit,state},dates) {

      let {riid,realname} = state.selectedMember;
      let {hospitalcode} = state.hospital.current ;
      let {cardno,cardtype} = state.selectedCards["BGCX"] || {};


      let params = {
        riid:riid,
        realname:realname,
        cardno:cardno,
        cardtype:cardtype,
        hospitalcode:hospitalcode,
      };
      Object.assign(params,dates)
      // queryReportList(params).then(function (mainData){
      //   commit("setReportList",mainData);
      // });

      return queryReportList(params)

    }
  }

}]
// store：结束
