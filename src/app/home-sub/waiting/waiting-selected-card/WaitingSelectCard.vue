<template>
  <div class="page">
    <view-box>
      <x-header slot="header" :showBack="showBack">{{title}}</x-header>
      <!--提示-->
      <group class="select-card-page-group" gutter="0">
        <cell>
          <span slot="title" class="select-card-page-tips">请选择 <strong class="name">{{waitingItem.realname}}</strong> 所用的 <strong
            class="card-name">{{validCardTypeNameStr}}</strong> </span>
        </cell>
        <cell-box>
          <div style="width: 100%;">
            <checker class="card-list" type="radio" v-model="selectedCard" default-item-class="default"
                     selected-item-class="selected">
              <checker-item class="card" v-for="(card, index) in busiCardList" :value="card" :key="index">
                <p class="name">{{card.cardTypeName}}</p>
                <p class="cardno">{{formatCardNo(card.cardno)}}</p>
                <p class="cardtime" v-if="card.createtime">绑卡日期  {{card.createtime}}</p>
              </checker-item>
            </checker>

            <mt-button @click.native="addCardHandle" class="card-select-btn" size="large">
              <img class="btn-img" slot="icon" src="@icon/icon_add.png">
              添加卡
            </mt-button>


            <actionsheet v-model="showSheet" @on-click-menu="seletCardTypeHandle" :menus="sheetMenus"></actionsheet>
          </div>
        </cell-box>
      </group>

      <cell class="select-card-page-cell">
        <span slot="title" class="select-card-page-tips">如果没有{{validCardTypeNameStr}}，可向医院工作人员咨询</span>
      </cell>
      <div style="padding: 10px;">
        <x-button type="primary" class="own-btn" @click.native="selectCard">确认</x-button>
      </div>
    </view-box>
  </div>
</template>

<script>

  import {mapState, mapActions} from 'vuex'
  import {funModules} from '@constant.js'

  export default {
    name: "WaitingSelectCard",
    components: {},

    data: function () {
      return {
        currCard: '',
        showSheet:false
      };
    },

    computed: {
      ...mapState({
        waitingItem: state => state.waitingItem,
        hospitalInfo: state => state.hospital.current,
        busiCardList: state => state.busiCardList,
        selectedCardList: state => state.selectedCards,
        isNewPage:state=>state.isNewPage,
        isCardNewPage:state=>state.isCardNewPage
      }),
      title: function () {
        let routeData = this.$routeData;
        let funMod = funModules[routeData.funKey];
        let title = routeData.title || (funMod && funMod.name );
        return title;
      },
      showBack: function () {
        return !this.$routeData.hideBack;
      },

      funKey: function () {
        return this.$routeData.funKey;
      },

      validCardTypeNameStr: function () {
        let cardNameList = this.validCardTypes.map(function (card) {
          return card.cardtype;
        });
        cardNameList=cardNameList.filter(function (element, index, array) {
          return array.indexOf(element) === index;
        });
        let cardNamesStr = cardNameList.join("/");

        return cardNamesStr;
      },
      cardInfo: function () {
        return this.$store.state.selectedCards[this.$routeData.funKey];
      },
      validCardTypes: function () {
        let validCardTypes = this.$store.state.validCardType[this.funKey] || [];
        return validCardTypes;
      },


      selectedCard: {
        get: function () {
          let funKey = this.funKey;
          let selected = this.selectedCardList[funKey];
          let pkcard = selected && selected.pkcard;
          let a = {}
          if(this.busiCardList){
            a = this.busiCardList.find(function (card) {
              return pkcard == card.pkcard;
            });
          }
          this.currCard = a
          return a;

        },
        set: function (card) {

//          let payload = {
//            funKey: this.funKey,
//            card: card
//          };
//
//          this.$store.commit("selectCard", payload);
          this.currCard = card
        }
      },
      sheetMenus: function () {

        let menus = this.validCardTypes.reduce(function (preMenus, card) {
          if(card.cardtypeid<6) {
            preMenus[card.cardtypeid] = card.cardtype;
          }
          return preMenus;
        }, {});

        return menus;
      },
    },
    watch: {},
    created: function () {
      if(this.waitingItem){
        this.$store.commit('selectMember',{realname:this.waitingItem.realname,riid:this.waitingItem.riid})
      }
      this.reqValidCardType(this.funKey);
      this.loadCardList();
    },
    methods: {
      ...mapActions(["reqValidCardType", "getCardInfo","isPayOrder","getAlreadyCard"]),
      selectCard: function (card) {
        if (!this.currCard) {
          this.$vux.toast.text('请选中卡')
        } else {
          let payload = {
            funKey:this.funKey,
            card:this.currCard
          };
          this.$store.commit("selectCard", payload);
          this.ispayorder()
        }
      },
      formatCardNo(cardno){
        if(cardno&&cardno.length>8){
          return cardno.substring(0,4)+'****'+cardno.substr(cardno.length-4);
        }else{
          return cardno;
        }
      },
      loadCardList() {
        let param = {
          hospitalcode: this.hospitalInfo ? this.hospitalInfo.hospitalcode : '',
          busi: this.funKey,
          riid: this.waitingItem.riid
        }
        this.getCardInfo(param).then((res)=>{
          if(this.hospitalInfo.isRecordOnline==1){
            let self=this;
            if(res.cardlist.length==0){


              this.getAlreadyCard({
                riid:this.waitingItem.riid,
                hospitalcode:this.hospitalInfo.hospitalcode,
                name:this.waitingItem.realname,
                cid:this.waitingItem.cid,
                mobile:'',
                busi:this.funKey
              }).then((res)=>{
                if(res.result&&res.data.onlinestatus==0&&res.data.cardinfo&&res.data.cardinfo.cardlist&&res.data.cardinfo.cardlist.length>0){
                  this.$vux.alert.show({
                    title:`获取${self.validCardTypeNameStr}成功`,
                    content:'使用之前请检查卡号是否正确',
                    showCancelButton:false,
                    onHide(){
                      self.$store.commit('updateCardIsNewPage', false);
                    }
                  })
                }else{
                  this.$store.commit('updateCardIsNewPage', false);
                  let nextRoute = self.$routeData.to;
                  shareInst.client.push({
                    name:"AddCard",
                    query:{
                      funKey:this.funKey,
                      isBuild:this.isOnLineBuild(),
                      to:this.funKey=='GRZX'?-1:JSON.stringify(nextRoute)
                    }
                  })
                }
              })
            }
          }
        });
      },
      isOnLineBuild(){
        let result=false
        this.validCardTypes.forEach((value,index)=>{
          if(value.isrecordonline==1){
            result =true
            return;
          }
        })
        return result;
      },
      ispayorder(item) {
        let params = {
          reghistoryid: this.waitingItem.reghistoryid
        }
        this.isPayOrder(params).then((res) => {
          if (res.bsresult == 0) {
            localStorage.setItem('isCanTakeNo',true);
            shareInst.client.back()
          } else {
            let self = this;
            this.$vux.confirm.show({
              title: '您还未支付挂号费？',
              content: '在线取号须先支付挂号费用',
              confirmText: '立刻支付',
              onConfirm() {
                shareInst.client.push({
                  path: '/waitingPay',
                  query: {
                    routeName: 'waiting',
                    funKey:'QHHZ'
                  }
                })
              },
              onCancel() {
              }
            })
          }
        })
      },
      addCardHandle: function () {
        this.showSheet = true;
      },
      seletCardTypeHandle: function (type, name) {
        let nextRoute = this.$routeData.to;
        shareInst.client.push({
          name: "AddCard",
          query: {
            cardType:type,
            cardName:name,
            funKey: this.funKey,
            isBuild:this.isOnLineBuild(),
            to:-1
          }
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .select-card-page-tips {
    font-size: 1rem;
    color: #999;
  }

  .select-card-page-tips .name,
  .select-card-page-tips .card-name {
    color: $mainColor;
  }

  .select-card-page-cell:before {
    border-top: 1px solid #fff
  }

  .select-card-page-cell:after {
    border-bottom: 1px solid #fff
  }

  .default {

  }

  .selected {
    border-style: solid;
    border-color: gray;
  }

  .card-list {
    display: flex;

    flex-wrap: wrap;

    .card {
      flex-basis: 40%;
      border: 2px solid #D9D9D9;
      border-radius: 2px;
      padding: 9px 10px 5px;
      margin-top: 15px;
      min-width: 5rem;

      .name {
        font-size: 13px;
        color: #999;
      }

      .cardno {
        font-size: 20px;
        color: #666;
        line-height: 1.6;
      }

      .cardtime {
        font-size: 11px;
        color: #bbb;
      }

    }

    .selected {
      border: 2px solid $mainColor;
    }

    .card:nth-child(odd) {
      margin-right: 15px;
    }

  }

  .btn-img {
    width: 16px;
    height: 16px;
    margin-right: 6px;
  }

  .slider {
    width: 100%;
    height: 200px;
    position: relative;
    user-select: none;

    .content {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: green;
      z-index: 100;
      transition: 0.3s;

    }

    .remove {
      position: absolute;
      width: 200px;
      height: 200px;
      background: red;
      right: 0;
      top: 0;
      color: #fff;
      text-align: center;
      font-size: 40px;
      line-height: 200px;
    }

  }

  .card-select-btn {
    margin-top: 15px;
    background: #fff;
    border: 1px #ccc;
    border-style: dashed;
    box-shadow: none;
    padding: 0 10px;
  }
</style>
