<template>
  <div style="height: 100%;">
    <x-header v-show="false">{{payInfo.title}}</x-header>
    <div class="vux-center" style="height:75%;text-align:center;line-height: 75%;">
      <div>
        <img src="@icon/loading.png" class="loading" alt="">
        <p style="color:#666;padding-top:20px;">{{tipsText}}</p>
      </div>
    </div>
  </div>
</template>

<script>

  import {mapState, mapActions} from 'vuex'
  import {osName} from '@constant.js' ;
  export default {
    data() {
      return {
        tipsText: '支付结果确认中，请稍候...',
        timer: {},
        timerTime: 0,
        payInfo: JSON.parse(localStorage.getItem("pay-info")),
        outTime: 30,
        flagTime: '',
        bookingResult: JSON.parse(localStorage.getItem("bookingResult"))
      }
    },
    computed: {
      ...mapState({
        hospitalInfo: state => state.hospital.current,
        departmentInfo: state => state.selectedDepartment,
        doctorInfo: state => state.doctorInfo,
        scheduleInfo: state => state.selectedSchedule,
        bookingData: state => state.bookingData,
        memberInfo: state => state.selectedMember,
        cardInfo: state => state.selectedCard,

      })
    },
    created() {
      if (this.payInfo.regPayType == 4) {
        if (this.payInfo.routeName == 'register') {
          shareInst.client.replace({
            path: '/bookingResult'
          })
        } else if (this.payInfo.routeName == 'outpatientSingle') {
          this.$store.commit('updateOutpatientPayResult', this.payInfo)
          shareInst.client.replace({
            path: '/outpatientPayResult',
            query: {
              cardno: this.payInfo.cardNo,
              cardtype: this.payInfo.cardType,
              riid: this.payInfo.riid,
              hospitalcode: this.payInfo.hospitalcode
            }
          })
        } else if (this.payInfo.routeName == 'outpatientMerger') {
          let datas = this.payInfo.content;
          let list = [];
          datas.forEach((val) => {
            Object.assign(val, {
              cardType: this.payInfo.cardtype,
              hospitalcode: this.payInfo.hospitalcode,
              hospitalname: this.payInfo.hospitalname,
              patientname: this.payInfo.patientname,
            });
            Object.assign(val, this.payInfo.outids[val.hisorderno])
            list.push(val);
          })
          this.$store.commit('updateOutpatientPayResults', list)
//          this.$store.commit('updateOutpatientPayResults',this.payInfo.content)
          shareInst.client.replace({
            path: '/mergerPayResult',
            query: {
              cardno: this.payInfo.cardNo,
              cardtype: this.payInfo.cardType,
              riid: this.payInfo.riid,
              hospitalcode: this.payInfo.hospitalcode
            }
          })
        } else if (this.payInfo.routeName == 'waitting') {
          localStorage.setItem('isCanTakeNo', true);
          if(this.payInfo.regPayType==7){
            shareInst.client.back("WXH5Pay",-3)
          }else if(this.payInfo.regPayType==6){
            shareInst.client.back("Alipay",-3)
          }else{
            shareInst.client.go(-3)
          }
        }
      } else if (this.payInfo.regPayType == 7) {
//        if (shareInst.client.osName == osName.ios  || shareInst.client.osName == osName.android) {
//          plus.key.addEventListener("backbutton",(event)=>{
//            shareInst.client.go(-2)
//          });
//        }
        let self=this
        this.$vux.confirm.show({
          title: '支付提示',
          content: '请确认微信支付是否已经完成',
          confirmText: '已支付完成',
          cancelText: '返回重新支付',
          onCancel() {
//            shareInst.client.go(-2)
            shareInst.client.back("WXH5Pay")
          },
          onConfirm() {
            self.flagTime = new Date().getTime();
            //同步检验支付结果
            self.syncvalidate();
          }
        })
      } else {
        this.flagTime = new Date().getTime();
        //同步检验支付结果
        this.syncvalidate();
      }
    },
    destroyed() {
      clearInterval(this.timer);
    },
    methods: {
      ...mapActions(["syncValiDate", "registerPayResult", "rechargePayResult", "mergePayOrderResult", "stayHosPayResult", "takeNoPayResult","reqNatItemResult"]),
      syncvalidate() {
        let param = {
          payinfo: this.payInfo.orderNo || '', //微信订单号
          paytype: this.payInfo.regPayType,
          payclientid:''
        }
        if(this.payInfo.routeName == 'nucleicInscpet'){
          param.payclientid = shareInst.clientId
        }
        if(this.payInfo.isScan==1){
          Object.assign(param,{
            uid:'-1',
            ticket:'-1',
            isscan:1
          })
        }
        this.syncValiDate(param).then((res) => {
          if (!res.result||res.data.checkresult == 1) { //待支付 轮询接口直到成功
            if (this.isLoop()) {
              this.syncvalidate();
            } else {
              if (this.payInfo.routeName == 'register') {
                this.registerError(2);
              } else if (this.payInfo.routeName == 'recharge') {
                this.rechargeError(2);
              } else if (this.payInfo.routeName == 'outpatientSingle') {
                this.singlePayError(2);
              } else if (this.payInfo.routeName == 'outpatientMerger') {
                this.mergerPayError(2);
              } else if (this.payInfo.routeName == 'waitting') {
                if(this.payInfo.regPayType==7){
                  shareInst.client.back("WXH5Pay")
                }else if(this.payInfo.regPayType==6){
                  shareInst.client.back("Alipay")
                }else{
                  shareInst.client.back()
                }
              } else if (this.payInfo.routeName == 'complementDeposit') {
                this.stayHospayError(2);
              } else if(this.payInfo.routeName == 'nucleicInscpet'){
                this.nucleicInscpetError(2)
              }
            }
          } else {
            if (this.payInfo.routeName == 'register') {//挂号支付
              if (this.payInfo.bookType == 0) {
                this.tipsText = '正在为您预约挂号...';
              } else {
                this.tipsText = '正在为您挂号中...';
              }
              this.flagTime = new Date().getTime();
              this.registerpayresult();
            } else if (this.payInfo.routeName == 'recharge') {//门诊充值
              this.tipsText = '已确认支付结果，正在为您充值中...';
              this.flagTime = new Date().getTime();
              this.rechargepayresult();
            } else if (this.payInfo.routeName == 'outpatientSingle') {//门诊缴费
              this.tipsText = '已确认支付结果，正在为您缴费中...';
              this.flagTime = new Date().getTime();
              this.mergepayorderresult(1)
            } else if (this.payInfo.routeName == 'outpatientMerger') {//门诊缴费
              this.tipsText = '已确认支付结果，正在为您缴费中...';
              this.flagTime = new Date().getTime();
              this.mergepayorderresult(2)
            } else if (this.payInfo.routeName == 'complementDeposit') {//补交押金
              this.tipsText = '已确认支付结果，正在为您预交中...';
              this.flagTime = new Date().getTime();
              this.stayHospayResult()
            } else if (this.payInfo.routeName == 'waitting') {//取号候诊
              this.tipsText = '已确认支付结果，正在为您取号中...';
              this.flagTime = new Date().getTime();
              this.getTakePayResult();
            } else if(this.payInfo.routeName == 'nucleicInscpet'){
              this.tipsText = '已确认支付结果，正在为您预交中...';
              this.flagTime = new Date().getTime();
              this.nucleicInscpet(2)
            }
          }
        })

      },
      nucleicInscpetError(){
        this.$store.commit('updateNatResult', {
          state:-1,
          message:'支付失败',
          sendNo:'',
          natId :'',
          isCancel :'0',
          isTopay :'0'
        })
        shareInst.client.replace({
          path: 'nucleicInscpetResult'
        })
      },
      //核酸检验
      nucleicInscpet(){
        this.reqNatItemResult({
          riid:this.payInfo.riid,
          cardno:this.payInfo.cardNo,
          hospitalcode: this.payInfo.hospitalcode,
          natId:this.payInfo.ids,
          natCode:this.payInfo.codes||'',
          orderNo:this.payInfo.orderNo
        }).then((res)=>{
          if (!res.result||res.data.ispolling == 1) {//是否轮询：1需要 0不需要
            if (this.isLoop()) {
              this.timer = setInterval(() => {

                clearInterval(this.timer);
                this.nucleicInscpet()

              }, 5000);
            } else {
              this.nucleicInscpetError(0);
            }
          }else{
            if(!res.result){
              nucleicInscpetError()
              return;
            }
            let data = res.data.content.length>0?res.data.content[0]:{}
            let message = ''
            if(data.bsstatus=='0'){
              message='预约成功'
            }else{
              if(data.payresult=='0'){
                message = '预约失败'
              }else if(data.payresult == '1'){
                message = '支付异常'
              }else if(data.payresult == '2'){
                message = '错误'
              }else if(data.payresult == '3'){
                message = '已退款'
              }else if(data.payresult == '4'){
                message = '退款失败'
              }
            }
            let barcode = []
            res.data.content.forEach((item)=>{
              if(item.barcode){
                barcode.push(item.barcode)
              }
            })
            this.$store.commit('updateNatResult', {
              state:data.bsstatus=='0'?'0':-1,
              message:message,
              sendNo:'',
              natId :'',
              isCancel :'0',
              isTopay :'0',
              barcode:barcode,
              name:data.itemname,
              amount:data.amount
            })
            shareInst.client.replace({
              path: 'nucleicInscpetResult'
            })
          }
        })
      },
      // 获取住院押金结果
      stayHospayResult() {
        let param = {
          hospitalcode: this.payInfo.hospitalcode,
          cardno: this.payInfo.cardNo,
          cardtype: this.payInfo.cardType,
          orderno: this.payInfo.orderNo || '',
          serialnum: this.payInfo.serialnum,
          riid:this.payInfo.riid
        }
        this.stayHosPayResult(param).then((res) => {
          if (!res.result||res.data.ispolling == 1) {//是否轮询：1需要 0不需要
            if (this.isLoop()) {
              this.timer = setInterval(() => {

                clearInterval(this.timer);
                this.stayHospayResult()

              }, 5000);
            } else {
              this.stayHospayError(0);
            }
          } else {
            let bResult = this.payInfo;
            if (res.data.content.length > 0) {
              Object.assign(bResult, res.data.content[0])
            }
            this.$store.commit('updateDepositPayResult', bResult)
            shareInst.client.replace({
              path: '/depositResult',
              query: {
                cardno: this.payInfo.cardNo,
                cardtype: this.payInfo.cardType,
                riid: this.payInfo.riid,
                hospitalcode: this.payInfo.hospitalcode,
              }
            })
          }
        })
      },
      // 获取门诊缴费结果
      mergepayorderresult(type) {//type 1 单笔支付 2 合单支付
        let param = {
          hospitalcode: this.payInfo.hospitalcode,
          cardno: this.payInfo.cardNo,
          cardtype: this.payInfo.cardType,
          orderno: this.payInfo.orderNo || ''
        }
        if(this.payInfo.isScan==1){
          Object.assign(param,{
            uid:'-1',
            ticket:'-1',
            isscan:1
          })
        }
        this.mergePayOrderResult(param).then((res) => {
          if (!res.result||res.data.ispolling == 1) {
            if (this.isLoop()) {
              this.timer = setInterval(() => {

                clearInterval(this.timer);
                this.mergepayorderresult(type)

              }, 5000);
            } else {
              if (type == 1) {
                this.singlePayError(0);
              } else {
                this.mergerPayError(4);
              }
            }
          } else {
            let bResult = this.payInfo;
            if (type == 1) {
              if (res.data.content.length > 0) {
                Object.assign(bResult, res.data.content[0]);
                this.$store.commit('updateOutpatientPayResult', bResult)
                shareInst.client.replace({
                  path: '/outpatientPayResult',
                  query: {
                    cardno: this.payInfo.cardNo,
                    cardtype: this.payInfo.cardType,
                    riid: this.payInfo.riid,
                    hospitalcode: this.payInfo.hospitalcode,
                  }
                })
              }
            } else {
              let datas = res.data.content;
              let list = [];
              datas.forEach((val) => {
                Object.assign(val, {
                  cardType: this.payInfo.cardtype,
                  hospitalcode: this.payInfo.hospitalcode,
                  hospitalname: this.payInfo.hospitalname,
                  patientname: this.payInfo.patientname,
                });
                let outid = val.outid
                Object.assign(val, this.payInfo.outids[val.hisorderno])
                val.outid = outid
                val.isScan=this.payInfo.isScan
                list.push(val);
              })
              this.$store.commit('updateOutpatientPayResults', list)
//              this.$store.commit('updateOutpatientPayResults',res.content)
              shareInst.client.replace({
                path: '/mergerPayResult',
                query: {
                  cardno: this.payInfo.cardNo,
                  cardtype: this.payInfo.cardType,
                  riid: this.payInfo.riid,
                  hospitalcode: this.payInfo.hospitalcode
                }
              })
            }
          }
        })
      },
      //获取取号候诊结果
      getTakePayResult() {
        let param = {
          hospitalcode: this.payInfo.hospitalcode,
          cardno: this.payInfo.cardNo,
          cardtype: this.payInfo.cardType,
          orderno: this.payInfo.orderNo || ''
        }
        this.takeNoPayResult(param).then((res) => {
          if (!res.result||res.data.payresult == 3) {
            if (this.isLoop()) {
              this.timer = setInterval(() => {

                clearInterval(this.timer);
                this.getTakePayResult()

              }, 5000);
            } else {
              if(this.payInfo.regPayType==7){
                shareInst.client.back("WXH5Pay")
              }else if(this.payInfo.regPayType==6){
                shareInst.client.back("Alipay")
              }else{
                shareInst.client.back()
              }
            }
          } else {
            if (res.payresult == 0) {
              localStorage.setItem('isCanTakeNo', true);
            } else if (res.payresult == 1) {
              this.$vux.toast.text('退款成功')
            } else if (res.payresult == 2) {
              this.$vux.toast.text('退款失败')
            }
            if(this.payInfo.regPayType==7){
              shareInst.client.back("WXH5Pay",-3)
            }else if(this.payInfo.regPayType==6){
              shareInst.client.back("Alipay",-3)
            }else{
              shareInst.client.go(-3)
            }
          }
        })
      },
      // 取号
      getNumber() {

      },
      // 获取挂号支付结果
      registerpayresult() {
        this.registerPayResult({
          orderno: this.payInfo.orderNo
        }).then((res) => {
          if (!res.result||res.data.ispolling == 1) { //是否轮询：1需要 0不需要
            if (this.isLoop()) {
              this.timer = setInterval(() => {

                clearInterval(this.timer);
                this.registerpayresult()

              }, 5000);
            } else {
              this.registerError(0);
            }
          } else {
            let bResult = this.bookingResult;
            bResult.statusText = this.curStatus(res.data.content.bsstatus, this.bookingResult.bookType);

            Object.assign(bResult, res.data.content)
//            this.bookingResult.status = 0;
            this.$store.commit('updateBookingResult', bResult)
            shareInst.client.replace({
              path: '/bookingResult',
              query: {
                bookType: this.bookingResult.bookType
              }
            });
          }
        })

      },
      // 充值结果
      rechargepayresult() {
        this.rechargePayResult({
          orderno: this.payInfo.orderNo,
          cardno: this.payInfo.cardNo
        }).then((res) => {
          if (!res.result||res.data.ispolling == 1) { //是否轮询：3需要 其他不需要
            if (this.isLoop()) {
              this.timer = setInterval(() => {

                clearInterval(this.timer);
                this.rechargepayresult()

              }, 5000);
            } else {
              this.rechargeError(0);
            }
          } else {
            let isHaveBack = localStorage.getItem("is-have-back");
            if (isHaveBack == 'true') {
              if (res.data.bsstatus == 0) {
                this.$vux.toast.text("充值成功");
              } else {
                this.$vux.toast.text("充值失败");
              }
              if(this.payInfo.regPayType==7){
                shareInst.client.back("WXH5Pay",-2)
              }else if(this.payInfo.regPayType==6){
                shareInst.client.back("Alipay",-2)
              }else{
                shareInst.client.go(-2)
              }
            } else {
              let bResult = this.payInfo;
              Object.assign(bResult, res.data)
              this.$store.commit('updateRechargeResult', bResult)
              shareInst.client.replace({
                path: '/RechargeResult'
              });
            }
          }
        })

      },
      stayHospayError(payresult) {
        let data = {
          status: 2,
          payresult: payresult,
        }
        Object.assign(data, this.payInfo);
        this.$store.commit('updateDepositPayResult', data)
        shareInst.client.replace({
          path: '/depositResult',
          query: {
            cardno: this.payInfo.cardNo,
            cardtype: this.payInfo.cardType,
            riid: this.payInfo.riid,
            hospitalcode: this.payInfo.hospitalcode,
          }
        })
      },
      singlePayError(payresult) {
        let data = {
          cardNo: this.payInfo.cardNo,
          orderNo: this.payInfo.orderNo,
          regPayType: this.payInfo.regPayType,
          patientname: this.payInfo.patientname,
          payresult: payresult,
          bsstatus:2,

        }
        Object.assign(data, this.payInfo)
        data.payresult=3
        this.$store.commit('updateOutpatientPayResult', data)
        alert(JSON.stringify(shareInst.store.state.outpatientPayResult))
        shareInst.client.replace({
          path: '/outpatientPayResult',
          query: {
            cardno: this.payInfo.cardNo,
            cardtype: this.payInfo.cardType,
            riid: this.payInfo.riid,
            hospitalcode: this.payInfo.hospitalcode,
          }
        })
      },
      mergerPayError(payresult) {

        let datas = this.payInfo.detailslist;
        let list = [];
        datas.forEach((val) => {
          Object.assign(val, {
            bsstatus: 2,
            cardType: this.payInfo.cardtype,
            hospitalcode: this.payInfo.hospitalcode,
            hospitalname: this.payInfo.hospitalname,
            patientname: this.payInfo.patientname,
            payresult: payresult,
            regPayType:this.payInfo.regPayType
          });
          if (this.payInfo.content && this.payInfo.content.length > 0) {
            let a = this.payInfo.content.find(i => i.hisorderno == val.outid);
            val.outid = a.outid
          }
          val.bsstatus=2
          val.payresult=payresult
          list.push(val);
        })
        this.$store.commit('updateOutpatientPayResults', list)
        shareInst.client.replace({
          path: '/mergerPayResult',
          query: {
            cardno: this.payInfo.cardNo,
            cardtype: this.payInfo.cardType,
            riid: this.payInfo.riid,
            hospitalcode: this.payInfo.hospitalcode,
          }
        })
      },
      rechargeError(payresult) {
        let data = {
          cardNo: this.payInfo.cardNo,
          orderNo: this.payInfo.orderNo,
          regPayType: this.payInfo.regPayType,
          payresult: payresult,
          receipt: '',
          barcode: '',
          payorderno: '',
          bsorderno: this.payInfo.orderNo,
          payTypeName: this.payInfo.payTypeName,
          routeName: 'recharge',
          memberName: this.payInfo.memberName,
          rechargeamount: this.payInfo.rechargeamount,
          balance: this.payInfo.balance,
          bsstatus: 2,
          hospitalcode: this.payInfo.hospitalcode,
          pkregHospitalId: this.payInfo.pkregHospitalId
        }
        let isHaveBack = localStorage.getItem("is-have-back");
        if (isHaveBack == 'true') {
          this.$vux.toast.text("充值失败");
          if(this.payInfo.regPayType==7){
            shareInst.client.back("WXH5Pay",-2)
          }else if(this.payInfo.regPayType==6){
            shareInst.client.back("Alipay",-2)
          }else{
            shareInst.client.go(-2)
          }
        } else {
          this.$store.commit('updateRechargeResult', data)

          shareInst.client.replace({
            path: '/RechargeResult'
          });
        }
      },
      registerError(payresult) {
        let data = {
          statusText: (this.payInfo.bookType == 0 ? '预约' : '') + '挂号异常',
          bsstatus: 3,
          payresult: payresult
        }
        Object.assign(data, this.payInfo)
        this.$store.commit('updateBookingResult', data);
        shareInst.client.replace({
          path: '/bookingResult',
          query: {
            bookType: this.payInfo.bookType
          }
        });
      },
      isLoop() {
        if (this.flagTime == '') {
          this.flagTime = new Date().getTime();
        }
        let now = new Date().getTime();
        if ((now - this.flagTime) > (this.outTime * 1000)) {
          this.flagTime = '';
          return false;
        }
        return true;
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
      }
    }
  }
</script>

<style scoped>
  .loading {
    height: 100px;
    width: 100px;
    animation: spin 2000ms infinite linear
  }

  @keyframes spin {
    0% {
      transform: rotate(360deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
</style>
