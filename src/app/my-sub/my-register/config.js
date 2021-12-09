

// 路由：开始




export let myRegisterChildRoutes = [

];


// 路由：结束







// store：开始
import {getreghistorylist} from '@network/Api'
export let myRegisterStoreConfigs = [
  {
    state:{
      curRegisterList:[],
      bookingRegisterList:[]
    },
    mutations:{

    },
    actions:{
      getRegHistoryList:function ({commit,state},params) {//regtype:0->预约挂号，1->当日挂号
        return getreghistorylist(params).then((res)=>{

          if(params.regtype==0){
            if(params.page==1){
              state.bookingRegisterList=res;
            }else{
              let list = state.bookingRegisterList;
              state.bookingRegisterList=list.concat(res);
            }
          }else if(params.regtype==1){
            if(params.page==1){
              state.curRegisterList=res;
            }else{
              let list = state.curRegisterList;
              state.curRegisterList=list.concat(res);
            }
          }

          return res;
        })
      }
    }
  }
];
// store：结束
