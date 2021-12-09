<template>
  <div class="page">
    <view-box body-padding-bottom="100px">
      <x-header slot="header">挂号支付</x-header>
      <div id="alipay-page"></div>
      <div>
        <div class="cmc-tip-bar own-tip-bar">
          暂只支持自费，使用医保请到窗口缴费
        </div>
        <div style="margin-top: 10px;">
          <div style="padding: 15px 10px;background: #fff;">
            <div class="booking-info-plan own-web-plan">
              <div class="booking-info-bar">
                <span class="booking-info-title">姓名</span>
                <span class="booking-info-value">{{memberInfo.realname}}</span>
              </div>
              <div class="booking-info-bar">
                <span class="booking-info-title">医院</span>
                <span class="booking-info-value">{{doctorInfo.hospitalname}}</span>
              </div>
              <div class="booking-info-bar">
                <span class="booking-info-title">科室</span>
                <span class="booking-info-value">{{doctorInfo.departmentname}}</span>
              </div>
              <div class="booking-info-bar">
                <span class="booking-info-title">医生</span>
                <span class="booking-info-value">{{doctorInfo.doctorname}}</span>
              </div>
              <div class="booking-info-bar">
                <span class="booking-info-title">日期</span>
                <span class="booking-info-value">{{bookingData.regdate}} <span v-if="bookingData.weekDate">({{bookingData.weekDate}})</span> {{bookingData.regtime}}</span>
              </div>
              <div class="booking-info-bar">
                <span class="booking-info-title">费用</span>
                <span class="booking-info-value">￥{{bookingData.registerfee}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--<div style="margin-top:10px;">-->
      <!--<div class="pay-plan">-->
      <!--<div class="plan-title">支付方式</div>-->
      <!--<div class="pay-type-plan">-->
      <!--<div class="pay-type-box" v-for="(item,key) in payTypes" v-if="item.isShow">-->
      <!--<div class="pay-type" :class="{checked:curPayType==item.payType}" @click="choosePayType(item.payType)">-->
      <!--<img :src="item.icon">-->
      <!--<div class="pay-type-info">-->
      <!--<span class="pay-type-label">{{item.label}}</span>-->
      <!--<span v-show="item.payType==4" class="pay-type-balance">{{item.allbalance}}</span>-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->

      <!--支付方式-->
      <pay-method :payMethods="allowPayMethods" @selected="selectedPayMethod"></pay-method>

      <footer slot="bottom" class="bottom-bar">
        <div class="pay-money-box">
          <span class="pay-money-title">支付金额</span>
          <span class="pay-money-value money">￥{{bookingData.registerfee}}</span>
        </div>
        <div class="pay-ok-btn own-btn" @click="payBooking">
          确认支付
        </div>
      </footer>
    </view-box>
  </div>
</template>
<script>

  import {mapState, mapActions, mapGetters} from 'vuex'

  export default {
    computed: {
      ...mapState({
        hospitalInfo: state => state.hospital.current,
        doctorInfo: state => state.doctorInfo,
        scheduleInfo: state => state.selectedSchedule,
        bookingData: state => state.bookingData,
        memberInfo: state => state.selectedMember,
//        cardInfo:state => state.selectedCard
      }),
      ...mapGetters(["totalBalance", "allowPayMethods"]),
      bookType: function () {
        return this.$routeData.bookType
      },
      funKey: function () {
        return this.$routeData.funKey
      },
      cardInfo: function () {
        return this.$store.state.selectedCards[this.$routeData.funKey];
      }
    },
    created() {

//      if(ap.isAlipay){
//        this.setAliPayTypes();
//      }else if(tool.isWechat()){
//        this.setWechatPayTypes();
//      }else{
//      this.setPayTypes();
//      }
//      if (ap.isAlipay) {
//        this.payTypes['3'].isShow = false
//        this.payTypes['5'].isShow = false
//      } else if (tool.isWechat()) {
//        this.payTypes['2'].isShow = false
//        this.payTypes['6'].isShow = false
//      }

      window.byAddEventListener("displayChange",(event)=>{
       console.log(`--事件处理器：${event.type}`);
        let data = event.data  ;

        let currWVO = window.plus.webview.currentWebview();

        if (currWVO.id != data.webviewID && data.action == "close"){
          this.$forceUpdate();
        }
      })


      this.allowPayMethods.forEach((val) => {
        if (val.type == 4) {
          this.loadMeidcalResource();
        }
      })
    },
    components: {
    },
    data() {
      return {
        curPayType: '',
        payTypes: {//1.银联 2支付宝支付, 3微信APP支付,4.就诊卡，5微信公众号支付 6支付宝生活号
          2: {label: '支付宝支付', payType: 6, checked: false, isShow: false, icon: require('@icon/ic_alipay.png')},
          3: {label: '微信支付', payType: 7, checked: false, isShow: false, icon: require('@icon/ic_wechat.png')},
          4: {
            label: '就诊卡余额',
            payType: 4,
            checked: false,
            isShow: false,
            icon: require('@icon/ic_medicalcard.png'),
            allbalance: ''
          },
          5: {label: '微信支付', payType: 5, checked: false, isShow: false, icon: require('@icon/ic_wechat.png')},
          6: {label: '支付宝支付', payType: 6, checked: false, isShow: false, icon: require('@icon/ic_alipay.png')}
        }

      }
    },
    methods: {
      ...mapActions(["payinfo", "registerSign"]),
      setPayTypes() {
        let p = this.hospitalInfo.payTypes
        p.forEach((val, index, arr) => {
          this.payTypes[val.payType + ''].isShow = true;
        })
      },
      setAliPayTypes() {
        let p = this.hospitalInfo.payTypes
        p.forEach((val, index, arr) => {
          if (val.payType == 6) {
            this.payTypes['6'].isShow = true;
          }
          if (val.payType == 4) {
            this.payTypes['4'].isShow = true;
          }
        })
      },
      setWechatPayTypes() {
        let p = this.hospitalInfo.payTypes
        p.forEach((val, index, arr) => {
          if (val.payType == 5) {
            this.payTypes['5'].isShow = true;
          }
          if (val.payType == 4) {
            this.payTypes['4'].isShow = true;
          }
        })
      },
      loadMeidcalResource() {
        let param = {
          riid: this.memberInfo.riid,
          cardno: this.cardInfo.cardno,
          cardtype: this.cardInfo.cardtype,
          pkreghospital: this.doctorInfo.hospitalid,
          hospitalcode: this.doctorInfo.hospitalCode
        }
        this.payinfo(param).then((res) => {
          this.payTypes['4'].allbalance = `¥${res.enablebalance}`
        })

      },
      selectedPayMethod: function (payMethod) {
        if(payMethod&&payMethod.type){
          this.curPayType = payMethod.type
        }
      },
      choosePayType(payType) {
        this.curPayType = payType
      },
      registersign() {
        console.log('this.curPayType>' + this.curPayType);
        let param = {
          riid: this.memberInfo.riid,
          departmentid: this.doctorInfo.departmentid,
          doctorid: this.doctorInfo.doctorid,
          worktype: this.scheduleInfo.worktype,
          workdate: this.bookingData.regdate,
          regtime: this.scheduleInfo.timequantum,
          cardno: this.cardInfo.cardno,
          cardtype: this.cardInfo.cardtype,
          pkreghospital: this.doctorInfo.hospitalid,
          realname: this.memberInfo.realname,
          hosptotalfee: parseFloat(this.bookingData.registerfee).toFixed(2),
          thridpayfee: parseFloat(this.bookingData.registerfee).toFixed(2),
          paytype: this.curPayType,
          registrationtype: this.bookType,
          hospitalcode: this.doctorInfo.hospitalCode,
          scheduleid: this.scheduleInfo.scheduleid,
        }
        this.registerSign(param).then((res) => {
          console.log("11111")
          if (this.curPayType==4||(this.curPayType!=4&&res.signresult == 0)) {
            console.log("22222")
            let data = {
              regPayType: this.curPayType,
              statusText: '',
              bookType: this.bookType,
              status: 0,
              registerfee: '￥'+this.bookingData.registerfee,
            };
            let payInfo = {
              title:this.bookType==0?'预约挂号':'当日挂号',
              regPayType: this.curPayType,
              routeName: 'register',
              orderNo: res.orderNo,
              bookType: this.bookType,
              doctorNotice: this.doctorInfo.treatmentnotice,
              registerfee: '￥'+this.bookingData.registerfee,
              doctorName: this.doctorInfo.doctorname,
              doctorRank: this.doctorInfo.doctorrank,
              doctorSpecialty: this.doctorInfo.doctorspecialty,
              dotcorPhoto: this.doctorInfo.doctorphoto,
              hospitalDeptName: this.doctorInfo.departmentname,
              hospitalName: this.doctorInfo.hospitalname,
              realName: this.memberInfo.realname,
              doctorid: this.doctorInfo.doctorid,
              hospitalid: this.doctorInfo.hospitalid,
              riid: this.memberInfo.riid,//亲友ID
              regDate: this.bookingData.regdate,
              worktype: this.scheduleInfo.worktype,
              regTime: this.scheduleInfo.timequantum,
              scheduleid: this.scheduleInfo.scheduleid,
              cardno: this.cardInfo.cardno || '',
              cid: this.memberInfo.cid,
              cardtype: this.cardInfo.cardtype || '',
            }
            localStorage.setItem('pay-info', JSON.stringify(payInfo));
            if (this.curPayType == 4) {
              data.statusText = this.curStatus(res.bsstatus, this.bookType);
              Object.assign(data, res);
              this.$store.commit('updateBookingResult', data);

              shareInst.client.push({path: '/confirmLoading'})

            } else {
              console.log(data);
              console.log(res);
              Object.assign(data, res);
              localStorage.setItem('bookingResult', JSON.stringify(data));
              this.$store.commit('updateBookingResult', data);
              res.payType = this.curPayType;
              res.nextLocation = {
                path: "/confirmLoading"
              };
              console.log("33333")
              window.shareInst.client.payment(res).then((res) => {
                if (shareInst.client.isWeChat()) {
                  shareInst.client.push({path: '/confirmLoading'})
                }
              });
            }
          }else{
            this.$vux.alert.show({
              title:res.bstitle,
              content:res.bsmessage
            })
          }
        })
      },
      curStatus(bsstatus, bookType) {
        let status = Number(bsstatus);
        let bt = bookType == 0 ? '预约' : '';
        switch (status) {
          case 0:
            return bt + "挂号成功"
          case 1:
            return bt + "挂号失败"
          case 2:
            return "已取消"
          case 3:
            return bt + "挂号异常"
          default:
            return ""
        }
      },
      payBooking() {
        if (this.curPayType == '') {
          this.$vux.alert.show({
            title: '提示',
            content: '请选择支付方式！！',
//            showCancelButton: true
          });
          return;
        }
        if (this.curPayType == 4) {
          if (parseFloat(this.bookingData.registerfee) > parseFloat(this.totalBalance)) {
            let diffMoney = parseFloat(this.bookingData.registerfee) - parseFloat(this.totalBalance)

            diffMoney = Math.abs(diffMoney)
            let self = this
            this.$vux.confirm.show({
              title: '提示',
              content: '就诊卡余额不足，请前往充值！',
              confirmText: '前往充值',
              cancelText: '暂不充值',
              // 组件除show外的属性
              onCancel() {

              },
              onConfirm() {
                shareInst.client.push({
                  path: '/PayForm',
                  query: {funKey: self.funKey, routeName: 'register', diffMoney: diffMoney}
                })
              }
            })
            return;
          }
        }
        this.registersign();

        // 拉起支付
//        Wechat.WxPay(res.data,function(result){
//          // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
//          if(result.err_msg=="get_brand_wcpay_request:ok") {
//            // 支付确认,保存订单号
//            tool.hPush({
//              name:'/bookingResult'
//            },this)
//          }
//        })
      }
    }
  }
</script>
<style>
  .cmc-tip-bar {
    padding: 13px 10px;
    border-bottom: 1px solid #D9D9D9;
    color: #333;
    width: 100%;
    font-size: 14px;
    background: #fff;
  }

  .pay-type-plan {
    display: flow-root;
    padding: 0px 5px 10px 5px;
  }

  .pay-type-plan .pay-type-box {
    float: left;
    width: 50%;
    display: block;
    padding: 10px 5px 0px;
    box-sizing: border-box;
  }

  .pay-type-plan .pay-type.checked {
    border-color: #9CCC65;
  }

  .pay-type-plan .pay-type {
    border: 2px solid #DCDCDC;
    box-sizing: border-box;
    display: flow-root;
    padding: 15px 20px;
    border-radius: 5px;
    position: relative;
  }

  .pay-type-plan .pay-type .pay-type-info {
    font-size: 14px;
    line-height: 1rem;
    position: absolute;
    left: 65px;
    top: 50%;
    transform: translateY(-50%);
  }

  .pay-type-plan .pay-type-box img {
    float: left;
    width: 36px;
    height: 36px;
    vertical-align: middle;
    margin-right: 10px;
  }

  .pay-type-plan .pay-type-box span {
    vertical-align: middle;
  }

  .pay-type-plan .pay-type-box .pay-type-balance {
    margin-top: 5px;
    color: red;
  }

  .money {
    color: #F43530;
  }

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
  .booking-info-bar .booking-info-title{
    width: 30px;
  }
  .pay-ok-btn{
	border-radius:0 !important;
  }
</style>
