<template>
  <div class="page">
    <view-box>
      <x-header slot="header">{{title}}</x-header>

      <group :gutter="0" v-if="routeName=='result'&&outpatientPayResult.bsstatus==1||outpatientPayResult.bsstatus==2">
        <cell>
          <span slot="icon">
            <x-icon slot="icon" type="ios-close" class="status-icon error"></x-icon>
          </span>
          <span slot="title">
            {{outpatientPayResult.bsstatus==1?'缴费失败':'缴费异常'}}
          </span>
          <span slot="inline-desc" class="status-desc">
            <span v-if="outpatientPayResult.payresult==3">退款会在3-7个工作日内原路返回至您的账户</span>
            <span v-if="outpatientPayResult.payresult==1||outpatientPayResult.payresult==4">退费请到收费窗口咨询办理</span>
          </span>
        </cell>
      </group>

      <div v-else>
        <tip-text-bar v-if="alreadyPayResult.bsstatus==0">
          如需发票、退票，请于就诊当天到收费窗口办理
        </tip-text-bar>
        <tip-text-bar v-if="alreadyPayResult.paytype==1||alreadyPayResult.paytype==4">
          退款请到医院收费窗口咨询办理
        </tip-text-bar>
        <tip-text-bar v-if="alreadyPayResult.paytype==3">
          退款会在3-7个工作日内原路退回至您的账户
        </tip-text-bar>
      </div>
      <div v-if="alreadyPayResult.bsstatus==0">
        <div class="success-code-bar"><!--缴费成功 -->
          <!--<div class="guide-bar"-->
               <!--v-if="alreadyPayResult.msdepart&&alreadyPayResult.msdetail&&alreadyPayResult.msqueueno">-->
            <!--请前往 <span class="guide-text">{{alreadyPayResult.msdepart}}</span> 的 <span-->
            <!--class="guide-text">{{alreadyPayResult.msdetail}}</span>（排队号：<span-->
            <!--class="guide-number">{{alreadyPayResult.msqueueno}}</span>）-->
          <!--</div>-->
          <div class="barcode">
            <div class="barcode-img">
				<barcode :value="alreadyPayResult.barcode" :options="{ displayValue: true,tag:'img',margin:0,width:48/alreadyPayResult.barcode.length,height:90 ,fontSize:22}"></barcode>
				<!-- <img :src="alreadyPayResult.barcode"> -->
            </div>
          </div>
          <div class="guide-bar" v-if="alreadyPayResult.msdepart">
            <!---->
            {{alreadyPayResult.msdepart}}
            <!--请前往 <span> [{{outpatientPayResult.msdepart}}]</span> - <span>[{{outpatientPayResult.msdetail}}]</span>-->
            <!--<p>排队号：<span>{{outpatientPayResult.msqueueno}}</span></p>-->
          </div>
        </div>
      </div>
      <div>

        <div class="card-info-plan">
          <div class="booking-result-plan">
            <div class="booking-result-header line-bottom">
              <div class="booking-result-info-bar">
                <span class="booking-result-info-title">订单号</span>
                <span class="booking-result-info-value">{{outpatientPayResult.orderno}}</span>
                <span class="status-text"
            :class="{'cost-item-status-success':alreadyPayResult.bsstatus==0,'cost-item-status-error':alreadyPayResult.bsstatus!=0}">{{payStatus(alreadyPayResult.paytype)}}</span>

              </div>
            </div>
            <div class="booking-result-body line-bottom">
              <div class="booking-result-info-bar" v-if="outpatientPayResult.receipt">
                <span class="booking-result-info-title">发票号</span>
                <span class="booking-result-info-value">{{outpatientPayResult.receipt}}</span>
              </div>
              <div class="booking-result-info-bar" v-if="outpatientPayResult.itemname">
                <span class="booking-result-info-title">项目</span>
                <span class="booking-result-info-value">{{outpatientPayResult.itemname}}</span>
              </div>
              <div class="booking-result-info-bar" v-if="outpatientPayResult.patientname && outpatientPayResult.hospitalname != '洛宁县人民医院'">
                <span class="booking-result-info-title">就诊人</span>
                <span class="booking-result-info-value">{{outpatientPayResult.patientname}}</span>
              </div>
              <div class="booking-result-info-bar" v-if="outpatientPayResult.hospitalname">
                <span class="booking-result-info-title">医院</span>
                <span class="booking-result-info-value">{{outpatientPayResult.hospitalname}}</span>
              </div>
              <div class="booking-result-info-bar" v-if="outpatientPayResult.doctorname">
                <span class="booking-result-info-title">接诊医生</span>
                <span class="booking-result-info-value">{{outpatientPayResult.doctorname}}</span>
              </div>
              <div class="booking-result-info-bar" v-if="outpatientPayResult.outpatientclinic">
                <span class="booking-result-info-title">门诊号</span>
                <span class="booking-result-info-value">{{outpatientPayResult.outpatientclinic}}</span>
              </div>
              <div class="booking-result-info-bar" v-if="outpatientPayResult.deptname">
                <span class="booking-result-info-title">就诊科室</span>
                <span class="booking-result-info-value">{{outpatientPayResult.deptname}}</span>
              </div>
              <div class="booking-result-info-bar" v-if="outpatientPayResult.createtime">
                <span class="booking-result-info-title">就诊日期</span>
                <span class="booking-result-info-value">{{outpatientPayResult.createtime}}</span>
              </div>
              <div class="booking-result-info-bar">
                <span class="booking-result-info-title">费用</span>
                <span class="booking-result-info-value" v-bind="{'money-error':routeName=='result'&&outpatientPayResult.bsstatus!=0}">￥{{outpatientPayResult.amount}}
                  <span v-if="routeName=='result'&&outpatientPayResult.payresult==3">（已自动申请退款）</span>
                </span>
              </div>
              <!--<div class="booking-info-bar">-->
                <!--<span class="booking-info-title">就诊卡号</span>-->
                <!--<span class="booking-info-value">{{cardno}}</span>-->
              <!--</div>-->

            </div>
          </div>
          <group :gutter="0" v-if="outpatientPayResult.hospitalname != '洛宁县人民医院'">
            <cell title="费用明细" is-link @click.native="toFeeDetail"></cell>
          </group>
        </div>


        <tip-text-bar v-if="routeName=='result'&&outpatientPayResult.payresult==1||outpatientPayResult.payresult==4">为不耽误您的就诊，可前往收费窗口缴费</tip-text-bar>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    computed: {
      ...mapState({
        alreadyPayResult: state => state.alreadyPayResult,
        outpatientPayResult: state => state.outpatientPayResult
      }),
      outid: function () {
        return this.$routeData.outid
      },
      riid: function () {
        return this.$routeData.riid
      },
      cardno: function () {
        return this.$routeData.cardno
      },
      routeName:function(){
        return this.$routeData.routeName
      },
      title:function(){
        return this.$routeData.title
      }
    },
    created() {
      this.getAlreadyPayResult({
        riid: this.riid,
        outid: this.outid
      })
    },
    data() {
      return {
        funKey: 'MZJF'
      }
    },
    methods: {
      ...mapActions(["getAlreadyPayResult"]),
      payStatus(payType) {//"缴费状态  1确认中;4缴费中 ;5已退款;6缴费失败;7缴费失败;8缴费成功;11已执行;12已退费"
//        let status = {1: '确认中', 4: '缴费中', 5: '已退款', 6: '缴费失败', 7: '缴费失败', 8: '缴费成功', 11: '已执行', 12: '已退费', 13: '缴费失败'}
        let status = {0: '支付成功', 1: '退款异常', 2: '支付异常', 3: '退款成功', 4: '退款失败'}
        return status[payType]
      },
      toFeeDetail() {
        shareInst.client.push({
          path: '/feeDetail'
        });
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

  }
  .barcode-img canvas,
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
