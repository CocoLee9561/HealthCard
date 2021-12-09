// 路由：开始



// 路由：结束





// store：开始
import {getallrelativeinfo} from '@network/Api'
import {cardTypes} from '@constant.js'


export let memberListStoreConfigs = [{
  state:{
    memberList:[],
    selectedMember:{},
    tempSelectedMember:{},
    isHaveSelf:false
  },

  mutations: {
    setMemberList (state,memberList) {
      state.isHaveSelf=false;
      memberList.forEach(function (member) {
        let cardList = member.cardlist;
        if(member.relation=='本人'){
          state.isHaveSelf=true;
        }
        let newCardList = cardList.map(function (card) {
          let type = card.cardtype;
          if(card.cardno){
            card.cardno=card.cardno.split('_')[0]
          }
          let newCard = {...card,...cardTypes[type]};
          return newCard;
        });

        member.cardlist = newCardList;

      });

      state.memberList = memberList ;
    },
    selectMember (state,result) {
      state.selectedMember = result ;
      let cardList = result.cardlist;
      if(cardList){
        let newCardList = cardList.map(function (card) {
          let type = card.cardtype;
          if(card.cardno){
            card.cardno=card.cardno.split('_')[0]
          }
          let newCard = {...card,...cardTypes[type]};
          return newCard;
        });
        state.cardList=newCardList
        state.selectedMember.cardlist = newCardList;
      }
    },
    selectTempMember(state,result){
      state.tempSelectedMember = result ;
      let cardList = result.cardlist;
      if(cardList) {
        let newCardList = cardList.map(function (card) {
          let type = card.cardtype;
          if(card.cardno){
            card.cardno=card.cardno.split('_')[0]
          }
          let newCard = {...card, ...cardTypes[type]};
          return newCard;
        });
        state.cardList=newCardList
        state.tempSelectedMember.cardlist = newCardList;
      }
    }
  },
  actions: {
    reqMemberList ({commit}) {
      return getallrelativeinfo({}).then(function (res) {
        commit('setMemberList',res);
        return res;
      });

    }
  }
}]
// store：结束
