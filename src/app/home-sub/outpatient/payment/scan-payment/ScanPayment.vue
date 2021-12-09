<template>
  <div class="page">
    <view-box>
      <x-header :left-options="{showBack:false}" slot="header">扫码付</x-header>
      <div class="wait-pay-wrap" v-if="isSuccess"><!--待支付 -->
        <div>

          <div>

            <template>
              <div class="cost-item" v-for="item in scanPaymentList" @click="toDetail(item)">

                <div class="cost-item-left">
                  <!--<check-icon class="cost-item-left-check" @click.native="selectItem(scanPaymentList)"-->
                              <!--:value.sync='scanPaymentList.isselected'></check-icon>-->
                </div>
                <div class="cost-item-right">
                  <span class="cost-item-right-money">¥ {{item.amount}}</span>
                </div>
                <div class="cost-item-header">
                  <span>{{item.body}}</span>
                </div>

                <div>
                  <div class="cost-item-center">

                    <div v-if="item.businessid">
                      <span class="cost-item-info-title">单号</span>
                      <span class="cost-item-info-label">{{item.businessid}}</span>
                    </div>
                    <div v-if="item.deptname">
                      <span class="cost-item-info-title">科室</span>
                      <span class="cost-item-info-label">{{item.deptname}}</span>
                    </div>
                    <div v-if="item.doctorname">
                      <span class="cost-item-info-title">医生</span>
                      <span class="cost-item-info-label">{{item.doctorname}}</span>
                    </div>
                    <div v-if="item.createtime">
                      <span class="cost-item-info-title">时间</span>
                      <span class="cost-item-info-label">{{item.createtime}}</span>
                    </div>
                  </div>

                </div>
              </div>
            </template>
          </div>

          <!--<group>-->
            <!--<div v-for="item in item.detailslist">-->
              <!--<cost-expend :item='item'></cost-expend>-->
            <!--</div>-->
          <!--</group>-->

        </div>
      </div>
      <group v-if="isSuccess&&scanPaymentList.length>0&&isPay">
        <cell class="tip-bar" title="该单已支付"></cell>
      </group>

      <pay-method :payMethods="allPayMethods" @selected="selectedPayMethod" v-if="isSuccess&&scanPaymentList.length>0&&!isPay"></pay-method>
      <footer slot="bottom" class="bottom-bar" v-if="isSuccess&&scanPaymentList.length>0&&!isPay">
        <div class="pay-money-box">
          <span class="pay-money-title">费用合计</span>
          <span class="pay-money-value">￥{{totalfee}}</span>
        </div>
        <div class="pay-ok-btn own-btn" @click="clickPay">
          {{isMerge?'合并支付':'确认支付'}}
        </div>
      </footer>
      <div class="empty-page vux-center" v-else>
        {{msg}}
      </div>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions,mapGetters} from 'vuex'
  import {CheckIcon} from 'vux'
  import CostExpend from '../../../../components/CostExpend'
  import {osName} from '@constant.js'
  export default {
    computed: {
      ...mapGetters(["allPayMethods"]),
      ...mapState({
        scanPaymentList:state=>state.scanPaymentList,
        scanPayent:state=>state.scanPayent
      }),
      key:function(){
        return this.$routeData.key
      },
      openid:function(){
        return this.$routeData.openid
      },
      wxsettingCode :function(){
        return this.$routeData.wxsettingCode
      },
      wxappid:function(){
        return this.$routeData.wxappid
      },
      isRedirect:function(){
        return this.$routeData.isRedirect
      }
    },
    components: {
      CheckIcon,CostExpend
    },
    created() {
      this.getScanData({
        key:this.key,
        wxsettingCode:this.wxsettingCode,
        wxappid:this.wxappid
      }).then((res)=>{
        this.isSuccess=res.result;
        if(!this.isSuccess){
          this.msg=res.msg
        }else{
          if(this.isRedirect==1){
            if(res.data.wxurl){
              window.location=res.data.wxurl
            }
          }
          this.isPay=res.data.isPay==1
          let a = 0;
          let _outids=''
          this.scanPaymentList.forEach((val)=>{
            a+=parseFloat(val.amount)
            _outids+=val.businessid+','
          })
          this.outids=_outids.replace(/,$/gi,'')
          this.totalfee=a
          this.isMerge=this.scanPaymentList.length>1
        }
      })
    },
    data() {
      return {
        totalfee: 0.00,
        selectList: [],
        isMerge: false,
        payMethod:{},
        isSuccess:true,
        msg:'',
        outids:'',
        isPay:false
      }
    },
    methods: {
      ...mapActions(["getScanData","mergeOrderSign"]),
      selectedPayMethod(payMethod) {
        this.payMethod = payMethod
      },
      toDetail(item){
        this.$store.commit('updateScanPaymentDetail',item);
        shareInst.client.push({
          path:'scanPaymentDetail'
        })
      },
      clickPay(){
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

        this.mergeordersign();
      },
      paySingle(res) {
        let payInfo = {
          title:'扫码付',
          orderNo: res.orderNo,
          routeName: 'outpatientSingle',
          isScan:1,
          regPayType: this.payMethod.type,
          cardNo: this.scanPaymentList[0].cardno,
          riid:this.scanPaymentList[0].riid,
          cardType: this.scanPaymentList[0].cardtype,
          orderno: this.scanPaymentList[0].orderno,
          hospitalcode: this.scanPayent.hospitalcode,
          hospitalname: this.scanPayent.hospitalname,
          patientname: this.scanPaymentList[0].patientname,
          deptname:this.scanPaymentList[0].deptname,
          doctorname:this.scanPaymentList[0].doctorname,
        }
        Object.assign(payInfo, this.scanPaymentList);
        if (res.content&&res.content.length>0) {
          Object.assign(payInfo, res.content[0]);
        }
        localStorage.setItem('pay-info', JSON.stringify(payInfo));
      },
      payMerge(res){
        let _outids = {}
        this.scanPaymentList.forEach((val) => {
          let outid = val.outid
          _outids[outid] = val
//              if(res.content&&res.content.length>0){
//                let a = res.content.find(i=>i.hisorderno==outid);
//                _outids[outid].outid=a.outid
//              }
        })
        let payInfo = {
          title: '门诊缴费',
          orderNo: res.orderNo,
          routeName: 'outpatientMerger',
          regPayType: this.payMethod.type,
          isScan:1,
          cardNo: this.scanPaymentList[0].cardno,
          cardType: this.scanPaymentList[0].cardtype,
          hospitalcode: this.scanPayent.hospitalcode,
          hospitalname: this.scanPayent.hospitalname,
          detailslist: this.scanPaymentList,
          outids: _outids
        }
        Object.assign(payInfo, res);
        localStorage.setItem('pay-info', JSON.stringify(payInfo));
      },
      mergeordersign() {
        let params = {
          riid: -1,
          realname: this.scanPaymentList[0].patientname,
          cardno: this.scanPaymentList[0].cardno,
          cardtype: this.scanPaymentList[0].cardtype,
          outids: this.outids,
          hosptotalfee: this.totalfee,
          thridpayfee: this.totalfee,
          paytype: this.payMethod.type,
          hospitalcode: this.scanPayent.hospitalcode,
          isscan:1,
          clientid:this.scanPayent.clientid,
          clienttype:6,
          openid:this.openid,
          key:this.key,
          uid:'-1',
          ticket:'-1'
        }
        this.mergeOrderSign(params).then((res) => {
          if (res.signresult == 0) {
            if(this.isMerge){
              this.payMerge(res);
            }else{
              this.paySingle(res)
            }

            if (this.payMethod.type == 4) {

              shareInst.client.push({path: '/confirmLoading'})

            } else {

              res.nextLocation = {
                path: "/confirmLoading"
              };
              res.payType = this.payMethod.type;

              window.shareInst.client.payment(res).then((res) => {
                if (osName.weChat==shareInst.client.osName) {
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
    padding-left: 1.2rem;
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
    padding-left: 1.2rem;
    margin-right: 3.5rem;
    padding-bottom: 0.5rem;
  }

  .wait-pay-wrap .bottom-bar .pay-money-box .pay-money-value {
    color: #FF4949 !important;
  }

  .cost-item2 .cost-item-right {
    margin-right: 1.2rem;
  }

  .cost-item2 .cost-item-center {
    padding-left: 0.5rem;
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
