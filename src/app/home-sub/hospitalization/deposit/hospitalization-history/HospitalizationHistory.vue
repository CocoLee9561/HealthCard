<template>
  <div class="page">
    <view-box>
      <x-header slot="header">住院历史</x-header>
      <div v-if="stayHospitalInfos.length>0">

        <group :gutter="0" v-for="(item,index) in stayHospitalInfos" :key="index" @click.native="toDetail(item)" class="card-plan">
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
            <div class="booking-result-info-bar history-bar">
              <span class="booking-result-info-title">医院</span>
              <span class="booking-result-info-value">{{hospitalInfo.hospitalname}}</span>
              <span class="hospitalization-status-text right-text" :class="{'inflag':item.inflag=='是'}" slot="title">{{item.inflag == '是' ? '住院中' : '已出院'}}</span>
            </div>
            <div class="booking-result-info-bar history-bar">
              <span class="booking-result-info-title">科室</span>
              <span class="booking-result-info-value">{{item.departmentname?item.departmentname:'--'}}</span>
            </div>
            <div class="booking-result-info-bar history-bar">
              <span class="booking-result-info-title">诊断</span>
              <span class="booking-result-info-value">{{item.zhenduan?item.zhenduan:'--'}}</span>
            </div>
            <div class="booking-result-info-bar history-bar">
              <span class="booking-result-info-title">入院</span>
              <span class="booking-result-info-value">{{item.stayhospitaldate?item.stayhospitaldate:'--'}}</span>
              <span class="right-text">{{item.inflag == '是' ? '已入院' : '共住院'}}<span class="days"> {{item.days?item.days:'--'}} </span>天</span>
            </div>
          </div>
        </group>

      </div>
      <div v-else class="vux-center empty-page">
        暂无住院历史
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
        stayHospitalInfos: state => state.stayHospitalInfos,
        selectedMember: state => state.selectedMember,
      }),
      cardInfo: function () {
        return this.$store.state.selectedCards[this.funKey];
      },
      funKey: function () {
        return this.$routeData.funKey
      },
    },
    created() {

    },
    data() {
      return {}
    },
    methods: {
      ...mapActions([""]),
      toDetail(item) {
        this.$store.commit('updateStayHospitalInfo', item);
        this.$store.commit('updateIsNewPage', false);
        shareInst.client.back()
      }
    }
  }
</script>
<style scoped lang="scss">
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

  .days {
    color: #F06A00;
  }

  .right-text {
    float: right;
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
