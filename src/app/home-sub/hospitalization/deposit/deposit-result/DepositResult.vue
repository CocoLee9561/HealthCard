<template>
  <div class="page">
    <view-box>
      <x-header :left-options="{preventGoBack:true}" @on-click-back="backHandle" slot="header">住院预交金</x-header>
      <div>
        <group gutter='0'>
          <cell>
          <span slot="icon">
            <x-icon class="tip-icon-success" type="ios-checkmark" size="25"
                    v-if="depositPayResult.bsstatus==0"></x-icon>
            <x-icon class="tip-icon-error" type="ios-close" size="25" v-if="depositPayResult.bsstatus!=0"></x-icon>
          </span>

            <span slot="title">
            <span v-if="depositPayResult.bsstatus==0">住院预交成功</span>
            <span v-else-if="depositPayResult.bsstatus==1">住院预交失败</span>
            <span v-else>住院预交异常</span>
          </span>
          </cell>
        </group>

        <div class="booking-result-plan">
          <div class="booking-result-header line-bottom">
            <div class="booking-result-info-bar">
              <span class="booking-result-info-title">补交信息</span>
            </div>
          </div>
          <div class="booking-result-body">
            <div class="booking-result-info-bar" v-if="depositPayResult.orderNo">
              <span class="booking-result-info-title">支付单号</span>
              <span class="booking-result-info-value">{{depositPayResult.orderNo}}</span>
            </div>
            <div class="booking-result-info-bar" v-if="depositPayResult.stayhospitalnum">
              <span class="booking-result-info-title">住院号</span>
              <span class="booking-result-info-value">{{depositPayResult.stayhospitalnum}}</span>
            </div>
            <div class="booking-result-info-bar">
              <span class="booking-result-info-title">预交金额</span>
              <span class="booking-result-info-value">￥{{depositPayResult.money}}</span>
            </div>
          </div>
          <group :gutter="0" v-if="depositPayResult.bsstatus==0">
            <x-table>
              <thead>
              <tr>
                <th>
                  <div>
                    <div class="deposit-title">预交金余额</div>
                    <div class="money-text deposit-money">￥{{depositPayResult.amountbalance}}</div>
                  </div>
                </th>
                <th>
                  <div @click="toDepositList">
                    <div class="deposit-title">预交金总额</div>
                    <div class="money-text deposit-money">￥{{depositPayResult.amount}}</div>
                  </div>
                </th>
              </tr>
              </thead>
            </x-table>
          </group>
        </div>

        <group>
          <cell class="tip-bar" v-if="depositPayResult.payresult==4">
            <img src="@icon/tip.png" slot="icon">
            <span slot="title">退款请到住院收费窗口咨询办理</span>
          </cell>
          <cell class="tip-bar" v-if="depositPayResult.payresult==3">
            <img src="@icon/tip.png" slot="icon">
            <span slot="title">退款一般会在<span style="color: #8BC393;">3-7</span>个工作日内返还至您的账户</span>
          </cell>
          <cell class="tip-bar" v-if="depositPayResult.payresult==2||depositPayResult.bsstatus==2">
            <img src="@icon/tip.png" slot="icon">
            <span slot="title">请到住院收费处咨询预交结果，或办理退款。</span>
          </cell>
        </group>
        <div class="btn-box">
          <x-button type="primary" class="own-btn" @click.native="backDetail()">返回住院详情</x-button>
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    computed: {
      ...mapState(["depositPayResult"]),
    },
    created() {

    },
    data() {
      return {}
    },
    methods: {
      ...mapActions([""]),
      backHandle(){
        if(this.depositPayResult.regPayType==7){
//          shareInst.client.go(-2);
          shareInst.client.back("WXH5Pay")
        }else if(this.depositPayResult.regPayType==6){
          shareInst.client.back("Alipay")
        }else{
          shareInst.client.back();
        }
      },
      backDetail() {
        if(this.depositPayResult.regPayType==7){
          shareInst.client.back("WXH5Pay",-2)
        }else if(this.depositPayResult.regPayType==6){
          shareInst.client.back("Alipay",-2)
        }else{
          shareInst.client.go(-2);
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  .tip-icon-success {
    float: left;
    fill: #00c901;
    margin-right: 5px;
  }

  .tip-icon-error {
    float: left;
    fill: red;
    margin-right: 5px;
  }

  .deposit-title {
    text-align: left;
    padding: 0px 10px;
    color: #bbb;
    font-size: 14px;
  }

  .deposit-money {
    font-size: 20px;
    color: $fontColor;
    margin-bottom: 10px;
  }

  .btn-box {
    padding: 20px;
  }
  .booking-result-plan{
    box-shadow: 5px 5px 5px #eee;
    margin:16px;
  }
</style>
