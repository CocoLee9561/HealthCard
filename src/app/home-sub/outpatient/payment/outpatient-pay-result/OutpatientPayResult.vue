<template>
  <div class="page">
    <view-box>
      <x-header :left-options="{preventGoBack:true}" @on-click-back="backHandle" slot="header">缴费结果</x-header>
      <div class='page-top'>
        <div>
          <group :gutter="10">
            <cell :is-link="!outpatientPayResult.isScan||outpatientPayResult.isScan!=1" @click.native="goResultDetail(outpatientPayResult)">
              <span slot="icon" class="merger-pay-result-icon">
                <x-icon v-if="outpatientPayResult.bsstatus==0" class="tip-icon-success" type="ios-checkmark"
                        size="25"></x-icon>
                <x-icon v-if="outpatientPayResult.bsstatus!=0" class="tip-icon-error" type="ios-close" size="25"></x-icon>
              </span>
              <span slot="title" class="pay-form-name">
                <span v-if="outpatientPayResult.bsstatus==0">缴费成功！</span>
                <span v-else-if="outpatientPayResult.bsstatus==1">缴费失败！</span>
                <span v-else>缴费异常！</span>
              </span>
            </cell>
          </group>
        </div>
        <!--<div class="key-value-box" v-if="outpatientPayResult.receipt">
          <div class="key-value-plan">
            <div class="key-value-bar">
              <span class="key-value-title">发票号</span>
              <span class="key-value-value">{{outpatientPayResult.receipt}}</span>
            </div>
            <div class="key-value-bar">
              <span class="key-value-title">金额</span>
              <span class="key-value-value">￥{{outpatientPayResult.amount}}</span>
            </div>
          </div>
        </div>-->
        <s class="pay-result-slipt"></s>
        <div class="booking-result-plan"><!--缴费成功 -->
          <div class="booking-result-info-bar" v-if="outpatientPayResult.receipt">
            <span class="booking-result-info-title">发票号</span>
            <span class="booking-result-info-value">{{outpatientPayResult.receipt}}</span>
          </div>
          <div class="booking-result-info-bar">
            <span class="booking-result-info-title">金额</span>
            <span class="booking-result-info-value">￥{{outpatientPayResult.amount}}</span>
          </div>
          <div v-if="outpatientPayResult.bsstatus==0">
            <div class="barcode">

              <div class="barcode-img">
				<barcode :value="outpatientPayResult.barcode" :options="{ displayValue: true,tag:'img',margin:0,width:48/outpatientPayResult.barcode.length,height:90 ,fontSize:22}"></barcode>
                <!-- <img :src="outpatientPayResult.barcode"></img> -->
              </div>
            </div>
            <div class="guide-bar" v-if="outpatientPayResult.msdepart">
              <!---->
              {{outpatientPayResult.msdepart}}
              <!--请前往 <span> [{{outpatientPayResult.msdepart}}]</span> - <span>[{{outpatientPayResult.msdetail}}]</span>-->
              <!--<p>排队号：<span>{{outpatientPayResult.msqueueno}}</span></p>-->
            </div>
          </div>
        </div>

        <div v-if="outpatientPayResult.bsstatus!=0"><!--缴费失败 -->
          <group>
            <cell class="tip-bar" v-if="payInfo.regPayType==4">
              <span slot="title">退款将返还至您的就诊卡余额账户</span>
            </cell>
            <cell class="tip-bar" v-if="payInfo.regPayType!=4&&outpatientPayResult.payresult==3">
              <span slot="title">退款一般会在<span style="color: #8BC393;">3-7</span>个工作日内返还至您的账户</span>
            </cell>
            <cell class="tip-bar" v-if="payInfo.regPayType!=4&&(outpatientPayResult.payresult==4||outpatientPayResult.payresult==1)">
              <span slot="title">退款请到挂号收费窗口咨询办理</span>
            </cell>
            <cell class="tip-bar">
              <span slot="title">为不耽误您的就诊，可前往收费窗口缴费</span>
            </cell>
          </group>
        </div>

      </div>
      <!--<div v-if="outpatientPayResult.bsstatus==0">


        <div class="pending-pay-plan" v-if="pendingPayList.length>0">
          <tip-text-bar slot="title">该就诊人还有 <span class="pending-pay-num">{{pendingPayList.length}}</span> 笔待支付费用</tip-text-bar>
          <div class="cost-item" v-for="item in pendingPayList" @click="toSinglePay(item)">
            <cell :title="item.itemname" is-link class="cost-item-bigtitle">
              <span class="cost-item-to-pay">去支付</span>
            </cell>
            <div class="cost-item-left">
              <div class="cost-item-sub-left">
                <div>
                  <span class="cost-item-info-title">单号</span>
                  <span class="cost-item-info-label">{{item.orderno}}</span>
                </div>
                <div>
                  <span class="cost-item-info-title">就诊科室</span>
                  <span class="cost-item-info-label">{{item.deptname}}</span>
                </div>
                <div>
                  <span class="cost-item-info-title">就诊医生</span>
                  <span class="cost-item-info-label">{{item.doctorname}}</span>
                </div>
                <div>
                  <span class="cost-item-info-title">时间</span>
                  <span class="cost-item-info-label">{{item.createtime}}</span>
                </div>
                <div>
                  <span class="cost-item-info-title">费用</span>
                  <span class="cost-item-info-label money">¥ {{item.amount}}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
        &lt;!&ndash;<group>
          <cell class="tip-bar">
            <span slot="title">祝早日康复</span>
          </cell>
        </group>&ndash;&gt;
      </div>-->
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import {Cell} from 'vux'

  export default {
    components: {Cell},
    computed: {
      ...mapState({
        outpatientPayResult: state => state.outpatientPayResult,
        hospitalInfo: state => state.hospitalInfo,
        pendingPayList: state => state.pendingPayList,
      }),
      cardInfo: function () {
        return this.$store.state.selectedCards[this.funKey];
      }
    },
    created() {
      if(!this.outpatientPayResult.isScan||this.outpatientPayResult.isScan!=1){
        this.getPendingPayData();
      }
    },
    data() {
      return {
        payInfo: JSON.parse(localStorage.getItem("pay-info")),
        funKey: 'MZJF'
      }
    },
    methods: {
      ...mapActions(["getPendingPayList"]),
      backHandle(){
        if(this.outpatientPayResult.regPayType==7){
//          shareInst.client.go(-2);
          shareInst.client.back("WXH5Pay")
        }else if(this.outpatientPayResult.regPayType==6&&!shareInst.client.isAliPay()){
          shareInst.client.back("Alipay")
        }else{
          shareInst.client.back();
        }
      },
      getPendingPayData() {
        this.getPendingPayList({
          cardno: this.cardInfo.cardno || this.outpatientPayResult.cardNo,
          cardtype: this.cardInfo.cardtype || this.outpatientPayResult.cardType,
          riid: this.cardInfo.riid || this.outpatientPayResult.riid,
          hospitalcode: this.hospitalInfo.hospitalcode || this.outpatientPayResult.hospitalcode
        });
      },
      toSinglePay(item) {
        shareInst.client.push({
          path: '/singlePay',
          query: {
            funKey: this.funKey,
            outid: item.outid
          }
        })
      },
      goResultDetail(item) {
        if(this.outpatientPayResult.isScan&&this.outpatientPayResult.isScan==1){
          return;
        }
        this.$store.commit('updateOutpatientPayResult', item)
        shareInst.client.push({
          path: '/outpatientDetail',
          query: {
            funKey: this.funKey,
            riid: this.cardInfo.riid,
            cardno: this.cardInfo.cardno,
            outid: item.outid,
            routeName: 'result',
            title: '缴费结果'
          }
        })
      },
    }
  }
</script>
<style scoped lang="scss">
  .tip-icon-success {
    float: left;
    fill: #00c901;
  }

  .tip-icon-error {
    float: left;
    fill: red;
  }

  .realname {
    color: #8BC34A;
  }

  .itemname {
    color: #8BC34A;
  }


  .key-value-box {
    padding: 15px 10px;
    background: #fff;
  }

  .key-value-plan {
    background: #FAFAF0;
    padding: 10px 15px;
    border-radius: 5px;
    font-size: 14px;
  }

  .key-value-bar {
    background: #fff;
    text-indent: 15px;
  }

  .key-value-bar .key-value-title {
    color: #444;
    text-align: left;
    width: 70px;
    margin-right: 10px;
    display: inline-block;
  }

  .barcode {
    box-sizing: border-box;
    padding: 10px 0px;
    background-color: white;
    text-align: center;
    width: 100%;
  }

  .barcode-img {
    padding: 5px 0;
  }
  .barcode-img canvas,
  .barcode-img img {
    width: 100%;
    height: 90px;
  }

  .guide-bar {
    text-align: center;
    background: #4B6BAF;
    font-size: 14px;
    color: #fff;
    padding: 10px 0;
    border-top: 2px dashed #fff;
  }

  .guide-text {
    color: #8BC393;
  }

  .guide-number {
    color: #FF984F;
  }

  .cost-item {
    background-color: white;
    padding: 0 0px 10px;
    position: relative;
    display: block;
    overflow: hidden;
    margin-bottom: 10px;

  }

  .cost-item:active {
    background: #F5F5F5;
  }

  .cost-item-left {
    margin:0 16px;
    padding-top: 5px;
    border-top: 1px dashed #ccc;
  }

  .cost-item-right {
    float: right;
  }


  .cost-item-right-money {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    color: #FF9800;
  }

  .cost-item-name {
    color: #bbb;
  }

  .cost-item-info-title {
    font-size: 14px;
    color: #bbb;
  }

  .cost-item-info-label {
    font-size: 14px;
  }

  .pending-pay-plan {
    margin-bottom: 30px;
    margin-top: 15px;
  }

  .own-tip-bar {
    box-sizing: border-box;
    padding: 5px;
    background: #FFF5E4;
    color: #F06A00;
    border-bottom: 0;
    opacity: 0.7;
  }

  .pay-form-name {
    color: #666;
  }

  .pay-form-text {
    color: #333;
  }

  .pay-result-slipt {
    display: block;
    border-top: 1px dashed #ccc;
    margin:0 16px 10px;
  }

  .merger-pay-result-icon {
    margin-right: 5px;
  }

  .cost-item-info-title {
    display: inline-block;
    width: 80px;
  }

  .cost-item-to-pay {
    color: $mainColor;
  }

  .cost-item-info-label.money {
    color: #FF4949;
  }

  .pending-pay-num {
    color: $mainColor;
  }

  .page-top {
    background: #fff;
  }

  .booking-result-info-bar{
    margin-left: 30px;
  }
</style>
