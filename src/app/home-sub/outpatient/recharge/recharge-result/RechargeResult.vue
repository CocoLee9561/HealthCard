<template>
  <div class="page">
    <view-box>
      <x-header :left-options="{preventGoBack:true}" @on-click-back="backHandle" slot="header">门诊充值</x-header>

      <group :gutter="0">
        <cell v-if="rechargeResult.bsstatus==0"><!---->
          <x-icon slot="icon" class="tip-icon-success pay-result-icon" type="ios-checkmark" size="25"></x-icon>
          <span slot="title"><strong class="name">{{rechargeResult.memberName}}</strong>的门诊充值成功</span>
        </cell>
        <cell v-else-if="rechargeResult.bsstatus==1"><!---->
          <x-icon slot="icon" class="tip-icon-error pay-result-icon" type="ios-close" size="25"></x-icon>
          <span slot="title"><strong class="name">{{rechargeResult.memberName}}</strong>的门诊充值失败</span>
        </cell>
        <cell v-else><!---->
          <x-icon slot="icon" class="tip-icon-error pay-result-icon" type="ios-close" size="25"></x-icon>
          <span slot="title"><strong class="name">{{rechargeResult.memberName}}</strong>的门诊充值异常</span>
        </cell>
        <!--<cell-form-preview :list="payDataList"></cell-form-preview>-->
      </group>

      <div class="booking-result-plan">
        <div class="booking-result-header line-bottom">
          <div class="booking-result-info-bar">
            <span class="booking-result-info-title">就诊人</span>
            <span class="booking-result-info-value">{{rechargeResult.memberName}}</span>
          </div>
        </div>
        <div class="booking-result-body">
          <div class="booking-result-info-bar">
            <span class="booking-result-info-title">就诊卡号</span>
            <span class="booking-result-info-value">{{rechargeResult.cardNo}}</span>
          </div>
          <div class="booking-result-info-bar">
            <span class="booking-result-info-title">支付金额</span>
            <span class="booking-result-info-value">¥ {{rechargeResult.rechargeamount}}</span>
          </div>
          <div class="booking-result-info-bar">
            <span class="booking-result-info-title">支付方式</span>
            <span class="booking-result-info-value">{{rechargeResult.payTypeName}}</span>
          </div>
          <div class="booking-result-info-bar">
            <span class="booking-result-info-title">支付状态</span>
            <span class="booking-result-info-value" v-if="rechargeResult.payresult==2">支付异常（无法在线确认支付结果）</span>
            <span class="booking-result-info-value" v-else>支付成功</span>
          </div>
          <div class="booking-result-info-bar">
            <span class="booking-result-info-title">支付单号</span>
            <span class="booking-result-info-value">{{rechargeResult.bsorderno}}</span>
          </div>
          <div class="booking-result-info-bar" v-if="rechargeResult.createtime">
            <span class="booking-result-info-title">支付时间</span>
            <span class="booking-result-info-value">{{rechargeResult.createtime}}</span>
          </div>
          <div class="booking-result-info-bar"
               v-if="rechargeResult.payresult==1||rechargeResult.payresult==3||rechargeResult.payresult==4">
            <span class="booking-result-info-title">退款状态</span>
            <span class="booking-result-info-value" v-if="rechargeResult.payresult==3">退款成功</span>
            <span class="booking-result-info-value" v-else-if="rechargeResult.payresult==4">线上退款失败</span>
            <span class="booking-result-info-value" v-else>退款异常（无法在线确认退款结果）</span>
          </div>
        </div>
        <div class="recharge-result-group line-top" >
          <table style="background: #fff">
            <tr>
              <td style="border-right:#dfdfdf solid 1px;">
                <span>充值金额</span>
                <p>￥{{rechargeResult.rechargeamount}}</p>
              </td>
              <td><span>当前余额</span>
                <p>￥{{allbalance}}</p>
              </td>
            </tr>
          </table>

        </div>
      </div>

      <tip-text-bar v-if="rechargeResult.payresult==2">
        无法在线确认充值结果，请到医院收费窗口咨询确认，或办理退款。
      </tip-text-bar>
      <tip-text-bar v-if="rechargeResult.payresult==3">
        退款一般会在<span style="color: #FF2F4C;">3-7</span>个工作日内返还至您的账户
      </tip-text-bar>
      <tip-text-bar v-if="rechargeResult.payresult==1||rechargeResult.payresult==4">
        退款请到医院收费窗口咨询办理
      </tip-text-bar>
      <!--<tip-text-bar v-if="rechargeResult.payresult!=0">-->
        <!--为不耽误您的就诊，可前往自助机或人工窗口充值-->
      <!--</tip-text-bar>-->

      <div style="padding: 10px;margin-top:10px;"><!--v-if="rechargeResult.payresult==0"-->
        <x-button type="primary" @click.native="backHandle()" class="own-btn">返回</x-button>
      </div>


    </view-box>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import {payinfo} from '@network/Api'

  export default {
    name: "RechargeResult",
    created() {
      this.payinfo({
        riid: this.selectedMember.riid,
        cardno: this.rechargeResult.cardNo,
        cardtype: this.rechargeResult.cardType,
        hospitalcode: this.rechargeResult.hospitalcode,
        pkreghospital: this.rechargeResult.pkregHospitalId
      })
    },
    computed: {
      ...mapState({
        rechargeResult: state => state.rechargeResult,
        selectedMember:state=>state.selectedMember,
        allbalance: state => state.allbalance
      }),
      payDataList: function () {
        //支付数据
        return [{
          label: 'Apple',
          value: '3.29'
        }, {
          label: 'Banana',
          value: '1.04'
        }, {
          label: 'Fish',
          value: '8.00'
        }];
      }
    },
    methods: {
      ...mapActions(["payinfo"]),
      back() {
        shareInst.client.back();
      },
      backHandle(){
        if(this.rechargeResult.regPayType==7){
//          shareInst.client.go(-2);
          shareInst.client.back("WXH5Pay")
        }else if(this.rechargeResult.regPayType==6){
          shareInst.client.back("Alipay")
        }else{
          shareInst.client.back();
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  .pay-result-icon {
    width: 1.2rem;
    margin-right: 0.8rem;
    position: relative;
    top: 4px;
  }
  .tip-icon-success {
    fill: #00c901;
  }

  .tip-icon-error {
    fill: red;
  }
  .booking-info-wrap {
    margin-top: 15px;
    padding: 16px;
    background: #ffffff;
  }

  .booking-info-plan {
    background: #F3F6FC;
  }

  .recharge-result-group table {
    width: 100%;

  }

  .recharge-result-group .vux-table:after {
    border-right: 0;
    border-left: 0;
    border-top: 0;
    border-bottom: 0;
  }

  .recharge-result-group td {
    color: #666;
    font-size: 13px;
    text-align: left;
    text-indent: 10px;
    line-height: 2;
    padding: 10px 0px;
  }

  .recharge-result-group td span {

  }

  .recharge-result-group td p {
    font-size: 20px;
    color: $fontColor;
  }
  .booking-result-plan{
    box-shadow: 5px 5px 5px #eee;
    margin:16px;
  }
</style>
