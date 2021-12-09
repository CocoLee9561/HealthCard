<template>
  <div class="page">
    <view-box>
      <x-header :left-options="{preventGoBack:true}" @on-click-back="backHandle" slot="header">缴费结果</x-header>
      <group :gutter="10" v-for="(item,index) in outpatientPayResults" :key="index">
        <cell is-link @click.native="toPayResult(item)">
        <span slot="icon" class="merger-pay-result-icon">
          <x-icon class="tip-icon-success" type="ios-checkmark" size="25" v-if="item.bsstatus==0"></x-icon>
          <x-icon class="tip-icon-error" type="ios-close" size="25" v-if="item.bsstatus!=0"></x-icon>
        </span>

          <span slot="title" class="merger-pay-title">
          <span v-if="item.bsstatus==0">缴费成功</span>
          <span v-else-if="item.bsstatus==1">缴费失败</span>
          <span v-else>缴费异常</span>
        </span>
        </cell>
      </group>
      <!--<div>
        <div class="pending-pay-plan" v-if="pendingPayList.length>0">

          <tip-text-bar slot="title">该就诊人还有 <span class="pending-pay-num">{{pendingPayList.length}}</span> 笔待支付费用</tip-text-bar>

          <div class="cost-item" v-for="item in pendingPayList" @click="toSinglePay(item)">
            <cell :title="item.itemname" is-link>
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
        <group>
          <cell class="tip-bar">
            <span slot="title">祝早日康复</span>
          </cell>
        </group>
      </div>-->
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    computed: {
      ...mapState({
        outpatientPayResults: state => state.outpatientPayResults,
        hospitalInfo: state => state.hospital.current,
        pendingPayList: state => state.pendingPayList,
      }),
      cardInfo: function () {
        return this.$store.state.selectedCards[this.funKey];
      }
    },
    created() {
      if(this.outpatientPayResults.length>0&&(!this.outpatientPayResults[0].isScan||this.outpatientPayResults[0].isScan!=1)){
        this.getPendingPayData()
      }
    },
    data() {
      return {
        funKey: 'MZJF'
      }
    },
    methods: {
      ...mapActions(["getPendingPayList","getPendingPayDetail"]),
      backHandle(){
        if(this.outpatientPayResults.length>0&&this.outpatientPayResults[0].regPayType==7){
//          shareInst.client.go(-2);
          shareInst.client.back("WXH5Pay")
        }else if(this.outpatientPayResults.length>0&&this.outpatientPayResults[0].regPayType==6&&!shareInst.client.isAliPay()){
          shareInst.client.back("Alipay")
        }else{
          shareInst.client.back();
        }
      },
      getPendingPayData() {
        this.getPendingPayList({
          cardno: this.cardInfo.cardno,
          cardtype: this.cardInfo.cardtype,
          riid: this.cardInfo.riid,
          hospitalcode: this.hospitalInfo.hospitalcode
        });
      },
      toPayResult(item) {
        this.$store.commit('updateOutpatientPayResult', item)
        shareInst.client.push({
          path: '/outpatientPayResult'
        })
      },
      loadPendingPayDetail(outids){
        this.getPendingPayDetail({
          riid: this.cardInfo.riid,
          outids: outids,
          outtype: 0,
          hospitalcode: this.hospitalInfo.hospitalcode
        });
      },
      toSinglePay(item) {
//        this.loadPendingPayDetail(item.outid)
        shareInst.client.push({
          path: '/singlePay',
          query: {
            funKey: 'MZJF',
            outid: item.outid
          }
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  .tip-icon-success {
    float: left;
    fill: #00c901;
    margin-left: -2px;
  }

  .tip-icon-error {
    float: left;
    fill: red;
    margin-left: 5px;
  }

  .merger-pay-title {
    color: #555;
    margin-left: 8px;
  }

  .merger-pay-result-icon {

  }

  .realname,
  .itemname {
    color: $mainColor;
    font-weight: 500;
  }

  .pending-pay-num {
    color: $mainColor;
  }

  .cost-item {
    background-color: white;
    padding: 0px 0;
    position: relative;
    display: block;
    overflow: hidden;
    margin-bottom: 10px;
  }

  .cost-item:active {
    background: #F5F5F5;
  }

  .cost-item-left {
    /*float: left;*/
    margin: 0px 16px;
    padding: 10px 0;
    border-top:1px dashed #ccc;
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
    color: #FF4949;
  }

  .cost-item-name {
    color: #bbb;
  }

  .cost-item-info-title {
    font-size: 14px;
    color: #bbb;
    display: inline-block;
    width: 80px;
  }

  .cost-item-info-label {
    font-size: 14px;
  }

  .cost-item-info-label.money {
    color: #FF4949;
  }

  .pending-pay-plan {
    margin-bottom: 30px;
    margin-top: 10px;
  }

  .merger-pay-result-tip .tip-bar {
    color: #666;
    border-bottom: 1px solid #f7f7f7;
  }

  .cost-item-to-pay {
    color: $mainColor;
  }

  .cost-item .weui-cell_access .weui-cell__ft:after {
    border-color: $mainColor !important;
  }
</style>
