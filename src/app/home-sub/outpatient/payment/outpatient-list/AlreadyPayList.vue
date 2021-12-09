<template>
  <div class="page">
    <view-box>
      <x-header slot="header">缴费记录</x-header>
      <change-patient :realname="selectedMember.realname" :cardno="cardInfo.cardno"
                      :to="changePatientTo"></change-patient>
      <tip-text-bar>
        {{alreadyPayTip}}
      </tip-text-bar>
      <div><!--缴费记录 -->

        <div v-if="alreadyPayList.length>0">

          <div class="card-info-plan" v-for="(item,index) in alreadyPayList" :key="index" @click="toDetail(item)">
            <div class="booking-result-plan" >
              <div class="booking-result-header line-bottom">
                <div class="booking-result-info-bar">
                  <span class="booking-result-info-title cost-item-name">{{item.itemname}}</span>
                  <span class="booking-result-info-value">
                    <span class="cost-item-status"
                          :class="{'cost-item-status-success':item.bsstatus==0,'cost-item-status-error':item.bsstatus == 1 || item.bsstatus == 2}">{{statusText(item.bsstatus)}}</span>
                  </span>
                </div>
              </div>
              <div class="booking-result-body line-bottom">
                <div class="booking-result-info-bar" v-if="item.orderno">
                  <span class="booking-result-info-title">单号</span>
                  <span class="booking-result-info-value">{{item.orderno}}</span>
                </div>
                <div class="booking-result-info-bar" v-if="item.deptname">
                  <span class="booking-result-info-title">科室</span>
                  <span class="booking-result-info-value">{{item.deptname}}</span>
                </div>
                <div class="booking-result-info-bar">
                  <span class="booking-result-info-title">医生</span>
                  <span class="booking-result-info-value">{{item.doctorname}}</span>
                </div>
                <div class="booking-result-info-bar">
                  <span class="booking-result-info-title">时间</span>
                  <span class="booking-result-info-value">{{item.createtime}}</span>
                </div>
                <div class="booking-result-info-bar">
                  <span class="booking-result-info-title">费用</span>
                  <span class="booking-result-info-value cost-item-all-money">￥{{item.amount}}</span>
                </div>
              </div>
            </div>
            <group :gutter="0" @click.native="toDetail(item)">
              <cell is-link>
                <span slot="title">查看详情</span>
              </cell>
            </group>
          </div>
        </div>
		<div v-else>
			<div class="vux-center empty-page" style="height: 500px;">
				暂无缴费记录
			</div>
		</div>
      </div>
    </view-box>
  </div>

</template>
<script>
  import {Group, Cell} from 'vux'
  import {mapState, mapActions} from 'vuex'
  import ChangePatient from "../../../../components/ChangePatient.vue";

  export default {
    computed: {
      ...mapState({
        alreadyPayList: state => state.alreadyPayList,
        hospitalInfo: state => state.hospital.current,
        alreadyPayTip: state => state.alreadyPayTip,
        selectedMember: state => state.selectedMember
      }),
      cardInfo: function () {
        return this.$store.state.selectedCards[this.funKey];
      },
      changePatientTo() {
        return {
          name: "MemberList",
          query: {
            funKey: this.funKey,
            title: "交费记录",
            hideBack: false,
            prompt: "您要查询谁的交费记录？",
            to: JSON.stringify({
              name: "SelectCardPage",
              query: {
                funKey: this.funKey,
                title: "交费记录",
                to: -2
              }
            })

          },
        }
      },
    },
    components: {
      ChangePatient,Group, Cell
    },
    created() {
      this.$store.commit('updateOutpatientMember',{
        hospCode:this.hospitalInfo.hospitalcode,
        member:this.selectedMember,
        card:this.cardInfo
      })
      this.getAlreadyPayData()
    },
    data() {
      return {
        funKey: 'JFJL',
      }
    },
    methods: {
      ...mapActions(["getPendingPayList", "getAlreadyPayList", "outpatientHint","getPendingPayDetail"]),
      getAlreadyPayData() {
        this.getAlreadyPayList({
          cardno: this.cardInfo.cardno,
          cardtype: this.cardInfo.cardtype,
          riid: this.cardInfo.riid,
          hospitalcode: this.hospitalInfo.hospitalcode
        })
      },
      payStatus(payType) {//"缴费状态  1确认中;4缴费中 ;5已退款;6缴费失败;7缴费失败;8缴费成功;11已执行;12已退费"
//        let status = {1: '确认中', 4: '缴费中', 5: '已退款', 6: '缴费失败', 7: '缴费失败', 8: '缴费成功', 11: '已执行', 12: '已退费',13:'缴费失败'}

        // 0 支付成功 1退款异常 2支付异常 3退款成功 4退款失败
        let status = {0: '支付成功', 1: '退款异常', 2: '支付异常', 3: '退款成功', 4: '退款失败'}
        return status[payType]
      },
      statusText(bsStatus){
        let status = {0: '缴费成功', 1: '缴费失败', 2: '缴费异常'}
        return status[bsStatus]
      },
      toDetail(item) {
        this.$store.commit('updateOutpatientPayResult', item)
        this.$store.commit('updatePedingPayDetail',item)
        shareInst.client.push({
          path: '/outpatientDetail',
          query: {
            funKey: this.funKey,
            riid: this.cardInfo.riid,
            cardno: this.cardInfo.cardno,
            outid: item.outid,
            routeName: 'already',
            title: '缴费记录'
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>

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
    float: right;
  }

  .cost-item-status-success {
    color: #444;
  }

  .cost-item-status-error {
    color: red;
  }

  .outpatient-list-menu .vux-tab .vux-tab-item.vux-tab-selected {
    color: $mainColor;
  }

  .wait-pay-wrap .outpatient-list-menu .vux-tab-ink-bar {
    background-color: $mainColor !important;
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
  .cost-item-name{
    color: $fontColor !important;
  }
  .cost-item-all-money {
    color: #FF4949 !important;
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
