// 路由：开始


// 路由：结束





// store：开始

import {getcards,payinfo1} from '@network/Api'
export let myCardListStoreConfigs = [
  {
    state:{
      myCardList:[]
    },
    mutations:{
      setCards1(state,cards){
        state.myCardList = cards;
      },
      setCards(state,cards){
        let list = cards
        let count = 0;
        cards.forEach(item=>{
          if(item.cardtype==1||item.cardtype==6){
            count++;
          }
        })
        console.log(count)
        if(count!=0){
          cards.forEach((item,index) => {
            if(item.cardtype==1||item.cardtype==6){
              
              payinfo1({
                riid: item.riid,
                cardno: item.cardno,
                cardtype: item.cardtype,
                hospitalcode: item.hospitalcode,
                pkreghospital: item.pkreghospitalid
              }).then((res)=>{
                count--;
                list[index].allbalance = res.allbalance||'0.00'
                if(count<=0){
                  state.myCardList=list
                }
              })
            }
          });
        }else{
          state.myCardList=list
        }
      }
    },
    actions:{
      getCards:function({commit,state},params){
        state.myCardList=[]
        return getcards(params).then((res)=>{
          commit('setCards1',res)
          return res;
        })
      }
    }
  }
]
// store：结束
