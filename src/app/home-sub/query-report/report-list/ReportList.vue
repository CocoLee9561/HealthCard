<template>
  <div class="page">
    <view-box class="report-list" :body-padding-bottom="isReportDateSetting==0?'100px':'0px'">

      <x-header slot="header">报告查询</x-header>

      <change-patient :realname="selectedMember.realname" :cardno="card.cardno"  :to="to" ></change-patient>
      <!--<tip-text-bar v-if="reporttypeinfo">{{reporttypeinfo}}</tip-text-bar>-->
      <div class="list" v-if="reportList.length>0">
        <!--可查报告类型：放射、超声、检验、病历-->
        <div class="card-info-plan" v-for="(item,index) in reportList" :key="index">
          <div class="booking-result-plan">
            <div class="booking-result-header line-bottom">
              <div class="booking-result-info-bar">
                <span class="booking-result-info-title">
                  {{item.checktype==1?'检验':'检查'}}报告<badge class="badge" v-if="isBadge(item)" />
                </span>
              </div>
            </div>
            <div class="booking-result-body line-bottom">
              <div class="booking-result-info-bar" v-if="item.name">
                <span class="booking-result-info-title">患者姓名</span>
                <span class="booking-result-info-value">{{item.name}}</span>
              </div>
              <div class="booking-result-info-bar" v-if="item.itemname">
                <span class="booking-result-info-title">{{item.checktype==1?'检验':'检查'}}项目</span>
                <span class="booking-result-info-value">{{item.itemname}}</span>
              </div>
              <div class="booking-result-info-bar" v-if="item.spceimenname">
                <span class="booking-result-info-title">送检标本</span>
                <span class="booking-result-info-value">{{item.spceimenname}}</span>
              </div>
              <div class="booking-result-info-bar" v-if="item.reportdate">
                <span class="booking-result-info-title">{{item.checktype==1?'检验':'检查'}}时间</span>
                <span class="booking-result-info-value">{{item.reportdate}}</span>
              </div>
              <div class="booking-result-info-bar">
                <span class="booking-result-info-title">{{item.checktype==1?'检验':'检查'}}状态</span>
                <span class="booking-result-info-value state">已完成</span>
              </div>
            </div>
          </div>
          <group :gutter="0">
            <cell is-link @click.native="selectReportHandle(item)">
              <span slot="title">查看详情</span>
            </cell>
          </group>
        </div>



        <!--<cell class="item" v-for="(item,index) in reportList" :key="index" is-link  @click.native="selectReportHandle(item)" >
          <p class="title" slot="title">{{item.itemname}}
            <badge class="badge" v-if="isBadge(item)" />
          </p>

          <p slot="inline-desc" class="desc">
            <span class="key" >报告时间</span>
            <span class="value">{{item.reportdate}}</span>
          </p>
          <p class="state">已完成</p>
        </cell>-->



        <cell class="prompt"  is-link v-if="false">
          <span slot="title">没找到要查询的报告？</span>
        </cell>
      </div>
      <div class="report-empty-page"  v-else-if="isEmpty">
        <div class="empty-img">
          <img src="@icon/no_report@2x.png">
        </div>
        <div class="empty-text">暂无可查看的报告</div>
        <div class="empty-desc">
          <div>1.请检查姓名与就诊卡号是否正确</div>
          <div>2.医生可能正在审核报告，请耐心等待...</div>
        </div>
      </div>


      <popup @on-hide="cancelSettingDate()" v-model="settingDateVisible" position="top">
        <div class="setting-date-plan" :class="{'box-margin-top':isShowNavBar}">
          <div class="setting-date-title">设置查询时间</div>
          <div class="setting-date-checker-box">
            <checker v-model="date" radio-required @on-change="dateChange" default-item-class="setting-date-checker" selected-item-class="setting-date-checker-selected">
              <checker-item :value="1">最近1个月</checker-item>
              <checker-item :value="3">最近3个月</checker-item>
              <checker-item :value="6">最近6个月</checker-item>
            </checker>
          </div>
          <div class="setting-date-space-box">
            <div class="start-date-box date-box">
              <div class="start-date date-input" @click="chooseDate(1)" placeholder="开始时间">{{startDate}}</div>
            </div>
            <span class="date-space">/</span>
            <div class="end-date-box date-box">
              <div class="end-date date-input" @click="chooseDate(2)" placeholder="结束时间">{{endDate}}</div>
            </div>
          </div>
        </div>
        <div class="btn-box">
          <div class="btn-cancel" @click="cancelSettingDate()">取消</div>
          <div class="btn-ok" @click="reSettingDate()">确定</div>
        </div>
      </popup>


      <footer v-if="isReportDateSetting==0" slot="bottom" style="width: 100%;">
        <div class="popup-bottom">
          <div class="popup-title">没有找到查询的报告？</div>
          <div class="popup-desc">默认查询最近一个月的报告，如需查询更久之前历史报告，请<span @click="settingDate" class="popup-setting">设置查询时间</span></div>
        </div>
      </footer>
    </view-box>
  </div>
</template>

<script>
  import {mapMutations,mapActions,mapState} from 'vuex'
  import {Badge,Popup,Checker, CheckerItem} from 'vux'
  import ChangeMember from "@app/menber/change-member/ChangeMember"
  import tool from '@common/libs/tool'
  import {funModules} from "@constant.js"

export default {
  name: "ReportList",
  components: {Badge,ChangeMember,Popup,Checker, CheckerItem},
  data:function() {
    return {
      reportList:[],
      isEmpty:false,
      settingDateVisible:false,
      date:1,
      currDate:1,
      isShowNavBar:shareInst.client.showWebNavBar,
      startDate:'开始时间',
      endDate:'结束时间'
    }
  },
  computed:{
    ...mapState(["reporttypeinfo","badgeReport","reportStartDate","reportEndDate","reportDateType","selectedMember","selectedCards"]),
    to:function () {
      return funModules["BGCX"].to;
    },
    isReportDateSetting:function(){
      return shareInst.store.state.hospital.current.isReportDateSetting
    },
    card:function () {
      return this.selectedCards['BGCX'] || {};
    }
  },


  created:function () {
    this.dateChange();
    if(this.reportStartDate&&this.reportEndDate){
      this.date=this.reportDateType
      this.currDate=this.date
      this.startDate=this.reportStartDate
      this.endDate=this.reportEndDate
    }
    this.reqQueryReportList();
  },

  methods:{
    ...mapMutations(["setSelectedReport","addBadgeReport"]),
    reqQueryReportList:function(){
      let start='';
      let end = '';
      if(this.isReportDateSetting==0){
        start=this.startDate
        end=this.endDate
      }
      this.$store.dispatch("reqQueryReportList",{starttime:start,endtime:end}).then((mainData)=>{
        this.reportList = mainData || [] ;
        if(this.reportList.length<=0){
          this.isEmpty=true
        }else{
          this.isEmpty=false
        }
      });
    },
    dateChange(){
      this.endDate=this.getToday()
      this.startDate=this.getStartDate(this.endDate,this.date)
    },
    selectReportHandle:function (report) {
      console.log(report);
      this.setSelectedReport(report);
      this.addBadgeReport(report)
      shareInst.client.push({name:'ReportDetails'})
    },
    isBadge(item){
      if(this.badgeReport[item.reportid]){
        return false;
      }
      return true;
    },
    settingDate(){
      this.settingDateVisible=true
    },
    getCurrentDate() {
      let now = new Date();

      this.currentDate = tool.dateFormat(now, 'yyyy-MM-dd');
    },
    getToday(){
      let now = new Date();
      return tool.dateFormat(now, 'yyyy-MM-dd');
    },
    getStartDate(date,month){
      let now = new Date(date);
      now.setMonth(now.getMonth()-month)
      return tool.dateFormat(now, 'yyyy-MM-dd');
    },
    cancelSettingDate(){
      this.date=this.currDate;
      this.settingDateVisible=false;
    },
    reSettingDate(){
      this.currDate=this.date
      this.settingDateVisible=false
      this.reqQueryReportList();
      this.$store.commit('updateReportStartDate',this.startDate)
      this.$store.commit('updateReportEndDate',this.endDate)
      this.$store.commit('updateReportDateType',this.date)
    },
    chooseDate(flag){
      let maxDate=''
      let minDate=''
      let val=''
      let self=this
      if(flag==1){
        maxDate=this.endDate;
        minDate=this.getStartDate(maxDate,6)
        val=this.startDate
      }else{
        maxDate=this.getToday()>this.getStartDate(this.startDate,-6)?this.getStartDate(this.startDate,-6):this.getToday()
        minDate=this.startDate
        val=this.endDate
      }
      this.$vux.datetime.show({
        value: val, // 其他参数同 props
        confirmText:'确认',
        cancelText:'取消',
        startDate:minDate,
        endDate:maxDate,
        onHide () {
          const _this = this
        },
        onShow () {
          const _this = this
        },
        onConfirm(val){
          if(flag==1){
            self.startDate=val
          }else if(flag==2){
            self.endDate=val
          }
        }
      })
    }
  }


}
</script>

<style lang="scss" scoped>

  .report-list {
    .vux-header{
      z-index:502;
    }

    $pageBgColor:#f4f4f4 ;

    $highlightBg: #ffffff;
    $itemFontSize: 16px;
    $itemSmallFontSize:14px;


    $itemTextMainColor: #4b6baf;
    $itemTextMinorColor: #666666;
    $itemTextMinor2Color: #333333;
    $groupTitleColor:#2F2F2F;

    $lineColor: #d9d9d9;

    $itemHeight:35px;



    .group {
      border-style: none;

      .cell {
        border-style: none;

        span {
          margin: 0;
        }
      }

    }




    .badge {
      padding: 4px;
      vertical-align: text-top;
      border-radius: 4px;
    }



    .list-title {

      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      color: #9B9B9B;

      padding: 10px 16px;

    }
    .list {
      margin-bottom: 10px;
      .weui-cells {
        background-color: $pageBgColor;
      }

      .item {
        background-color: #fff;
        font-size: $itemFontSize;
        margin-bottom: 14px;

        &::before {
        border-style: none;
        }


        .title {
          color: $groupTitleColor;
        }

        .desc {
          margin-top: 5px;
          .key{
            margin-right: 20px;
            color: #656565;
          }
          .value{
            color: #656565;
          }
        }

        .state {
          color: $mainColor;
        }


      }

      .prompt {
        background-color: #4ec7ff ;
        color:#fff ;
      }
    }

  }
  .report-empty-page{
    margin-top: 100px;
    color: #A6A6A6;
  }
  .empty-img{
    text-align: center;
  }
  .report-empty-page img{
    width: 80px;
  }
  .empty-text{
    color: #313131;
    text-align: center;
    margin-top: 10px;
  }
  .empty-desc{
    margin: 0 auto;
    margin-top: 20px;
    font-size: 14px;
    width: 247px;
  }
  .popup-bottom{
    /*background-color: #000000AA;*/
    background-color: rgba(0,0,0,0.66);
    height: 100px;
    width: 100%;
    left: 0;
    bottom: 0;
    padding: 16px;
    box-sizing: border-box;
    .popup-title{
      color: white;
    }
    .popup-desc{
      color: #D4D4D4;
      font-size: 14px;
      margin-top: 3px;
      .popup-setting{
        color: $mainColor;
      }
    }
  }
  .state {
    color: $mainColor !important;
  }
  .setting-date-plan{
    width: 100%;
    height: auto;
    background: white;
    padding: 16px 16px 30px;
    box-sizing: border-box;
  }
  .box-margin-top{
    margin-top: 46px;
  }
  .setting-date-title{
    color: #666666;
  }
  .setting-date-checker-box{
    margin-top: 16px;
  }
  .setting-date-checker{
    color: #9C9C9C;
    border:1px solid #D9D9D9;
    border-radius: 2px;
    padding: 5px 9px;
    font-size: 14px;
  }
  .setting-date-checker:not(:last-child){
    margin-right: 10px;
  }
  .setting-date-checker-selected{
    color: $mainColor;
    border:1px solid $mainColor;
  }
  .setting-date-space-box{
    margin-top: 25px;
    overflow: hidden;
    .date-box{
      float: left;
      width: 45%;
      .date-input{
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        outline:0;
        width: 100%;
        border:1px solid #D9D9D9;
        padding: 5px 10px;
        box-sizing: border-box;
        border-radius: 2px;
        color: #BABABA;
        vertical-align: super;
      }
      .date-input:focus{
        border:1px solid #D9D9D9;
      }
      .date-input:active{
        background: #efefef;
      }
    }
    .date-space{
      width: 10%;
      float: left;
      text-align: center;
      color: #BABABA;
      line-height: 35px;
    }
  }
  .btn-box{
    border-top:1px solid #D9D9D9;
    overflow: hidden;
    background: white;
    box-sizing: border-box;
    .btn-cancel{
      padding: 10px;
      width: 50%;
      float: left;
      color: #333333;
      text-align: center;
      box-sizing: border-box;
      border-right:1px solid #D9D9D9;
    }
    .btn-cancel:active{
      background: #EEEEEE;
    }
    .btn-ok{
      width: 50%;
      padding: 10px;
      float: right;
      color: $mainColor;
      text-align: center;
      box-sizing: border-box;
    }
    .btn-ok:active{
      background: #EEEEEE;
    }
  }
  .date-input::-webkit-input-placeholder{
    color:#BABABA;
  }
  .date-input::-moz-placeholder{   /* Mozilla Firefox 19+ */
    color:#BABABA;
  }
  .date-input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
    color:#BABABA;
  }
  .date-input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
    color:#BABABA;
  }
  .card-info-plan:first-child{
    .booking-result-plan{
      margin-top: 0;
    }
  }
</style>
