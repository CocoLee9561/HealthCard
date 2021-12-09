<template>
  <div class="page">
    <view-box body-padding-bottom="100px">
      <x-header slot="header">缴费结果</x-header>
      <!--<div class="tip-bar cost-tip-bar">
        <span slot="title">{{pendingPayTip}}</span>
      </div>-->
      <tip-text-bar v-if="pendingPayTip">
        {{pendingPayTip}}
      </tip-text-bar>
      <div>
        <group :gutter="0" v-if="this.hospitalInfo.hospitalcode != '18452' && this.hospitalInfo.hospitalcode != '18449'">
          <cell v-for="(item,index) in pendingPayDetails" is-link :key="index" @click.native="pedingPayDetail(item)">
            <span slot="title">{{item.itemname}}</span>
            <span>点击查看</span>
          </cell>
        </group>
        <group :gutter="0" v-if="this.hospitalInfo.hospitalcode == '18452' || this.hospitalInfo.hospitalcode == '18449'">
          <cell v-for="(item,index) in pendingPayDetails" is-link :key="index">
            <span slot="title">{{item.itemname}} | 单据号:{{item.orderno}} | 金额:{{item.amount}}</span>
          </cell>
        </group>
        <pay-method :payMethods="allowPayMethods" @selected="selectedPayMethod"></pay-method>
      </div>
      <footer slot="bottom" class="bottom-bar">
        <div class="pay-money-box">
          <span class="pay-money-title">费用合计</span>
          <span class="pay-money-value">￥{{mergerTotalFee}}</span>
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
    computed: {
      ...mapState({
        outids: state => state.outids,
        hospitalInfo: state => state.hospital.current,
        pendingPayTip: state => state.pendingPayTip,
        pendingPayDetails: state => state.pendingPayDetails,
        selectedMember: state => state.selectedMember,
        mergerTotalFee: state => state.mergerTotalFee
      }),
      ...mapGetters(["allowPayMethods", "totalBalance"]),
      cardInfo: function () {
        return this.$store.state.selectedCards[this.funKey];
      },
    },
    components: {
      Group,
      Cell
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
      if (this.isqrCode) {
        this.getPendingPayDetail({
          riid: this.riid,
          outtype: 0,
          outids: this.outids,
          hospitalcode: this.hospitalInfo.hospitalcode
        });
      } else {
        this.getPendingPayDetail({
          riid: this.cardInfo.riid,
          outtype: 0,
          outids: this.outids,
          hospitalcode: this.hospitalInfo.hospitalcode
        });
      }
      this.allowPayMethods.forEach((val) => {
        if (val.type == 4) {
          this.loadMeidcalResource();
        }
      })
    },
    data() {
      console.log("3data");
      let riid = getUrlKey("riid");
      let cardno = getUrlKey("cardno");
      let realname = getUrlKey("realname");
      let isqrCode = getUrlKey("isqrCode");
      console.log("riid:",riid);
      console.log("cardno:",cardno);
      console.log("realname:",realname);
      console.log("isqrCode:",isqrCode);
      // console.log("333333:",this.selectedMember);
      // console.log("444444:",this.cardInfo);
      // console.log("555555:",this.cardInfo.riid);
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
        }
      }
    },
    methods: {
      ...mapActions(["getPendingPayDetail", "payinfo", "mergeOrderSign"]),
      pedingPayDetail(item) {
        if (this.isqrCode) {
          this.$store.commit("updatePedingPayDetail", item)
          shareInst.client.push({
            path: '/singlePay',
            query: {
              isqrCode: this.isqrCode,
              cardno: this.cardno,
              realname: this.realname,
              riid: '10585',
              isDetail: true
            }
          })
        } else {
          this.$store.commit("updatePedingPayDetail", item)
          shareInst.client.push({
            path: '/singlePay',
            query: {
              isDetail: true
            }
          })
        }

      },
      selectedPayMethod(payMethod) {
        this.payMethod = payMethod
      },
      clickPay() {
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
        this.payMerge();
      },
      payMerge() {
        if (this.payMethod.type == 4) {
          if (parseFloat(this.mergerTotalFee) > parseFloat(this.totalBalance)) {
            let self = this;
            let diffMoney = parseFloat(this.mergerTotalFee) - parseFloat(this.totalBalance)
            diffMoney = Math.abs(diffMoney)
            this.$vux.confirm.show({
              title: '提示',
              content: '就诊卡余额不足，请前往充值！',
              onConfirm() {
                shareInst.client.push({
                  path: '/PayForm',
                  query: {funKey: self.funKey, routeName: 'outpatient', diffMoney: diffMoney}
                })
              }
            })
            return;
          }
        }
        this.mergeordersign();
      },
      loadMeidcalResource() {
        console.log("aaaaaaaaaaaaa")
        let param = {}
        if (this.isqrCode) {
          param = {
            riid: this.riid,
            cardno: this.cardno,
            cardtype: this.cardtype,
            isqrCode: this.isqrCode,
            pkreghospital: this.hospitalInfo.pkregHospitalId,
            hospitalcode: this.hospitalInfo.hospitalcode
          }
        } else {
          param = {
            riid: this.selectedMember.riid,
            cardno: this.cardInfo.cardno,
            cardtype: this.cardInfo.cardtype,
            pkreghospital: this.hospitalInfo.pkregHospitalId,
            hospitalcode: this.hospitalInfo.hospitalcode
          }
        }
        console.log("bbbbbbbbbbb")
        this.payinfo(param).then((res) => {
        })
      },
      mergeordersign() {
        let params = {}
        if (this.isqrCode) {
          console.log("ccccccccccc")
          params = {
            riid: this.riid,
            realname: this.realname,
            cardno: this.cardno,
            cardtype: '66',
            isqrCode: this.isqrCode,
            outids: this.outids,
            hosptotalfee: this.mergerTotalFee,
            thridpayfee: this.mergerTotalFee,
            paytype: this.payMethod.type,
            hospitalcode: this.hospitalInfo.hospitalcode
          }
        }else{
          params = {
            riid: this.cardInfo.riid,
            realname: this.selectedMember.realname,
            cardno: this.cardInfo.cardno,
            cardtype: this.cardInfo.cardtype,
            outids: this.outids,
            hosptotalfee: this.mergerTotalFee,
            thridpayfee: this.mergerTotalFee,
            paytype: this.payMethod.type,
            hospitalcode: this.hospitalInfo.hospitalcode
          }
        }

        this.mergeOrderSign(params).then((res) => {
          if (res.signresult == 0) {
            let _outids = {}
            this.pendingPayDetails.forEach((val) => {
              let outid = val.outid
              _outids[outid] = val
            })
            let payInfo = {}
            if (this.isqrCode) {
              payInfo = {
                title: '门诊缴费',
                orderNo: res.orderNo,
                routeName: 'outpatientMerger',
                regPayType: this.payMethod.type,
                cardNo: this.cardno,
                riid: this.riid,
                isqrCode: this.isqrCode,
                cardType: '66',
                hospitalcode: this.hospitalInfo.hospitalcode,
                hospitalname: this.hospitalInfo.hospitalname,
                patientname: this.selectedMember.realname,
                detailslist: this.pendingPayDetails,
                outids: _outids
              }
            }else{
              payInfo = {
                title: '门诊缴费',
                orderNo: res.orderNo,
                routeName: 'outpatientMerger',
                regPayType: this.payMethod.type,
                cardNo: this.cardInfo.cardno,
                cardType: this.cardInfo.cardtype,
                hospitalcode: this.hospitalInfo.hospitalcode,
                hospitalname: this.hospitalInfo.hospitalname,
                patientname: this.selectedMember.realname,
                detailslist: this.pendingPayDetails,
                outids: _outids
              }
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
              title: res.bstitle,
              content: res.bsmessage
            })
          }
        })
      }
    }
  }
</script>
<style>

</style>
