<template>
  <div class="page">
    <view-box>
      <x-header :left-options="{preventGoBack:true}" @on-click-back="backHandle" slot="header">挂号详情</x-header>
      <div>
        <group gutter="0">
          <cell :title="bookingInfo.statusText">
            <!-- <img slot="icon" src="@icon/tip.png" width="24" height="24" style="margin-right: 5px;">-->
            <x-icon v-if="bookingInfo.bsstatus==0" slot="icon" type="ios-checkmark" class="status-icon success"></x-icon>
            <x-icon v-else slot="icon" type="ios-close" class="status-icon error"></x-icon>
          </cell>
        </group>
        <div>
          <div style="padding: 15px 10px;background: #fff;">
            <div style="padding-bottom: 10px;font-size: 14px;color: #333;" v-if="bookingInfo.payresult==2">
              无法在线确认预约结果，请到挂号收费窗口咨询确认，或办理退款。
            </div>
            <div class="booking-info-plan own-web-plan"  style="position:relative;">
              <x-button class="booking-detail" v-if="bookingInfo.orderNo" mini @click.native="toBookingDetail">查看详情</x-button>
              <div class="booking-info-bar">
                <span class="booking-info-title">姓名</span>
                <span class="booking-info-value">{{bookingInfo.realName || bookingInfo.realname}}</span>
              </div>
              <div class="booking-info-bar">
                <span class="booking-info-title">医院</span>
                <span class="booking-info-value">{{bookingInfo.hospitalName || bookingInfo.hospitalname}}</span>
              </div>
              <div class="booking-info-bar">
                <span class="booking-info-title">日期</span>
                <span
                  class="booking-info-value">{{bookingInfo.regDate || bookingInfo.regdate}}  {{bookingInfo.regTime || bookingInfo.regtime}}</span>
              </div>
              <div class="booking-info-bar" v-if="bookingInfo.registerfee||bookingInfo.bsregisterfee">
                <span class="booking-info-title">费用</span>
                <span class="booking-info-value money-value">{{bookingInfo.registerfee || bookingInfo.bsregisterfee}}</span>
              </div>
              <div class="booking-info-bar">
                <span class="booking-info-title">科室</span>
                <span class="booking-info-value">{{bookingInfo.hospitalDeptName || bookingInfo.departmentname}}</span>
              </div>
              <div class="booking-info-bar">
                <span class="booking-info-title">医生</span>
                <span class="booking-info-value">{{bookingInfo.doctorName || bookingInfo.doctorname}}</span>
              </div>
              <div class="booking-info-bar" v-if="bookingInfo.guide">
                <span class="booking-info-title">就诊地址</span>
                <span class="booking-info-value">{{bookingInfo.guide || bookingInfo.guide}}</span>
              </div>

            </div>
          </div>
          <div v-if="bookingInfo.bsstatus==0&&(bookingInfo.treatmentnotice||bookingInfo.doctorNotice)" style="margin-top: 10px;background: #fff;padding: 10px;font-size: 14px;">
            <div><strong>就诊须知</strong></div>
            <div style="font-size: 13px;" id="treatmentnotice" :class="{expand:!isExpand}"></div>
            <div class="expand-text-btn" @click="expandTextPlan">{{ expandText }}</div>
          </div>
          <!--<group v-if="bookType==0&&bookingInfo.status==0&&!isMy">-->
            <!--<cell class="tip-bar">-->
              <!--<span slot="icon"><img style="vertical-align: middle;margin-right: 5px;" src="@icon/tip.png" width="14" alt=""></span>-->
              <!--<span slot="title">取消预约请提前 <span style="color: #FF797E;">1</span> 天，爽约将影响您的预约权利</span>-->
            <!--</cell>-->
          <!--</group>-->
          <group v-if="bookingInfo.bsstatus==0&&bookingInfo.payresult==0">
            <cell class="tip-bar">
              <span slot="icon"><img src="@icon/tip.png" width="14" alt=""></span>
              <span slot="title">祝早日康复</span>
            </cell>
          </group>
          <div v-if="bookingInfo.payresult==3||bookingInfo.payresult==4">
            <group v-if="bookingInfo.payresult==3&&bookingInfo.regPayType!=4">
              <cell class="tip-bar">
                <span slot="icon"><img  src="@icon/tip.png" width="14" alt=""></span>
                <span slot="title">退款一般会在<span style="color: #FF2F4C;">3-7</span>个工作日内返还至您的账户</span>
              </cell>
            </group>
            <group v-if="bookingInfo.payresult==4">
              <cell class="tip-bar">
                <span slot="icon"><img  src="@icon/tip.png" width="14" alt=""></span>
                <span slot="title">退款请到挂号收费窗口咨询办理</span>
              </cell>
            </group>
          </div>
          <div style="padding: 20px;" v-if="bookingInfo.bsstatus!=0&&bookingInfo.payresult&&bookingInfo.payresult!=0&&bookingInfo.payresult!=5">
            <x-button type="primary" @click.native="reReg()"  class="own-btn" style="margin-bottom: 10px;">选择其他时段号源
            </x-button>
            <x-button type="default" @click.native="reChooseDoctor" >重新选择医生</x-button>
          </div>
          <!--<div style="padding: 20px;" v-if="isShowCancleBtn()">-->
            <!--<x-button type="warn"  @click.native="cancleRegister">{{ bookType == '1' ? '取消挂号' : '取消预约'-->
              <!--}}-->
            <!--</x-button>-->
          <!--</div>-->

          <group v-if="hospitalInfo.hospitalcode ==='18451'">
            <img src="@icon/bookingsmallthread.png" width="100%" alt>
          </group>
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>

  import {mapState, mapActions} from 'vuex'

  export default {
    computed: {
      ...mapState({
        hospitalInfo: state => state.hospital.current,
        departmentInfo: state => state.selectedDepartment,
        doctorInfo: state => state.doctorInfo,
        scheduleInfo: state => state.selectedSchedule,
        bookingData: state => state.bookingData,
        memberInfo: state => state.selectedMember,
        bookingInfo: state => state.bookingResult
      }),
      bookType: function () {
        return this.$routeData.bookType
      },
      isMy: function () {
        return this.$routeData.isMy
      }
    },
    created() {

    },
    mounted() {
      this.$nextTick(()=> {
        if(this.bookingInfo.doctorNotice||this.bookingInfo.treatmentnotice){
          document.getElementById("treatmentnotice").innerHTML = this.bookingInfo.doctorNotice||this.bookingInfo.treatmentnotice;
        }
      })

    },
    data() {
      return {
        isExpand: false,
        expandText: '展开剩余内容',
      }
    },
    methods: {
      ...mapActions(["regCancel"]),
      backHandle(){
        if(this.bookingInfo.regPayType==7){
//          shareInst.client.go(-2);
          shareInst.client.back("WXH5Pay")
        }else if(this.bookingInfo.regPayType==6){
          shareInst.client.back("Alipay")
        }else{
          shareInst.client.back();
        }
      },
      expandTextPlan() {
        this.isExpand = !this.isExpand
        if (!this.isExpand) {
          this.expandText = '展开剩余内容'
        } else {
          this.expandText = '收起内容'
        }
      },
      cancleRegister() {//取消挂号
        let self=this
        this.$vux.confirm.show({
          title:'取消挂号',
          content:'已支付的费用将原路退回你的账户',
          onCancel () {},
          onConfirm () {
            self.regcancel()
          }
        })
      },
      regcancel() {
        this.regCancel({
          hospitalid: this.bookingInfo.hospitalid,
          reserveid: this.bookingInfo.reserveid
        }).then((res) => {
          this.$vux.toast.text(res.rtnMsg)
        })
      },
      isShowCancleBtn() {//是否显示取消挂号
        if (this.bookingInfo.bsstatus != 0) {
          return false;
        }
        if (this.bookType == 0) {//预约挂号  默认0 不能取消 1当天之前可以取消预约挂号 2最大权限不控制
          if (this.hospitalInfo.isCancelAppReg == 0) {
            return false;
          } else if (this.hospitalInfo.isCancelAppReg == 2) {
            return true;
          } else if (this.hospitalInfo.isCancelAppReg == 1) {
            return this.compareDate(this.bookingInfo.regDate);
          } else {
            return false;
          }
        } else {        //  默认0 不能取消 1可以取消当日挂号 2最大权限不控制
          if (this.hospitalInfo.isCancelReg == 0) {
            return false;
          } else if (this.hospitalInfo.isCancelReg == 2) {
            return true;
          } else if (this.hospitalInfo.isCancelReg == 1) {
            return this.compareDate(this.bookingInfo.regDate);
          } else {
            return false;
          }
        }
      },
      compareDate(regdate) {

        var curTime = new Date().getTime();
        var regTime = new Date(regdate).getTime();
        let result = ((curTime - regTime) / (1000 * 60 * 60 * 24));
        return result >= 1;

      },
      toBookingDetail(){
        shareInst.client.push({
          path: '/bookingDetail',
          query: {
            bookType: this.bookType,
            isMy: false,
            orderNo:this.bookingInfo.orderNo
          }
        })
      },
      reChooseDoctor() {
        if(this.bookingInfo.regPayType==7){
          shareInst.client.back("WXH5Pay",-4)
        }else if(this.bookingInfo.regPayType==6){
          shareInst.client.back("Alipay",-4)
        }else{
          shareInst.client.go(-4);
        }
      },
      reReg() {
        if(this.bookingInfo.regPayType==7){
          shareInst.client.back("WXH5Pay",-3)
        }else if(this.bookingInfo.regPayType==6){
          shareInst.client.back("Alipay",-3)
        }else{
          shareInst.client.go(-3);
        }
      }
    }
  }
</script>
<style>
  .own-web-plan {
    background: #F3F6FC;
  }
  .money-value{
    color: #FB545C;
  }
  .booking-detail{
    padding: 2px 10px !important;
    position: absolute !important;
    top:10px !important;
    right: 10px !important;
    border-radius: 3px !important;
    background: transparent !important;
  }
  .booking-detail:after{
    border:1px solid #333 !important;
  }
  .booking-info-bar booking-info-title{
    width: 30px !important;
  }
</style>
