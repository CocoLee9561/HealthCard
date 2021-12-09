<template>
  <div class="page">
    <view-box>
      <x-header slot="header">就医点评</x-header>
      <div v-if="reviewList.length>0">
        <div v-for="item in reviewList">
          <group>
            <div>
              <div class="doctor-info-bar ">
                <img :src="item.doctorphoto">
                <div class="doctor-info">
                  <strong>{{ item.doctorname }}</strong><span class="doctor-info-jobtitle">{{ item.doctorrank }}</span>
                  <div class="doctor-info-text">{{item.departmentname}}</div>
                  <div class="doctor-info-text">{{item.hospitalname}}</div>
                </div>
                <button class="take-btn  own-mini-btn" mini @click="reviewAction(item)">点评</button>
              </div>
            </div>
            <div class="booking-info-box">
              <div class="booking-info-plan own-web-plan">
                <div class="booking-info-bar">
                  <span class="booking-info-title">姓名</span>
                  <span class="booking-info-value">{{item.realname}}</span>
                </div>
                <div class="booking-info-bar">
                  <span class="booking-info-title">时间</span>
                  <span class="booking-info-value">{{item.regdate}} {{item.regtime}}</span>
                </div>
                <div class="booking-info-bar">
                  <span class="booking-info-title">费用</span>
                  <span class="booking-info-value">{{item.bsregisterfee}}</span>
                </div>
              </div>
            </div>
          </group>
        </div>
      </div>
      <div v-else>
        <figure style="text-align:center; margin-top:100px;;width:100%;">
          <img  src="@icon/ico-no.png" alt="">
          <p style="margin-top:10px;color:#999;">暂无可点评的医生</p>
          <div style="padding: 20px 10px;">
            <x-button @click.native="goRegHistory" class="own-btn">查看预约记录</x-button>
          </div>
        </figure>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    computed: {
      ...mapState(["reviewList"]),
    },
    created() {
      this.getTodayReview({});
    },
    data() {
      return {}
    },
    methods: {
      ...mapActions(["getTodayReview"]),
      reviewAction(item) {
        //去点评
        this.$store.commit('updateReviewDoctorInfo', item)
        shareInst.client.push({
          path: '/reviewDoctor'
        })
      },
      goRegHistory(){
        shareInst.client.push({
          path:'/myRegister'
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .doctor-info-bar {
    border-bottom: 0px;
  }

  .take-btn {
    margin-top: 20px;
    float: right;
  }

  .own-web-plan {
    /*background: #F3F6FC;*/
  }

  .own-mini-btn {
    background: #fff;
    border: 1px solid $mainColor;
    color: $mainColor;
    width: 4rem;
    height: 2rem;
    border-radius: 0px;
  }
  .booking-info-bar .booking-info-title{
    width: 30px;
  }
</style>
