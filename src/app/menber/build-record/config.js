// 路由：开始



// 路由：结束





// store：开始
import {onlinebuildrecord} from '@network/Api'
export let buildRecordStoreConfigs = [
  {
    state:{

    },
    mutations:{

    },
    actions:{
      onLineBuildRecord({commit,state},params){
        return onlinebuildrecord(params).then((res)=>{
          if(res.result){
            if(res.data&&res.data.cardinfo&&res.data.cardinfo.cardlist){
              let list = res.data.cardinfo.cardlist
              list.forEach((val)=>{
                if(val.cardno){
                  val.cardno=val.cardno.split('_')[0]
                }
              })
              state.busiCardList=list
              state.cardList=list
            }
          }
          return res;
        })
      }
    }
  }
];
// store：结束
