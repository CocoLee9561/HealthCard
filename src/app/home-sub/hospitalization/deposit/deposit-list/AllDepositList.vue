<template>
  <div class="page">
    <view-box>
      <x-header slot="header">预交记录</x-header>
      <div v-if="depositList.length>0">
        <group class="line-bottom">
          <cell>
            <strong class="cell-title" slot="title">预交金总额</strong>
            <span class="money-text">￥{{totalDeposit}}</span>
          </cell>
        </group>
        <group gutter="0">
          <div class="deposit-list-li line-bottom" v-for="(item,index) in depositList" :key="index">
          <span>
            <p>
            	<!--<span>{{item.paytime}}</span>-->
            	<span class="out-fee">{{item.paytype}}</span>
            	<span class="out-fee" v-if="item.payres==3">（已退）</span>
            	<span class="error-fee" v-if="item.payres==2">（异常）</span>
            </p>
            <p class="deposit-list-date">{{item.paytime}}</p>
          </span>
            <span class="deposit-right">￥{{item.amount}}</span>
          </div>
        </group>

      </div>
      <div v-else>
        <div class="vux-center empty-page" style="height: 500px;">
          暂无预交记录
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    computed: {
      ...mapState({
        hospitalInfo: state => state.hospital.current,
        totalDeposit: state => state.totalDeposit,
        depositList: state => state.depositList,
        selectedMember: state => state.selectedMember,
      }),
      cardInfo: function () {
        return this.$store.state.selectedCards[this.funKey];
      },
      funKey: function () {
        return this.$routeData.funKey;
      }
    },
    created() {
      this.getDepositList({
        hospitalcode: this.hospitalInfo.hospitalcode,
        stayhospitalnum: this.cardInfo.cardno,
        cardtype: this.cardInfo.cardtype,
        starttime: '',
        endtime: '',
        riid:this.selectedMember.riid
      })
    },
    data() {
      return {}
    },
    methods: {
      ...mapActions(["getDepositList"]),
    }
  }
</script>
<style scoped lang="scss">

  .inflag {
    color: #FF5722;
    border: 1px solid #FF5722;
  }

  .days {
    color: #FF9800;
  }

  .right-text {
    float: right;
  }

  .money-text {
    color: #FF9800;
  }

  .cell-title {
    /*font-size: 16px;*/
  }

  .out-fee {

  }

  .error-fee {
    color: #f43530;
  }

  .hosptalidation-deposit-plan {
    background: #F3F6FC;
  }

  .deposit-right {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 16px;
    font-size: 16px;
  }

  .deposit-list-li {
    padding: 8px 16px;
    position: relative;
  }

  .deposit-list-li p {
    font-size: 15px;
    color: #333;
    line-height: 1.8;
  }

  .deposit-list-li .deposit-list-date {
    color: #999;
    font-size: 12px;
  }

  .hospitalization-status-text {
    color: $fontColor;
    border: 0;
    font-size: 14px;
    padding: 0px;
  }

  .inflag {
    color: $mainColor;
    border: 0;
  }

  .card-plan{
    margin: 16px;
    box-shadow: 5px 5px 5px #ccc;
    .card-top{
      background: $mainColor;
      padding: 10px 16px;
      display: flex;
      color: white;
      img{
        width: 50px;
        height: 50px;
        vertical-align: middle;
        border-radius: 50%;
      }
      .card-info{
        margin-left: 10px;
        .label{
          width: 60px;
          display: inline-block;
        }
        .realname{

        }
        .cardno{
          margin-top: 5px;
          font-size: 14px;
        }
      }
    }
  }
</style>
