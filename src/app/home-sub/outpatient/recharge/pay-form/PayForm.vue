<template>
  <div class="page">
    <view-box body-padding-bottom="100px">
      <x-header slot="header">门诊充值</x-header>
      <!--切换就诊人-->
      <!--<group gutter="0">
        <cell  is-link @click.native="changeMember">
          <span slot="title" class="pay-form-name"><span>{{selectedMember.realname}}</span>  <span>{{selectedCard.cardno}}</span></span>
          <span>更换就诊人</span>
           </cell>
      </group>-->

      <change-patient v-if="routeName=='recharge'" :realname="selectedMember.realname" :cardno="selectedCard.cardno"
                      :to="changePatientTo"></change-patient>
      <group :gutter="0" v-else>
        <cell>
          <span slot="title" class="pay-form-name"><span>{{selectedMember.realname}}</span>  <span>{{selectedCard.cardno}}</span></span>
        </cell>
      </group>
      <tip-text-bar>为了您的资金安全，单笔支付最高上限为{{hospitalInfo.singleRechargeMax}}</tip-text-bar>
      <!-- 充值金额 -->

     <!-- <div class="allbalance-box">
        <div>余额</div>
        <div>
          ￥{{allbalance || '0.00'}}
        </div>
      </div>-->

      <group :gutter="0">
        <cell class="current-money line-bottom" is-link @click.native="toRechargeList">
          <span slot="title">当前余额：<span class="money-text">￥{{allbalance || '0.00'}}</span></span>
          <span>充值记录</span>
        </cell>




        <div class="pay-form-title">充值金额</div>



        <!--<cell-box class="pay-form-cell-box">

          <checker class="money-radio" selected-item-class="selected" default-item-class="money-item" v-model="moneyVal"
                   type="radio">
            <checker-item @on-item-click="moneyItemClick" :value="50">50元</checker-item>
            <checker-item @on-item-click="moneyItemClick" :value="100">100元</checker-item>
            <checker-item @on-item-click="moneyItemClick" :value="200">200元</checker-item>
            <checker-item @on-item-click="moneyItemClick" :value="500">500元</checker-item>
            <checker-item @on-item-click="moneyItemClick" selected value="">其它</checker-item>
          </checker>

        </cell-box>-->
        <x-input v-if="!moneyVal" title="￥" label-width="2rem" ref="moneyInput" v-model="money" @on-change="moneyInputChange"
                 :disabled="moneyInputDisabled" placeholder=" 请输入充值金额"
                 class="pay-money-input"></x-input>
        <!--<cell class="tip-item" title="为了您的资金安全，单笔支付最高上限为500">
          <img slot="icon" src="@icon/tip.png"/>
        </cell>-->
        <grid :cols="2" class="money-box">
          <grid-item @click.native="money=50">
            50元
          </grid-item>
          <grid-item @click.native="money=100">
            100元
          </grid-item>
          <grid-item @click.native="money=200">
            200元
          </grid-item>
          <grid-item @click.native="money=500">
            500元
          </grid-item>
        </grid>
      </group>


      <!--支付方式-->
      <pay-method :payMethods="allPayMethods" @selected="selectedPayMethod"></pay-method>

      <!--确认按钮-->
      <!--<x-button :disabled="disabledBtn" type="primary" @click.native="confirmHandel" >确定</x-button>-->
      <footer slot="bottom"  class="pay-form-confirm-group bottom-bar">

        <div class="confirm-btn ">
          总费用: <span>￥{{money ? (parseFloat(money)).toFixed(2) : '0.00'}}</span>
        </div>
        <div class="pay-ok-btn" @click="confirmHandel">
          确认支付
        </div>
      </footer>

    </view-box>
  </div>
</template>


<script>
  import {mapGetters, mapState, mapActions} from 'vuex'
  import tool from '@common/libs/tool'
  import ChangePatient from "../../../../components/ChangePatient.vue";
  import Grid from "../../../../../../node_modules/vux/src/components/grid/grid.vue";
  import GridItem from "../../../../../../node_modules/vux/src/components/grid/grid-item.vue";

  export default {
    name: "PayForm",
    components: {
      GridItem,
      Grid,
      ChangePatient
    },
    inject: ['reload'],
    mounted(){
      this.$refs.moneyInput.focus()
    },
    created() {

      window.byAddEventListener("displayChange",(event)=>{
       console.log(`--事件处理器：${event.type}`);
        let data = event.data  ;

        let currWVO = window.plus.webview.currentWebview();

        if (currWVO.id != data.webviewID && data.action == "close"){
//          this.$forceUpdate()
          this.reload();
        }
      })

      if (this.diffMoney) {
        this.money = parseFloat(this.diffMoney).toFixed(2)
        if(parseFloat(this.money)<parseFloat(this.diffMoney)){
          this.money=parseFloat(this.money)+0.01;
        }
      }
      this.payinfo({
        riid: this.selectedMember.riid,
        cardno: this.selectedCard.cardno,
        cardtype: this.selectedCard.cardType,
        hospitalcode: this.hospitalInfo.hospitalcode,
        pkreghospital: this.hospitalInfo.pkregHospitalId
      });
    },
    data: function () {
      return {
        moneyVal: '',
        money: '',
        payMethod: {},
        moneyInputDisabled: false
      };
    },
    computed: {
      ...mapGetters(["allPayMethods"]),
      ...mapState({
        hospitalInfo: state => state.hospital.current,
        selectedMember: state => state.selectedMember,
        allbalance: state => state.allbalance
      }),
      selectedCard: function () {
        return this.$store.state.selectedCards[this.funKey];
        // return {}
      },
      funKey: function () {
        return this.$routeData.funKey
      },
      routeName: function () {
        return this.$routeData.routeName
      },
      diffMoney: function () {
        return this.$routeData.diffMoney
      },
      disabledBtn: function () {
        let invalidMoney = !this.money || this.money == 0;
        let invalidPayMethod = !this.payMethod;
        let invalidMember = !this.selectedMember;
        let invalidCard = !this.selectedCard;

        return invalidMoney || invalidPayMethod || invalidMember || invalidCard;
      },
      changePatientTo() {
        return {
          name: "MemberList",
          query: {
            funKey: this.$routeData.funKey,
            title: "门诊充值",
            hideBack: true,
            prompt: "您要为谁充值？",
            to: JSON.stringify({
              name: "SelectCardPage",
              query: {
                funKey: this.$routeData.funKey,
                title: "门诊充值",
                to: -2
              }
            })
          },
        }
      }
    },

    methods: {
      ...mapActions(["cardRechargeSign", "payinfo"]),
      selectedPayMethod: function (payMethod) {
        this.payMethod = payMethod;
      },
      toRechargeList() {
        shareInst.client.push({
          path: '/rechargeList',
          query: {
            funKey: this.funKey
          }
        })
      },
      moneyItemClick: function (val) {
        if (val == '') {
          this.moneyInputDisabled = false
        } else {
          this.moneyInputDisabled = true
          this.money = val
        }
      },
      moneyInputChange() {
        this.$nextTick(function () {
          if (this.money != '' && this.money.substr(0, 1) == '.') {
            this.money = "";
          }
          this.money = this.money.replace(/^0*(0\.|[1-9])/, '$1');//解决 粘贴不生效
          this.money = this.money.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
//        this.money = this.money.replace(/[^\d]/g,"");  //清除“数字”以外的字符  只能整数
          this.money = this.money.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
          this.money = this.money.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
          this.money = this.money.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数

          // 控制最大金额
          if (parseFloat(this.money) > parseFloat(this.hospitalInfo.singleRechargeMax || 20000)) {
            this.money = this.hospitalInfo.singleRechargeMax || 20000;
            this.$vux.toast.show({
              type: 'text',
              text: `不能超过${this.hospitalInfo.singleRechargeMax || 20000}元`,
              time: 1000
            })
          }
        })


      },
      changeMember() {
        shareInst.client.go(-2);
      },
      confirmHandel: function () {

        if (this.money == '') {
          this.$vux.toast.show({
            type: 'text',
            text: '请输入充值金额',
            time: 1000
          })
          return;
        }

        let payType = this.payMethod.type;
        if (!payType) {
          this.$vux.alert.show({
            title: '提示',
            content: '请选择支付方式！',
          })
          return;
        }
        let payload = {
          funKey: this.funKey,
          money: this.money,
          payType: payType
        };

        this.cardRechargeSign(payload).then((payOptions) => {
          if(payOptions.signresult==0) {
            if (this.routeName == 'register' || this.routeName == 'outpatient' || this.routeName == 'waiting' || this.routeName == 'nucleicInscpet') {
              localStorage.setItem("is-have-back", true);
            } else {
              localStorage.setItem("is-have-back", false);
            }

            let payInfo = {
              title:'门诊充值',
              orderNo: payOptions.orderNo,
              cardNo: this.selectedCard.cardno,
              cardType:this.selectedCard.cardtype,
              hospitalcode:this.hospitalInfo.hospitalcode,
              pkregHospitalId:this.hospitalInfo.pkregHospitalId,
              regPayType: payType,
              payTypeName: this.payMethod.name,
              routeName: 'recharge',
              memberName: this.selectedMember.realname,
              rechargeamount: this.money,
              balance: this.allbalance,
              createtime:tool.dateFormat(new Date(),'yyyy-MM-dd hh:mm'),
              bsstatus: 0
            }
            localStorage.setItem("pay-info", JSON.stringify(payInfo));

            payOptions.payType = payType;
            payOptions.nextLocation = {
              path: "/confirmLoading"
            };

            shareInst.client.payment(payOptions).then((res) => {
              if (shareInst.client.isWeChat()) {
                shareInst.client.push({
                  path: '/confirmLoading'
                })
              }
            });
          }else{
            this.$vux.alert.show({
              title:payOptions.bstitle,
              content:payOptions.bsmessage
            })
          }
        });

      }
    }
  }
</script>


<style lang="scss" scoped>
  .allbalance-box{
    margin: 16px;
    background: linear-gradient(to right,#FFE2B0, #FCECCB, #FFE2B0);
    /*background: #FFE2B0;*/
    border-radius: 10px;
    height: 88px;
    text-align: center;
    padding: 20px;
    box-sizing: border-box;
    div:first-child{
      font-size: 12px;
    }
    div:last-child{
      font-size: 18px;
    }
  }
  .pay-money-input:before{
    border:0;
  }
  .pay-money-input {
    font-size: 30px;
  }
  .money-box{
    color: $fontColor;
    text-align: center;
    line-height: 2;
    .weui-grid{
      color: $fontColor;
    }
  }
  .money-radio {
    display: flex;
    flex-wrap: wrap;
    width: 100%;

    .money-item {
      flex-basis: 29%;
      align-items: center;
      text-align: center;
      border: 1px solid #4B6BAF;
      color: #4B6BAF;
      border-radius: 4px;
      line-height: 3;
      margin-bottom: 15px;
    }
    .money-item:nth-child(3n-1) {
      margin: 0 17px 15px;
    }

    .selected {
      background: #4B6BAF;
      color: #fff;
    }
  }

  .current-money {
    /*border-bottom: 1px solid #D9D9D9;*/
    // opacity: 0.7;
  }

  .tip-item {
    font-size: 14px;
    font-weight: normal;
    color: gray;
  }

  .pay-form-name {
    color: #4B6BAF;
  }

  .pay-form-title {
    padding: 10px 16px 0px;
    font-size: 1rem;
    color: #999;

  }

  .pay-form-cell-box.weui-cell:before {
    border-top: 1px solid #fff;
  }

  .pay-form-confirm-group {
    position: relative;
    bottom: 0px;
    width: 100%;
    .confirm-btn {
      background: white;
      float: left;
      width: 50%;
      text-align: center;
      line-height: 3;

      span {
        color: #FF4949;
      }

    }
    .own-btn {
      color: #fff;
    }

  }
  .money-text{
    color: #FF4949;
    font-size: 18px;
    font-weight: 600;
  }

</style>
