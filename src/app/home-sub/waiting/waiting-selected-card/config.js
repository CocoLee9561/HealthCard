// 路由：开始


export let waitingSelectedCardChildRoutes = [

];

// 路由：结束





// store：开始
import {getcardinfo} from '@network/Api'
import {cardTypes} from '@constant.js'
export let waitingSelectedCardStoreConfigs = [
  {
    state:{
      busiCardList:[]
    },
    mutations:{

    },
    actions:{
      getCardInfo:function({commit,state},params){
        return getcardinfo(params).then((res)=>{
          let list = res.cardlist
          list.forEach((val)=>{
            if(val.cardno){
              val.cardno=val.cardno.split('_')[0]
            }
          })
          state.busiCardList=list
          return res;
        })
      }
    }
  }
]
// store：结束
