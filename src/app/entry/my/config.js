// 路由：开始



// 路由：结束





// store：开始
import {getpersonalcenterlist,getuserinfo,logout} from '@network/Api'
import {personModules} from  '@constant.js'
export let myStoreConfigs = [
  {
    state:{
      personalList:[]
    },
    mutations:{
      savePersonalCenterList(state,personalList){
        let list=[];
        personalList.forEach((val)=>{
          let code=val.code;
          let fItem=personModules[code];
          if(!fItem){
            return;
          }
          if(val.isactive==1){
            Object.assign(fItem,val)
            list.push(fItem);
          }
        })
        state.personalList=list;
      }
    },
    actions:{
      getPersonalCenterList:function({commit,state},params){
        return getpersonalcenterlist(params).then((res)=>{
          commit('savePersonalCenterList',res)
          return res;
        })
      },
      getUserInfo:function({commit,state},params){
        return getuserinfo(params).then((res)=>{
          state.user.userInfo=res
          return res;
        }).catch((res)=>{
          if(res.data.status!='10001'){
            shareInst.router.push({
              name:'LogIn',
              query: { redirect:true }
            });
          }
        })
      },
      logout:function({commit,state},params){
        return logout(params).then((res)=>{
          commit("saveLoginResult",{
            token:"",
            devicenum:"",
            uid:"",
            mobile:"",
            nickname:"",
            headshoturl:"",
            islogin:0
          });
          shareInst.client.push({path:'/logIn?redirect=true'})
          // state.user={}
          return res;
        })
      }
    }
  }
]
// store：结束
