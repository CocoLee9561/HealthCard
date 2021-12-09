<template>
  <div class="page">
    <view-box>
      <x-header slot="header">充值记录</x-header>
      <div>

        <group :gutter="0">
          <cell title="支付金额">￥{{rechargeDetail.bsAmount}}</cell>
        </group>

        <group :gutter="10">
          <cell title="医院" :value="rechargeDetail.bsHospitalName"></cell>
          <cell title="姓名" :value="rechargeDetail.bsOwnerName"></cell>
          <cell title="卡号" :value="rechargeDetail.bsMedicalCard"></cell>
          <cell title="类型">充值</cell>
          <cell title="状态" :value="rechargeDetail.bsState==1?'成功':'失败'"></cell>
          <cell title="时间" :value="rechargeDetail.bsLastTime"></cell>
          <cell title="交易单号">{{rechargeDetail.bsOrderNo}}</cell>
          <!-- <cell title="充值方式" :value="detail.bsPerformedName"></cell> -->
        </group>

      </div>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    computed: {
      ...mapState(["rechargeDetail"]),
      orderno: function () {
        return this.$routeData.orderno
      },
      pkreghospital: function () {
        return this.$routeData.pkreghospital
      }
    },
    created() {
      this.getrechargedetail()
    },
    data() {
      return {}
    },
    methods: {
      ...mapActions(["getRechargeDetail"]),
      getrechargedetail() {
        let param = {
          orderno: this.orderno,
          pkreghospital: this.pkreghospital
        }
        this.getRechargeDetail(param);
      }
    }
  }
</script>
<style>

</style>
