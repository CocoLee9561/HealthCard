<template>
  <div class="page">
    <view-box>
      <x-header slot="header">我的就诊卡</x-header>
      <popup-tab v-model="currTab">
        <div slot="content">
          <div v-show="currTab==1">
            <group :gutter="0">
              <!--<radio :options="['全部就诊人','张小可','王薇','李楠安']"></radio>-->
              <cell title="全部就诊人" @click.native="changeMember({})">
                  <span v-if="JSON.stringify(currMember) == '{}'">
                    <img width="20px" src="@icon/ic_select@2x.png"/>
                  </span>
              </cell>
              <cell v-for="(item,index) in memberList" :key="index" @click.native="changeMember(item)">
                <span slot="title">{{item.realname}}</span>
                <span v-if="currMember.riid==item.riid">
                    <img width="20px" src="@icon/ic_select@2x.png"/>
                  </span>
              </cell>
            </group>
            <div @click="addMember()" class="add-member-btn">
                <span>
                  <img src="@icon/icon_add.png"/>
                </span>
              <span>添加就诊人</span>
            </div>
          </div>
          <div v-show="currTab==2">
            <group :gutter="0">
              <!--<radio :options="['全部就诊人','张小可','王薇','李楠安']"></radio>-->
              <cell title="全部" @click.native="changeCardType({})">
                  <span v-if="JSON.stringify(currCardType) == '{}'">
                    <img width="20px" src="@icon/ic_select@2x.png"/>
                  </span>
              </cell>
              <cell v-for="(item,index) in validCardTypes" :key="index" @click.native="changeCardType(item)">
                <span slot="title">{{item.cardtype}}</span>
                <span v-if="currCardType.cardtypeid==item.cardtypeid">
                    <img width="20px" src="@icon/ic_select@2x.png"/>
                  </span>
              </cell>
            </group>
          </div>
        </div>
      </popup-tab>
      <div class="card-list-contain" v-if="cardList.length>0">
        <swipeout>
          <swipeout-item :disabled="item.cardtype==6||item.cardtype==7||item.cardtype==8" v-for="(item,index) in cardList" :key="index">
            <div slot="right-menu">
              <swipeout-button @click.native="onDdeleteCard(item)" type="warn">删除</swipeout-button>
            </div>
            <div class="card-list-item " slot="content" @click="toMyCardInfo(item)"><!--@click="editCard(item)"-->
              <img v-show="item.cardtype==1" src="@icon/cardtypetwo.png">
              <img v-show="item.cardtype==2" src="@icon/cardtypeone.png">
              <img v-show="item.cardtype==3" src="@icon/cardtypethree.png">
              <img v-show="item.cardtype==4" src="@icon/cardtypefour.png">
              <img v-show="item.cardtype==5" src="@icon/cardtypefive.png">
              <img v-show="item.cardtype==6" src="@icon/cardtypesix.png">
              <img v-show="item.cardtype==7" src="@icon/cardtypetwo.png">
              <img v-show="item.cardtype==8" src="@icon/cardtypefive.png">
              <div class="card-list-item-info">
                <div class="card-list-item-bar">
                  <span class="card-list-item-name">
                    {{item.realname}}
                  </span>
                      <span>
                        {{item.cardname}}
                      </span>
                  <span class="card-list-item-area">
                        <span v-show="item.cardtype==1 || item.cardtype==5 || item.cardtype==7 || item.cardtype==8">{{item.hospitalname}}</span>
                        <span v-show="item.cardtype==2 || item.cardtype==3 || item.cardtype==4">{{item.regionname}}</span>
                      </span>
                </div>
                <div class="card-list-item-no">{{item.cardno}}
                  <span v-if="item.balance" class="card-list-item-allbalance">余额：<span style="color:#ff4949;">{{item.balance}}</span></span>
                </div>
              </div>
              <div @click="showQrCodeFun(item)" style="float:right;margin-top:10px;">
                <qrcode :value="item.qrCode" type="img" size="35"></qrcode>
              </div>
            </div>
          </swipeout-item>
        </swipeout>
        <div style="padding: 20px;" class="card-botton-wrap">
          <mt-button @click.native="cardTypeSheetVisible=true" size="large">
            <img src="@icon/my/addcard_symbol.png" height="20" width="20" slot="icon">
            添加卡
          </mt-button>
        </div>
      </div>
      <div v-else style="margin-top: 50px;">
        <div class="vux-center" style="height: 250px;">
        <div style="text-align: center;">
          <img src="@icon/no_card.png" style="width: 50%;" alt>
          <div style="color: #303030;margin-top: 10px;">暂无添加任何卡</div>
        </div>
        </div>
        <div class="btn-box">
          <x-button v-if="memberList.length<=0" class="own-btn" @click.native="addMember()">添加就诊人</x-button>
          <x-button class="white-btn" @click.native="cardTypeSheetVisible=true">添加卡</x-button>
        </div>
      </div>
      <actionsheet v-model="cardTypeSheetVisible" show-cancel :menus="cards" @on-click-menu="onChooseCardType"></actionsheet>
      <x-dialog v-model="showQrCode" class="dialog-demo" :hide-on-blur="true">
        <div style="padding:15px;">
          <qrcode :value="qrCodeStr" type="img"></qrcode>
        </div>
        <div @click="showQrCode=false">
          <span class="vux-close"></span>
        </div>
      </x-dialog>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions, mapMutations} from 'vuex'
  import {Swipeout, SwipeoutItem, SwipeoutButton,Radio,Qrcode,XDialog } from 'vux'
  import PopupTab from '../../../components/PopupTab'

  export default {
    computed: {
      ...mapState(["myCardList","memberList"]),
      validCardTypes:function(){
        let validCardTypes = this.$store.state.validCardType[this.funKey] || [];
        return validCardTypes ;
      },
      cardList1:function(){
        let _cardList=[]
        if(JSON.stringify(this.currMember)=='{}'&&JSON.stringify(this.currCardType)=='{}'){
          _cardList=this.myCardList
          return _cardList;
        }
        let riid = this.currMember.riid
        let cardtype = this.currCardType.cardtypeid
        this.myCardList.forEach((val,index)=>{
          if(riid&&cardtype){
            if(val.riid==riid&&val.cardtype==cardtype){
              _cardList.push(val)
            }
          }else if(riid&&!cardtype){
            if(val.riid==riid){
              _cardList.push(val)
            }
          }else if(!riid&&cardtype){
            if(val.cardtype==cardtype){
              _cardList.push(val)
            }
          }
        })
        return _cardList;
      }
    },
    watch:{

    },
    components:{
      Swipeout, SwipeoutItem, SwipeoutButton,Radio,PopupTab,Qrcode,XDialog
    },
    created() {
      this.reqMemberList();
      this.getCards({}).then((res)=>{
        this.cardList=res
      });
      this.reqValidCardType(this.funKey).then((res) => {
        let menus = res.reduce(function(preMenus, card){
          if(card.cardtypeid<6){
            preMenus[card.cardtypeid] = card.cardtype ;
          }
          return preMenus;
        }, {});
        this.cards=menus
      })
    },
    data() {
      return {
        cardTypeSheetVisible:false,
        currTab:'',
        currMember:{},
        currCardType:{},
        funKey:'GRZX',
        cards:[],
        cardList:[],
        qrCodeStr:'',
        showQrCode:false,
        cards:[
          {
            cardno:'123456',
            balance:'1.1'
          }
        ]
      }
    },
    methods: {
      ...mapActions(["deleteCard","reqMemberList","reqValidCardType","getCards"]),
      ...mapMutations([]),
      showQrCodeFun(item){
        event.stopPropagation();
        this.qrCodeStr=item.qrCode;
        this.showQrCode=true;
      },
      toMyCardInfo(item){
        this.$store.commit('updateSelectedCard', item)
        shareInst.client.push({
          path:'/myCardInfo'
        })
      },
      changeMember(item){
        this.currMember=item
        this.currTab=''
        // this.valiCardList();
      },
      changeCardType(item){
        this.currCardType=item
        this.currTab=''
        // this.valiCardList();
      },
      valiCardList(){
        if(JSON.stringify(this.currMember)=='{}'&&JSON.stringify(this.currCardType)=='{}'){
          this.cardList=this.myCardList
          return;
        }
        let riid = this.currMember.riid
        let cardtype = this.currCardType.cardtypeid
        let _cardList=[]
        this.myCardList.forEach((val,index)=>{
          if(riid&&cardtype){
            if(val.riid==riid&&val.cardtype==cardtype){
              _cardList.push(val)
            }
          }else if(riid&&!cardtype){
            if(val.riid==riid){
              _cardList.push(val)
            }
          }else if(!riid&&cardtype){
            if(val.cardtype==cardtype){
              _cardList.push(val)
            }
          }
        })
        this.cardList=_cardList
      },
      onChooseCardType(key,name){
        if(key=='cancel'){
          return;
        }
        this.addCard(key,name)
      },
      addCard(key,name) {
        if(this.memberList.length<=0){
          shareInst.client.push({
            path:'/addMember',
            query:{
              funKey:this.funKey,
              to:JSON.stringify({
                path: '/addCard',
                query: {
                  funKey: this.funKey,
                  isBuild:false,
                  cardType:key,
                  cardName:name,
                  to:-1
                }
              })
            }
          })
        }else{
          shareInst.client.push({
            path: '/addCard',
            query: {
              funKey: this.funKey,
              isBuild:false,
              cardType:key,
              cardName:name,
              isChooseMember:true,
              to:-1
            }
          });
        }
      },
      onDdeleteCard(item){
        let self=this
        this.$vux.confirm.show({
          title:'删除卡',
          content: '你确定要删除此卡吗？',
          confirmText:'删除',
          cancelText:'取消',
          onCancel () {
          },
          onConfirm () {
            self.deleteCard({
              riid: item.riid,
              pkcard: item.id
            }).then((res) => {
              self.$vux.toast.text('删除卡成功')
              self.getCards({}).then((res)=>{
                self.valiCardList()
              });
            })
          }
        })

      },
      addMember(){
        shareInst.client.push({
          path:'/addMember',
          query:{
            to:-1,
            funKey:this.funKey
          }
        })
      }
    }
  }
</script>
<style scoped>
  .btn-box{
    padding: 0px 20px;
  }
  .card-list-contain{
    margin-top: 50px;
  }
  .card-list-item {
    margin: 10px;
    background: #fff;
    border-radius: 3px;
    padding: 5px;
    display: block;
    overflow: hidden;
    border-radius: 4px;
  }

  .card-list-item:active {
    background: #f5f5f5;
  }

  .card-list-item img {
    float: left;
    vertical-align: middle;
    width: 2.4rem;
    margin-top: 5px;
  }

  .card-list-item-info {
    float: left;
    margin-left: 10px;
  }

  .card-list-item-bar {
    font-size: 12px;
    color: #BBBBBB;
  }

  .card-list-item-no {
    color: #333;
    margin-top: 3px;
  }
  .card-list-item-allbalance{
    position: absolute;
    right: 55px;
    top: 35px;
    font-size: 14px;
    color: #666;
  }
  .card-list-item-name{
    font-size: 16px;
    color: #4A4A4A;
  }
  .card-list-item-area {
    position: absolute;
    right: 55px;
    top: 10px;
  }
  .card-list-contain .mint-cell-title {
    display: none;
  }

  .card-list-contain .mint-cell-right {
    right: -1px;
  }

  .card-botton-wrap .mint-button--default {
    color: #656b79;
    background-color: #F4F4F4;
    box-shadow: none;
    border-bottom: 1px solid #D9D9D9;
    border-radius: 0;
    text-align: left;
  }
  .flex-box{
    pointer-events: none;
    position: absolute;
    width:100%;
    height: 100%;
    overflow: hidden;
    z-index: 10000;
  }
  .flex-tab-bar{
    border-bottom: 1px solid #D9D9D9;
    pointer-events: auto;
    overflow: hidden;
    background: white;
    position: relative;
    z-index: 10003;
  }
  .flex-item{
    float: left;
    padding: 10px;
    box-sizing: border-box;
    width: 50%;
    color: #343434;
    text-align: center;
  }
  .flex-item img{
    vertical-align: middle;
    width: 10px;
  }
  .flex-item .selected{
    color: #4768AB;
  }
  .popup-bg{
    pointer-events: auto;
    background: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    position: absolute;
    transition: opacity 400ms;
    opacity: 0;
    z-index: 9000;
  }
  .popup-content{
    pointer-events: auto;
    position: relative;
    z-index: 9001;
    transition-duration:300ms;
    top:-100%;
    max-height: 300px;
    overflow-y: auto;
  }
  .white-btn{
    background: white;
  }
  .white-btn:after{
    border:0;
  }
  .add-member-btn{
    background: white;
    border-top: 1px solid #ECECEC;
    text-align: center;
    padding: 10px;
  }
  .add-member-btn:active{
    background: #EFEFEF;
  }
  .add-member-btn img{
    width: 1rem;
    vertical-align: middle;
  }
  .popup-content-show{
    top:0;
  }
  .popup-bg-show{
    opacity: 1;
  }
  .swipeout-item{
    margin: 10px;
  }
  @keyframes popupIn {
    from {opacity: 0.3}
    to {opacity: 1}
  }
</style>
