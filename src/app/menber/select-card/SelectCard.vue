<template>
  <div style="width: 100%;">
    <checker class="card-list" type="radio" v-model="selectedCard" default-item-class="default"
             selected-item-class="selected">
      <checker-item class="card" v-for="(card, index) in busiCardList" :value="card" :key="index">
        <p class="name">{{card.cardTypeName}}</p>
        <p class="cardno">{{formatCardNo(card.cardno)}}</p>
        <p class="cardtime" v-if="card.createtime">绑卡日期  {{card.createtime}}</p>
      </checker-item>
    </checker>

   	<mt-button @click.native="addCardHandle" class="card-select-btn" size="large" v-if="showAddCard">
      <img class="btn-img" slot="icon" src="@icon/icon_add.png">
     		 添加卡
    </mt-button>


    <actionsheet v-model="showSheet"  @on-click-menu="seletCardTypeHandle" :menus="sheetMenus"></actionsheet>
  </div>
</template>

<script>

  import {mapState,mapGetters,mapActions} from 'vuex'
  import {hospitalInfo} from '../../../common/network/Api'

  export default {
    name: "SelectCard",
    props:["funKey","needSort"],
    data:function(){
      return {
        showSheet:false
      };
    },
    computed: {
      ...mapState({
        selectedCardList:state=>state.selectedCards,
        cardList:state=>state.cardList,
        hospitalInfo: state => state.hospital.current,
        selectedMember:state=>state.selectedMember,
        tempSelectedMember:state=>state.tempSelectedMember,
        isNewPage:state=>state.isNewPage,
        isCardNewPage:state=>state.isCardNewPage
      }),
//      ...mapGetters(["cardList"]),
      busiCardList: function(
      )  {
        console.log("1")
        let bcl = this.$store.state.busiCardList;
        let finalBCl = bcl;






        if  (this.needSort){
          finalBCl = [];

          bcl.forEach( (item,index)=> {

            if( item.cardtype == 6 ){
              //  判断如果是身份证号 则从后面添加
              finalBCl.push(item);
            }else {
              //  判断如果不是身份证号 则从前面添加
              finalBCl.unshift(item);
            }

          });
        }


        console.log(finalBCl)
        return finalBCl;


      },
      validCardTypes:function(){
        let validCardTypes = this.$store.state.validCardType[this.funKey] || [];
        return validCardTypes ;
      },
      validCardList:function(){
        let validCards = this.cardList.filter(function (card) {

          let testType = card.cardtype ;

          let isValid = this.validCardTypes.some(function (cardTypeInfo) {
            return cardTypeInfo.cardtypeid == testType ;
          });

          return isValid ;
        },this);

        return validCards ;
      },

      selectedCard:{
        get:function () {
          let funKey = this.funKey;
          let selected = this.selectedCardList[funKey];
          let pkcard = selected && selected.pkcard ;
          let a = {}
          if (this.busiCardList && this.busiCardList.length ==1  && this.hospitalInfo.hospitalcode === '18452'){
            console.log("aaa")
            a = this.busiCardList[0];
          }else if(this.busiCardList){
            a = this.busiCardList.find(function (card) {
              return pkcard == card.pkcard ;
            });
          }
          this.$emit("on-change", a);
          return a;
        },
        set:function (card) {

//          let payload = {
//            funKey:this.funKey,
//            card:card
//          };
//
//          this.$store.commit("selectCard", payload);
          this.$emit("on-change", card);
        }
      },
      sheetMenus:function () {

        let menus = this.validCardTypes.reduce(function(preMenus, card){
          if(card.cardtypeid<6){
            preMenus[card.cardtypeid] = card.cardtype ;
          }
          return preMenus;
        }, {});

        return menus;
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
      showAddCard:function(){
        if(!this.sheetMenus||JSON.stringify(this.sheetMenus)=='{}'){
          return false;
        }
        let isShow = true
        return isShow;
      }
    },
    watch:{
      validCardTypes:function (val) {
        this.$emit("valid-card-types",val);
      }
    },
    created:function(){

       this.reqValidCardType(this.funKey);
       this.loadCardList();
    },
    methods: {
      ...mapActions(["reqValidCardType","getCardInfo","getAlreadyCard","onLineBuildRecord"]),
      loadCardList() {
        let isChangePatient = sessionStorage.getItem('updateChangePatient');
        let curMember=isChangePatient==1?this.tempSelectedMember:this.selectedMember

        let param = {
          hospitalcode: this.hospitalInfo ? this.hospitalInfo.hospitalcode : '',
          busi: this.funKey,
          riid: curMember.riid
        }
        this.getCardInfo(param).then((res)=>{
          if(this.isCardNewPage){//this.hospitalInfo.isRecordOnline==1&&
            let self=this;

            if(res.cardlist.length==0){

              this.getAlreadyCard({
                riid:curMember.riid,
                hospitalcode:this.hospitalInfo.hospitalcode,
                name:curMember.realname,
                cid:curMember.cid||curMember.guardiancardno,
                mobile:curMember.mobile,
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
      addCardHandle:function () {

        if (this.$listeners["add-card"]){
          this.emit("add-card",this.validCardList);
        }else {
          this.showSheet = true;
        }

      },
      formatCardNo(cardno){
        if(cardno&&cardno.length>8){
          return cardno.substring(0,4)+'****'+cardno.substr(cardno.length-4);
        }else{
          return cardno;
        }
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
      seletCardTypeHandle:function (type,name) {
        let nextRoute = this.$routeData.to;
        shareInst.client.push({
          name:"AddCard",
          query:{
            cardType:type,
            cardName:name,
            funKey:this.funKey,
            isBuild:this.isOnLineBuild(),
            to:(this.funKey=='GRZX'||this.funKey=='DRGH'||this.funKey=='YYGH')?-1:JSON.stringify(nextRoute)
          }
        });
      },
    }
  }
</script>

<style lang="scss" scoped>

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
      flex-basis: 48%;
      border:2px solid #D9D9D9;
      border-radius:2px;
			padding:9px 10px 5px ;
			margin-top:15px;
			min-width:5rem;
      box-sizing: border-box;
      .name {
					font-size: 13px;
					color:#999;
      }

      .cardno {
					font-size: 1.2rem;
					color:#666;
					line-height: 1.6;
      }

			.cardtime{
				font-size: 11px;
				color:#bbb;
			}
    }

    .selected{
    	border:2px solid $mainColor;
    }
    .card:nth-child(odd){
    	margin-right: 4%;
    }

  }

  .btn-img {
    width: 16px;
    height: 16px;
    margin-right: 6px;
  }
	.slider{
        width: 100%;
        height:200px;
        position: relative;
         user-select: none;
        .content{
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background:green;
            z-index: 100;
            transition: 0.3s;

        }
        .remove{
            position: absolute;
            width:200px;
            height:200px;
            background:red;
            right: 0;
            top: 0;
            color:#fff;
            text-align: center;
            font-size: 40px;
            line-height: 200px;
        }
    }

    .card-select-btn{
    	margin-top: 15px;
	    background: #fff;
	    border: 1px #ccc;
	    border-style: dashed;
	    box-shadow: none;
	    padding:0 10px;
    }
</style>
