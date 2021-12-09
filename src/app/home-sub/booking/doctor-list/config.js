// 路由：开始


// 路由：结束




// store：开始
import {getregdoctorlistbydeptid,getregdoctorlistbydate} from '@network/Api'

export let doctorListStoreConfigs = [
  {
    state:{
      doctorList:[],
      dateDoctorList:[],
    },
    mutations:{

    },
    actions:{
      getRegDoctorListByDeptId({commit,state},params){

        return getregdoctorlistbydeptid(params).then((res)=>{
          state.doctorList=res
          return res;
        })
      },
      getRegDoctorListByDate({commit,state},params){

        return getregdoctorlistbydate(params).then((res)=>{
          state.dateDoctorList=res
          return res;
        })
      },
    }
  }
]
// store：结束
