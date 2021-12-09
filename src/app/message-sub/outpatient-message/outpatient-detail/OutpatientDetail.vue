<template>
  <div class="page">
    <view-box>
      <x-header slot="header">缴费详情</x-header>
      <group :gutter="0" v-if="outpatientMessageDetail.bsstatus==1||outpatientMessageDetail.bsstatus==2">
        <cell>
          <span slot="icon">
            <x-icon slot="icon" type="ios-close" class="status-icon error"></x-icon>
          </span>
          <span slot="title">
            {{outpatientMessageDetail.bsstatus==1?'缴费失败':'缴费异常'}}
          </span>
          <span slot="inline-desc" class="status-desc">
            <span v-if="outpatientMessageDetail.paytype==3">退款会在3-7个工作日内原路返回至您的账户</span>
            <span v-if="outpatientMessageDetail.paytype==1||outpatientMessageDetail.paytype==4">退费请到收费窗口咨询办理</span>
          </span>
        </cell>
      </group>

      <div v-else>
        <div class="tip-bar own-tip-bar" v-if="outpatientMessageDetail.bsstatus==0">
          <span slot="title">如需发票、退票，请于就诊当天到收费窗口办理</span>
        </div>
      </div>
      <div v-if="outpatientMessageDetail.bsstatus==0">
        <div class="success-code-bar"><!--缴费成功 -->
          <!--<div class="guide-bar"-->
          <!--v-if="alreadyPayResult.msdepart&&alreadyPayResult.msdetail&&alreadyPayResult.msqueueno">-->
          <!--请前往 <span class="guide-text">{{alreadyPayResult.msdepart}}</span> 的 <span-->
          <!--class="guide-text">{{alreadyPayResult.msdetail}}</span>（排队号：<span-->
          <!--class="guide-number">{{alreadyPayResult.msqueueno}}</span>）-->
          <!--</div>-->
          <div class="barcode" v-if="outpatientMessageDetail.barcode">
            <div class="barcode-img">
              <img :src="outpatientMessageDetail.barcode">
            </div>
          </div>
          <div class="guide-bar" v-if="outpatientMessageDetail.msdepart">
            <!---->
            {{outpatientMessageDetail.msdepart}}
            <!--请前往 <span> [{{outpatientPayResult.msdepart}}]</span> - <span>[{{outpatientPayResult.msdetail}}]</span>-->
            <!--<p>排队号：<span>{{outpatientPayResult.msqueueno}}</span></p>-->
          </div>
        </div>
      </div>
      <div>
        <group gutter="0">
          <!--<cell>
          <span slot="title">
            <span class="gray-label">单号</span>
            <span>{{outpatientPayResult.orderno}}</span>
          </span>
            <span>
            <span
              :class="{'cost-item-status-success':alreadyPayResult.paytype==8,'cost-item-status-error':alreadyPayResult.paytype == 6 || alreadyPayResult.paytype == 7}">{{payStatus(alreadyPayResult.paytype)}}</span>
          </span>
          </cell>-->
          <div>
            <div style="padding: 15px 10px;background: #fff;">
              <div class="booking-info-plan own-web-plan">
                <div class="booking-info-bar">
                  <span class="booking-info-title">订单号</span>
                  <span class="booking-info-value">{{outpatientMessageDetail.orderno}}</span>
                  <span class="status-text"
                        :class="{'cost-item-status-success':outpatientMessageDetail.bsstatus==0,'cost-item-status-error':outpatientMessageDetail.bsstatus!=0}">{{payStatus(outpatientMessageDetail.paytype)}}</span>

                </div>
                <div class="booking-info-bar" v-if="outpatientMessageDetail.receipt">
                  <span class="booking-info-title">发票号</span>
                  <span class="booking-info-value">{{outpatientMessageDetail.receipt}}</span>
                </div>
                <div class="booking-info-bar">
                  <span class="booking-info-title">项目</span>
                  <span class="booking-info-value">{{outpatientMessageDetail.itemname}}</span>
                </div>
                <div class="booking-info-bar">
                  <span class="booking-info-title">就诊人</span>
                  <span class="booking-info-value">{{outpatientMessageDetail.patientname}}</span>
                </div>
                <div class="booking-info-bar">
                  <span class="booking-info-title">医院</span>
                  <span class="booking-info-value">{{outpatientMessageDetail.hospitalname}}</span>
                </div>
                <div class="booking-info-bar">
                  <span class="booking-info-title">接诊医生</span>
                  <span class="booking-info-value">{{outpatientMessageDetail.doctorname}}</span>
                </div>
                <div class="booking-info-bar">
                  <span class="booking-info-title">就诊科室</span>
                  <span class="booking-info-value">{{outpatientMessageDetail.deptname}}</span>
                </div>
                <div class="booking-info-bar">
                  <span class="booking-info-title">就诊日期</span>
                  <span class="booking-info-value">{{outpatientMessageDetail.createtime}}</span>
                </div>
                <div class="booking-info-bar">
                  <span class="booking-info-title">费用</span>
                  <span class="booking-info-value" v-bind="{'money-error':outpatientMessageDetail.bsstatus!=0}">￥{{outpatientMessageDetail.amount}}
                    <span v-if="outpatientMessageDetail.paytype==3">（已自动申请退款）</span>
                  </span>
                </div>
                <!--<div class="booking-info-bar">-->
                <!--<span class="booking-info-title">就诊卡号</span>-->
                <!--<span class="booking-info-value">{{cardno}}</span>-->
                <!--</div>-->

              </div>
            </div>
          </div>
        </group>

        <!--<group>-->
          <!--<cell title="费用明细" is-link @click.native="toFeeDetail"></cell>-->
        <!--</group>-->
        <group>
        <div v-for="item in outpatientMessageDetail.detailslist">
          <cost-expend :item='item' v-on:expendAction='expend'></cost-expend>
        </div>
        </group>
        <cell class="select-card-page-cell" v-if="outpatientMessageDetail.paytype==1||outpatientMessageDetail.paytype==4">
          <span slot="title" class="select-card-page-tips">为不耽误您的就诊，可前往收费窗口缴费</span>
        </cell>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import CostExpend from '../../../components/CostExpend'
  export default {
    computed: {
      ...mapState(["outpatientMessageDetail"]),
    },
    components:{
      CostExpend
    },
    created() {

    },
    data() {
      return {}
    },
    methods: {
      ...mapActions([""]),
      payStatus(payType) {//"缴费状态  1确认中;4缴费中 ;5已退款;6缴费失败;7缴费失败;8缴费成功;11已执行;12已退费"
//        let status = {1: '确认中', 4: '缴费中', 5: '已退款', 6: '缴费失败', 7: '缴费失败', 8: '缴费成功', 11: '已执行', 12: '已退费', 13: '缴费失败'}
        let status = {0: '支付成功', 1: '退款异常', 2: '支付异常', 3: '退款成功', 4: '退款失败'}
        return status[payType]
      },
      toFeeDetail() {
        shareInst.client.push({
          path: '/feeDetail'
        });
      },
      expend(){

      }
    }
  }
</script>
<style scoped>
  .success-code-bar {
    margin-bottom: 10px;
  }

  .barcode {
    box-sizing: border-box;
    padding: 10px 15px;
    background-color: white;
    text-align: center;
    width: 100%;
  }

  .barcode-img {
    padding: 5px 0;
    height: 90px;
  }

  .barcode-img img {
    width: 100%;
    height: 90px;
  }

  .guide-bar {
    text-align: center;
    background: white;
    font-size: 14px;
    border-top:2px  dashed #fff;
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

  .gray-label {
    color: #bbb;
    margin-right: 5px;
  }

  .cost-item-status-success {
    color: #4B6BAF;
  }

  .cost-item-status-error {
    color: #bbb;
  }
  .status-text{
    float: right;
  }
  .status-desc{
    color: #A7A7A7;
  }
  .money-error{
    color: #FD6162;
  }
  .select-card-page-tips {
    font-size: 1rem;
    color: #999;
  }


  .select-card-page-cell:before {
    border-top: 1px solid #fff
  }

  .select-card-page-cell:after {
    border-bottom: 1px solid #fff
  }

  .booking-info-bar .booking-info-title{
    width: 60px;
  }
</style>
