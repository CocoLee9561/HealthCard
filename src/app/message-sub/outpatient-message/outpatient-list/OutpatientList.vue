<template>
  <div class="page">
    <view-box>
      <x-header slot="header">门诊缴费</x-header>
      <div v-if="outpatientMessageList.length>0">
        <div class="cost-item cost-item2" v-for="item in outpatientMessageList" @click="toDetail(item)">
          <div class="cost-item-right">
              <span class="cost-item-status"
                    :class="{'cost-item-status-success':item.bsstatus==0,'cost-item-status-error':item.bsstatus == 1 || item.bsstatus == 2}">{{statusText(item.bsstatus)}}</span>
          </div>
          <div class="cost-item-header">
            <span>{{item.itemname}}</span>
          </div>
          <div class="cost-item-center ">
            <div>
              <span class="cost-item-info-title">单号</span>
              <span class="cost-item-info-label">{{item.orderno}}</span>
            </div>
            <div>
              <span class="cost-item-info-title">科室</span>
              <span class="cost-item-info-label">{{item.deptname}}</span>
            </div>
            <div>
              <span class="cost-item-info-title">医生</span>
              <span class="cost-item-info-label">{{item.doctorname}}</span>
            </div>
            <div>
              <span class="cost-item-info-title">时间</span>
              <span class="cost-item-info-label">{{item.createtime}}</span>
            </div>
            <div>
              <span class="cost-item-info-title">费用</span>
              <span class="cost-item-info-label money">{{item.amount}}</span>
            </div>
          </div>

        </div>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    computed: {
      ...mapState(["outpatientMessageList"]),
      orderno:function(){
        return this.$routeData.orderno
      }
    },
    created() {
      this.getWxOutPayList({orderno:this.orderno})
    },
    data() {
      return {}
    },
    methods: {
      ...mapActions(["getWxOutPayList"]),
      payStatus(payType) {
        // 0 支付成功 1退款异常 2支付异常 3退款成功 4退款失败
        let status = {0: '支付成功', 1: '退款异常', 2: '支付异常', 3: '退款成功', 4: '退款失败'}
        return status[payType]
      },
      statusText(bsStatus){
        let status = {0: '缴费成功', 1: '缴费失败', 2: '缴费异常'}
        return status[bsStatus]
      },
      toDetail(item){
        this.$store.commit('updateOutpatientMessageDetail',item)
        shareInst.client.push({
          path:'/message/outpatientDetail'
        })
      }
    }
  }
</script>
<style scoped>
  .cost-item {
    background-color: white;
    padding: 10px 0;
    position: relative;
    display: block;
    overflow: hidden;
    margin-bottom: 15px;
  }

  .cost-item:active {
    background: #F5F5F5;
  }

  .cost-item-left-check {
    align-items: center;
    position: absolute;
    top: 15%;
    transform: translateY(-50%);
  }

  .cost-item-left {
    float: left;
  }

  .cost-item-center {
    box-sizing: border-box;
    float: left;
    width: 100%;
    padding-left: 40px;
  }

  .cost-item-right {
    float: right;
  }

  .cost-item-right-money {
    position: absolute;
    right: 10px;
    top: 15%;
    transform: translateY(-50%);
    font-size: 18px;
    color: #FF4949;
  }

  .cost-item-info-title {
    font-size: 14px;
    color: #bbb;
    margin-right: 10px;
  }

  .cost-item-info-label {
    font-size: 14px;
  }

  .cost-item-status {
    font-size: 14px;
  }

  .cost-item-status-success {
    color: #444;
  }

  .cost-item-status-error {
    color: red;
  }

  .outpatient-list-menu .vux-tab .vux-tab-item.vux-tab-selected {
    color: #4B6BAF;
  }

  .wait-pay-wrap .outpatient-list-menu .vux-tab-ink-bar {
    background-color: #4B6BAF !important;
  }

  .cost-item-header {
    border-bottom: 1px solid #f4f4f4;
    padding-left: 2.5rem;
    padding-bottom: 0.5rem;
  }

  .wait-pay-wrap .bottom-bar .pay-money-box .pay-money-value {
    color: #FF4949 !important;
  }

  .cost-item2 .cost-item-right {
    margin-right: 1.2rem;
  }

  .cost-item2 .cost-item-center {
    padding-left: 1.2rem;
  }

  .cost-item2 .cost-item-header {
    padding-left: 1.2rem;
  }

  .cost-item-all-money {
    color: #FF4949;
  }

  .own-tip-bar {
    box-sizing: border-box;
    padding: 5px;
    background: #FFF5E4;
    color: #F06A00;
    border-bottom: 0;
    opacity: 0.7;
  }

  .cost-item-info-label.money {
    color: #FF4949;
  }
</style>
