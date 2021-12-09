<template>
  <div class="page">
    <view-box>
      <x-header slot="header">预交记录</x-header>
      <div>
        <group :gutter="0" class="card-plan">
          <div class="card-top">
            <div>
              <img src="@icon/zhuyuan.png">
            </div>
            <div class="card-info">
              <div class="realname"><span class="label">姓名:</span>{{selectedMember.realname}}</div>
              <div class="cardno"><span class="label">{{cardInfo.cardTypeName}}:</span>{{cardInfo.cardno}}</div>
            </div>
          </div>

          <div class="booking-result-plan" style="padding: 10px 16px 10px;">
            <div class="booking-result-info-bar">
              <span class="booking-result-info-title">医院</span>
              <span class="booking-result-info-value">{{hospitalInfo.hospitalname}}</span>
              <span class="hospitalization-status-text right-text" v-if="stayHospitalInfo.inflag" :class="{'inflag':stayHospitalInfo.inflag=='是'}"
                    slot="title">{{stayHospitalInfo.inflag == '是' ? '住院中' : '已出院'}}</span>
            </div>
            <div class="booking-result-info-bar">
              <span class="booking-result-info-title">科室</span>
              <span class="booking-result-info-value">{{stayHospitalInfo.departmentname?stayHospitalInfo.departmentname:'--'}}</span>
            </div>
            <div class="booking-result-info-bar">
              <span class="booking-result-info-title">诊断</span>
              <span class="booking-result-info-value">{{stayHospitalInfo.zhenduan?stayHospitalInfo.zhenduan:'--'}}</span>
            </div>
            <div class="booking-result-info-bar">
              <span class="booking-result-info-title">入院</span>
              <span class="booking-result-info-value">{{stayHospitalInfo.stayhospitaldate?stayHospitalInfo.stayhospitaldate:'--'}}</span>
              <span class="right-text">{{stayHospitalInfo.inflag == '是' ? '已入院' : '共住院'}}<span
                class="days"> {{stayHospitalInfo.days?stayHospitalInfo.days:'--'}} </span>天</span>
            </div>
          </div>

        </group>
        <group class="line-bottom">
          <cell>
            <strong class="cell-title" slot="title">预交金总额</strong>
            <span class="money-text">￥{{totalDeposit}}</span>
          </cell>
        </group>
        <group gutter="0">
          <!-- <cell v-for="(item,index) in depositList" :key="index">
             <span slot="title">
               <span>{{item.paytime}}</span>
               <span>{{item.paytype}}</span>
               <span class="out-fee" v-if="item.payres==3">（已退）</span>
               <span class="error-fee" v-if="item.payres==2">（异常）</span>
             </span>
             <span>￥{{item.amount}}</span>
           </cell>-->
          <div class="deposit-list-li line-bottom" v-for="(item,index) in depositList" :key="index">
          <span>
            <p>
            	<!--<span>{{item.paytime}}</span>-->
            	<span class="out-fee">{{item.paytype}}</span>
            	<span class="out-fee" v-if="item.payres==3">（已退）</span>
            	<span class="error-fee" v-if="item.payres==2">（异常）</span>
            </p>
            <p class="deposit-list-date">{{item.paytime}}</p>
          </span>
            <span class="deposit-right">￥{{item.amount}}</span>
          </div>
        </group>

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
        stayHospitalInfo: state => state.stayHospitalInfo,
        totalDeposit: state => state.totalDeposit,
        depositList: state => state.depositList,
        selectedMember: state => state.selectedMember,
      }),
      cardInfo: function () {
        return this.$store.state.selectedCards[this.funKey];
      },
      funKey: function () {
        return this.$routeData.funKey;
      }
    },
    created() {
      let endtime = ''
      if (this.stayHospitalInfo.inflag == '是') {
        var today = new Date();
        endtime = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      } else {
        endtime = this.stayHospitalInfo.leavehospitaldate;
      }
      this.getDepositList({
        hospitalcode: this.hospitalInfo.hospitalcode,
        stayhospitalnum: this.cardInfo.cardno,
        cardtype: this.cardInfo.cardtype,
        starttime: this.stayHospitalInfo.stayhospitaldate,
        endtime: endtime,
        riid:this.selectedMember.riid
      })
    },
    data() {
      return {}
    },
    methods: {
      ...mapActions(["getDepositList"]),
    }
  }
</script>
<style scoped lang="scss">

  .inflag {
    color: #FF5722;
    border: 1px solid #FF5722;
  }

  .days {
    color: #FF9800;
  }

  .right-text {
    float: right;
  }

  .money-text {
    color: #FF9800;
  }

  .cell-title {
    /*font-size: 16px;*/
  }

  .out-fee {

  }

  .error-fee {
    color: #f43530;
  }

  .hosptalidation-deposit-plan {
    background: #F3F6FC;
  }

  .deposit-right {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 16px;
    font-size: 16px;
  }

  .deposit-list-li {
    padding: 8px 16px;
    position: relative;
  }

  .deposit-list-li p {
    font-size: 15px;
    color: #333;
    line-height: 1.8;
  }

  .deposit-list-li .deposit-list-date {
    color: #999;
    font-size: 12px;
  }

  .hospitalization-status-text {
    color: $fontColor;
    border: 0;
    font-size: 14px;
    padding: 0px;
  }

  .inflag {
    color: $mainColor;
    border: 0;
  }

  .card-plan{
    margin: 16px;
    box-shadow: 5px 5px 5px #ccc;
    .card-top{
      background: $mainColor;
      padding: 10px 16px;
      display: flex;
      color: white;
      img{
        width: 50px;
        height: 50px;
        vertical-align: middle;
        border-radius: 50%;
      }
      .card-info{
        margin-left: 10px;
        .label{
          width: 60px;
          display: inline-block;
        }
        .realname{

        }
        .cardno{
          margin-top: 5px;
          font-size: 14px;
        }
      }
    }
  }
</style>
