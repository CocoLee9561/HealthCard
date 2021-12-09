<template>
  <div class="page">
    <view-box>
      <x-header slot="header">医生信息</x-header>
      <div>
        <!-- <div class="doctor-info-bar">
           <img :src="doctorInfo.doctorphoto"  onerror="this.src='../../../../common/assets/icon/my/ic_avatar@2x.png'">
           <div class="doctor-info">
             <strong>{{ doctorInfo.doctorname }}</strong><span class="doctor-info-jobtitle">{{ doctorInfo.doctorrank }}</span>
             <div class="doctor-info-text">{{doctorInfo.departmentname}}</div>
             <div class="doctor-info-text">{{doctorInfo.hospitalname}}</div>
           </div>
           <div v-if="!doctorInfo.iscollected!=0" class="doctor-follow-btn" @click="followDoctor(0)">关注</div>
           <div v-else class="doctor-follow-btn" @click="followDoctor(1)">取消关注</div>
       </div>

       <div style="padding: 10px;background: #fff">
         <div class="doctor-info-goodAt" :class="{expand:!isExpand}">
           {{ doctorInfo.doctorspecialty }}
         </div>
         <div class="expand-text-btn" @click="expandGoodAt">{{ expandText }}</div>
       </div>

       -->
        <div class="doctor-info-bar">
          <img v-if="doctorInfo.doctorphoto" :src="doctorInfo.doctorphoto">
          <img v-else src="@icon/my/ic_avatar@2x.png">
          <div class="doctor-info">
            <strong>{{ doctorInfo.doctorname }}</strong>
            <div class="doctor-info-text1"><span class="doctor-info-job">{{doctorInfo.doctorrank}}</span>
              <span>{{doctorInfo.departmentname}}</span></div>
            <div class="doctor-info-text1">{{doctorInfo.hospitalname}}</div>
          </div>
          <div v-if="doctorInfo.iscollected==0" class="doctor-follow-btn" @click="followDoctor(0)">+关注</div>
          <div v-else class="doctor-follow-btn" @click="followDoctor(1)">取消关注</div>
        </div>

        <div v-if="doctorInfo.doctorspecialty" style="padding: 10px;background: #fff" class="current-doctor-info">
          <div class="doctor-info-goodAt" :class="{expand:!isExpand}">
            <!--<p class="doctor-info-goodtitle">擅长</p>-->
            <p>
              {{ doctorInfo.doctorspecialty }}
            </p>
          </div>
          <div class="expand-text-btn" @click="expandGoodAt">{{ expandText }}</div>
        </div>
        <!-- 预约挂号 -->
        <div style="margin-top: 10px;">
          <div v-if="bookType==0">
            <div v-if="scheduleTitle.length>0" class="doctor-booking-time-day" :style="{height:((scheduleTitle.length+1)*50)+'px'}">
              <div class="doctor-booking-time-day-apm">
                <div class="doctor-booking-time-day-am">排班</div>
                <div class="doctor-booking-time-day-am" v-for="item in scheduleTitle">{{item}}</div>
                <!--<div class="doctor-booking-time-day-am">下午</div>-->
              </div>
              <div class="doctor-booking-time-bar">
                <swiper :show-dots="false" :show-desc-mask="false" class="doctor-booking-time-swipe" ref="swipeWrapper" height="100%"
                        @on-index-change="handleSwipeChange">
                  <swiper-item v-for="(item,index) in scheduleTimes" :key="index">
                    <flexbox :gutter="0">
                      <flexbox-item style="height: 100%;" v-for="(weekItem,weekIndex) in item" :key="weekIndex">
                        <div class="booking-time-item">
                          <div class="booking-time-week">{{ weekItem[scheduleTitle[0]].workWeek }}</div>
                          <div class="booking-time-date">{{ weekItem[scheduleTitle[0]].workdate.split('-')[2] }}</div>
                        </div>

                      </flexbox-item>

                    </flexbox>
                    <flexbox :gutter="0">
                      <flexbox-item  v-for="(bookingTimeItem,bookingItemIndex) in scheduleTimes[index]":key="bookingItemIndex">
                        <div class="time-box-bar">
                          <div class="time-box-bar-item" v-for="(amItem,amIndex) in scheduleTitle">
                            <div class="time-box" :class="[((scheduleTitle.length-1)==amIndex)?'time-box-pm':'time-box-am']">
                              <div v-if="bookingTimeItem[amItem].isdisplay!=0&&bookingTimeItem[amItem].countofreg>0" class="time-box-booking"
                                   @click="bookingTime(bookingTimeItem[amItem])">预约
                              </div>
                              <div v-if="bookingTimeItem[amItem].isdisplay!=0&&bookingTimeItem[amItem].countofreg<=0" class="time-box-booking-full">约满</div>
                            </div>
                          </div>
                          <!--<div class="time-box-bar-item">-->
                            <!--<div class="time-box time-box-pm">-->
                              <!--<div v-if="bookingTimeItem.pm.isdisplay!=0&&bookingTimeItem.pm.countofreg>0" class="time-box-booking"-->
                                   <!--@click="bookingTime(bookingTimeItem.pm)">预约-->
                              <!--</div>-->
                              <!--<div v-if="bookingTimeItem.pm.isdisplay!=0&&bookingTimeItem.pm.countofreg<=0" class="time-box-booking-full">约满</div>-->
                            <!--</div>-->
                          <!--</div>-->
                        </div>
                      </flexbox-item>
                    </flexbox>
                  </swiper-item>
                </swiper>
              </div>
            </div>
          </div>

          <!-- 当日挂号 -->
          <div v-else class="doctor-info-table">
            <!--<div>
              <mt-cell v-for="(item,index) in doctorInfo.schedulelist" :key="index">
                <span slot="title">{{item.workdate}}（{{ item.workWeek }}）{{ item.worktype==1?'上午':'下午' }}</span>
                <span>
                  <div class="time-box-booking time-box-cur-booking" @click="bookingTime(item)">预约</div>
                </span>
              </mt-cell>
            </div>-->
            <table border="0" cellspacing="0" cellpadding="0" v-if="doctorInfo.schedulelist.length>0">
              <tr>
                <td colspan="3" class="doctor-text-black">
                  {{doctorInfo.schedulelist[0].workdate}} {{doctorInfo.schedulelist[0].workWeek}}
                </td>
              </tr>
              <tr v-for="(item,index) in doctorInfo.schedulelist" :key="index">
                <!--<td>{{ item.worktype == 1 ? '上午' : '下午' }}</td>-->
                <td>{{item.worktypeName}}</td>
                <td>
                  <p class="doctor-text-black">{{doctorInfo.hospitalname}}</p>
                  <p>{{doctorInfo.departmentname}}</p>
                </td>
                <td class="time-box-booking time-box-cur-booking" @click="bookingTime(item)">
                  <p>挂号</p>
                  <!--<span>￥{{doctorInfo.registerfee}}</span>-->
                </td>
              </tr>
            </table>
          </div>
        </div>

        <!--<group class="doctor-jop-address">-->
        <!--<cell>-->
        <!--<img style="display: block;margin-right: 5px;" slot="icon" src="../../../../common/assets/icon/hospital_location.png" width="16"/>-->
        <!--<span slot="title">-->
        <!--<span>执业地点:</span>-->
        <!--<span>内科门诊-惠州市西湖社康</span>-->
        <!--</span>-->
        <!--</cell>-->
        <!--<cell>-->
        <!--<img style="display: block;margin-right: 5px;" slot="icon" src="../../../../common/assets/icon/hospital_location.png" width="16"/>-->
        <!--<span slot="title">执业地点: -->
        <!--<span>内科门诊-惠州市西湖社康</span>-->
        <!--</span>-->
        <!--</cell>-->
        <!--</group>-->

        <group v-if="doctorInfo.countofreview>0">
          <cell is-link @click.native="toReviewList">
            <span slot="title">用户点评({{ doctorInfo.countofreview }})</span>
            <span class="doctor-info-stars">
              <span v-for="index in 5">
                  <img v-if="doctorInfo.totalevalper>=index" src="@icon/stars-yellow.png" width="18"/>
                  <img v-else src="@icon/stars-gray.png" width="18"/>
                </span>
            </span>
          </cell>
        </group>

        <group v-if="doctorInfo.doctorintro">
          <div class="doctor-info-intro">
            <p class="doctor-text-black">医生简介</p>
            <div style="color:#939393;" id="doctorInfoDoctorIntro"></div>
          </div>
        </group>

        <popup
          :popup-style="{zIndex:701}"
          v-model="rightPopupVisible"
          position="right" style="width: 70%;height: 100%;"
          popup-transition="popup-fade">
          <div style="height: 100%;width: 100%;">
            <div class="booking-time-quantum-title">请选择时间段</div>
            <div v-if="scheduleList.length>0">
              <div v-for="(item,index) in scheduleList" @click="booking(item)" class="booking-time-quantum-item"
                   :class="{stripe:index%2==0}">
                <div class="booking-time-quantum">{{item.timequantum}}</div>
                <div class="booking-time-order" v-if="item.isorder==1&&item.basenum!=''&&item.basenum>0">还有 <span class="basenum">{{item.basenum}}</span>
                  个号
                </div>
                <div v-if="item.isorder!=1||item.basenum==0" class="already-booking-full">已约满</div>
              </div>
            </div>
            <div v-else class="vux-center empty-page">
              没有可{{bookType==0?'预约':'挂号'}}的时间段
            </div>
          </div>
        </popup>
      </div>
    </view-box>
  </div>
</template>
<script>

  import {mapState, mapActions} from 'vuex'
  import {Flexbox, FlexboxItem,Popup,Swiper,SwiperItem} from 'vux'

  export default {
    components: {
      Flexbox, FlexboxItem,Popup,Swiper,SwiperItem
    },
    computed: {
      ...mapState({
        doctorInfo: state => state.doctorInfo,
        scheduleList: state => state.scheduleList,
        selectedMember: state => state.selectedMember,
        scheduleTimes: state => state.scheduleTimes,
        scheduleTitle: state =>state.scheduleTitle
      }),
      bookType: function () {
        return this.$routeData.bookType;
      },
      doctorId: function () {
        return this.$routeData.doctorId;
      },
      departmentId: function () {
        return this.$routeData.departmentId
      },
      routeName: function () {
        return this.$routeData.routeName
      },
      isFirstPatient: function () {
        return this.$routeData.isFirstPatient
      },
      selectedCard: function () {
        return this.$store.state.selectedCards[this.$routeData.funKey];
      },
    },
    mounted(){
      this.getregdoctorinfo();
    },
    created() {
      this.swipePages.push({weekDays: this.getWeek(0)})
      this.swipePages.push({weekDays: this.getWeek(1)})
      if (this.bookType == 0) {
        this.getdocschedulelist();
      }
    },
    data() {
      return {
        rightPopupVisible: false,
        workDate: '',
        weekDate:'',
        isExpand: false,
        expandText: '展开剩余内容',
        index: 0,
        swipePages: [],
        curBookingTimes: [],
        bookingTimes: []
      }
    },
    methods: {
      ...mapActions(["getRegDoctorInfo", "getRegScheduleList", "collectionDoctor", "getDocScheduleList", "getHospitalInfo"]),
      followDoctor(flag) {//0关注  1取消关注
        this.collectionDoctor({
          regtype: this.bookType,
          doctorid: this.doctorId,
          departmentid: this.departmentId,
          hospitalid: this.doctorInfo.hospitalid
        })
      },
      getregdoctorinfo() {
        let params = {
          regtype: this.bookType,
          doctorid: this.doctorId,
          departmentid: this.departmentId
        }
        if(this.isFirstPatient==1){//如果是优抚号
          Object.assign(params,{
            cardtype:this.selectedCard.cardtype,
            cardno:this.selectedCard.cardno,
            cid:this.selectedMember.cid||this.selectedMember.guardiancardno
          })
        }
        this.getRegDoctorInfo(params).then((res) => {
          this.$nextTick(()=>{
            document.getElementById('doctorInfoDoctorIntro').innerHTML = res.doctorintro
          })
          if (this.routeName && this.routeName == 'myFouce') {
            this.getHospitalInfo({
              hospitalcode: this.doctorInfo.hospitalCode
            })
          }
        })
      },
      getregschedulelist(workdate, worktype) {
        this.workDate = workdate
        this.getRegScheduleList({
          regtype: this.bookType,
          workdate: workdate,
          worktype: worktype,
          doctorid: this.doctorId,
          departmentid: this.departmentId
        })
      },
      getdocschedulelist() {
        let params={
          doctorid: this.doctorId,
          departmentid: this.departmentId
        }
        if(this.isFirstPatient==1){//如果是优抚号
          Object.assign(params,{
            cardtype:this.selectedCard.cardtype,
            cardno:this.selectedCard.cardno,
            riid:this.selectedMember.riid,
            cid:this.selectedMember.cid||this.selectedMember.guardiancardno
          })
        }
        this.getDocScheduleList(params).then((res) => {
          this.bookingTimes = res[0];
        })
      },
      expandGoodAt() {
        this.isExpand = !this.isExpand
        if (!this.isExpand) {
          this.expandText = '展开剩余内容'
        } else {
          this.expandText = '收起内容'
        }
      },
      handleSwipeChange(index) {
//        if((this.swipePages.length-this.index)<3){
//          let w = this.getWeek(this.swipePages.length)
//          this.swipePages.push({weekDays:w});
//        }
        this.bookingTimes = this.scheduleTimes[index];
        this.index = index
      },
      prevPage() {
        if (this.index > 0) {
          this.$refs.swipeWrapper.prev();
        }
      },
      nextPage() {
        if (this.index < this.swipePages.length - 1) {
          this.$refs.swipeWrapper.next();
        }
      },
      getWeek(index) {
        const week = [];
        const now = new Date().getTime();
        const w = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        for (let i = 0; i < 7; i++) {
          let Stamp = new Date();
          let number;
          if (Stamp.getDay() == 0) {
            number = 7;
          } else {
            number = Stamp.getDay();
          }
          let num = 7 * index - number + 1 + i;
          Stamp.setDate(Stamp.getDate() + num);

          let year = Stamp.getFullYear();
          let month = Stamp.getMonth() + 1;
          let date = Stamp.getDate();
          if (month < 10) {
            month = `0${month}`;//这里使用的反引号
          }
          let a = {};
          a.week = w[i]
          if (now / 60000 >= Stamp.getTime() / 60000) {
            a.isChecked = false
          } else {
            a.isChecked = true
          }
          if (date < 10) {
            a.date = `${month}/0${date}`
            week.push(a);//这里使用的反引号
          } else {
            a.date = `${month}/${date}`
            week.push(a);//这里使用的反引号
          }
        }
        return week;
      },
      clickDate(item) {
        if (item.isChecked) {
          this.currentDate = item.date
        }
      },
      bookingTime(item) {
        this.weekDate=item.workWeek
        this.getregschedulelist(item.workdate, item.worktype);
        this.rightPopupVisible = true
      },
      booking(item) {

        if(item.isorder!=1||item.basenum==0){
          return;
        }

        this.$store.commit('updateSelectedSehedule', item)

        let confirmData = {
          workweek: item.workweek,
          hospitalname: this.doctorInfo.hospitalname,
          departmentname: this.doctorInfo.departmentname,
          regtime: item.timequantum,
          worktype: item.worktype,
          weekDate:this.weekDate,
          scheduleid: item.scheduleid,
          regdate: this.workDate.replace('/', '-').replace('/', '-'),
          isexpert: this.doctorInfo.isexpert == 0 ? "普通" : "专家",
          doctorname: this.doctorInfo.doctorname,
          doctorrank: this.doctorInfo.doctorrank,
          reghospitalid: this.doctorInfo.hospitalid,
          regdepartid: this.doctorInfo.departmentid,
          regdoctorid: this.doctorInfo.doctorid,
          bookType: Number(this.bookType),
          registerfee: this.doctorInfo.registerfee,
          clinicfee: this.doctorInfo.clinicfee,
          expertfee: this.doctorInfo.expertfee,
          notice: this.doctorInfo.treatmentnotice || this.doctorInfo.hospitalnotice,
          regPayType: (this.bookType == 1) ? this.doctorInfo.regPayType : ''
        }

        this.$store.commit('updateBooingInfo', confirmData);

        if (this.isFirstPatient != 1) {
          this.$store.commit('selectMember', {});
          this.$store.commit('selectCard', {
            funKey: this.$routeData.funKey,
            card: {}
          })
        }
        this.$store.commit('updateCardIsNewPage', true);
        shareInst.client.push({
          path: '/chooseMemberCard',
          query: {
            bookType: this.bookType,
            funKey: this.$routeData.funKey,
            isFirstPatient: this.$routeData.isFirstPatient
          }
        })
      },
      toReviewList() {
        shareInst.client.push({
          path: '/reviewList',
          query: {
            isUse: 1,
            doctorId: this.doctorInfo.doctorid,
            countofreview: this.doctorInfo.countofreview
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .doctor-info-bar {
    padding: 20px 16px;
    height: auto;
    overflow: hidden;
  }

  .doctor-info-bar strong {
    color: #333333;
  }

  .doctor-info-bar img {
    width: 4.4rem;
    height: 4.4rem;
    border-radius: 50%;
  }

  .doctor-info-bar .doctor-info-text1 {
    font-size: 14px;
    color: #BEBEBE;
  }

  .current-doctor-info .expand {
    max-height: 4rem;
  }

  .doctor-info-goodAt .doctor-info-goodtitle {
    font-size: 16px;
    color: #959595;
  }

  .doctor-info-bar .doctor-follow-btn {
    vertical-align: middle;
    float: right;
    padding: 5px 16px;
    /*margin-top: 15px;*/
    border-radius: 0px;
    font-size: 13px;
    user-select: none;
    border: 1px solid $mainColor;
    color: $mainColor;
  }

  .doctor-info-bar .doctor-follow-btn:active {
    border-color: #ccc;
    color: #ccc;
  }

  .doctor-info-goodAt {
    font-size: 13px;
    color: #959595;
    overflow: hidden;
    overflow: hidden;
  }

  .doctor-booking-time-bar {
    height: 100%;
    width: 100%;
    background: #fff;
  }

  .doctor-booking-time-arrow-left:after {
    border: solid 3px #c8c8cd;
    border-bottom-width: 0;
    border-left-width: 0;
    content: " ";
    top: 50%;
    left: 10px;
    position: absolute;
    width: 10px;
    height: 10px;
    -webkit-transform: translateY(-50%) rotate(225deg);
    transform: translateY(-50%) rotate(225deg);
  }

  .doctor-booking-time-arrow-right:after {
    border: solid 3px #c8c8cd;
    border-bottom-width: 0;
    border-left-width: 0;
    content: " ";
    top: 50%;
    right: 10px;
    position: absolute;
    width: 10px;
    height: 10px;
    -webkit-transform: translateY(-50%) rotate(45deg);
    transform: translateY(-50%) rotate(45deg);
  }

  .doctor-booking-time-swipe {
    height: 100%;
    margin-left: 25px;
    box-sizing: border-box;
  }

  .booking-time-item {
    border-right: 1px solid #EBEBEB;
    border-bottom: 1px solid #EBEBEB;
    padding: 5px 0px;
    box-sizing: border-box;
    height: 50px;
    vertical-align: middle;
    text-align: center;
    font-size: 12px;
    color: #333;
  }

  .doctor-booking-time-day {
    background: #fff;
    width: 100%;
    border-top: 1px solid #EBEBEB;
    border-bottom: 1px solid #EBEBEB;
  }

  .doctor-booking-time-day-apm {
    font-size: 14px;
    width: 25px;
    /*height: 150px;*/
    box-sizing: border-box;
    border-right: 1px solid #EBEBEB;
    line-height: 25px;
    text-align: center;
    color: #BFBFBF;
    float: left;
  }

  .doctor-booking-time-day-apm div {
    height: 50px;
    writing-mode: tb-rl
  }

  .doctor-booking-time-day-am {
    box-sizing: border-box;
  }

  .time-box-bar {
    height: 100px;
  }

  .time-box-bar-item {
    width: 100%;
    height: 50px;
    border-right: 1px solid #EBEBEB;
    box-sizing: border-box;
  }

  .time-box-am {
    border-bottom: 1px solid #EBEBEB;
    /*height: 100%;*/
    /*border-bottom: 1px solid #f5f5f5;*/
  }

  .time-box {
    height: 100%;
    line-height: 49px;
    text-align: center;
    box-sizing: border-box;
    font-size: 14px;
  }

  .time-box-booking {
    background: $mainColor;
    color: #fff;
    height: 49px;
    line-height: 49px;
  }

  .time-box-cur-booking {
    width: 65px;
    height: 50px;
    margin: 10px;
    text-align: center;
    padding: 15px 1px;
  }

  .time-box-cur-booking > span {
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
  }

  .time-box-booking-full {
    color: #9D9D9D;
  }

  .time-box-booking:active {
    background: #ccc;
  }

  .doctor-info-intro {
    padding: 10px;
    background: #fff;
  }

  .doctor-info-intro strong {
    font-size: 16px;
  }

  .doctor-info-intro div {
    margin-top: 5px;
    font-size: 14px;
    color: #555555;
  }

  .booking-time-quantum-title {
    box-sizing: border-box;
    /*border-bottom: 1px solid #f5f5f5;*/
    background: #fff;
    font-size: 18px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }

  .booking-time-quantum-item {
    padding: 0px 20px;
    box-sizing: border-box;
    /*border-bottom: 1px solid #f5f5f5;*/
    background: #fff;
    font-size: 14px;
    position: relative;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }

  .booking-time-quantum-item:after {
    border: solid 2px #c8c8cd;
    border-bottom-width: 0;
    border-left-width: 0;
    content: " ";
    top: 50%;
    right: 10px;
    position: absolute;
    width: 8px;
    height: 8px;
    -webkit-transform: translateY(-50%) rotate(45deg);
    transform: translateY(-50%) rotate(45deg);
  }

  .booking-time-quantum-item.stripe {
    background: #F4F4F4;
    /*border-top: 1px solid #9E9E9D;*/
  }

  .booking-time-quantum-item .booking-time-quantum {
    float: left;
  }

  .booking-time-quantum-item .booking-time-order span {
    color: $mainColor;
  }

  .booking-time-quantum-item .booking-time-order {
    margin-right: 5px;
    float: right;
  }

  .booking-time-quantum-item .already-booking-full {
    color: #CFCFCF;
    float: right;
  }

  .doctor-info-table table {
    border-collapse: collapse;
    border: 0px solid #E1E1E1;
    width: 100%;
    background: #fff;
    color: #888;
    font-size: 14px;
  }

  .doctor-info-table table tr {
    height: 40px;
  }

  .doctor-info-table table td {
    border-top: 0;
    border-right: 1px solid #E1E1E1;
    border-bottom: 1px solid #E1E1E1;
    border-left: 0;
    text-indent: 10px;

  }

  .doctor-text-black {
    color: #333;
  }

  .doctor-info-table table tr:last-child td {
    border-bottom: 0;
  }

  .doctor-info-table table tr td:last-child {
    border-right: 0;
  }

  .doctor-info-stars {
    position: relative;
    top: -2px
  }

  .doctor-info-stars > img {
    width: 1rem;
    height: 1rem;
  }

  .doctor-jop-address span {
    font-size: 15px;
    line-height: 1.5;
  }

  .doctor-jop-address span > span:last-child {
    color: #666;
  }

  .doctor-jop-address .mint-cell:not(:last-of-type) {
    border-bottom: 1px solid #E1E1E1;
  }

  .booking-time-week {
    color: #999999;
  }
  .booking-time-date{
    color: #6F6F6F;
    font-size: 14px;
  }
  .doctor-info-stars span{
    padding: 1px;
  }
  .doctor-info-stars span img{
    vertical-align: middle;
  }
</style>
