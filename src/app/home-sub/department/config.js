// 路由：开始


// 路由：结束




// store：开始
import {getregdepartmentlist,getlatestregdepartment,getlatestregdoctor} from '@network/Api'
export let departmentListStoreConfigs = [
  {
    state:{
      departmentList:{},
      isSingleColumn:true,
      lastRegDepartment:{},
      lastRegDoctor:{}
    },
    mutations:{

    },
    actions:{
      getRegDepartmentList({commit,state},params){
        state.isSingleColumn=true
        state.departmentList=[]
        return getregdepartmentlist(params).then((res)=>{
          let departs=res
          departs.forEach((val,index,arr)=>{
            if(val.children&&val.children.length>0){
              state.isSingleColumn=false
              return;
            }
          })
          state.departmentList=res;
          return res;
        })
      },
      selectedDepartment({commit,state},params){
        state.selectedDepartment = params;
      },
      getLatestRegDepartment({commit,state},params){
        return getlatestregdepartment(params).then((res)=>{
          state.lastRegDepartment=res;
          return res;
        })
      },
      getLatestRegDoctor({commit,state},params){
        return getlatestregdoctor(params).then((res)=>{
          state.lastRegDoctor=res
        })
      }
    }
  }
];
// store：结束
