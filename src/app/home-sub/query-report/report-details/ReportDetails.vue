<template>
  <view-box class="report-details">
    <x-header slot="header">报告查询</x-header>

    <change-patient :realname="selectedMember.realname" :cardno="card.cardno"  :to="to" ></change-patient>

    <tip-text-bar v-if="selectedReport.checktype==1&&jyreportinfo">{{jyreportinfo}}</tip-text-bar>
    <tip-text-bar v-if="selectedReport.checktype==2&&jcreportinfo">{{jcreportinfo}}</tip-text-bar>
    <div class="card-info-plan">
      <div class="booking-result-plan" style="margin-top: 0;">
        <div class="booking-result-header line-bottom" v-if="reportDetail.pitemname">
          <div class="booking-result-info-bar">
            <span class="header-title">{{reportDetail.pitemname}}</span>
          </div>
        </div>
        <div class="booking-result-body" v-if="selectedReport.checktype==1">
          <div class="booking-result-info-bar" v-if="reportDetail.pspceimenname">
            <span class="booking-result-info-title">送检标本</span>
            <span class="booking-result-info-value">{{reportDetail.pspceimenname}}</span>
          </div>
          <div class="booking-result-info-bar" v-if="reportDetail.equipmentname">
            <span class="booking-result-info-title">送检仪器</span>
            <span class="booking-result-info-value">{{reportDetail.equipmentname}}</span>
          </div>
        </div>
        <div class="booking-result-body" v-if="selectedReport.checktype==2">
          <div class="booking-result-info-bar" v-if="reportDetail.checkpoint">
            <span class="booking-result-info-title">检查部位</span>
            <span class="booking-result-info-value">{{reportDetail.checkpoint}}</span>
          </div>
          <div class="booking-result-info-bar" v-if="reportDetail.checkmode">
            <span class="booking-result-info-title">检查方式</span>
            <span class="booking-result-info-value">{{reportDetail.checkmode}}</span>
          </div>
          <div class="booking-result-info-bar" v-if="reportDetail.equipmentname">
            <span class="booking-result-info-title">检测仪器</span>
            <span class="booking-result-info-value">{{reportDetail.equipmentname}}</span>
          </div>
        </div>
        <!--<div v-if="selectedReport.checktype==1&&jyreportinfo" class="tip-text line-top">
          {{jyreportinfo}}
        </div>
        <div v-if="selectedReport.checktype==2&&jcreportinfo" class="tip-text line-top">
          {{jcreportinfo}}
        </div>-->
      </div>

      <div class="check-detail-plan" v-if="selectedReport.checktype==2&&((reportDetail.reportimage&&reportDetail.reportimage.length>0)||reportDetail.checkdetail)">
        <div class="check-detail-img-box" v-for="item in reportDetail.reportimage" v-if="reportDetail.reportimage&&reportDetail.reportimage.length>0"> <!--v-if="reportDetail.reportimage"-->
          <img :src="item">
        </div>
        <div v-if="reportDetail.checkdetail"> <!--v-if="reportDetail.checkdetail"-->
          <div class="check-detail-title">检查所见</div>
          <div class="check-detail">
            {{reportDetail.checkdetail}}
            <!--查看体检报告时，要注意看每一条结论后面相对应的健康建议和健康指导，将康体检报告通常不会直接做出疾病诊断，而是将体检所见-->
          </div>
        </div>
      </div>

      <div class="booking-result-plan left-right" v-if="detailList.length>0">
        <div class="booking-result-header line-bottom">
          <div class="booking-result-info-bar">
            <span class="booking-result-info-title">名称</span>
            <span class="header-value">结果(参考值)</span>
          </div>
        </div>
        <div class="booking-result-body">
          <div class="booking-result-info-bar" v-for="(item,index) in detailList" :key="index">
            <span class="booking-result-info-title">{{item.itemname}}</span>
            <span class="body-value"><img class="arrow" v-if="item.isnormal==1||item.isnormal==2" :src="arrowUrl(item.isnormal)"> <span class="fact">{{item.result}}</span><span class="refer" >({{item.resultrange}})</span> </span>
          </div>
        </div>
      </div>

    <!--<ul class="area result" v-if="detailList.length>0">
      <li class="col-title" key="col-title" >
        <span class="key">名称</span>  <span class="value">结果 (参考值)</span>
      </li>

      <li class="item vux-center" v-for="(item,index) in detailList" :key="index" >
        <span class="key">{{item.itemname}}</span>  <span class="value"> <img class="arrow" v-if="item.isnormal==1||item.isnormal==2" :src="arrowUrl(item.isnormal)"> <span class="fact">{{item.result}}</span><span class="refer" >({{item.resultrange}})</span> </span>
      </li>
    </ul>-->

      <div class="check-detail-plan" v-if="reportDetail.checktips&&selectedReport.checktype==2">
         <!--v-if="reportDetail.checkdetail"-->
        <div class="check-detail-title">检查提示</div>
        <div class="check-detail">
          {{reportDetail.checktips}}
          <!--查看体检报告时，要注意看每一条结论后面相对应的健康建议和健康指导，将康体检报告通常不会直接做出疾病诊断，而是将体检所见-->
        </div>
      </div>

      <div class="booking-result-plan" v-if="selectedReport.checktype==1">
        <div class="booking-result-header line-bottom" v-if="reportDetail.deptname">
          <div class="booking-result-info-bar">
            <span class="booking-result-info-title">检验报告</span>
          </div>
        </div>
        <div class="booking-result-body">
          <div class="booking-result-info-bar" v-if="reportDetail.deptname">
            <span class="booking-result-info-title">申请科室</span>
            <span class="booking-result-info-value">{{reportDetail.deptname}}</span>
          </div>
          <div class="booking-result-info-bar" v-if="reportDetail.applydoctoename" >
            <span class="booking-result-info-title" >申请医生</span>
            <span class="booking-result-info-value">{{reportDetail.applydoctoename}}</span>
          </div>
          <div class="booking-result-info-bar" v-if="reportDetail.collectiondoctoename" >
            <span class="booking-result-info-title" >采集人员</span>
            <span class="booking-result-info-value">{{reportDetail.collectiondoctoename}}</span>
          </div>
          <div class="booking-result-info-bar" v-if="reportDetail.checkdoctoename" >
            <span class="booking-result-info-title" >检验人员</span>
            <span class="booking-result-info-value">{{reportDetail.checkdoctoename}}</span>
          </div>
          <div class="booking-result-info-bar" v-if="reportDetail.verifydoctoename" >
            <span class="booking-result-info-title" >审核人员</span>
            <span class="booking-result-info-value">{{reportDetail.verifydoctoename}}</span>
          </div>
          <div class="booking-result-info-bar" v-if="reportDetail.checkdate" >
            <span class="booking-result-info-title" >送检时间</span>
            <span class="booking-result-info-value">{{reportDetail.checkdate}}</span>
          </div>
          <div class="booking-result-info-bar" v-if="reportDetail.resultdate" >
            <span class="booking-result-info-title" >报告时间</span>
            <span class="booking-result-info-value">{{reportDetail.resultdate}}</span>
          </div>
          <div class="booking-result-info-bar" v-if="reportDetail.checkcode" >
            <span class="booking-result-info-title" >检验编号</span>
            <span class="booking-result-info-value">{{reportDetail.checkcode}}</span>
          </div>
        </div>
      </div>
      <div class="booking-result-plan" v-if="selectedReport.checktype==2">
        <div class="booking-result-header line-bottom">
          <div class="booking-result-info-bar">
            <span class="booking-result-info-title">检查报告</span>
          </div>
        </div>
        <div class="booking-result-body">
          <div class="booking-result-info-bar" v-if="reportDetail.deptname" >
            <span class="booking-result-info-title" >申请科室</span>
            <span class="booking-result-info-value">{{reportDetail.deptname}}</span>
          </div>
          <div class="booking-result-info-bar" v-if="reportDetail.applydoctoename" >
            <span class="booking-result-info-title" >申请医生</span>
            <span class="booking-result-info-value">{{reportDetail.applydoctoename}}</span>
          </div>
          <div class="booking-result-info-bar" v-if="reportDetail.checkdoctoename" >
            <span class="booking-result-info-title" >检查医生</span>
            <span class="booking-result-info-value">{{reportDetail.checkdoctoename}}</span>
          </div>
          <div class="booking-result-info-bar" v-if="reportDetail.verifydoctoename" >
            <span class="booking-result-info-title" >审核医生</span>
            <span class="booking-result-info-value">{{reportDetail.verifydoctoename}}</span>
          </div>
          <div class="booking-result-info-bar" v-if="reportDetail.checkdate" >
            <span class="booking-result-info-title" >检查时间</span>
            <span class="booking-result-info-value">{{reportDetail.checkdate}}</span>
          </div>
          <div class="booking-result-info-bar" v-if="reportDetail.resultdate" >
            <span class="booking-result-info-title" >报告时间</span>
            <span class="booking-result-info-value">{{reportDetail.resultdate}}</span>
          </div>
          <div class="booking-result-info-bar" v-if="reportDetail.checkcode" >
            <span class="booking-result-info-title" >检查编号</span>
            <span class="booking-result-info-value">{{reportDetail.checkcode}}</span>
          </div>
          <div class="booking-result-info-bar" v-if="reportDetail.imagenumber" >
            <span class="booking-result-info-title" >影像编号</span>
            <span class="booking-result-info-value">{{reportDetail.imagenumber}}</span>
          </div>
        </div>
      </div>
    </div>
    <!--<div class="area related-area" v-if="selectedReport.checktype==1">
      <ul class="related-info report-details-related-info">
        <li class="item" v-if="reportDetail.deptname" >
          <span class="key" >申请科室</span>  <span class="value">{{reportDetail.deptname}}</span>
        </li>
        <li class="item" v-if="reportDetail.applydoctoename" >
          <span class="key" >申请医生</span>  <span class="value">{{reportDetail.applydoctoename}}</span>
        </li>
        <li class="item" v-if="reportDetail.collectiondoctoename" >
          <span class="key" >采集人员</span>  <span class="value">{{reportDetail.collectiondoctoename}}</span>
        </li>
        <li class="item" v-if="reportDetail.checkdoctoename" >
          <span class="key" >检验人员</span>  <span class="value">{{reportDetail.checkdoctoename}}</span>
        </li>
        <li class="item" v-if="reportDetail.verifydoctoename" >
          <span class="key" >审核人员</span>  <span class="value">{{reportDetail.verifydoctoename}}</span>
        </li>
        <li class="item" v-if="reportDetail.checkdate" >
          <span class="key" >送检时间</span>  <span class="value">{{reportDetail.checkdate}}</span>
        </li>
        <li class="item" v-if="reportDetail.resultdate" >
          <span class="key" >报告时间</span>  <span class="value">{{reportDetail.resultdate}}</span>
        </li>
        <li class="item" v-if="reportDetail.checkcode" >
          <span class="key" >检验编号</span>  <span class="value">{{reportDetail.checkcode}}</span>
        </li>
      </ul>
    </div>
    <div class="area related-area" v-else-if="selectedReport.checktype==2">
      <ul class="related-info report-details-related-info">
        <li class="item" v-if="reportDetail.deptname" >
          <span class="key" >申请科室</span>  <span class="value">{{reportDetail.deptname}}</span>
        </li>
        <li class="item" v-if="reportDetail.applydoctoename" >
          <span class="key" >申请医生</span>  <span class="value">{{reportDetail.applydoctoename}}</span>
        </li>
        <li class="item" v-if="reportDetail.checkdoctoename" >
          <span class="key" >检查医生</span>  <span class="value">{{reportDetail.checkdoctoename}}</span>
        </li>
        <li class="item" v-if="reportDetail.verifydoctoename" >
          <span class="key" >审核医生</span>  <span class="value">{{reportDetail.verifydoctoename}}</span>
        </li>
        <li class="item" v-if="reportDetail.checkdate" >
          <span class="key" >检查时间</span>  <span class="value">{{reportDetail.checkdate}}</span>
        </li>
        <li class="item" v-if="reportDetail.resultdate" >
          <span class="key" >报告时间</span>  <span class="value">{{reportDetail.resultdate}}</span>
        </li>
        <li class="item" v-if="reportDetail.checkcode" >
          <span class="key" >检查编号</span>  <span class="value">{{reportDetail.checkcode}}</span>
        </li>
        <li class="item" v-if="reportDetail.imagenumber" >
          <span class="key" >影像编号</span>  <span class="value">{{reportDetail.imagenumber}}</span>
        </li>
      </ul>
    </div>-->

    <tip-text-bar v-if="reportDetail.msg">{{reportDetail.msg}}</tip-text-bar>

    <div v-if="selectedReport.checktype==1&&report4jyinfo">
      <tip-text-bar :showIcon="false">
        {{report4jyinfo}}
      </tip-text-bar>
    </div>
    <div v-if="selectedReport.checktype==2&&report4jcinfo">
      <tip-text-bar :showIcon="false">
        {{report4jcinfo}}
      </tip-text-bar>
    </div>
  </view-box>


</template>

<script>
  import {mapState,mapActions} from 'vuex'
  import arrow_up from '@icon/arrow_up.png'
  import arrow_down from '@icon/arrow_down.png'

  import {funModules} from "@constant.js"


  export default {
    name: "ReportDetails",
    computed:{
      ...mapState(["reportDetail","selectedReport","reporttypeinfo","report4jyinfo","report4jcinfo","jyreportinfo","jcreportinfo","selectedMember","selectedCards"]),
      detailList:function () {
        let detailList = this.reportDetail.detaillist || [] ;
        console.log("length>>",detailList.length);
        return detailList ;
      },
      to:function () {
        console.log("1>>");
        return funModules["BGCX"].to;
      },
      card:function () {
        console.log("2>>");

        return this.selectedCards['BGCX'] || {};
      }
    },
    created:function () {
      console.log("3>>");

      this.reqReportDetail();
    },
    methods:{
      ...mapActions(["reqReportDetail"]),
      arrowUrl:function(state){
        let arrowUrl = "";
        if(!state&&state!=0){
          return "";
        }
        switch (state){
          case "1" :{
            arrowUrl = arrow_up ;
            break
          }

          case "2" :{
            arrowUrl = arrow_down ;
            break
          }
        }


        return arrowUrl ;
      },
    }

  }
</script>

<style lang="less" scoped>
  .header-title{
    font-size: 16px;
    color: #333;
  }
  .tip-text{
    padding: 10px 0px;
    color: #999;
  }
  .left-right{
    .booking-result-info-title{
      flex: 1;
    }

    .booking-result-header{
      .booking-result-info-title{
        color: #999;
      }
    }
    .booking-result-body{
      .booking-result-info-bar{
        display: inline-block;
        padding: 4px 0;
        .booking-result-info-title{
          white-space: nowrap;
          word-wrap: break-word;
          width: 100%;
          color: #333;
        }
      }

    }
    .header-value{
      display: inline-block;
      white-space: nowrap;
      word-wrap: break-word;
      width: 60%;
      color: #999;
    }
    .body-value{
      img{
        width: 0.5rem;
        vertical-align: baseline;
      }
      .fact{
        color: #333;
      }
      .refer{
        color: #999;
      }
    }
  }
  .report-details {

    @pageBgColor:#f4f4f4 ;

    @highlightBg: #ffffff;
    @itemFontSize: 16px;
    @itemSmallFontSize:14px;


    @itemTextMainColor: #4b6baf;
    @itemTextMinorColor: #999999;
    @itemTextMinor2Color: #666666;
    @groupTitleColor:#333333;

    @lineColor: #d9d9d9;

    @itemHeight:35px;





    background-color: @pageBgColor;
    font-size: @itemFontSize;

    .area {
    background-color:#fff ;
      margin-top: 16px;
    }


    .group {
      border-style: none;

      .cell {
        border-style: none;

        span {
          margin: 0;
        }
      }

    }


    ul {

      li {
        padding:0 16px;
        list-style: none;
        height: @itemHeight;
        line-height: @itemHeight;
        vertical-align: middle;
      }
    }



    .patient {
      .cell {
        height: 44px;
        background-color: @highlightBg;

        font-weight: normal;
        font-stretch: normal;

        .key {
          color: @itemTextMainColor;

          .num {
            margin-left: 1px;
          }
        }

        .value {
          color: @itemTextMinorColor;
        }

      }

    }



    .appar {

      margin-top: 15px;

      .group-title {
        border-style: none ;
        font-weight: normal;
        font-stretch: normal;
        color: #333333;
      }

      .item {
        border-style: none;
        .key {
          display: inline-block;
          width: 6em;
          font-size: @itemSmallFontSize;
          color: #656565;
        }

        .value {
          /*margin-left: 30px;*/
          margin-left: 0;
          font-size: @itemSmallFontSize;
          color: #333333;
        }
      }



      .illustrate {
        color: @itemTextMinorColor;
        font-size: @itemSmallFontSize;

        border-top: 1px solid @lineColor;

      }
    }

    .result {
      font-size: @itemSmallFontSize ;

      li {
        content:" ";
        clear: bottom;


        .key{
          float: left;
        }

        .value {
          float: right;
        }

      }




      .col-title {
        color: #999999;
        border-bottom:1px solid @lineColor;
      }

      .item {
        clear:both;
        display: flex;
        line-height: 1.3;
        padding-top: 7px;
        padding-bottom: 7px;
        height: auto;
        overflow: hidden;
        .key {
          color: #333333;
          display: inline-block;
          line-height: 1.3;
          flex: 1;
          margin-right: 10px;
        }

        .value {

          .arrow {
            height: auto;
            width: 0.5em;
            vertical-align: baseline;
          }

          .fact {
            color: #333333;
          }

          .refer {
            color: #999999;
          }

        }
      }

    }


    .related-area {
      padding: 15px;

      .related-info {
        background-color: #f3f6fc;
        border-radius: 6px;

        padding:0 20px;


        .item {
          font-size: @itemSmallFontSize;
					padding:0!important;

          .key {
            display: inline-block;
            width: 5em;
            color: #656766;
          }

          .value {
            display: inline-block;
            /*margin-left: 33px;*/
            margin-left: 3px;
            color: #333333;
          }
        }

      }

    }

    .check-detail-plan{
      margin-top: 10px;
      background: white;
      box-sizing: border-box;
      padding: 8px;
      .check-detail-img-box{
        padding: 8px;
        background: #F4F4F4;
        img{
          width: 100%;
        }
      }
      .check-detail-title{
        padding: 8px;
        font-size: 15px;
        color: #A0A0A0;
      }
      .check-detail{
        font-size: 15px;
        padding: 0px 8px 8px;
        color: #333333;
      }
    }




    .prompt {
      padding: 16px;
      font-size: @itemSmallFontSize;
      color: @itemTextMinorColor;
    }

  }

</style>
