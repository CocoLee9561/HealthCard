

// 路由：开始




export let myFocusChildRoutes = [

];


// 路由：结束







// store：开始
import {getcollectionlist} from '@network/Api'
export let myFocusStoreConfigs = [
  {
    state:{
      collectionList:[]
    },
    mutations:{

    },
    actions:{
      getCollectionList:function({commit,state},params){
        return getcollectionlist(params).then((res)=>{
          if(params.page==1){
            state.collectionList=res
          }else{
            let list=state.collectionList
            state.collectionList=list.concat(res);
          }
          return res;
        })
      }
    }
  }
];
// store：结束
