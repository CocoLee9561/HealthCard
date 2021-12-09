<template>
  <div class="page">
    <view-box>
      <x-header slot="header">门诊缴费</x-header>
      <!--<div>-->
        <!--<div class="tip-bar cost-tip-bar" v-if="selected==1">-->
          <!--<span slot="title">{{alreadyPayTip}}</span>-->
        <!--</div>-->
        <!--<div class="tip-bar  cost-tip-bar" v-if="selected==0">-->
          <!--<span slot="title">{{pendingPayTip}}</span>-->
        <!--</div>-->
      <!--</div>-->
      <change-patient v-if="!this.isqrCode" :realname="this.isqrCode ? '门诊号:' : selectedMember.realname" :cardno="this.isqrCode ? this.cardno : cardInfo.cardno" :to="this.isqrCode ? '':changePatientTo"></change-patient>
      <tip-text-bar v-if="selected==1">
        {{alreadyPayTip}}
      </tip-text-bar>
      <tip-text-bar v-if="selected==0">
        {{pendingPayTip}}
      </tip-text-bar>
      <group :gutter="0" style="margin: 0 16px;">
        <tab v-model="selected" class="outpatient-list-menu">
          <tab-item><span>待支付</span></tab-item><!-- @on-item-click="getPendingPayData"-->
          <tab-item @on-item-click="getAlreadyPayData" v-if="this.hospitalInfo.hospitalcode != '18452' || this.hospitalInfo.hospitalcode != '18453' || this.hospitalInfo.hospitalcode != '18454'|| this.hospitalInfo.hospitalcode != '18449'">缴费记录</tab-item>
        </tab>
      </group>
      <div v-if="selected==0" class="wait-pay-wrap"><!--待支付 -->
        <div v-if="pendingPayList.length>0">

          <div>

            <template v-if="isSinglePay">
              <div class="card-info-plan" v-for="(item,index) in pendingPayList" :key="index">
                <div class="booking-result-plan" >
                  <div class="booking-result-header line-bottom">
                    <div class="booking-result-info-bar">
                      <span class="booking-result-info-title cost-item-name">{{item.itemname}}</span>
                      <span class="booking-result-info-value cost-item-all-money">{{item.amount}}</span>
                      <check-icon @click.native="selectItem(item)"
                                  :value.sync='item.isselected'></check-icon>
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
                  </div>
                </div>

                <group :gutter="0" @click.native="toSinglePay(item)">
                  <cell is-link>
                    <span slot="title">去支付</span>
                  </cell>
                </group>
              </div>
            </template>

            <template v-else>

              <div class="card-info-plan" v-for="(item,index) in pendingPayList" :key="index">
                <div class="booking-result-plan" >
                  <div class="booking-result-header line-bottom">
                    <div class="booking-result-info-bar">
                      <span class="booking-result-info-title cost-item-name">{{item.itemname}}</span>
                      <span class="booking-result-info-value cost-item-all-money">{{item.amount}}</span>
                    </div>
                  </div>
                  <div class="booking-result-body">
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
                  </div>
                </div>
              </div>

            </template>


          </div>


        </div>
		<div v-else>
			<div class="vux-center empty-page" style="height: 300px;">
				暂无待缴费
			</div>
		</div>
      </div>
      <footer slot="bottom" class="bottom-bar" v-if="totalfee!=0&&selected==0">
        <div class="pay-money-box">
          <span class="pay-money-title">费用合计</span>
          <span class="pay-money-value">￥{{totalfee}}</span>
        </div>
        <div class="pay-ok-btn" @click="clickPay">
          {{isMerge ? '合并支付' : '确认支付'}}
        </div>
      </footer>
      <div v-if="selected==1"><!--缴费记录 -->

        <div v-if="alreadyPayList.length>0">

          <div class="card-info-plan" v-for="item in alreadyPayList" @click="toDetail(item)">
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
                <div class="booking-result-info-bar" v-if="item.outpatientclinic">
                  <span class="booking-result-info-title">门诊号</span>
                  <span class="booking-result-info-value">{{item.outpatientclinic}}</span>
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
			<div class="vux-center empty-page" style="height: 300px;">
				暂无缴费记录
			</div>
		</div>
      </div>
    </view-box>
  </div>

</template>
<script>
  import {Tab, TabItem, Group, Cell, CheckIcon} from 'vux'
  import {mapState, mapActions} from 'vuex'
  import ChangePatient from "../../../../components/ChangePatient.vue";
  export function getUrlKey (name) {
    console.log("init window.location.href:",window.location.href)
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(window.location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
  }
  export default {
    computed: {
      ...mapState({
        pendingPayList: function (state) {
          return state.pendingPayList
        },
        alreadyPayList: state => state.alreadyPayList,
        hospitalInfo: state => state.hospital.current,
        pendingPayTip: state => state.pendingPayTip,
        alreadyPayTip: state => state.alreadyPayTip,
        selectedMember: state => state.selectedMember
      }),
      isSinglePay: function () {
        console.log("1")
        // return true
        return this.hospitalInfo.isSinglePay != 0;
      },
      cardInfo: function () {
        console.log("2")

        return this.$store.state.selectedCards[this.funKey];
      },
      changePatientTo() {
        console.log("3")

        return {
          name: "MemberList",
          query: {
            funKey: this.funKey,
            title: "门诊缴费",
            hideBack: false,
            prompt: "您要查询谁的门诊费用？",
            to: JSON.stringify({
              name: "SelectCardPage",
              query: {
                funKey: this.funKey,
                title: "门诊缴费",
                to: -2
              }
            })

          },
        }
      },
      selected: {
        get: function () {
          return this.$store.state.tabSelected || 0
        },
        set: function (val) {
          this.$store.commit('updateTabSelected', val)
        }
      }
    },
    components: {
      ChangePatient,
      Tab, TabItem, Group, Cell, CheckIcon
    },
    created() {
      console.log("4")
      this.$store.commit('updateOutpatientMember',{
        hospCode:this.hospitalInfo.hospitalcode,
        member:this.selectedMember,
        card:this.cardInfo
      })
      this.getPendingPayData()
      this.getAlreadyPayData()
//      this.outpatientHint()
    },
    data() {
      console.log("5")
      let cardno = getUrlKey("cardno");
      let isqrCode = getUrlKey("isqrCode");
      let realname = getUrlKey("realname");
      console.log("cardno::", cardno)
      if (isqrCode) {
        let client = getUrlKey("clientId");
        client = client.substring(9);
        console.log("client::", client)
        return {
//        selected: 0,
          funKey: 'MZJF',
          totalfee: 0.00,
          selectList: [],
          isMerge: false,
          cardno: cardno,
          realname: realname,
          isqrCode: isqrCode,
          client: client
        }
      }else{
        return {
//        selected: 0,
          funKey: 'MZJF',
          totalfee: 0.00,
          selectList: [],
          isMerge: false,
          isqrCode: isqrCode
        }
      }
    },
    methods: {
      ...mapActions(["getPendingPayList", "getAlreadyPayList", "outpatientHint","getPendingPayDetail"]),
      noSinglePayToast: function () {
        this.$vux.toast.text("不能取消选择订单");
      },
      selectItem(item) {
        console.log("6")

        if(this.hospitalInfo.isSinglePay==2){
          this.pendingPayList.forEach((res)=>{
            if(res.outid!=item.outid){
              res.isselected=false
            }
          })
          if (item.isselected) {
            this.totalfee='0.00'
            this.selectList=[]
          }
        }
        if (item.isselected) {
          if (item.amount) {
            let a = (parseFloat(item.amount) * 100)
            this.totalfee = this.totalfee * 100;
            this.totalfee = (this.totalfee + a);
            this.totalfee = (this.totalfee / 100).toFixed(2);
          }
          this.selectList.push(item);
        } else {

          if (this.totalfee > 0.00) {
            if (item.amount) {
              let a = (parseFloat(item.amount) * 100)
              this.totalfee = this.totalfee * 100;
              this.totalfee = (this.totalfee - a);
              this.totalfee = (this.totalfee / 100).toFixed(2);
            }
          }
          this.selectList.splice(this.selectList.indexOf(item), 1);
        }
        this.isMerge = this.selectList.length > 1;
      },
      getAlreadyPayData () {
        console.log("7")
        if (this.isqrCode) {
          console.log("ok");
          this.getAlreadyPayList({
            cardno: this.cardno,
            cardtype: '66',
            riid: '10585',
            isqrCode: this.isqrCode,
            hospitalcode: this.client
          })
        } else {
          this.getAlreadyPayList({
            cardno: this.cardInfo.cardno,
            cardtype: this.cardInfo.cardtype,
            riid: this.cardInfo.riid,
            hospitalcode: this.hospitalInfo.hospitalcode
          })
        }
      },
      getPendingPayData() {
        console.log("8111")
        console.log("this.hospitalInfo.hospitalcode>>>>",this.hospitalInfo.hospitalcode)
//        this.totalfee=0.00;
//        this.selectList=[];
        if (this.isqrCode) {
          this.getPendingPayList({
            cardno: this.cardno,
            cardtype: '66',
            riid: '10585',
            isqrCode: this.isqrCode,
            hospitalcode: this.client
          }).then((res) => {
            if (!this.isSinglePay) {
              this.selectList = [];
              this.pendingPayList.forEach((item) => {
                this.selectItem(item);
              });
            }
          });
        }else{
          this.getPendingPayList({
            cardno: this.cardInfo.cardno,
            cardtype: this.cardInfo.cardtype,
            riid: this.cardInfo.riid,
            hospitalcode: this.hospitalInfo.hospitalcode
          }).then((res) => {
            if (!this.isSinglePay) {
              this.selectList = [];
              this.pendingPayList.forEach((item) => {
                this.selectItem(item);
              });
            }
          });
        }
      },
      payStatus(payType) {//"缴费状态  1确认中;4缴费中 ;5已退款;6缴费失败;7缴费失败;8缴费成功;11已执行;12已退费"
//        let status = {1: '确认中', 4: '缴费中', 5: '已退款', 6: '缴费失败', 7: '缴费失败', 8: '缴费成功', 11: '已执行', 12: '已退费',13:'缴费失败'}
        console.log("9")

        // 0 支付成功 1退款异常 2支付异常 3退款成功 4退款失败
        let status = {0: '支付成功', 1: '退款异常', 2: '支付异常', 3: '退款成功', 4: '退款失败'}
        return status[payType]
      },
      statusText(bsStatus){
        console.log("10")

        let status = {0: '缴费成功', 1: '缴费失败', 2: '缴费异常'}
        return status[bsStatus]
      },
      clickPay: function () {
        console.log("11")

        if (this.isMerge) {
          console.log("111111")
          let list = []
          this.selectList.forEach(function (element) {
            list.push(element.outid);
          }, this);
          let outids = list.join(',');
          this.$store.commit('updateOutids', outids);
//          this.loadPendingPayDetail(outids)
          if (this.isqrCode) {
            shareInst.client.push({
              path: '/mergePay',
              query: {
                isqrCode: this.isqrCode,
                cardno: this.cardno,
                realname: this.realname,
                riid: '10585',
                funKey: this.funKey
              }
            })
          }else{
            shareInst.client.push({
              path: '/mergePay',
              query: {
                funKey: this.funKey
              }
            })
          }

        } else {
          this.toSinglePay(this.selectList[0])
//          shareInst.client.push({
//            path: '/singlePay',
//            query: {
//              funKey: this.funKey,
//              outid: this.selectList[0].outid
//            }
//          })
        }
      },
      toSinglePay(item) {
        console.log("12")
        if (this.isqrCode) {
          //        this.loadPendingPayDetail(item.outid)
          shareInst.client.push({
            path: '/singlePay',
            query: {
              isqrCode: this.isqrCode,
              cardno: this.cardno,
              realname: this.realname,
              riid: '10585',
              funKey: this.funKey,
              outid: item.outid
            }
          })
        } else {
          //        this.loadPendingPayDetail(item.outid)
          shareInst.client.push({
            path: '/singlePay',
            query: {
              funKey: this.funKey,
              outid: item.outid
            }
          })
        }

      },
      loadPendingPayDetail(outids){
        console.log("13")

        this.getPendingPayDetail({
          riid: this.cardInfo.riid,
          outids: outids,
          outtype: 0,
          hospitalcode: this.hospitalInfo.hospitalcode
        });
      },
      toDetail (item) {
        console.log("14")
        if (this.isqrCode) {
          this.$store.commit('updateOutpatientPayResult', item)
          this.$store.commit('updatePedingPayDetail',item)
          shareInst.client.push({
            path: '/outpatientDetail',
            query: {
              funKey: this.funKey,
              riid: '10585',
              cardno: this.cardno,
              outid: item.outid,
              routeName: 'already',
              isqrCode: this.isqrCode,
              title: '缴费记录'
            }
          })
        }else{
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
