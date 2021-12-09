// 路由：开始


// 路由：结束




// store：开始
import {getregdoctorinfo,getregschedulelist,collection,getdocschedulelist} from '@network/Api'
export let doctorInfoStoreConfigs = [
  {
    state: {
      selectedSchedule:{},
      bookingData:{},
      doctorInfo:{},
      scheduleList:[],
      scheduleTitle:[]
    },
    mutations:{
      updateSelectedSehedule(state,data){
        state.selectedSchedule=data;
      },
      updateBooingInfo(state,data){
        state.bookingData=data;
      },
      updateDoctorInfo(state,data){
        state.doctorInfo=data;
      }
    },
    actions:{
      getRegDoctorInfo({commit,state},params){

        return getregdoctorinfo(params).then((res)=>{
          state.doctorInfo = res
          return res;
        });
      },
      getRegScheduleList({commit,state},params){
        return getregschedulelist(params).then((res)=>{
          state.scheduleList=res
          return res
        });
      },
      collectionDoctor({commit,state},params){
        return collection(params).then((res)=>{
          state.doctorInfo.iscollected = 1-state.doctorInfo.iscollected
          return res
        })
      },
      getDocScheduleList({commit,state},params){
        state.scheduleTimes=[]
        return getdocschedulelist(params).then((res)=>{
          state.scheduleTitle = res.title
          let days = res.days
          if(!res.days){
            return []
          }
          let one=[];
          for(var i=0;i<7;i++){
            one.push(days[i]);
          }
          let two=[];
          for(var i=7;i<14;i++){
            two.push(days[i]);
          }
          state.scheduleTimes.push(one)
          state.scheduleTimes.push(two)
          return state.scheduleTimes
        })
      }
    }
  },
]
// store：结束
