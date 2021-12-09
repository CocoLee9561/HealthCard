<template>
  <div class="page">
    <view-box class="report-details">
      <x-header slot="header">报告</x-header>
      <div>
        <ul class="area appar" >
          <li class="group-title" v-if="reportMessageDetail.pitemname">{{reportMessageDetail.pitemname}}</li>
          <li class="item" v-if="reportMessageDetail.pspceimenname" >
            <span class="key" >送检标本</span>  <span class="value">{{reportMessageDetail.pspceimenname}}</span>
          </li>
          <li class="item" v-if="false" >
            <span class="key" >送检仪器</span>  <span class="value">{{reportMessageDetail.pspceimenname}}</span>
          </li>
        </ul>


        <ul class="area result">
          <li class="col-title" key="col-title" >
            <span class="key">名称</span>  <span class="value">结果 (参考值)</span>
          </li>

          <li class="item" v-for="(item,index) in reportMessageDetail.detaillist" :key="index" >
            <span class="key">{{item.itemname}}</span>  <span class="value"> <img class="arrow" :src="arrowUrl(item.isnormal)"> <span class="fact">{{item.result}}</span><span class="refer" >({{item.resultrange}})</span> </span>
          </li>
        </ul>



        <div class="area related-area" >
          <ul class="related-info report-details-related-info">
            <li class="item" v-if="reportMessageDetail.deptname" >
              <span class="key" >申请科室</span>  <span class="value">{{reportMessageDetail.deptname}}</span>
            </li>
            <li class="item" v-if="reportMessageDetail.applydoctoename" >
              <span class="key" >申请医生</span>  <span class="value">{{reportMessageDetail.applydoctoename}}</span>
            </li>
            <li class="item" v-if="reportMessageDetail.collectiondoctoename" >
              <span class="key" >采集人员</span>  <span class="value">{{reportMessageDetail.collectiondoctoename}}</span>
            </li>
            <li class="item" v-if="reportMessageDetail.checkdoctoename" >
              <span class="key" >检验人员</span>  <span class="value">{{reportMessageDetail.checkdoctoename}}</span>
            </li>
            <li class="item" v-if="reportMessageDetail.verifydoctoename" >
              <span class="key" >审核人员</span>  <span class="value">{{reportMessageDetail.verifydoctoename}}</span>
            </li>
            <li class="item" v-if="reportMessageDetail.checkdate" >
              <span class="key" >送检时间</span>  <span class="value">{{reportMessageDetail.checkdate}}</span>
            </li>
            <li class="item" v-if="reportMessageDetail.resultdate" >
              <span class="key" >报告时间</span>  <span class="value">{{reportMessageDetail.resultdate}}</span>
            </li>
            <li class="item" v-if="false" >
              <span class="key" >检验编号</span>  <span class="value">检验编号</span>
            </li>
          </ul>
        </div>

        <p v-if="reportMessageDetail.msg" class="prompt">{{reportMessageDetail.msg}}</p>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import arrow_up from '@icon/arrow_up.png'
  import arrow_down from '@icon/arrow_down.png'
  export default {
    computed: {
      ...mapState(["reportMessageDetail"]),
    },
    created() {

    },
    data() {
      return {}
    },
    methods: {
      ...mapActions([""]),
      arrowUrl:function(state){
        let arrowUrl = "";
        switch (state){
          case 1 :{
            arrowUrl = arrow_up ;
            break
          }

          case 2 :{
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
        height: auto;
        line-height: 1.5;
        padding: 10px 16px;
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
        .key {
          color: #333333;
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

    .prompt {
      padding: 16px;
      font-size: @itemSmallFontSize;
      color: @itemTextMinorColor;
    }

  }
</style>
