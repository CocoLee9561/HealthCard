<template>
  <div class="page">
    <view-box>
      <x-header slot="header">取号候诊</x-header>
      <div>

        <div class="tip-bar own-tip-bar">
          <span slot="title">暂只支持自费，使用医保请到窗口缴费</span>
        </div>

        <div style="margin-top: 10px;">
          <div style="padding: 15px 10px;background: #fff;">
            <div class="booking-info-plan own-web-plan">
              <div class="booking-info-bar">
                <span class="booking-info-title">姓名</span>
                <span class="booking-info-value">{{waitingItem.realname}}</span>
              </div>
              <div class="booking-info-bar">
                <span class="booking-info-title">医院</span>
                <span class="booking-info-value">{{waitingItem.hospitalname}}</span>
              </div>
              <div class="booking-info-bar">
                <span class="booking-info-title">科室</span>
                <span class="booking-info-value">{{waitingItem.departmentname}}</span>
              </div>
              <div class="booking-info-bar">
                <span class="booking-info-title">医生</span>
                <span class="booking-info-value">{{waitingItem.doctorname}}</span>
              </div>
              <div class="booking-info-bar">
                <span class="booking-info-title">日期</span>
                <span class="booking-info-value">{{waitingItem.regdate}}  {{waitingItem.regtime}}</span>
              </div>
              <div class="booking-info-bar">
                <span class="booking-info-title">费用</span>
                <span class="booking-info-value money">￥{{waitingItem.bsregisterfee}}</span>
              </div>
            </div>
          </div>
        </div>

        <!--支付方式-->
        <pay-method :payMethods="allowPayMethods" @selected="selectedPayMethod"></pay-method>

        <footer class="bottom-bar">
          <div class="pay-money-box">
            <span class="pay-money-title">支付金额</span>
            <span class="pay-money-value money">￥{{waitingItem.bsregisterfee}}</span>
          </div>
          <div class="pay-ok-btn own-btn" @click="payBooking">
            确认支付
          </div>
        </footer>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions, mapGetters} from 'vuex'

  export default {
    computed: {
      ...mapState({
        waitingItem: state => state.waitingItem,
        selectedMember:state=>state.selectedMember,
        hospitalInfo: state => state.hospital.current
      }),
      ...mapGetters(["totalBalance", "allowPayMethods"]),
      cardInfo: function () {
        return this.$store.state.selectedCards[this.$routeData.funKey];
      },
    },
    created() {

      window.byAddEventListener("displayChange",(event)=>{
       console.log(`--事件处理器：${event.type}`);
        let data = event.data  ;

        let currWVO = window.plus.webview.currentWebview();

        if (currWVO.id != data.webviewID && data.action == "close"){
          this.$forceUpdate()
        }
      })

      this.allowPayMethods.forEach((val) => {
        if (val.type == 4) {
          this.loadMeidcalResource();
        }
      })
    },
    data() {
      return {
        payMethod: {},
        funKey: 'QHHZ'
      }
    },
    methods: {
      ...mapActions(["payinfo", "takeNoSign"]),
      selectedPayMethod: function (payMethod) {
        this.payMethod = payMethod
      },
      payBooking() {
        if (!this.payMethod.type) {
          this.$vux.alert.show({
            title: '提示',
            content: '请选择支付方式',
            onShow() {
            },
            onHide() {
            }
          })
          return;
        }
        this.bookingPay();
      },
      loadMeidcalResource() {
        let param = {
          riid: this.selectedMember.riid,
          cardno: this.cardInfo.cardno,
          cardtype: this.cardInfo.cardtype,
          pkreghospital: this.hospitalInfo.pkregHospitalId,
          hospitalcode: this.hospitalInfo.hospitalcode
        }
        this.payinfo(param).then((res) => {
        })
      },
      bookingPay() {
        if (this.payMethod.type == 4) {
          if (parseFloat(this.waitingItem.bsregisterfee) > parseFloat(this.totalBalance)) {
            let self=this
            let diffMoney = parseFloat(this.waitingItem.bsregisterfee) - parseFloat(this.totalBalance)
            diffMoney = Math.abs(diffMoney)
            this.$vux.confirm.show({
              title: '提示',
              content: '就诊卡余额不足，请前往充值！',
              onConfirm() {
                shareInst.client.push({path: '/PayForm', query: {funKey: self.funKey, routeName: 'waiting',diffMoney:diffMoney}})
              }
            })
            return;
          }
        }
        this.takenosign();
      },
      takenosign() {
        let params = {
          riid: this.waitingItem.riid,
          realname: this.waitingItem.realname,
          cardno: this.cardInfo.cardno,
          cardtype: this.cardInfo.cardtype,
          hosptotalfee: this.waitingItem.bsregisterfee,
          thridpayfee: this.waitingItem.bsregisterfee,
          paytype: this.payMethod.type,
          reghistoryid: this.waitingItem.reghistoryid,
          hospitalcode: this.hospitalInfo.hospitalcode,
        }
        this.takeNoSign(params).then((res) => {
          if (res.signresult == 0) {
            let payInfo = {
              title:'取号候诊',
              orderNo: res.orderNo,
              routeName: 'waitting',
              regPayType: this.payMethod.type,
              cardNo: this.cardInfo.cardno,
              cardType: this.cardInfo.cardtype,
              hospitalcode: this.hospitalInfo.hospitalcode
            }
            Object.assign(payInfo, res);
            localStorage.setItem('pay-info', JSON.stringify(payInfo));

            if (this.payMethod.type == 4) {

              shareInst.client.push({path: '/confirmLoading'})

            } else {

              res.payType = this.payMethod.type;
              res.nextLocation = {
                path: "/confirmLoading"
              };

              window.shareInst.client.payment(res).then((res) => {
                if (shareInst.client.isWeChat()) {
                  shareInst.client.push({path: '/confirmLoading'})
                }
              });
            }

          } else {
            this.$vux.alert.show({
              title:res.bstitle,
              content:res.bsmessage
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .own-web-plan {
    background: #F3F6FC;
  }

  .own-tip-bar {
    box-sizing: border-box;
    padding: 5px;
    background: #FFF5E4;
    color: #F06A00;
    border-bottom: 0;
    opacity: 0.7;
  }

  .money {
    color: #FF4949 !important;
  }
</style>
