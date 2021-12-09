<template>
  <div class="page">
    <view-box :body-padding-bottom="isShowNavBar?'90px':'44px'" body-padding-top="0">

      <div slot="header">
        <x-header>我的挂号</x-header>
        <tab v-model="selected">
          <tab-item @on-item-click="getRegisterHistoryList(0)">预约挂号</tab-item>
          <tab-item @on-item-click="getRegisterHistoryList(1)">当日挂号</tab-item>
        </tab>
      </div>

      <div v-if="selected==0" style="height: 100%">
        <div @scroll="onScroll($event),0" class="wraper" v-if="bookingRegisterList.length>0">
          <div v-for="(item,index) in bookingRegisterList" :key="index">
            <group>
              <cell @click.native="toResult(item)">
                <span slot="title" class="">
                  <span class="order-no-title">订单号: </span>
                  <span>{{item.reserveid}}</span>
                </span>
                <span class="status-text">{{status(item.status)}}</span>
              </cell>
            </group>

            <div @click="toResult(item)">
              <div class="doctor-info-bar ">
                <img :src="item.doctorphoto">
                <div class="doctor-info">
                  <strong>{{ item.doctorname }}</strong><span class="doctor-info-jobtitle">{{ item.doctorrank }}</span>
                  <div class="doctor-info-text">{{item.departmentname}}</div>
                  <div class="doctor-info-text">{{item.hospitalname}}</div>
                </div>
                 <button class="take-btn  own-mini-btn" mini v-if="(item.status == '0' || item.status == '3' || item.status == '4') && isOutDateOfReg(item.regdate) && item.isreviewed == '0' "
                        @click="reviewAction(item)">点评</button>
              </div>
            </div>
            <div class="booking-info-box" @click="toResult(item)">
              <div class="booking-info-plan own-web-plan">
                <div class="booking-info-bar">
                  <span class="booking-info-title">姓名</span>
                  <span class="booking-info-value">{{item.realname}}</span>
                </div>
                <div class="booking-info-bar">
                  <span class="booking-info-title">时间</span>
                  <span class="booking-info-value">{{item.regdate}} ( {{item.regweek}} ) {{item.regtime}}</span>
                </div>
                <div class="booking-info-bar">
                  <span class="booking-info-title">费用</span>
                  <span class="booking-info-value">{{item.bsregisterfee}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="vux-center empty-page" v-else>
          <div style="text-align:center;">
            <img src="@icon/icon_notbook.png" width="50%" alt>
            <div style="color:#999999">暂无预约记录</div>
          </div>
        </div>
      </div>
      <div v-if="selected==1" style="height: 100%">
        <div @scroll="onScroll($event),0" class="wraper" v-if="curRegisterList.length>0">
          <div v-for="(item,index) in curRegisterList" :key="index">
            <group>
              <cell @click.native="toResult(item)">
              <span slot="title">
                <span class="order-no-title">订单号</span>
                <span>{{item.reserveid}}</span>
              </span>
                <span class="status-text">{{status(item.status)}}</span>
              </cell>
            </group>

            <div @click="toResult(item)">
              <div class="doctor-info-bar ">
                <img :src="item.doctorphoto">
                <div class="doctor-info">
                  <strong>{{ item.doctorname }}</strong><span class="doctor-info-jobtitle">{{ item.doctorrank }}</span>
                  <div class="doctor-info-text">{{item.departmentname}}</div>
                  <div class="doctor-info-text">{{item.hospitalname}}</div>
                </div>
                 <button class="take-btn  own-mini-btn" mini v-if="(item.status == '0' || item.status == '3' || item.status == '4') && isOutDateOfReg(item.regdate) && item.isreviewed == '0' "
                        @click="reviewAction(item)">点评</button>
              </div>
            </div>
            <div class="booking-info-box" @click="toResult(item)">
              <div class="booking-info-plan own-web-plan">
                <div class="booking-info-bar">
                  <span class="booking-info-title">姓名</span>
                  <span class="booking-info-value">{{item.realname}}</span>
                </div>
                <div class="booking-info-bar">
                  <span class="booking-info-title">时间</span>
                  <span class="booking-info-value">{{item.regdate}} ( {{item.regweek}} ) {{item.regtime}}</span>
                </div>
                <div class="booking-info-bar">
                  <span class="booking-info-title">费用</span>
                  <span class="booking-info-value">{{item.bsregisterfee}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="vux-center empty-page" v-else>
          <div style="text-align:center;">
            <img src="@icon/icon_notbook.png" width="50%" alt>
            <div style="color:#999999">暂无挂号记录</div>
          </div>
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import {Tab, TabItem, Sticky} from 'vux'

  export default {
    components: {
      Tab, TabItem, Sticky
    },
    computed: {
      ...mapState(["curRegisterList", "bookingRegisterList"]),
      selected:{
        get:function(){
          return this.$store.state.tabSelected||0
        },
        set:function(val){
          this.$store.commit('updateTabSelected',val)
        }
      }
    },
    created() {
//      for (var i = 0; i < 10; i++) {
//        this.getRegisterHistoryList(0)
//      }
      this.getRegisterHistoryList(0)
      this.getRegisterHistoryList(1)
    },
    data() {
      return {
//        selected: 0,
        isShowNavBar:shareInst.client.showWebNavBar,
        curNext: true,
        bookingNext: true,
        curPaginator: {
          page: 1,
          rows: 10,
          regtype: 1
        },
        bookingPaginator: {
          page: 1,
          rows: 10,
          regtype: 0
        }
      }
    },
    methods: {
      ...mapActions(["getRegHistoryList"]),
      getRegisterHistoryList(regtype) {
        let params = {}
        if (regtype == 0) {
          params = this.bookingPaginator
        } else if (regtype == 1) {
          params = this.curPaginator
        }
        this.getRegHistoryList(params).then((res) => {
          if (res.length == 0) {
            if (regtype == 0) {
              this.bookingNext = false
            } else if (regtype == 1) {
              this.curNext = false
            }
          } else {
            if (regtype == 0) {
              this.bookingNext = true
            } else if (regtype == 1) {
              this.curNext = true
            }
          }
        })
      },
      reviewAction(item) {
        //去点评
        this.$store.commit('updateReviewDoctorInfo', item)
        shareInst.client.push({
          path: '/reviewDoctor'
        })
        this.stopBubbling(event)
      },
      isOutDateOfReg(regdate) {

        var curTime = new Date().getTime();
        var regTime = new Date(regdate).getTime();

        let result = ((curTime - regTime) / (1000 * 60 * 60 * 24));

        return result >= 1;

      },
      onScroll() {
        let offsetHeight = event.currentTarget.offsetHeight,
          scrollHeight = event.target.scrollHeight,
          scrollTop = event.target.scrollTop,
          scrollBottom = offsetHeight + scrollTop
        if (scrollBottom === scrollHeight || scrollBottom === scrollHeight + 2) {
          if (this.selected == 0) {
            if (!this.bookingNext) return;
            this.bookingPaginator.page += 1
          } else if (this.selected == 1) {
            if (!this.curNext) return;
            this.curPaginator.page += 1
          }
          this.getRegisterHistoryList(this.selected)
        }
      },
      toResult(item) {
        item.statusText = this.status(item.status)
        //去点评
        this.$store.commit('updateBookingResult', item)

        shareInst.client.push({
          path: '/bookingDetail',
          query: {
            bookType: this.selected,
            isMy: true,
            orderNo:item.orderno
          }
        })
      },
      status(status) {
        switch (status) {
          case 0:
            return this.selected == 0 ? "已预约" : "已挂号"
          case 1:
            return "已退号"
          case 2:
            return "爽约"
          case 3:
            return "已就诊"
          case 4:
            return "已取号"
          case 5:
            return "停诊"
          case 6:
            return "待支付"
          case 7:
            return "预约失败"
          default:
            return ""
        }
      },
      stopBubbling(e) {
        e = window.event || e;
        if (e.stopPropagation) {
          e.stopPropagation();      //阻止事件 冒泡传播
        } else {
          e.cancelBubble = true;   //ie兼容
        }
      }
    }
  }
</script>
<style scoped>

  .order-no-title {
    color: #bbb;
  }

  .doctor-info-bar {
    border-bottom: 0px;
  }

  .booking-info-box {
    padding: 0px 10px 15px 10px;
    background: #fff;
  }

  .take-btn {
    margin-top: 20px;
    float: right;
  }

  .status-text {
    font-size: 0.875rem;
  }

  .own-web-plan {
    background: #F3F6FC;
  }

  .vux-tab .vux-tab-item.vux-tab-selected {
    color: #4B6BAF;
  }

  .my-registration-bar {
    background: #F4F4F4;
    color: #333;
    padding: 16px;
  }

  .my-register-list-box {
    background: #fff;
  }

  .my-register-list-box .my-register-list-li:first-child {
    border-bottom: 1px solid #DFDFDF;
  }

  .my-register-list-box .my-register-list-li:not(:last-of-type) {
    padding: 10px 16px 10px 0;
    margin-left: 16px;
  }

  .my-register-list-box .my-register-list-li:last-child {
    padding: 10px 16px;
    border-top: 1px solid #DFDFDF;
  }

  .my-register-list-box .my-register-list-li .my-register-list-left {
    width: 5rem;
    display: inline-block;
  }

  .my-register-list-box .my-register-list-li .my-register-list-text {

    color: #666;
  }

  .my-registration-bar img {
    width: 70px;
    height: 70px;
  }

  .my-registration-bar {
    height: 100px;
  }

  .my-register-list-box .my-register-list-li .my-register-list-text.money {
    color: #FF4949;
  }

  .my-register-list-btn {
    float: right;
    width: 4rem;
    height: 2rem;
    background: #fff;
    border: 1px solid #4B6BAF;
    border-radius: 2px;
    margin-top: -3px;
  }
  .own-mini-btn {
    background: #fff;
    border: 1px solid #4B6BAF;
    width: 4rem;
    height: 2rem;
    border-radius: 3px;
  }
  .booking-info-bar .booking-info-title{
    width: 30px;
  }
</style>
