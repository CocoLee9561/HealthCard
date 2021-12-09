<template>
  <div class="page">
    <view-box>
      <x-header slot="header">费用明细</x-header>
      <div class="fee-box">
        <div class="fee-detail-plan">
          <div class="fee-detail-text">费用明细</div>
          <div class="fee-detail-amount">￥{{pendingPayDetail.amount}}</div>
        </div>
      </div>
      <div>
        <cost-expend v-for="(item,index) in detailsList" :item='item' :key="index" v-on:expendAction='expend'></cost-expend>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions, mapGetters} from 'vuex'
  import CostExpend from '../../../../components/CostExpend'

  export default {
    computed: {
      ...mapState(["detailsList","pendingPayDetail"]),
    },
    components: {
      CostExpend
    },
    created() {
    },
    data() {
      return {}
    },
    methods: {
      ...mapActions([""]),
      expend(item) {

      }
    }
  }
</script>
<style lang="scss" scoped>
  .fee-box{
    background: white;
    padding: 16px;
    margin-bottom: 10px;
  }
  .fee-detail-plan{
    text-align: center;
    line-height: 1.3;
    height: 100px;
    box-shadow: 5px 5px 5px #eee;
    background: white;
    border-radius: 5px;
    box-sizing: border-box;
    background: linear-gradient(to right, #FCDFA7 ,#FCECCB, #FCDFA7);
    padding-top: 30px;
  }
  .fee-detail-text{
    color: $fontColor;
    font-size: 12px;
  }
  .fee-detail-amount{
    font-size: 28px;
    color: $fontColor;
    margin-right: 20px;
  }
</style>
