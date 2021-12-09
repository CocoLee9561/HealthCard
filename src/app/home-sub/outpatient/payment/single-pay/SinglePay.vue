<template>
  <div class="page">
    <view-box body-padding-bottom="100px">
      <x-header slot="header">门诊缴费</x-header>



      <tip-text-bar v-if="pendingPayTip">
        {{pendingPayTip}}
      </tip-text-bar>
      <!--<div class="tip-bar own-tip-bar">
        <span slot="title">{{pendingPayTip}}</span>
      </div>-->
      <div>
        <div class="card-info-plan">
          <div class="booking-result-plan" style="margin-top: 0px">
            <div class="booking-result-header line-bottom">
              <div class="booking-result-info-bar">
                <span class="booking-result-info-title">缴费项目</span>
                <span class="booking-result-info-value">{{pendingPayDetail.itemname}}</span>
              </div>
            </div>
            <div class="booking-result-body line-bottom">
              <div class="booking-result-info-bar">
                <span class="booking-result-info-title">费用单号</span>
                <span class="booking-result-info-value">{{pendingPayDetail.orderno}}</span>
              </div>
              <div class="booking-result-info-bar">
                <span class="booking-result-info-title">费用金额</span>
                <span class="booking-result-info-value">￥{{pendingPayDetail.amount}}</span>
              </div>
              <div class="booking-result-info-bar" v-if="!this.isqrCode">
                <span class="booking-result-info-title">就诊姓名</span>
                <span class="booking-result-info-value">{{pendingPayDetail.patientname}}</span>
              </div>
              <div class="booking-result-info-bar" v-if="!this.isqrCode">
                <span class="booking-result-info-title">就诊卡号</span>
                <span class="booking-result-info-value">{{cardInfo.cardno}}</span>
              </div>
              <div class="booking-result-info-bar">
                <span class="booking-result-info-title">收费医院</span>
                <span class="booking-result-info-value">{{pendingPayDetail.hospitalname}}</span>
              </div>
              <div class="booking-result-info-bar">
                <span class="booking-result-info-title">收费科室</span>
                <span class="booking-result-info-value">{{pendingPayDetail.deptname}}</span>
              </div>
              <div class="booking-result-info-bar">
                <span class="booking-result-info-title">开单医生</span>
                <span class="booking-result-info-value">{{pendingPayDetail.doctorname}}</span>
              </div>
              <div class="booking-result-info-bar">
                <span class="booking-result-info-title">更新时间</span>
                <span class="booking-result-info-value">{{pendingPayDetail.createtime}}</span>
              </div>
            </div>
          </div>
          <!--<group :gutter="0" v-if="this.hospitalInfo.hospitalcode != '18452' && this.hospitalInfo.hospitalcode != '18449'">-->
            <!--<cell title="费用明细" is-link @click.native="toFeeDetail"></cell>-->
          <!--</group>-->
        </div>
        <!--支付方式-->
        <pay-method v-if="!isDetail" :funKey="funKey" :payMethods="allowPayMethods" @selected="selectedPayMethod"></pay-method>
      </div>
      <footer slot="bottom" class="bottom-bar" v-if="!isDetail">
        <div class="pay-money-box">
          <span class="pay-money-title">费用合计</span>
          <span class="pay-money-value">￥{{pendingPayDetail.amount}}</span>
        </div>
        <div class="pay-ok-btn" @click="clickPay">
          确认支付
        </div>
      </footer>
    </view-box>
  </div>
</template>
<script>

  import {mapState, mapActions, mapGetters} from 'vuex'
  import {Group, Cell} from 'vux'
  export function getUrlKey (name) {
    console.log("initUrl:",window.location.href)
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(window.location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
  }
  export default {
    components: {Group, Cell},
    computed: {
      ...mapState({
        hospitalInfo: state => state.hospital.current,
        pendingPayTip: state => state.pendingPayTip,
        pendingPayDetail: state => state.pendingPayDetail,
        selectedMember: state => state.selectedMember
      }),
      ...mapGetters(["allowPayMethods", "totalBalance"]),
      cardInfo: function () {
        return this.$store.state.selectedCards[this.funKey];
      },
      outid: function () {
        return this.$routeData.outid
      },
      isDetail: function () {
        return this.$routeData.isDetail
      }
    },
    created() {
      console.log("1");
      window.byAddEventListener("displayChange",(event)=>{
       console.log(`--事件处理器：${event.type}`);
        let data = event.data  ;

        let currWVO = window.plus.webview.currentWebview();

        if (currWVO.id != data.webviewID && data.action == "close"){
          this.$forceUpdate()
        }
      })

      if (this.outid) {
        console.log("9");
        console.log("riid",this.riid);
        console.log("hoscode",this.hospitalInfo.hospitalcode);
        if (this.isqrCode) {
          console.log("11111")
          this.getPendingPayDetail({
            riid: this.riid,
            outids: this.outid,
            hospitalcode: this.hospitalInfo.hospitalcode
          });
          console.log("11111 end")
        } else {
          console.log("22222")
          this.getPendingPayDetail({
            riid: this.cardInfo.riid,
            outids: this.outid,
            hospitalcode: this.hospitalInfo.hospitalcode
          });
        }
      }
      this.allowPayMethods.forEach((val) => {
        console.log("10 begin");
        console.log("val.type:",val.type);
        console.log("val:",val);
        if (val.type == 4) {
          console.log("10 ing")
          this.loadMeidcalResource();
        }
        console.log("10 end")
      })

    },
    mounted() {
      if (window.location.href.indexOf("?#") < 0) {
        window.location.href = window.location.href.replace("#", "?#");
      }
    },
    data() {
      console.log("2data");
      let riid = getUrlKey("riid");
      let cardno = getUrlKey("cardno");
      let realname = getUrlKey("realname");
      let isqrCode = getUrlKey("isqrCode");
      console.log("riid:",riid);
      console.log("cardno:",cardno);
      console.log("realname:",realname);
      console.log("isqrCode:",isqrCode);
      if (isqrCode) {
        return {
          funKey: 'MZJF',
          payMethod: 4,
          cardno: cardno,
          realname: realname,
          riid: riid,
          isqrCode: isqrCode
        }
      } else {
        return {
          funKey: 'MZJF',
          payMethod: {},
          isqrCode: isqrCode

        }
      }

    },
    methods: {
      ...mapActions(["getPendingPayDetail", "payinfo", "mergeOrderSign"]),
      toFeeDetail() {
        shareInst.client.push({
          path: '/feeDetail'
        });
      },
      selectedPayMethod(payMethod) {
        console.log("3");
        console.log("payMethod:",payMethod);
        this.payMethod = payMethod
      },
      clickPay() {
        console.log("4");

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

        this.paySingle();
      },
      paySingle() {
        console.log("5");
        console.log("this.payMethod.type:",this.payMethod.type);

        if (this.payMethod.type == 4) {
          if (parseFloat(this.pendingPayDetail.amount) > parseFloat(this.totalBalance)) {
            let self=this
            let diffMoney = parseFloat(this.totalBalance) - parseFloat(this.pendingPayDetail.amount)
            diffMoney = Math.abs(diffMoney)
            this.$vux.confirm.show({
              title: '提示',
              content: '就诊卡余额不足，请前往充值！',
              onConfirm() {
                shareInst.client.push({path: '/PayForm', query: {funKey: self.funKey, routeName: 'outpatient',diffMoney:diffMoney}})
              }
            })
            return;
          }
        }
        this.mergeordersign();
      },
      loadMeidcalResource() {
        console.log("6");

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
      mergeordersign() {
        console.log("7");
        console.log("riid");
        console.log("isqrCode:", this.isqrCode)
        console.log("cardno:", this.cardno)
        console.log("riid:", this.riid)
        let params = {}
        if (this.isqrCode) {
          params = {
            riid: this.riid,
            realname: this.realname,
            cardno: this.cardno,
            cardtype: '66',
            isqrCode: this.isqrCode,
            outids: this.outid,
            hosptotalfee: this.pendingPayDetail.amount,
            thridpayfee: this.pendingPayDetail.amount,
            paytype: this.payMethod.type,
            hospitalcode: this.hospitalInfo.hospitalcode
          }
        }else{
          params = {
            riid: this.cardInfo.riid,
            realname: this.selectedMember.realname,
            cardno: this.cardInfo.cardno,
            cardtype: this.cardInfo.cardtype,
            outids: this.outid,
            hosptotalfee: this.pendingPayDetail.amount,
            thridpayfee: this.pendingPayDetail.amount,
            paytype: this.payMethod.type,
            hospitalcode: this.hospitalInfo.hospitalcode
          }
        }
        console.log("7  end params:",params);
        this.mergeOrderSign(params).then((res) => {
          console.log("8");
          console.log("res.signresult:",res.signresult);
          console.log("res:",res);

          if (res.signresult == 0) {
            console.log("10000")
            let payInfo = {}
            if (this.isqrCode) {
              payInfo = {
                title:'门诊缴费',
                orderNo: res.orderNo,
                routeName: 'outpatientSingle',
                regPayType: this.payMethod.type,
                cardNo: this.cardno,
                riid: this.riid,
                isqrCode: this.isqrCode,
                cardType: '66',
                orderno: this.pendingPayDetail.orderno,
                hospitalcode: this.hospitalInfo.hospitalcode,
                hospitalname: this.pendingPayDetail.hospitalname,
                patientname: this.selectedMember.realname,
                deptname: this.pendingPayDetail.deptname,
                doctorname: this.pendingPayDetail.doctorname,
              }
            }else{
              payInfo = {
                title:'门诊缴费',
                orderNo: res.orderNo,
                routeName: 'outpatientSingle',
                regPayType: this.payMethod.type,
                cardNo: this.cardInfo.cardno,
                riid: this.cardInfo.riid,
                cardType: this.cardInfo.cardtype,
                orderno: this.pendingPayDetail.orderno,
                hospitalcode: this.hospitalInfo.hospitalcode,
                hospitalname: this.pendingPayDetail.hospitalname,
                patientname: this.selectedMember.realname,
                deptname:this.pendingPayDetail.deptname,
                doctorname:this.pendingPayDetail.doctorname,
              }
            }
            Object.assign(payInfo, this.pendingPayDetail);
            if (res.content && res.content.length > 0) {
              Object.assign(payInfo, res.content[0]);
            }
            localStorage.setItem('pay-info', JSON.stringify(payInfo));

            if (this.payMethod.type == 4) {

              shareInst.client.push({path: '/confirmLoading'})

            } else {
//              if(this.payMethod.type==7){
//                this.$vux.confirm.show({
//                  title:'支付提示',
//                  content:'请确认微信支付是否已经完成',
//                  confirmText:'已支付完成',
//                  cancelText:'返回重新支付',
//                  onCancel () {},
//                  onConfirm () {
//                    shareInst.client.push({path: "/confirmLoading"})
//                  }
//                })
//              }else{
//
//              }
              res.nextLocation = {
                path: "/confirmLoading"
              };
              res.payType = this.payMethod.type;

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
<style scoped>
  .own-tip-bar {
    box-sizing: border-box;
    padding: 5px;
    background: #FFF5E4;
    color: #F06A00;
    border-bottom: 0;
    opacity: 0.7;
  }

  .own-web-plan {
    background: #F3F6FC;
  }

  .pay-money-box .pay-money-value {
    color: #FF4949 !important;
  }
  .booking-info-bar .booking-info-title{
    width: 60px;
  }
  .own-plan{
    box-shadow: 5px 5px 5px #eee;
    margin: 0 16px;
  }
</style>
