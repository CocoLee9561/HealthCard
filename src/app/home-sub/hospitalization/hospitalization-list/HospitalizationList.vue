<template>
  <div class="page">
    <view-box>
      <x-header slot="header">{{title}}</x-header>
	  <template v-if="dataList&&dataList.length>0">
		  <div class="tip-bar  own-tip-bar">
			<span slot="title">{{hospitalwords}}</span>
		  </div>
		  <div>
			<group>
			  <div class="arrow-turn arrow-left" @click="turn(0)">
				<x-icon class="arrow-item" type="ios-arrow-back" size="30"></x-icon>
			  </div>
			  <div class="scrollview-x" v-bind:style="{width:fWidth+'px'}" id="scrollview">
				<div v-bind:style="{width:XWidth+'px'}" style="overflow-y:auto;" id="scrollView-content">
				  <div class="item-date" v-for="(item,idx) in dataList" :key="item.date" :value="item.date"
					   @click="selectDate(item,idx)">
					<checker v-model='selectedDay' radio-required default-item-class="item-default"
							 selected-item-class="item-selected">
					  <checker-item class="box-item" :value="item.date">
						<div class="box-item-week">{{dateToSingleWeek(item.date)}}</div>
						<div class="box-item-date">{{dateToDay(item.date)}}</div><!--{{formatDate(item.date)}}-->
						<div class="box-item-money">￥{{toThousands(item.todaymoney)}}</div>
					  </checker-item>
					</checker>
				  </div>
				</div>
			  </div>
			  <div class="arrow-turn arrow-right" @click="turn(1)">
				<x-icon type="ios-arrow-forward" class="arrow-item" size="30"></x-icon>
			  </div>
			</group>
			<group gutter="0">
			  <datetime v-model="selectedTime" start-date="1900-01-01" format="YYYY-MM-DD" :end-date="endDate"
						@on-change="dateChange" title="选择日期" :show="dateVisibility"></datetime>
			  <cell is-link @click.native="toHosInfo" v-if="routeName=='hospitalizationList'||routeName=='deposit'">
				<span slot="title">住院信息</span>
				<span>查看床号、入院日期</span>
			  </cell>
			</group>
			<group>
			  <cell>
				<span slot="title">当日费用总额</span>
				<span class="money-text">￥{{toThousands(totalFee)}}</span>
			  </cell>
			</group>
			<div class="cost-item" v-for="item in feeList" v-if="dataList[currentIdx].isDisplay!=1">
			  <hos-expend :item='item' v-on:expendAction='expend'></hos-expend>
			</div>
		  </div>
	  </template>
	  <template v-else>
		<div class="vux-center empty-page">
			暂无{{routeName == 'outpatientList'?'门诊清单':'住院清单'}}信息
		</div>
	  </template>
    </view-box>
  </div>
</template>
<script>
  import {funModules} from '@constant.js'
  import {mapState, mapActions} from 'vuex'
  import {Datetime} from 'vux'
  import HosExpend from '../../../components/HosExpend'

  export default {
    components: {
      Datetime, HosExpend
    },
    computed: {
      ...mapState({
        selectedMember: state => state.selectedMember,
        hospitalInfo: state => state.hospital.current,
        stayHospitalInfo: state => state.stayHospitalInfo,
        isNewPage: state => state.isNewPage,
        stayHospitalList: state => state.stayHospitalList,
      }),
      cardInfo: function () {
        return this.$store.state.selectedCards[this.funKey];
      },
      routeName: function () {
        return this.$routeData.routeName
      },
      funKey: function () {
        return this.$routeData.funKey
      },
      title: function () {
        let routeData = this.$routeData;
        let title = routeData.title || funModules[routeData.funKey].name;
        return title;
      },
    },
    created() {

    },
    mounted() {
      this.$nextTick(() => {
        this.dataList.length = 0;
        let qTime = this.$routeData.dateString;
        if (qTime) {
//          this.selectedTime = `${qTime} ${this.dateToWeek(qTime)}`;
        } else {
          qTime = null;
        }
        // 初始传入3
        this.reloadData(qTime, 3);
        this.fWidth = window.screen.width -60;

      })
    },
    data() {
      return {
        XWidth: 0,
        fWidth: 0,
        selectedDay: '',
        dateVisibility: false,
        feeList: [],
        totalFee: '0.00',
        endDate: this.maxDay(),
        dataList: [],
        currentIdx: '',
        selectedTime: '',
        hospitalwords: '',
        isLoad: false,
      }
    },
    methods: {
      ...mapActions(["loadStayHospitalList", "loadOutpatientList"]),
      turn(direct) {
        if (this.selectedDay == '') {
          this.$vux.toast.show({
            text: '请选择查询日期',
            time: 1000,
            type: 'text'
          })
          return;
        }
        if (direct == 0) {//往左

          if (this.currentIdx > 0) {
            this.currentIdx--;
            this.selectedDay = this.dataList[this.currentIdx].date;
            this.feeList = this.dataList[this.currentIdx].itemlist;
            this.totalFee = this.dataList[this.currentIdx].todaymoney;
          } else { // 加载数据
            this.reloadData(this.selectedDay, 0);
          }

        } else {
          if (this.currentIdx < this.dataList.length - 1) {
            this.currentIdx++;
            this.selectedDay = this.dataList[this.currentIdx].date;
            this.feeList = this.dataList[this.currentIdx].itemlist;
            this.totalFee = this.dataList[this.currentIdx].todaymoney;
          } else {

            let nxt = new Date(this.selectedDay).getTime();
            let now = new Date().toLocaleDateString();
            now = new Date(now).getTime();
            if (nxt >= now - 60 * 60 * 24 * 1000) {
              this.$vux.toast.show({
                text: '不能选了',
                time: 1000,
                type: 'text'
              })
              return;
            }
            this.reloadData(this.selectedDay, 1);

          }
        }
        this.selectedTime = `${this.selectedDay} ${this.dateToWeek(this.selectedDay)}`;
        this.isLoad = false;
        this.adjustScroll();
      },
      // 调整scroll的位置居中
      adjustScroll() {

        // setTimeout(function() {
        try {
          // document.getElementById("scrollview").scrollTop = 0;
          let e = document.getElementById("scrollview");
          document.body.scrollLeft = this.currentIdx * 81 - 80;
          document.getElementById("scrollview").scrollLeft = this.currentIdx * 81 - 80;

        } catch (error) {
          console.log(error);
        }
        // },1000)

      },
      toThousands(num) {
        num = parseFloat(num).toFixed(2);
        return (num || 0.00).toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
      },
      dateToSingleWeek(dateStr) {
        let day = new Date(dateStr).getDay();
        let weekStr = '';
        switch (day) {
          case 1:
            weekStr = '一'
            break;
          case 2:
            weekStr = '二'
            break;
          case 3:
            weekStr = '三'
            break;
          case 4:
            weekStr = '四'
            break;
          case 5:
            weekStr = '五'
            break;
          case 6:
            weekStr = '六'
            break;
          case 0:
            weekStr = '日'
            break;
        }
        return weekStr;
      },
      dateToDay(dateStr){
        let day = new Date(dateStr).getDate();
        if(day<10){
          day=`0${day}`
        }
        return day
      },
      dateToWeek(datestr) {
        let day = new Date(datestr).getDay();
        let weekStr = '';
        switch (day) {
          case 1:
            weekStr = '周一'
            break;
          case 2:
            weekStr = '周二'
            break;
          case 3:
            weekStr = '周三'
            break;
          case 4:
            weekStr = '周四'
            break;
          case 5:
            weekStr = '周五'
            break;
          case 6:
            weekStr = '周六'
            break;
          case 0:
            weekStr = '周日'
            break;

        }
        return weekStr;
      },
      maxDay() {
        let mDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
        let year = mDate.getFullYear();
        let month = mDate.getMonth() + 1;
        if (month < 10) {
          month = '0' + month;
        }
        let day = mDate.getDate();
        if (day < 10) {
          day = '0' + day;
        }
        return `${year}-${month}-${day}`
      },
      /*
       * @param direct： 0表示向左加载：向左加载时开始时间往前算5天，结束时间为qtime
       *                 1表示向右加载：向右加载时开始时间为qtime，结束时间为往后算5天
       *                 3：3代表第一次进入，开始时间为qtime的前5天，结束时间为qTime的后5天
       */
      reloadData(qTime, direct) {
        console.log("routename:",this.routeName)
        if (this.routeName == 'hospitalizationList' || this.routeName == 'deposit') {
          this.getStayHospitalList(qTime, direct)
        } else if (this.routeName == 'outpatientList') {
          this.getOutpatientList(qTime, direct)
        }
      },
      getOutpatientList(qTime, direct) {
        let param = {
          hospitalcode: this.hospitalInfo.hospitalcode,
          cardno: this.cardInfo.cardno,
          starttime: this.startTimeWithDate(qTime, direct),
          endtime: this.endTimeWithDate(qTime, direct),
          phone: this.selectedMember.mobile || '',
          cardtype:this.cardInfo.cardtype,
          riid:this.selectedMember.riid
        }
        this.loadOutpatientList(param).then((res) => {
          let list = this.dataList;
          this.dataList = [];
          if (direct == 0) {
            this.dataList = res.alldata.concat(list);
          } else if (direct == 1) {
            this.dataList = list.concat(res.alldata);
          } else if (direct == 3) {
            this.dataList = res.alldata
          }
          this.hospitalwords = res.hospitalwords;
          if (this.dataList.length) {
            this.XWidth = this.dataList.length * 80;
          }

          //如果用户没有选择时间，默认选中最后一天（最近的一天）
          if (qTime) {
            this.selectedDay = qTime;
            //如果是向左加载或者是选择日期则currentIdx为5
            if (direct == 3) {
              this.currentIdx = 5;
            } else if (direct == 0) {
              if (this.currentIdx == 0) {
                this.currentIdx = 9;
                this.selectedDay = this.dataList[this.currentIdx].date;
              }
            } else {
              if (this.currentIdx < this.dataList.length) {
                this.currentIdx++;
                this.selectedDay = this.dataList[this.currentIdx].date;
              }
            }

            this.feeList = this.dataList[this.currentIdx].itemlist;
            this.totalFee = this.dataList[this.currentIdx].todaymoney;

          } else {

            this.feeList = this.dataList[this.dataList.length - 1].itemlist;
            this.totalFee = this.dataList[this.dataList.length - 1].todaymoney;
            this.selectedDay = this.dataList[this.dataList.length - 1].date;
            this.currentIdx = this.dataList.length - 1;

          }
          this.isLoad = false
          this.selectedTime = `${this.selectedDay} ${this.dateToWeek(this.selectedDay)}`;
          let self = this;
          setTimeout(function () {
            document.getElementById("scrollview").scrollLeft = self.currentIdx * 81 - 80;
          }, 500);
        })
      },
      getStayHospitalList(qTime, direct) {
        let param = {
          hospitalcode: this.hospitalInfo.hospitalcode,
          stayhospitalnum: this.cardInfo.cardno,
          starttime: this.startTimeWithDate(qTime, direct),
          endtime: this.endTimeWithDate(qTime, direct),
          phone: this.selectedMember.mobile || '',
          serialnum:this.stayHospitalInfo.serialnum,
          isloaditem:1,
          riid:this.selectedMember.riid
        }

        console.log("param",param)
        this.loadStayHospitalList(param).then((res) => {
          let list = this.dataList;
          this.dataList = [];
          if (direct == 0) {
            this.dataList = res.alldata.concat(list);
          } else if (direct == 1) {
            this.dataList = list.concat(res.alldata);
          } else if (direct == 3) {
            this.dataList = res.alldata
          }
          this.hospitalwords = res.hospitalwords;
          if (this.dataList.length) {
            this.XWidth = this.dataList.length * 80;
          }

          //如果用户没有选择时间，默认选中最后一天（最近的一天）
          if (qTime) {
            this.selectedDay = qTime;
            //如果是向左加载或者是选择日期则currentIdx为5
            if (direct == 3) {
              this.currentIdx = 5;
            } else if (direct == 0) {
              if (this.currentIdx == 0) {
                this.currentIdx = 9;
                this.selectedDay = this.dataList[this.currentIdx].date;
              }
            } else {
              if (this.currentIdx < this.dataList.length) {
                this.currentIdx++;
                this.selectedDay = this.dataList[this.currentIdx].date;
              }
            }

            this.feeList = this.dataList[this.currentIdx].itemlist;
            this.totalFee = this.dataList[this.currentIdx].todaymoney;

          } else {

            this.feeList = this.dataList[this.dataList.length - 1].itemlist;
            this.totalFee = this.dataList[this.dataList.length - 1].todaymoney;
            this.selectedDay = this.dataList[this.dataList.length - 1].date;
            this.currentIdx = this.dataList.length - 1;

          }
          this.isLoad = false
          this.selectedTime = `${this.selectedDay} ${this.dateToWeek(this.selectedDay)}`;
          let self = this;
          setTimeout(function () {
            document.getElementById("scrollview").scrollLeft = self.currentIdx * 81 - 80;
          }, 500);

        })
      },
      // 计算开始时间
      startTimeWithDate(querytime, direct) {
        let qtime = '';
        if (querytime) {
          qtime = new Date(querytime).getTime();
        } else {
          return '';
        }
        if (direct == 1) {//如果往右加载，开始时间为查询时间后一天.否则开始时间向前五天

          let startTime = '';
          let ms = qtime + 1 * (1000 * 60 * 60 * 24);
          startTime = new Date(ms);
          return startTime = this.dateToStr(startTime);
        } else if (direct == 3) {
          let startTime = '';
          let ms = qtime - 5 * (1000 * 60 * 60 * 24);
          startTime = new Date(ms)
          return startTime = this.dateToStr(startTime);
        } else {
          let startTime = '';
          let ms = qtime - 10 * (1000 * 60 * 60 * 24);
          startTime = new Date(ms);
          return startTime = this.dateToStr(startTime);
        }

      },
      // 计算结束时间
      endTimeWithDate(querytime, direct) {
        let qtime = '';
        if (querytime) {
          qtime = new Date(querytime).getTime();
        } else {
          return '';
        }
        if (direct == 0) {//如果往左加载，结束时间为查询时间前一天.否则结束时间向后五天、
          let startTime = '';
          let ms = qtime - 1 * (1000 * 60 * 60 * 24);
          startTime = new Date(ms)
          return startTime = this.dateToStr(startTime);
        } else if (direct == 3) {
          let nowTime = new Date().getTime();
          let endTime = '';
          // 最多为当天的前一天
          if (parseInt((nowTime - qtime) / (1000 * 60 * 60 * 24)) <= 10) {
            let lastms = new Date().getTime() - 1 * (1000 * 60 * 60 * 24);
            endTime = new Date(lastms)
          } else {
            let ms = qtime + 5 * (1000 * 60 * 60 * 24)
            endTime = new Date(ms)
          }
          return endTime = this.dateToStr(endTime);
        } else {
          let nowTime = new Date().getTime();
          let endTime = '';
          // 最多为当天的前一天
          if (parseInt((nowTime - qtime) / (1000 * 60 * 60 * 24)) <= 10) {
            let lastms = new Date().getTime() - 1 * (1000 * 60 * 60 * 24);
            endTime = new Date(lastms)
          } else {
            let ms = qtime + 10 * (1000 * 60 * 60 * 24)
            endTime = new Date(ms)
          }
          return endTime = this.dateToStr(endTime);
        }

      },
      // 日期转化成yyyy-MM-dd格式
      dateToStr(mDate) {
        let year = mDate.getFullYear();
        let month = mDate.getMonth() + 1;
        if (month < 10) {
          month = '0' + month;
        }
        let day = mDate.getDate();
        if (day < 10) {
          day = '0' + day;
        }
        return `${year}-${month}-${day}`
      },
      formatDate(mDate) {
        let d = new Date(mDate)
        let month = '' + (d.getMonth() + 1)
        let day = '' + d.getDate()
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return `${month}月${day}日`
      },
      // 点击选择日期
      selectDate(item, idx) {
        console.log("111")
        this.selectedDay = item.date;
        this.feeList = item.itemlist
        this.currentIdx = idx;
        this.totalFee = item.todaymoney;
        this.isLoad = false
        this.selectedTime = `${this.selectedDay} ${this.dateToWeek(this.selectedDay)}`;
      },
      dateChange(value) {
        console.log("222:",value)
        console.log("2222:",value.substring(0, 10))
        this.isLoad = true
        console.log("load:",this.isLoad)
        if (this.isLoad) {
          this.reloadData(value.substring(0, 10), 3)
        }
        this.isLoad = false
      },
      expend() {

      },
      toHosInfo() {
        if (this.routeName == 'deposit') {
          shareInst.client.back()
        } else if (this.routeName == 'hospitalizationList') {
          shareInst.client.push({
            path: '/hospitalizationDeposit',
            query:{
              funKey:this.funKey
            }
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .arrow-turn {
    display: flex;
    height: 122px;
  }

  .arrow-item {
    align-self: center;
  }

  .scrollview-x {
    overflow-y: auto;
    float: left;
    overflow-x: scroll;
  }

  .arrow-left {
    float: left;
    width: 30px;
  }

  .arrow-right {
    float: right;
    width: 30px;
  }

  .item-date {
    width: 80px;
    float: left;
    /* border-right:1px solid #e5e5e5;*/
  }

  .item-default {
    /* background: #FAFAF0;*/
    width: 80px;
  }

  .item-selected {
    background: #fff;
  }

  .cost-item {
    border-top: 1px solid #eee;
  }

  .box-item {
    text-align: center;
    justify-content: center;
    align-items: center;
    padding: 0px 0px 15px;
  }

  .box-item-week {
    color: #999;
    line-height: 3;
  }

  .box-item-date {
    width: 2rem;
    height: 2rem;
    line-height: 2rem;
    margin: 0 auto;
  }

  .item-selected .box-item-date {
    font-size: 14px;
    border-radius: 50%;
    background: $mainColor;
    color: #fff;

  }

  .box-item-money {
    font-size: 14px;
    margin-top: 5px;
    color: #999;
  }

  .item-selected .box-item-money {
    color: #F43530;
  }

  .money-text {
    color: #F43530;
    font-weight: 600;
  }

  .hospitallization-date-div {
    background: #fff;
  }

  .own-tip-bar {
    box-sizing: border-box;
    padding: 5px;
    background: #FFF5E4;
    color: #F06A00;
    border-bottom: 0;
    opacity: 0.7;
  }
</style>
