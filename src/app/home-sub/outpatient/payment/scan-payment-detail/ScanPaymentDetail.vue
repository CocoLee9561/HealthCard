<template>
  <div class="page">
    <view-box>
      <x-header slot="header">扫码付</x-header>
      <div>
        <div style="padding: 15px 16px;background: #fff;">
          <div class="booking-info-plan own-web-plan">
            <div class="booking-info-bar" v-if="scanPaymentDetail.businessid">
              <span class="booking-info-title">费用单号</span>
              <span class="booking-info-value">{{scanPaymentDetail.businessid}}</span>
            </div>
            <div class="booking-info-bar" v-if="scanPaymentDetail.body">
              <span class="booking-info-title">缴费项目</span>
              <span class="booking-info-value">{{scanPaymentDetail.body}}</span>
            </div>
            <div class="booking-info-bar" v-if="scanPaymentDetail.amount">
              <span class="booking-info-title">费用金额</span>
              <span class="booking-info-value">￥{{scanPaymentDetail.amount}}</span>
            </div>
            <div class="booking-info-bar" v-if="scanPaymentDetail.patientname">
              <span class="booking-info-title">就诊姓名</span>
              <span class="booking-info-value">{{scanPaymentDetail.patientname}}</span>
            </div>
            <div class="booking-info-bar" v-if="scanPaymentDetail.hospitalname">
              <span class="booking-info-title">收费医院</span>
              <span class="booking-info-value">{{scanPaymentDetail.hospitalname}}</span>
            </div>
            <div class="booking-info-bar" v-if="scanPaymentDetail.deptname">
              <span class="booking-info-title">收费科室</span>
              <span class="booking-info-value">{{scanPaymentDetail.deptname}}</span>
            </div>
            <div class="booking-info-bar" v-if="scanPaymentDetail.doctorname">
              <span class="booking-info-title">开单医生</span>
              <span class="booking-info-value">{{scanPaymentDetail.doctorname}}</span>
            </div>
            <div class="booking-info-bar" v-if="scanPaymentDetail.createtime">
              <span class="booking-info-title">更新时间</span>
              <span class="booking-info-value">{{scanPaymentDetail.createtime}}</span>
            </div>
          </div>
        </div>

        <group>
          <div v-for="item in scanPaymentDetail.detailslist">
            <cost-expend :item='item'></cost-expend>
          </div>
        </group>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import CostExpend from '../../../../components/CostExpend'
  export default {
    computed: {
      ...mapState(["scanPaymentDetail"]),
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
    }
  }
</script>
<style>

</style>
