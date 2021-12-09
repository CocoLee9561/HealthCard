<template>
  <div class="page">
    <view-box>
      <x-header slot="header">挂号详情</x-header>
      <div>
        <div class="tip-bar cost-tip-bar" >
          <span slot="title" v-if="bookingDetail.bsPayStatus!=0&&bookingDetail.isreview==1&&bookingDetail.bsStatus==0">如您已就诊，将无法取消挂号。</span>
          <span slot="title" v-if="bookingDetail.isreview!=1&&this.bookType==0&&bookingDetail.bsPayStatus==5&&bookingDetail.bsStatus==0&&isShowCancleBtn()">取消预约请提前1天，爽约将影响你的预约权利</span>
          <span slot="title" v-if="this.bookType==1&&bookingDetail.bsPayStatus==0&&bookingDetail.bsStatus==0">如您已就诊，将无法取消挂号。</span>
          <span slot="title" v-if="bookingDetail.bsPayStatus==4&&(bookingDetail.bsStatus==2||bookingDetail.bsStatus==1)">退款请到挂号收费窗口咨询办理</span>
          <span slot="title" v-if="bookingDetail.bsPayStatus==3&&bookingDetail.bsStatus==2">退款一般会在3-7个工作日内返还至您的账户</span>
          <span slot="title" v-if="bookingDetail.bsStatus==3">请到挂号收费窗口确认挂号结果或办理退款</span>
        </div>
      </div>
      <div>
        <group gutter="0">
          <cell>
            <span slot="title" class="booking-register" v-if="bookingDetail.bsReserveId">
                  <span class="order-no-title">订单号</span>
                  <span>{{bookingDetail.bsReserveId}}</span>
            </span>
            <span class="status-text" v-bind:class="{'success':bookingDetail.bsStatus==0,'fail':bookingDetail.bsStatus==1||bookingDetail.bsStatus==3}">{{getStatusText(bookingDetail.bsStatus)}}</span>
            <!--<span class="status-text fail">挂号失败</span>-->
          </cell>
        </group>

        <div>
          <div class="booking-register">
            <div class="doctor-info-bar ">
              <img :src="bookingDetail.bsDoctorPhoto">
              <div class="doctor-info">
                <strong>{{bookingDetail.bsDoctorName}}</strong><span class="doctor-info-jobtitle">{{bookingDetail.bsDoctorRank}}</span>
                <div class="doctor-info-text">{{bookingDetail.bsHospitalDeptName}}</div>
                <div class="doctor-info-text">{{bookingDetail.bsHospital}}</div>
              </div>
            </div>
          </div>
          <div style="padding: 15px 10px;background: #fff;">
            <!--<div style="padding-bottom: 10px;font-size: 14px;color: #333;" v-if="bookingInfo.status==3">-->
              <!--无法在线确认预约结果，请到挂号收费窗口咨询确认，或办理退款。-->
            <!--</div>-->
            <div class="booking-info-plan own-web-plan">
              <div class="booking-info-bar">
                <span class="booking-info-title" v-if="bookingDetail.bsRealName">就 诊 人</span>
                <span class="booking-info-value"> {{bookingDetail.bsRealName}}</span>
              </div>
              <div class="booking-info-bar" v-if="bookingDetail.bsQueueNo">
                <span class="booking-info-title">挂号序号</span>
                <span class="booking-info-value">{{bookingDetail.bsQueueNo}}</span>
              </div>
              <div class="booking-info-bar" v-if="bookingDetail.bsCardNo">
                <span class="booking-info-title">就诊卡号</span>
                <span class="booking-info-value">{{bookingDetail.bsCardNo}}</span>
              </div>
              <div class="booking-info-bar" v-if="bookingDetail.outpatientclinic">
                <span class="booking-info-title">门诊号</span>
                <span class="booking-info-value">{{bookingDetail.outpatientclinic}}</span>
              </div>
              <div class="booking-info-bar" v-if="hospitalInfo.hospitalcode ==='18452' && bookingDetail.bsRegDate">
                <span class="booking-info-title">就诊日期</span>
                <span class="booking-info-value booking-info-value-date">{{bookingDetail.bsRegDate}}<span v-if="bookingDetail.bsWeekDay"> （{{bookingDetail.bsWeekDay}}）</span> </span>
              </div>
              <div class="booking-info-bar" v-if="hospitalInfo.hospitalcode !='18452' && bookingDetail.bsRegDate">
                <span class="booking-info-title">就诊日期</span>
                <span class="booking-info-value booking-info-value-date">{{bookingDetail.bsRegDate}}<span v-if="bookingDetail.bsWeekDay"> （{{bookingDetail.bsWeekDay}}）</span> {{bookingDetail.bsRegTime}} </span>
              </div>
              <div class="booking-info-bar" v-if="hospitalInfo.hospitalcode ==='18452' && bookingDetail.guide">
                <span class="booking-info-title">就诊地址</span>
                <span class="booking-info-value booking-info-value-date">{{bookingDetail.guide}}</span>
              </div>
              <div class="booking-info-bar" v-if="bookingDetail.bshisviewno">
                <span class="booking-info-title">就诊地址</span>
                <span class="booking-info-value booking-info-value-date">{{bookingDetail.bshisviewno}}</span>
              </div>
              <div class="booking-info-bar" v-if="bookingDetail.bsPassword">
                <span class="booking-info-title">取号密码</span>
                <span class="booking-info-value">{{bookingDetail.bsPassword}}</span>
              </div>
              <div class="booking-info-bar" v-if="bookingDetail.bsRegisterFee">
                <span class="booking-info-title">挂号费用</span>
                <span
                  class="booking-info-value  money-value">￥{{bookingDetail.bsRegisterFee}}</span>
              </div>
              <div class="booking-info-bar">
                <span class="booking-info-title">支付状态</span>
                <span class="booking-info-value">{{getPayStatusText(0,bookingDetail.bsPayStatus)}}</span>
              </div>
              <div v-if="bookingDetail.bsPayStatus!=5">
                <div class="booking-info-bar">
                  <span class="booking-info-title">支付方式</span>
                  <span class="booking-info-value ">{{getPayTypeText(bookingDetail.bsPayType)}}</span>
                </div>
                <div class="booking-info-bar" v-if="bookingDetail.bsPayOrderNo">
                  <span class="booking-info-title">支付单号</span>
                  <span class="booking-info-value ">{{bookingDetail.bsPayOrderNo}}</span>
                </div>
                <div class="booking-info-bar" v-if="bookingDetail.bsOrderTime">
                  <span class="booking-info-title">支付时间</span>
                  <span class="booking-info-value ">{{bookingDetail.bsOrderTime}}</span>
                </div>
              </div>
              <div v-if="bookingDetail.bsPayStatus==3||bookingDetail.bsPayStatus==4">
                <div class="booking-info-bar">
                  <span class="booking-info-title">退款金额</span>
                  <span class="booking-info-value ">{{bookingDetail.bsRegisterFee}}元</span>
                </div>
                <div class="booking-info-bar" >
                  <span class="booking-info-title">退款状态</span>
                  <span class="booking-info-value">{{getPayStatusText(1,bookingDetail.bsPayStatus)}}</span>
                </div>
                <div v-if="bookingDetail.bsPayStatus==3">
                  <div class="booking-info-bar">
                    <span class="booking-info-title">退款方式</span>
                    <span class="booking-info-value ">原路返回</span>
                  </div>
                  <div class="booking-info-bar" v-if="bookingDetail.bsPayOrderNo">
                    <span class="booking-info-title">退款单号</span>
                    <span class="booking-info-value ">{{bookingDetail.bsPayOrderNo}}</span>
                  </div>
                  <div class="booking-info-bar" v-if="bookingDetail.bsLastTime">
                    <span class="booking-info-title">退款时间</span>
                    <span class="booking-info-value ">{{bookingDetail.bsLastTime}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div  style="margin-top: 10px;background: #fff;padding: 10px;font-size: 14px;" v-if="bookingDetail.doctorNotice">
            <div><strong>就诊须知</strong></div>
            <div style="font-size: 13px;" id="treatmentnotice" :class="{expand:!isExpand}"></div>
            <div class="expand-text-btn" @click="expandTextPlan">{{ expandText }}</div>
          </div>

          <group v-if="(bookingDetail.bsStatus == 0) && isOutDateOfReg(bookingDetail.bsRegDate) && (bookingDetail.isreview==0||bookingDetail.isreview==1 )">
            <cell is-link @click.native="toReView">
              <span slot="title">就医点评</span>
              <span v-if="bookingDetail.isreview==0">点评此次就医服务</span>
              <span class="doctor-info-stars" v-else>
                <span v-for="index in 5">
                  <img v-if="reviewDetail.totalevaluation>=index" src="@icon/stars-yellow.png" width="18"/>
                  <img v-else src="@icon/stars-gray.png" width="18"/>
                </span>
                <!--<img src="@icon/home/ic_bigstar_sel@2x.png"/>-->
                <!--<img src="@icon/home/ic_bigstar_sel@2x.png"/>-->
                <!--<img src="@icon/home/ic_bigstar_sel@2x.png"/>-->
                <!--<img src="@icon/home/ic_bigstar_sel@2x.png"/>-->
                <!--<img src="@icon/home/ic_bigstar_nor@2x.png"/>-->
              </span>
            </cell>
          </group>
          <group v-if="hospitalInfo.hospitalcode ==='18451'">
            <img src="@icon/bookingsmallthread.png" width="100%" alt>
          </group>

          <div style="padding: 20px;" v-if="isShowCancleBtn()">
            <x-button type="warn"  @click.native="cancleRegister">取消{{bookType==0?'预约':'挂号'}}
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
        hospitalInfo:state=>state.hospital.current,
        bookingInfo: state => state.bookingResult,
        bookingDetail:state=>state.bookingDetail,
        reviewDetail: state => state.reviewDetail
      }),
      bookType: function () {
        return this.$routeData.bookType
      },
      isMy: function () {
        return this.$routeData.isMy
      },
      orderNo:function(){
        return this.$routeData.orderNo
      },
      clientId:function(){
        return localStorage.getItem("clientId");
      }
    },
    created() {
    },
    mounted() {
      this.getreghistorydetail()
    },
    data() {
      return {
        isExpand: false,
        expandText: '展开剩余内容',
      }
    },
    methods: {
      ...mapActions(["regCancel","getRegHistoryDetail","regReviewList"]),
      expandTextPlan() {
        this.isExpand = !this.isExpand
        if (!this.isExpand) {
          this.expandText = '展开剩余内容'
        } else {
          this.expandText = '收起内容'
        }
      },
      regreviewlist() {
        this.regReviewList({
          doctorid: this.bookingDetail.bsdoctorid,
          isuse: 1,
          page: 1,
          rows: 1
        })
      },
      cancleRegister() {//取消挂号
        let self=this
        if(this.bookingDetail.bsPayStatus==5){//未支付
          this.$vux.confirm.show({
            title:'取消预约',
            content:'你确定要取消预约吗？',
            onCancel () {},
            onConfirm () {
              self.regcancel()
            }
          })
        }else{
          this.$vux.confirm.show({
            title:'取消挂号',
            content:'已支付的费用将原路退回你的账户',
            onCancel () {},
            onConfirm () {
              self.regcancel()
            }
          })
        }
      },
      getreghistorydetail(){
        this.getRegHistoryDetail({
          orderno:this.orderNo
        }).then((res)=>{

          if(this.bookingDetail.isreview==1){
            this.regreviewlist()
          }

          this.$nextTick(()=>{
            if(this.bookingDetail.doctorNotice){
              document.getElementById("treatmentnotice").innerHTML = this.bookingDetail.doctorNotice||'';
            }
          })
        })
      },
      regcancel() {
        this.regCancel({
          hospitalid: this.bookingDetail.bsHospitalId,
          reserveid: this.bookingDetail.bsReserveId
        }).then((res) => {
          if(res.result){
            this.$vux.toast.text(res.data.rtnMsg);
            this.getreghistorydetail()
          }else{
            this.$vux.confirm.show({
              title:'取消失败',
              content:'如需取消，请到挂号收费窗口咨询办理',
              onCancel(){},
              onConfirm(){}
            })
          }
        })
      },
      isShowCancleBtn() {//是否显示取消挂号
        if (this.bookingDetail.bsStatus != 0) {
          return false;
        }
        if (this.bookType == 0) {//预约挂号  默认0 不能取消 1当天之前可以取消预约挂号 2最大权限不控制
          if (this.hospitalInfo.isCancelAppReg == 0) {
            return false;
          } else if (this.hospitalInfo.isCancelAppReg == 2) {
            return true;
          } else if (this.hospitalInfo.isCancelAppReg == 1) {
            return this.compareDate(this.bookingDetail.bsRegDate)==1;
          } else {
            return false;
          }
        } else {        //  默认0 不能取消 1可以取消当日挂号 2最大权限不控制
          if (this.hospitalInfo.isCancelReg == 0) {
            return false;
          } else if (this.hospitalInfo.isCancelReg == 2) {
            return true;
          } else if (this.hospitalInfo.isCancelReg == 1) {
            return this.compareDate(this.bookingDetail.bsRegDate)==0;
          } else {
            return false;
          }
        }
      },
      getPayTypeText(bsPayType){
        let payTypes={1:'银联',2:'支付宝', 3:'微信支付',4:'就诊卡',5:'微信支付', 6:'支付宝', 7:'微信支付', 8:'微信扫码', 9:'支付宝扫码'}
        if(bsPayType==5&&this.clientId=='S-511800-53584'){
          return '四川农信收银台';
        }
        return payTypes[bsPayType]
      },
      getPayStatusText(flag , bsPayStatus){
//        let payStatus={0:'支付成功',1:'支付失败',2:'未支付',3:'退款成功',4:'退款失败'}
        let payStatus={0:'支付成功',1:'支付失败',2:'支付异常',3:'退款成功',4:'退款失败',5:'未支付'}
        if(bsPayStatus==3||bsPayStatus==4){
          if(flag==0){
            return "支付成功"
          }else{
            return payStatus[bsPayStatus]
          }
        }
        return payStatus[bsPayStatus]
      },
      getStatusText(bsStatus){
        let status = {"0":this.bookType==1?'挂号成功':'预约成功',"1":this.bookType==1?'挂号失败':'预约失败',"2":'已取消',"3":this.bookType==1?'挂号异常':'预约异常'}
        return status[bsStatus]
      },
      compareDate(regdate) {

        var curTime = new Date().getTime()/ (1000 * 60 * 60 * 24);
        var regTime = new Date(regdate).getTime()/ (1000 * 60 * 60 * 24);
        let result = parseInt(regTime) - parseInt(curTime);
        if(result==0){
          return 0; //当天
        }else if(result>0){
          return 1;  //以后
        }else if(result<0){
          return -1;  //以前
        }
      },
      toReView(){
        if(this.bookingDetail.isreview==0){
          this.$store.commit('updateReviewDoctorInfo', {
            doctorphoto:this.bookingDetail.bsDoctorPhoto,
            doctorname:this.bookingDetail.bsDoctorName,
            doctorrank:this.bookingDetail.bsDoctorRank,
            hospitalname:this.bookingDetail.bsHospital,
            realname:this.bookingDetail.bsRealName,
            regdate:this.bookingDetail.bsRegDate,
            reghistoryid:this.bookingDetail.id,
            departmentname:this.bookingDetail.bsHospitalDeptName,
          })
          shareInst.client.push({
            path: '/reviewDoctor'
          })
        }else{
          this.$store.commit('updateDoctorInfo',{
            doctorphoto:this.bookingDetail.bsDoctorPhoto,
            doctorname:this.bookingDetail.bsDoctorName,
            doctorrank:this.bookingDetail.bsDoctorRank,
            departmentname:this.bookingDetail.bsHospitalDeptName,
            hospitalname:this.bookingDetail.bsHospital,
          })
          shareInst.client.push({
            path: '/reviewList',
            query: {
              isUse: 1,
              doctorId: this.bookingDetail.bsdoctorid,
//              countofreview: this.doctorInfo.countofreview
            }
          })
        }
      },
      isOutDateOfReg(regdate) {

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
<style scoped>
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
  .doctor-info-stars {
    position: relative;
    top: -2px
  }

  .doctor-info-stars > img {
    width: 1rem;
    height: 1rem;
  }
  .booking-info-bar .booking-info-title{
    width: 60px;
  }
  @media screen and (max-width:320px ) {
    .booking-info-value-date{
	  	text-indent: 0rem!important;
	    margin-left: 4.7rem!important;
	    margin-top: -2rem!important;
	    display: inline-block!important;
	  }
  }
  .doctor-info-stars {
    position: relative;
    top: -2px
  }

  .doctor-info-stars  img {
    padding: 1px;
    /*width: 1rem;*/
    /*height: 1rem;*/
    vertical-align: middle;
  }
</style>
