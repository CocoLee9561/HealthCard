<template>
  <div class="page">
    <view-box>
      <x-header slot="header">挂号详情</x-header>
      <div>
        <div class="tip-bar cost-tip-bar" >
          <span slot="title">如您已就诊，将无法取消挂号。</span>
        </div>
      </div>
      <div>
        <group gutter="0">
          <cell :title="bookingInfo.statusText">
            <span slot="title" class="booking-register">
                  <span class="order-no-title">订单号</span>
                  <span>123465</span>
            </span>
            <span class="status-text success">挂号成功</span> 
           <!-- <span class="status-text fail">挂号失败</span>-->
          </cell>
        </group>
        
        <div>
        	<div class="booking-register">
              <div class="doctor-info-bar ">
                <img src="">
                <div class="doctor-info">
                  <strong>王阳名</strong><span class="doctor-info-jobtitle">主任医生</span>
                  <div class="doctor-info-text">心脑管</div>
                  <div class="doctor-info-text">南阳中医院</div>
                </div>
              </div>
            </div>
          <div style="padding: 15px 10px;background: #fff;">
            <div style="padding-bottom: 10px;font-size: 14px;color: #333;" v-if="bookingInfo.status==3">
              无法在线确认预约结果，请到挂号收费窗口咨询确认，或办理退款。
            </div>
            <div class="booking-info-plan own-web-plan">
              <div class="booking-info-bar">
                <span class="booking-info-title">就 诊 人  </span>
                <span class="booking-info-value"> {{bookingInfo.realName || bookingInfo.realname}}</span>
              </div>
              <div class="booking-info-bar">
                <span class="booking-info-title">就诊卡号</span>
                <span class="booking-info-value">023455</span>
              </div>
              <div class="booking-info-bar">
                <span class="booking-info-title">就诊日期</span>
                <span class="booking-info-value">{{bookingInfo.hospitalDeptName || bookingInfo.departmentname}}</span>
              </div>
              <div class="booking-info-bar">
                <span class="booking-info-title">取号密码</span>
                <span class="booking-info-value">1234568</span>
              </div>
              <div class="booking-info-bar">
                <span class="booking-info-title">挂号费用</span>
                <span
                  class="booking-info-value  money-value">￥{{bookingInfo.registerfee || bookingInfo.bsregisterfee}}</span>
              </div>
              <div class="booking-info-bar" v-if="bookingInfo.registerfee||bookingInfo.bsregisterfee">
                <span class="booking-info-title">支付状态</span>
                <span class="booking-info-value">支付成功</span>
              </div>
              <div class="booking-info-bar" v-if="bookingInfo.registerfee||bookingInfo.bsregisterfee">
                <span class="booking-info-title">支付方式</span>
                <span class="booking-info-value ">微信支付</span>
              </div>
              <div class="booking-info-bar" v-if="bookingInfo.registerfee||bookingInfo.bsregisterfee">
                <span class="booking-info-title">支付单号</span>
                <span class="booking-info-value ">1211121</span>
              </div>
              <div class="booking-info-bar" v-if="bookingInfo.registerfee||bookingInfo.bsregisterfee">
                <span class="booking-info-title">支付时间</span>
                <span class="booking-info-value ">{{bookingInfo.regDate || bookingInfo.regdate}}  {{bookingInfo.regTime || bookingInfo.regtime}}</span>
              </div>
            </div>
          </div>
          <div  style="margin-top: 10px;background: #fff;padding: 10px;font-size: 14px;">
            <div><strong>就诊须知</strong></div>
            <div style="font-size: 13px;" id="treatmentnotice" :class="{expand:!isExpand}"></div>
            <div class="expand-text-btn" @click="expandTextPlan">{{ expandText }}</div>
          </div>
          
         
          <div style="padding: 20px;" >
            <x-button type="warn"  @click.native="cancleRegister">取消挂号
            </x-button>
          </div>
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
        if(this.bookingInfo.treatmentnotice){
          document.getElementById("treatmentnotice").innerHTML = this.bookingInfo.treatmentnotice||'';
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
      expandTextPlan() {
        this.isExpand = !this.isExpand
        if (!this.isExpand) {
          this.expandText = '展开剩余内容'
        } else {
          this.expandText = '收起内容'
        }
      },
      cancleRegister() {//取消挂号
        this.regcancel();
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
        if (this.bookingInfo.status != 0) {
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
      reChooseDoctor() {
        shareInst.client.go(-4)
//        tool.hPop(-4);
      },
      reReg() {
        shareInst.client.go(-3)
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
  .status-text.success{
  	color:#00BE76;
  }
  .booking-register .order-no-title{
  	color:#989898;
  	margin-right: 10px;
  }
  .status-text.fail{
  	color:#FD5458;
  }
 .booking-register .doctor-info-bar {
 	border-bottom: 0;
 }
 .booking-register .doctor-info-text{
 	color:#333;
 }
</style>
