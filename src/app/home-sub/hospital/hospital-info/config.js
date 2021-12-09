// 路由：开始


// 路由：结束




// store：开始
import {queryRegHospAndDepts} from '@network/Api'
export let hospitalInfoStoreConfigs = [
  {
    state:{
      hospitalInfo:{}
    },
    mutations:{

    },
    actions:{
      queryRegHospAndDepts:function({commit,state}){

        let params = {
          pkreghospital: state.hospital.current.pkregHospitalId,
        };

        return queryRegHospAndDepts(params).then((res)=>{
          state.hospitalInfo=res
          return res
        })
      }
    }
  }
];
// store：结束
