<template>
  <div class="page">
    <view-box>
      <x-header slot="header" :showBack="showBack">{{title}}</x-header>
      <!--提示-->
      <group class="select-card-page-group" gutter="0">
        <cell>
          <span slot="title" class="select-card-page-tips">请选择 <strong class="name">{{isChangePatient==1?tempSelectedMember.realname:selectedMember.realname}}</strong> 所用的 <strong
            class="card-name">{{validCardTypeNameStr}}</strong> </span>
        </cell>
        <cell-box>
          <select-card :need-sort="needSort" :fun-key="funKey" @on-change="changeCard"  @valid-card-types="setValidCardTypes"></select-card>
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
  import SelectCard from '../select-card/SelectCard'
  import {mapState} from 'vuex'
  import {funModules} from '@constant.js'

  export default {
    name: "SelectCardPage",
    components: {
      SelectCard: SelectCard
    },

    data: function () {
      return {
        validCardTypes: [],
        currCard:'',
        isChangePatient:sessionStorage.getItem('updateChangePatient'),
        needSort:false,
      };
    },
    created() {
      //  判断医院 是否需要身份证排序
      let clientId = shareData.clientId || this.$store.state.hospital.current.clientId ;
      this.needSort = clientId == "S-230100-52953";

    },

    computed: {
      ...mapState(["selectedMember","tempSelectedMember"]),
      title: function () {
        let routeData = this.$routeData;
        let funMod = funModules[routeData.funKey];
        let title = routeData.title || (funMod && funMod.name ) ;
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

    },
    methods: {
      selectCard: function (card) {
        if(!this.currCard){
          this.$vux.toast.text('请选中卡')
        }else{
          let payload = {
            funKey:this.funKey,
            card:this.currCard
          };
          this.$store.commit("selectCard", payload);

          let nextRoute = this.$routeData.to || {};
          this.$store.commit('updateTabSelected',0)
          this.$store.commit('updateIsNewPage', true);
          if(this.isChangePatient==1){
            this.$store.commit("selectMember", this.tempSelectedMember);
          }
          this.$store.commit('updateCardIsNewPage', false);
          this.$store.commit('updateReportStartDate','')
          this.$store.commit('updateReportEndDate','')
          this.$store.commit('updateReportDateType',1)
          sessionStorage.setItem('updateChangePatient',0)
          shareInst.client.pushWithData(nextRoute);
        }
      },
      changeCard(card){
        this.currCard=card
      },
      setValidCardTypes: function (validCardTypes) {
        this.validCardTypes = validCardTypes;
      }
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
</style>
