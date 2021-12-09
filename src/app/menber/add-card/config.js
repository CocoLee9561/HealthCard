// 路由：开始



// 路由：结束





// store：开始
import {savecard,deletecard,getallareasdata,getbarcodeimage,getallcustomerareas,getBindCardCode} from '@network/Api'
export let addCardStoreConfigs = [
  {
    state:{
      areas:[],
      addressAreas:[]
    },
    mutations:{

    },
    actions:{
      getAllAreasData:function({commit,state},params){
        return getallareasdata(params).then((res)=>{
          let temp = res;
          if(temp.length>0){
            if(temp[0].childrenlist){
              temp[0].childrenlist.unshift({name:'请选择地区',id:-1})
            }
          }
          state.areas=res
          return res
        })
      },
      saveCard:function({commit,state},params){
        return savecard(params).then((res)=>{
          return res;
        })
      },
      deleteCard:function({commit,state},params){
        return deletecard(params).then((res)=>{
          return res;
        })
      },
      getBarCodeImage:function({commit,state},params){
        return getbarcodeimage(params).then((res)=>{
          return res;
        })
      },
      getAllCustomerAreas:function({commit,state},params){
        return getallcustomerareas(params).then((res)=>{
          state.addressAreas=res
          return res;
        })
      },
      getBindCardCode:function({commit,state},params){
        return getBindCardCode(params).then((res)=>{
          return res;
        })
      }
    }
  }
];
// store：结束
