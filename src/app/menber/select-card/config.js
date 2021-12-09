// 路由：开始



// 路由：结束





// store：开始

import {cardtype,getalreadycard} from '@network/Api'
import {cardTypes} from '@constant.js'

export let selectCardStoreConfigs = [{
  state:{
    validCardType:{},
    selectedCards:{},
    cardList:[]
  },

  getters:{
    // cardList:function(state){
    //   debugger;
    //   let changePatient = sessionStorage.getItem('updateChangePatient');
    //   if(changePatient==1){
    //     return state.tempSelectedMember.cardlist;
    //   }
    //   return state.selectedMember.cardlist;
    // }
  },

  mutations: {
    setValidCardType:function (state,payload) {
      let {funKey,cardTypeList} = payload;
      let validCardType = {};
      validCardType[funKey] = cardTypeList ;
      state.validCardType = {...state.validCardType,...validCardType};
    },
    selectCard (state,payload) {
      let {card,funKey} = payload ;
      state.selectedCards[funKey] = card ;
    }
  },
  actions:{
    reqValidCardType:function ({commit,state},funKey) {

      let {hospitalcode,hospitalid} = state.hospital.current ;
      let params = {
        busi:funKey,
        hospitalcode,
        hospitalid:hospitalcode
      };

      return cardtype(params).then(function (result) {
        let validCardList = result.map(function (remCard) {
          let type = remCard.cardtypeid;
          let locCard = cardTypes[type];
          return {...remCard,...locCard};
        });

        let payload = {
          funKey:funKey,
          cardTypeList:validCardList
        };
        commit("setValidCardType",payload);
        return result;
      })
    },
    getAlreadyCard:function ({commit,state},params) {
      return getalreadycard(params).then((res)=>{
        if(res.data&&res.data.cardinfo){
          let cardList = res.data.cardinfo.cardlist;
          if(cardList){
            let newCardList = cardList.map(function (card) {
              let type = card.cardtype;
              if(card.cardno){
                card.cardno=card.cardno.split('_')[0]
              }
              let newCard = {...card,...cardTypes[type]};
              return newCard;
            });
            state.busiCardList=newCardList
            state.cardList=newCardList
          }
        }

        return res;
      })
    }
  }
}]
// store：结束
