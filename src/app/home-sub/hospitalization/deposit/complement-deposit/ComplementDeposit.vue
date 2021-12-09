<template>
  <div class="page">
    <view-box>
    <x-header slot="header">补交押金</x-header>
    <div>
      <tip-text-bar>为了您的资金安全，单笔支付最高上限为20000</tip-text-bar>
      <group :gutter="0">
          <div class="booking-result-plan" style="margin-top: 0;">
            <div class="booking-result-header line-bottom">
              <div class="booking-result-info-bar">
                <span class="booking-result-info-title">姓名</span>
                <span class="booking-result-info-value">{{selectedMember.realname}}</span>
              </div>
            </div>
            <div class="booking-result-body">
              <div class="booking-result-info-bar" >
                <span class="booking-result-info-title">{{cardInfo.cardTypeName}}</span>
                <span class="booking-result-info-value">{{cardInfo.cardno}}</span>
              </div>
              <div class="booking-result-info-bar" >
                <span class="booking-result-info-title">预交金余额</span>
                <span class="booking-result-info-value">￥{{deposit.amountbalance}}</span>
              </div>
              <div class="booking-result-info-bar">
                <span class="booking-result-info-title">日均费用</span>
                <span class="booking-result-info-value">￥{{aveDepositFee}}</span>
              </div>
            </div>
          </div>
      </group>
      <group :gutter="10">
        <x-input v-model="money" @on-change="keyupAction" ref="moneyInput" placeholder="在此输入缴费金额" class="money-input">
          <span class="money-label" slot="label">￥</span>
        </x-input>
      </group>

      <pay-method :payMethods="allPayMethods" @selected="selectedPayMethod"></pay-method>

    </div>
    <footer slot="bottom" class="bottom-bar" v-if="money">
      <div class="pay-money-box">
        <span class="pay-money-title">费用合计</span>
        <span class="pay-money-value money">￥{{money ? (parseFloat(money)).toFixed(2) : '0.00'}}</span>
      </div>
      <div class="pay-ok-btn" @click="clickPay">
        确认支付
      </div>
    </footer>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions,mapGetters} from 'vuex'
  import {XNumber} from 'vux'
  export default {
    computed: {
      ...mapState({
        stayHospitalInfo:state=>state.stayHospitalInfo,
        aveDepositFee:state=>state.aveDepositFee,
        deposit:state=>state.deposit,
        selectedMember:state=>state.selectedMember,
        stayHospitalInfo:state=>state.stayHospitalInfo,
        hospitalInfo:state=>state.hospital.current
      }),
      ...mapGetters({totalBalance:"totalBalance",allPayMethods:"allPayMethods"}),
      cardInfo:function(){
        return this.$store.state.selectedCards[this.funKey];
      },
      funKey:function(){
        return this.$routeData.funKey
      },

    },
    components:{
      XNumber
    },
    mounted(){
      this.$refs.moneyInput.focus()
    },
    created() {

      shareInst.gby = this;
      console.log("-----补交押金--BJYG:",this.allPayMethods);

      window.byAddEventListener("displayChange",(event)=>{
       console.log(`--事件处理器：${event.type}`);
        let data = event.data  ;

        let currWVO = window.plus.webview.currentWebview();

        if (currWVO.id != data.webviewID && data.action == "close"){
          this.$forceUpdate()
        }
      })

      this.allPayMethods.forEach((val)=>{
        if(val.type==4){
          this.loadMeidcalResource();
        }
      })
    },
    data() {
      return {
        money:'',
        payMethod:{}
      }
    },
    methods: {
      ...mapActions(["payinfo","stayHosOrderSign"]),
      selectedPayMethod(payMethod){
        this.payMethod=payMethod
      },
      formatMoney(){
        if(this.money){
          let a=this.money.toFixed(2)
          return a
        }else{
          return '0.00'
        }
      },
      keyupAction(){
        this.$nextTick(()=>{
          // 过滤字符串
          if( this.money !=''&&  this.money.substr(0,1) == '.'){
            this.money="";
          }
          this.money = this.money.replace(/^0*(0\.|[1-9])/, '$1');//解决 粘贴不生效
          this.money = this.money.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
//        this.money = this.money.replace(/[^\d]/g,"");  //清除“数字”以外的字符  只能整数
          this.money = this.money.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
          this.money = this.money.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
          this.money = this.money.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数

          // 控制最大金额
          if (parseFloat(this.money) > 20000) {
            this.money = 20000;
            this.$vux.toast.show({
              type: 'text',
              text: `不能超过20000元`,
              time: 1000
            })
          }
        })


        // 过滤小数
        // if(this.dueFee.indexOf('.') != -1){

        //     let n = this.dueFee.split('.')[0];
        //     if(n>0){
        //         this.dueFee = this.dueFee.split('.')[0]
        //     }else{
        //         this.dueFee = '';
        //     }

        // }

      },
      clickPay(){
        if(!this.payMethod.type){
          this.$vux.alert.show({
            title: '提示',
            content: '请选择支付方式',
            onShow () {
            },
            onHide () {
            }
          })
          return;
        }
        this.complementDeposit();
      },
      loadMeidcalResource(){
        let param = {
          riid: this.selectedMember.riid,
          cardno:this.cardInfo.cardno,
          cardtype:this.cardInfo.cardtype,
          pkreghospital:this.hospitalInfo.pkregHospitalId,
          hospitalcode:this.hospitalInfo.hospitalcode
        }
        this.payinfo(param).then((res)=>{
        })

      },
      complementDeposit(){
        if(this.payMethod.type==4){
          if(parseFloat(this.money) > parseFloat(this.totalBalance)){
            let self=this
            let diffMoney = parseFloat(this.money) - parseFloat(this.totalBalance)
            diffMoney = Math.abs(diffMoney)
            this.$vux.confirm.show({
              title:'提示',
              content:'就诊卡余额不足，请前往充值！',
              onConfirm () {
                shareInst.client.push({path:'/PayForm',query:{funKey:self.funKey,routeName:'deposit',diffMoney:diffMoney}})
              }
            })
            return;
          }
        }
        this.stayhosordersign();
      },
      stayhosordersign(){
        this.stayHosOrderSign({
          riid:this.cardInfo.riid,
          realname:this.selectedMember.realname,
          cardno:this.cardInfo.cardno,
          cardtype:this.cardInfo.cardtype,
          cid:this.selectedMember.cid,
          hosptotalfee:this.money,
          thridpayfee:this.money,
          paytype:this.payMethod.type,
          hospitalcode:this.hospitalInfo.hospitalcode,
          serialnum:this.stayHospitalInfo.serialnum,
          stayhospitalnum:this.stayHospitalInfo.stayhospitalnum,
          departmentname:this.stayHospitalInfo.departmentname,
          bingqu:this.stayHospitalInfo.bingqu,
          bednum:this.stayHospitalInfo.bednum,
          zhenduan:this.stayHospitalInfo.zhenduan
        }).then((res)=>{
          if(res.signresult==0){

            let payInfo={
              title:'补交押金',
              orderNo:res.orderNo,
              routeName:'complementDeposit',
              regPayType:this.payMethod.type,
              cardNo:this.cardInfo.cardno,
              cardType:this.cardInfo.cardtype,
              hospitalcode:this.hospitalInfo.hospitalcode,
              hospitalname:this.hospitalInfo.hospitalname,
              realname:this.selectedMember.realname,
              serialnum:this.stayHospitalInfo.serialnum,
              money:(parseFloat(this.money||0)).toFixed(2),
              stayhospitalnum:this.stayHospitalInfo.stayhospitalnum,
              riid:this.selectedMember.riid
            }
            Object.assign(payInfo,res);

            localStorage.setItem('pay-info',JSON.stringify(payInfo));

            if(this.payMethod.type==4){

              shareInst.client.push({path:'/confirmLoading'})

            }else{

              res.payType = this.payMethod.type ;
              res.nextLocation = {
                path:"/confirmLoading"
              };

              window.shareInst.client.payment(res).then((res)=>{
                if(shareInst.client.isWeChat()){
                  shareInst.client.push({path:'/confirmLoading'})
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
      }
    }
  }
</script>
<style lang="scss" scoped>
  .tip-item{
    font-size: 14px;
  }
  .bottom-bar .pay-money-box .pay-money-value.money{
		color:#F43530;
	}
	.own-web-plan{
		background: #F3F6FC;
	}
  .booking-info-title{
    width: 80px;
  }
  .money-input{
    caret-color:#4B6BAF;
    font-size: 30px;
  }
  .money-label{
    font-size: 30px;
  }
</style>
