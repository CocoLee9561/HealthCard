<template>
  <div class="page">
    <view-box>
      <x-header slot="header">{{departmentInfo.departmentname}}</x-header>
      <div>
        <!-- 预约挂号 -->
        <div v-if="bookType==0">
          <tab v-model="selected" class="own-tab">
            <tab-item @on-item-click="getDoctorListByDept">按专家预约</tab-item>
            <tab-item @on-item-click="getDoctorListByDate">{{tabName2}}</tab-item>
          </tab>

          <div>
            <div v-if="selected==0">
              <search
                @on-change="getResult"
                v-model="value"
                position="absolute"
                ref="search"></search>
              <div style="margin-top: 10px;" v-if="searchDoctorList.length>0">
                <div class="doctor-list-item" v-for="item in searchDoctorList" @click="bookingDoctor(item)">
                  <img :src="item.doctorphoto">
                  <div class="doctor-list-item-info">
                    <strong>{{ item.doctorname }}</strong><span class="doctor-list-item-jobtitle">{{ item.doctorrank
                    }}</span>
                    <div class="doctor-list-item-goodat">{{item.doctorspecialty}}</div>
                  </div>
                  <div class="doctor-list-item-btn" :disabled="!item.isBooking" v-bind:class="{disabled: false}"
                       @click="bookingDoctor(item)">预约
                  </div>
                </div>
              </div>
              <!--<div v-if="doctorList.length>0">-->
                <!--<div style="margin-top:10px;" v-for="item in doctorList" >-->
                  <!--<div @click="bookingDoctor(item)">-->
                    <!--<div class="doctor-list-item">-->
                      <!--<img v-if="item.doctorphoto" :src="item.doctorphoto" >-->
                      <!--<img v-else src="@icon/my/ic_avatar@2x.png">-->

                      <!--<div class="doctor-list-item-info">-->
                        <!--<strong>{{ item.doctorname }}</strong><span class="doctor-list-item-jobtitle">{{ item.doctorrank }}</span>-->
                        <!--<div class="doctor-list-item-goodat" v-if="item.doctorspecialty"><span>擅长</span> {{item.doctorspecialty}}</div>-->
                        <!--<div class="doctor-list-item-goodat" v-if="item.departname">{{item.departname}}</div>-->
                      <!--</div>-->
                      <!--<div class="doctor-list-item-btn" @click="bookingDoctor(item)" v-bind:class="{disabled: false}">预约-->
                      <!--</div>-->
                    <!--</div>-->
                    <!--<div class="doctor-list-bottom">-->
                      <!--<div><span>预约{{item.countofreghistory||'0'}}</span></div>-->
                      <!--<div><span>评论{{item.countofreview||'0'}}</span></div>-->
                      <!--<div><span>粉丝{{item.countofcollection||'0'}}</span></div>-->
                    <!--</div>-->
                  <!--</div>-->
                <!--</div>-->
              <!--</div>-->
              <div v-else class="vux-center empty-page" style="height: 400px;">
                {{tipText}}
              </div>
            </div>
            <div v-if="selected==1">
              <group class="doctor-booking-time-bar">
                <!--<i class="doctor-booking-time-arrow-left" @click="prevPage"></i>-->
                <mt-swipe class="doctor-booking-time-swipe" ref="swipeWrapper" :defaultIndex="index"
                          :stopPropagation="true" :auto="0" :continuous="false" :show-indicators="false"
                          @change="handleSwipeChange">
                  <mt-swipe-item v-for="(item,index) in swipePages" :key="index">
                    <flexbox :gutter="0">
                      <flexbox-item v-for="(weekItem,weekIndex) in item.weekDays" :key="weekIndex" class="booking-time-item":class="{checked:weekItem.formatDate==currentDate,disabled:!weekItem.isChecked}" @click.native="clickDate(weekItem)">
                        <div class="booking-time-week">{{ weekItem.week }}</div>
                        <div style="margin-top: 5px;">
                         <span class="booking-time-date">{{ weekItem.date.split('/')[1] }}</span>
                        </div>
                      </flexbox-item>
                    </flexbox>
                  </mt-swipe-item>
                </mt-swipe>
                <div class="current-date">{{formatCurDate()}}</div>
                <!--<i class="doctor-booking-time-arrow-right" @click="nextPage"></i>-->
              </group>
              <div style="margin-top:10px;" v-if="dateDoctorList.length>0">
                <div class="doctor-list-item" v-for="item in dateDoctorList" @click="bookingDoctor(item)">
                  <img :src="item.doctorphoto">
                  <div class="doctor-list-item-info">
                    <strong>{{ item.doctorname }}</strong><span class="doctor-list-item-jobtitle">{{ item.doctorrank
                    }}</span>
                    <div class="doctor-list-item-goodat">{{item.doctorspecialty}}</div>
                  </div>
                  <div class="doctor-list-item-btn" :disabled="!item.isBooking" v-bind:class="{disabled: false}"
                       @click="bookingDoctor(item)">预约
                  </div>
                </div>
              </div>

              <!--<div v-if="dateDoctorList.length>0">-->
                <!--<div style="margin-top:10px;" v-for="item in dateDoctorList">-->                  <!--<div @click="bookingDoctor(item)">-->
                    <!--<div class="doctor-list-item">-->
                      <!--<img v-if="item.doctorphoto" :src="item.doctorphoto">-->
                      <!--<img v-else src="@icon/my/ic_avatar@2x.png">-->

                      <!--<div class="doctor-list-item-info">-->
                        <!--<strong>{{ item.doctorname }}</strong><span class="doctor-list-item-jobtitle">{{ item.doctorrank }}</span>-->
                        <!--<div class="doctor-list-item-goodat" v-if="item.doctorspecialty"><span>擅长</span> {{item.doctorspecialty}}</div>-->
                        <!--<div class="doctor-list-item-goodat" v-if="item.departname">{{item.departname}}</div>-->
                      <!--</div>-->
                      <!--<div class="doctor-list-item-btn" @click="bookingDoctor(item)" v-bind:class="{disabled: false}">预约-->
                      <!--</div>-->
                    <!--</div>-->
                    <!--<div class="doctor-list-bottom">-->
                      <!--<div><span>预约{{item.countofreghistory||'0'}}</span></div>-->
                      <!--<div><span>评论{{item.countofreview||'0'}}</span></div>-->
                      <!--<div><span>粉丝{{item.countofcollection||'0'}}</span></div>-->
                    <!--</div>-->
                  <!--</div>-->
                <!--</div>-->
              <!--</div>-->
              <div v-else class="vux-center empty-page" style="height: 400px;">
                {{regTipText}}
              </div>

            </div>
          </div>
        </div>

        <!-- 当日挂号  -->
        <div v-else>
          <search
            @on-change="getResult"
            v-model="value"
            position="absolute"
            ref="search_1"></search>
          <div style="margin-top:10px;" v-if="searchDoctorList.length>0">
            <div class="doctor-list-item" v-for="item in searchDoctorList" @click="bookingDoctor(item)">
              <img :src="item.doctorphoto">
              <div class="doctor-list-item-info">
                <strong>{{ item.doctorname }}</strong><span class="doctor-list-item-jobtitle">{{ item.doctorrank
                }}</span>
                <div class="doctor-list-item-goodat">{{item.doctorspecialty}}</div>
              </div>
              <div class="doctor-list-item-btn" :disabled="!item.isBooking" v-bind:class="{disabled: false}"
                   @click="bookingDoctor(item)">挂号
              </div>
            </div>
          </div>
          <!--<div style="margin-top:10px;">-->
            <!--<div class="doctor-list-item">-->
              <!--<img src="../../../../common/assets/icon/my/ic_avatar@2x.png">-->
              <!--<div class="doctor-list-item-info">-->
                <!--<strong>王子熙</strong><span class="doctor-list-item-jobtitle">副主任门诊</span>-->
                <!--<div class="doctor-list-item-goodat"><span>擅长</span> 神经内科四科</div>-->
                <!--<div class="doctor-list-item-goodat">神经内科四科</div>-->
              <!--</div>-->
              <!--<div class="doctor-list-item-btn">挂号</div>-->
            <!--</div>-->
            <!--<div class="doctor-list-bottom">-->
              <!--<div><span>预约0</span></div>-->
              <!--<div><span>评论0</span></div>-->
              <!--<div><span>粉丝0</span></div>-->
            <!--</div>-->
          <!--</div>-->

          <!--<div v-if="doctorList.length>0">-->
            <!--<div style="margin-top:10px;" v-for="item in doctorList">-->
              <!--<div @click="bookingDoctor(item)">-->
                <!--<div class="doctor-list-item">-->
                  <!--<img v-if="item.doctorphoto" :src="item.doctorphoto">-->
                  <!--<img v-else src="@icon/my/ic_avatar@2x.png">-->

                  <!--<div class="doctor-list-item-info">-->
                    <!--<strong>{{ item.doctorname }}</strong><span class="doctor-list-item-jobtitle">{{ item.doctorrank }}</span>-->
                    <!--<div class="doctor-list-item-goodat" v-if="item.doctorspecialty"><span>擅长</span> {{item.doctorspecialty}}</div>-->
                    <!--<div class="doctor-list-item-goodat" v-if="item.departname">{{item.departname}}</div>-->
                  <!--</div>-->
                  <!--<div class="doctor-list-item-btn" @click="bookingDoctor(item)" v-bind:class="{disabled: false}">预约-->
                  <!--</div>-->
                <!--</div>-->
                <!--<div class="doctor-list-bottom">-->
                  <!--<div><span>预约{{item.countofreghistory||'0'}}</span></div>-->
                  <!--<div><span>评论{{item.countofreview||'0'}}</span></div>-->
                  <!--<div><span>粉丝{{item.countofcollection||'0'}}</span></div>-->
                <!--</div>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
          <div v-else class="vux-center empty-page" style="height:400px;">
            {{tipText}}
          </div>

        </div>

      </div>
    </view-box>
  </div>
</template>
<script>
  import tool from '@common/libs/tool'
  import {mapState, mapActions} from 'vuex'
  import {Tab, TabItem,Flexbox, FlexboxItem,Search} from 'vux'

  export default {
    components: {
      Tab, TabItem,Flexbox, FlexboxItem,Search
    },
    computed: {
      ...mapState({
        hospitalInfo: state => state.hospital.current,
        departmentInfo: state => state.selectedDepartment,
        doctorList: state => state.doctorList,
        dateDoctorList: state => state.dateDoctorList,
      }),
      title: function () {
        let routeData = this.$routeData;
        let title = routeData.title || funModules[routeData.funKey].name;
        return title;
      },
      bookType: function () {
        return this.$routeData.bookType;
      },
      dateFlag:function(){
        let flag = this.hospitalInfo.registerDateType==1
        return flag
      },
      appointmentAllowCurr:function(){
        let flag = this.hospitalInfo.appointmentAllowCurr
        return flag
      },
      tabName2:function(){
        let clientId = this.hospitalInfo.clientId
//        if(clientId=='S-110000-53422'){
//          return '按科室预约';
//        }
        return "按日期预约";
      },
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

      this.swipePages.push({weekDays: this.getWeek(0,this.dateFlag)})
      this.swipePages.push({weekDays: this.getWeek(1,this.dateFlag)})
      this.swipePages.push({weekDays: this.getWeek(2,this.dateFlag)})
      this.getCurrentDate();
      this.getDoctorList();
    },
    watch: {
      value: function (val, oldValue) {

      }
    },
    data() {
      return {
        index: 0,
        value: '',
//        selected: 1,
        currentDate: '',
        swipePages: [],
        searchDoctorList:[],
        tipText:'正在加载医生列表...',
        regTipText:'正在加载医生列表...'
      }
    },
    methods: {
      ...mapActions(["getRegDoctorListByDeptId", "getRegDoctorListByDate"]),
      getResult(value){
        let doctors=[];
        if(value==''){
          this.searchDoctorList=this.doctorList
        }else{
          this.doctorList.forEach((doctor)=>{
            if(doctor.doctorname.search(value)!=-1){
              doctors.push(doctor);
            }
          })
          this.searchDoctorList=doctors
        }
      },
      getDoctorList() {
        //获取医生列表
        if (this.bookType == 0) {//预约挂号
          if(this.selected==1){
            this.getDoctorListByDate()
          }else{
            this.getDoctorListByDept()
          }
        } else if (this.bookType == 1) {//今日挂号
          this.getRegDoctorListByDeptId({
            departmentid: this.departmentInfo.departmentid,
            hospitalid: this.hospitalInfo.pkregHospitalId,
            regdate: this.currentDate,
            regtype:this.bookType
          }).then((res)=>{
            this.searchDoctorList=res
            this.tipText='暂无医生列表'
          });
        }
      },
      getDoctorListByDept(){
        this.getRegDoctorListByDeptId({
          departmentid: this.departmentInfo.departmentid,
          hospitalid: this.hospitalInfo.pkregHospitalId,
          regdate: this.currentDate,
          regtype:this.bookType
        }).then((res)=>{
          this.searchDoctorList=res
          this.tipText=this.bookType==0?'暂无可预约的医生':'暂无医生列表'
        });
      },
      getDoctorListByDate(){
        this.getRegDoctorListByDate({
          departmentid: this.departmentInfo.departmentid,
          hospitalid: this.hospitalInfo.pkregHospitalId,
          regdate: this.currentDate
        }).then((res)=>{
          this.regTipText='这天没有可预约的医生，请查看其他日期'
        });
      },
      formatCurDate(){
        let now = new Date(this.currentDate);
        let cur = tool.dateFormat(now, 'yyyy年MM月dd日');
        const w = ['周日','周一', '周二', '周三', '周四', '周五', '周六']
        let i = now.getDay();
        return `${cur} ${w[i]}`
      },
      getCurrentDate() {
        let now = new Date();
        if (this.bookType == 0&&this.appointmentAllowCurr!=1) {//预约挂号
          now.setDate(now.getDate());
        }
        this.currentDate = tool.dateFormat(now, 'yyyy-MM-dd');
      },
      bookingDoctor(item) {
        shareInst.client.push({
          path: '/doctorInfo',
          query: {
            bookType: this.bookType,
            doctorId: item.doctorid,
            funKey: this.$routeData.funKey,
            departmentId: this.departmentInfo.departmentid,
            isFirstPatient: this.$routeData.isFirstPatient
          }
        })
      },
      handleSwipeChange(index) {
        if ((this.swipePages.length - this.index) < 3) {
          let w = this.getWeek(this.swipePages.length,this.dateFlag)
          this.swipePages.push({weekDays: w});
        }
        this.index = index
      },
      prevPage() {
        if (this.index > 0) {
          this.$refs.swipeWrapper.prev();
        }
      },
      nextPage() {
        this.$refs.swipeWrapper.next();
      },
      getWeek(index,flag) {
        const week = [];
        const now = new Date().getTime();
        const w = ['日','一', '二', '三', '四', '五', '六']
        for (let i = 0; i < 7; i++) {
          let Stamp = new Date();
          let number;

          if (Stamp.getDay() == 0) {
            number = 7;
          } else {
            if(flag){
              number=0;
            }else{
              number = Stamp.getDay();
            }
          }
          let num = 7 * index - number + 1 + i;
          Stamp.setDate(Stamp.getDate() + num);
          let _week=Stamp.getDay();
          let year = Stamp.getFullYear();
          let month = Stamp.getMonth() + 1;
          let date = Stamp.getDate();
          if (month < 10) {
            month = `0${month}`;//这里使用的反引号
          }
          let a = {};
          a.week = w[_week]
          if (parseInt(now / 60000/60/24) > parseInt(Stamp.getTime() / 60000/60/24)) {
            if(this.appointmentAllowCurr!=1) {
              a.isChecked = false
            }else if(parseInt(now / 60000/60/24) == parseInt(Stamp.getTime() / 60000/60/24)){
              a.isChecked = true
            }else{
              a.isChecked = false
            }
          } else {
            a.isChecked = true
          }
          a.formatDate = tool.dateFormat(Stamp)
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
          this.currentDate = item.formatDate
          this.getRegDoctorListByDate({
            departmentid: this.departmentInfo.departmentid,
            hospitalid: this.hospitalInfo.pkregHospitalId,
            regdate: this.currentDate
          });
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .doctor-list-item {
    width: 100%;
    height: 80px;
    padding: 10px;
    position: relative;
    box-sizing: border-box;
    background: #fff;
  }
  .doctor-list-item:after{
    content: ' ';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #D9D9D9;
    transform-origin: 0 100%;
    transform: scaleY(0.5);
  }
  .doctor-list-item:active {
    /*background: #f5f5f5;*/
  }

  .doctor-list-item img {
    width: 60px;
    height: 60px;
    float: left;
    border-radius: 50%;
    vertical-align: middle;
  }

  .doctor-list-item .doctor-list-item-info {
    margin-left: 70px;
    margin-right: 60px;
  }

  .doctor-list-item-goodat {
    line-height: 1.3;
    color: #656565;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 35px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .doctor-list-item-jobtitle {
    color: #BBBBBB;
    margin-left: 10px;
    font-size: 15px;
  }

  .doctor-list-item-btn {
    width: 3rem;
    height: 3rem;
    float: right;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
    line-height: 3rem;
    border: 1px solid $mainColor;
    color: $mainColor;
    border-radius: 50%;
    font-size: 14px;
    -webkit-user-select: none;
    user-select: none;
  }

  .doctor-list-item-btn:active {
    border-color: #ccc;
    color: #ccc;
  }

  .doctor-list-item-btn.disabled {
    border-color: #ccc;
    color: #ccc;
  }

  .doctor-booking-time-bar {
    position: relative;
    /*height: 90px;*/
    /*padding-bottom: 5px;*/
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
    height: 55px;
    padding: 0px 0px;
    box-sizing: border-box;
  }

  .booking-time-item {
    padding-top: 8px;
    margin: 0px 3px;
    box-sizing: border-box;
    height: 100%;
    vertical-align: middle;
    text-align: center;
    width: 12%;
    font-size: 12px;
    float: left;
    color: #333;
  }

  .booking-time-item.checked .booking-time-date {
    background: $mainColor;
    border-radius: 50%;
    padding: 3px 4px;
    color: #fff;
  }



  .mint-search {
    height: auto;
  }

  .doctor-list-bottom > div {
    float: left;
    width: 33%;
    text-align: center;

  }

  .doctor-list-bottom {
    overflow: hidden;
    background: #fff;
    border-bottom: 1px solid #d9d9d9;
    color: #999;
    padding: 10px 0;
  }

  .doctor-list-bottom > div > span {
    display: inline-block;
    width: 100%;

  }

  .doctor-list-bottom > div:not(:first-of-type) > span {
    border-left: 1px solid #ccc;
  }

  .own-list-menu .mint-tab-item-label {
    color: #4B6BAF;
    font-size: 15px;
  }

  .own-list-menu.mint-navbar .mint-tab-item.is-selected {
    border-bottom: 3px solid #4B6BAF;
    color:#4B6BAF;
  }
  .booking-time-week {
    color: #999999;
  }
  .booking-time-date{
    margin-top: 5px;
    color: #2F2F2F;
    font-size: 14px;
  }
  .current-date{
    text-align: center;
    font-size: 14px;
    color: #BABABA;
    padding-bottom: 5px;
  }
  .booking-time-item.disabled .booking-time-date {
    color: #ccc;
  }
  .vux-search-box{
    position: relative !important;
  }
  .vux-tab .vux-tab-item{
    font-size: 16px !important;
  }
  .vux-tab .vux-tab-ink-bar{
    width: 100px !important;
    margin: 0px;
  }
</style>
