<template>
  <div class="page" :class="{'bg':!isEmpty}">
    <view-box :body-padding-bottom="isShowNavBar?'96px':'50px'" body-padding-top="0">
      <div slot="header">
        <x-header>自助业务统计</x-header>
        <choose-date-bar @on-change="dateChange" @on-choose-date="onChooseDate" v-model="date"></choose-date-bar>
      </div>
      <div v-if="!isEmpty">
        <group>
          <cell class="cell-bar">
            <span class="visit-person-title" slot="title">挂号</span>
            <span class="visit-person-label"></span>
          </cell>

          <div class="info-plan">
            <div class="h-inline-bar">
              <div class="h-inline-item">
                <span class="info-title">总挂号数</span>
                <span class="info-value">{{buffetBusiness.regamt}}</span>
              </div>
              <div class="h-inline-item">
                <span class="info-title">自助挂号</span>
                <span class="info-value">{{buffetBusiness.regmachine}}</span>
              </div>
            </div>
            <div class="h-inline-bar">
              <div class="h-inline-item">
                <span class="info-title">线上挂号</span>
                <span class="info-value">{{buffetBusiness.regapp}}</span>
              </div>
              <div class="h-inline-item">
                <span class="info-title">自助占比</span>
                <span class="info-value">{{buffetBusiness.regautorate}}</span>
              </div>
            </div>
          </div>


          <div class="charts">
            <div id="registerLine"></div>
          </div>

          <div class="charts">
            <div id="registerPie"></div>
          </div>

          <x-table :cell-bordered="false">
            <thead>
            <tr class="tb-header">
              <th>院区</th>
              <th>总挂号数</th>
              <th>自助挂号数</th>
              <th>线上挂号</th>
              <th>自助占比</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in buffetBusiness.yuanbingreglist">
              <td :style="{'color':colors[index]}">{{item.hospitalname}}</td>
              <td>{{item.amt}}</td>
              <td>{{item.machine}}</td>
              <td>{{item.app}}</td>
              <td>{{item.autorate}}</td>
            </tr>
            </tbody>
          </x-table>

        </group>


        <group>
          <cell class="cell-bar">
            <span class="visit-person-title" slot="title">预约挂号</span>
            <span class="visit-person-label"></span>
          </cell>

          <div class="info-plan">
            <div class="h-inline-bar">
              <div class="h-inline-item">
                <span class="info-title">总预约数</span>
                <span class="info-value">{{buffetBusiness.appointamt}}</span>
              </div>
              <div class="h-inline-item">
                <span class="info-title">自助预约</span>
                <span class="info-value">{{buffetBusiness.appointmachine}}</span>
              </div>
            </div>
            <div class="h-inline-bar">
              <div class="h-inline-item">
                <span class="info-title">线上预约</span>
                <span class="info-value">{{buffetBusiness.appointapp}}</span>
              </div>
              <div class="h-inline-item">
                <span class="info-title">自助占比</span>
                <span class="info-value">{{buffetBusiness.appointautorate}}</span>
              </div>
            </div>
          </div>


          <div class="charts">
            <div id="bookingLine"></div>
          </div>

          <div class="charts">
            <div id="bookingPie"></div>
          </div>

          <x-table :cell-bordered="false">
            <thead>
            <tr class="tb-header">
              <th>院区</th>
              <th>总预约数</th>
              <th>自助预约</th>
              <th>线上预约</th>
              <th>自助占比</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in buffetBusiness.yuanbingappointlist">
              <td :style="{'color':colors[index]}">{{item.hospitalname}}</td>
              <td>{{item.amt}}</td>
              <td>{{item.machine}}</td>
              <td>{{item.app}}</td>
              <td>{{item.autorate}}</td>
            </tr>
            </tbody>
          </x-table>

        </group>

        <group>
          <cell class="cell-bar">
            <span class="visit-person-title" slot="title">自助办卡</span>
            <span class="visit-person-label"></span>
          </cell>

          <div class="info-plan">
            <div class="h-inline-bar">
              <div class="h-inline-item">
                <span class="info-title">办卡总数</span>
                <span class="info-value">{{buffetBusiness.cardamt}}</span>
              </div>
              <div class="h-inline-item">
                <span class="info-title">自助办卡</span>
                <span class="info-value">{{buffetBusiness.cardmachine}}</span>
              </div>
            </div>
            <div class="h-inline-bar">
              <div class="h-inline-item">
                <span class="info-title">自助占比</span>
                <span class="info-value">{{buffetBusiness.cardautorate}}</span>
              </div>

            </div>
          </div>


          <div class="charts">
            <div id="buildLine"></div>
          </div>

          <div class="charts">
            <div id="buildPie"></div>
          </div>

          <x-table :cell-bordered="false">
            <thead>
            <tr class="tb-header">
              <th>院区</th>
              <th>办卡总数</th>
              <th>自助办卡</th>
              <th>自助占比</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in buffetBusiness.yuanbingcardlist">
              <td :style="{'color':colors[index]}">{{item.hospitalname}}</td>
              <td>{{item.amt}}</td>
              <td>{{item.machine}}</td>
              <td>{{item.autorate}}</td>
            </tr>
            </tbody>
          </x-table>

        </group>


        <group>
          <cell class="cell-bar">
            <span class="visit-person-title" slot="title">充值笔数</span>
            <span class="visit-person-label"></span>
          </cell>

          <div class="info-plan">
            <div class="h-inline-bar">
              <div class="h-inline-item">
                <span class="info-title">总充值数</span>
                <span class="info-value">{{buffetBusiness.accpdamt}}</span>
              </div>
              <div class="h-inline-item">
                <span class="info-title">自助充值</span>
                <span class="info-value">{{buffetBusiness.accpdmachine}}</span>
              </div>
            </div>
            <div class="h-inline-bar">
              <div class="h-inline-item">
                <span class="info-title">线上充值</span>
                <span class="info-value">{{buffetBusiness.accpdapp}}</span>
              </div>
              <div class="h-inline-item">
                <span class="info-title">自助占比</span>
                <span class="info-value">{{buffetBusiness.acccountautorate}}</span>
              </div>
            </div>
          </div>


          <div class="charts">
            <div id="outpatientLine"></div>
          </div>

          <div class="charts">
            <div id="outpatientPie"></div>
          </div>

          <x-table :cell-bordered="false">
            <thead>
            <tr class="tb-header">
              <th>院区</th>
              <th>总充值数</th>
              <th>自助充值</th>
              <th>线上充值</th>
              <th>自助占比</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in buffetBusiness.yuanbingacccountlist">
              <td :style="{'color':colors[index]}">{{item.hospitalname}}</td>
              <td>{{item.amt}}</td>
              <td>{{item.machine}}</td>
              <td>{{item.app}}</td>
              <td>{{item.autorate}}</td>
            </tr>
            </tbody>
          </x-table>

        </group>

        <group>
          <cell class="cell-bar">
            <span class="visit-person-title" slot="title">充值金额</span>
            <span class="visit-person-label"></span>
          </cell>

          <div class="info-plan">
            <div class="h-inline-bar">
              <div class="h-inline-item">
                <span class="info-title">总充值额</span>
                <span class="info-value">{{buffetBusiness.accpdamtsum}}</span>
              </div>
              <div class="h-inline-item">
                <span class="info-title">自助充值</span>
                <span class="info-value">{{buffetBusiness.accpdmachinesum}}</span>
              </div>
            </div>
            <div class="h-inline-bar">
              <div class="h-inline-item">
                <span class="info-title">线上充值</span>
                <span class="info-value">{{buffetBusiness.accpdappsum}}</span>
              </div>
              <div class="h-inline-item">
                <span class="info-title">自助占比</span>
                <span class="info-value">{{buffetBusiness.accsumautorate}}</span>
              </div>
            </div>
          </div>


          <div class="charts">
            <div id="amountLine"></div>
          </div>

          <div class="charts">
            <div id="amountPie"></div>
          </div>

          <x-table :cell-bordered="false">
            <thead>
            <tr class="tb-header">
              <th>院区</th>
              <th>总充值额</th>
              <th>自助充值</th>
              <th>线上充值</th>
              <th>自助占比</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in buffetBusiness.yuanbingaccsumlist">
              <td :style="{'color':colors[index]}">{{item.hospitalname}}</td>
              <td>{{item.amt}}</td>
              <td>{{item.machine}}</td>
              <td>{{item.app}}</td>
              <td>{{item.autorate}}</td>
            </tr>
            </tbody>
          </x-table>

        </group>


      </div>
      <div v-else>
        <div>
          <div class="vux-center" style="margin-top: 100px;">
            <img src="@icon/icon_log_empty.png" style="width: 30%;"/>
          </div>
          <br/>
          <div style="text-align: center;color: #999999;">此日期无统计数据</div>
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import {XTable} from 'vux'
  import ChooseDateBar from '../../components/ChooseDateBar'
  import tool from '@common/libs/tool'
  export default {
    computed: {
      ...mapState(["buffetBusiness"]),
      routeDate:function(){
        return this.$routeData.routeDate
      }
    },
    components:{
      XTable,ChooseDateBar
    },
    mounted(){
      if(this.routeDate){
        this.date=this.routeDate;
      }else{
        this.date=this.getLeftDate()
      }
      this.loadSelfMachineCount(this.date);
    },
    created() {


    },
    data() {
      return {
        isEmpty: false,
        date: '',
        colors: ['#1890FF', '#2FC25A', '#FACC14', '#233273'],
        isShowNavBar: shareInst.client.showWebNavBar,
      }
    },
    methods: {
      ...mapActions(["selfMachineCount"]),
      loadSelfMachineCount(date){

        this.selfMachineCount({
          startdate:date,
          enddate:date
        }).then((res)=>{
          this.isEmpty = (!res.result)||(!res.data)||(JSON.stringify(res.data)=='{}')
          if(!this.isEmpty){
            this.reloadChart()
          }else{
            if(res.msg){
              this.$vux.toast.text(res.msg)
            }
          }
        })
      },
      dateChange(date) {
        this.loadSelfMachineCount(date)
      },
      getLeftDate() {
        let now = new Date();
        now.setDate(now.getDate() - 1);
        return tool.dateFormat(now, 'yyyy-MM-dd');
      },
      onChooseDate(date) {
        shareInst.client.push({
          path: '/chooseDate',
          query: {
            date: this.date
          }
        })
      },
      reloadChart(){
        let registerPie=this.formatPieData(this.buffetBusiness.yuanbingreglist)
        registerPie.elementId='registerPie'
        this.$nextTick((res)=>{
          this.drawPie(registerPie)
        })

        let registerLine = this.formatLineData(this.buffetBusiness.zhexianreglist)
        registerLine.elementId='registerLine'
        this.$nextTick((res)=>{
          this.drawLine(registerLine)
        })

        let bookingPie=this.formatPieData(this.buffetBusiness.yuanbingappointlist)
        bookingPie.elementId='bookingPie'
        this.$nextTick((res)=>{
          this.drawPie(bookingPie)
        })

        let bookingLine = this.formatLineData(this.buffetBusiness.zhexianregappointlist)
        bookingLine.elementId='bookingLine'
        this.$nextTick((res)=>{
          this.drawLine(bookingLine)
        })


        let buildPie=this.formatPieData(this.buffetBusiness.yuanbingcardlist)
        buildPie.elementId='buildPie'
        this.$nextTick((res)=>{
          this.drawPie(buildPie)
        })

        let buildLine = this.formatLineData(this.buffetBusiness.zhexianregcardlist)
        buildLine.elementId='buildLine'
        this.$nextTick((res)=>{
          this.drawLine(buildLine)
        })


        let outpatientPie=this.formatPieData(this.buffetBusiness.yuanbingacccountlist)
        outpatientPie.elementId='outpatientPie'
        this.$nextTick((res)=>{
          this.drawPie(outpatientPie)
        })

        let outpatientLine = this.formatLineData(this.buffetBusiness.zhexianregacccountlist)
        outpatientLine.elementId='outpatientLine'
        this.$nextTick((res)=>{
          this.drawLine(outpatientLine)
        })


        let amountPie=this.formatPieData(this.buffetBusiness.yuanbingaccsumlist)
        amountPie.elementId='amountPie'
        this.$nextTick((res)=>{
          this.drawPie(amountPie)
        })

        let amountLine = this.formatLineData(this.buffetBusiness.zhexianregaccsumlist)
        amountLine.elementId='amountLine'
        this.$nextTick((res)=>{
          this.drawLine(amountLine)
        })


      },
      formatDate(val){
        return val.substring(5,val.length).replace('-','/');
      },
      formatLineData(data){
        let menzhenZhexian={};
        let menzhenX=[]
        let menzhenY=[]
        let menzhenP=[]
        data.forEach((res)=>{
          menzhenX.push(this.formatDate(res.date));
          menzhenY.push(res.percent)
          menzhenP.push({
            xAxis:this.formatDate(res.date),yAxis:res.percent,value:res.percent
          })
          menzhenZhexian.xAxis=menzhenX
          menzhenZhexian.yAxis=menzhenY
          menzhenZhexian.markPoint=menzhenP
        })
        return menzhenZhexian
      },
      formatPieData(data,flag){
        let a={}

        let s=[]
        let legend=[]
        data.forEach((res)=>{
          s.push({
            value:res.percent,
            name:res.hospitalname
          })
          let l=res.hospitalname
          if(flag){
//            l=l+`${((res.percent*10000)/100).toFixed(2)}%`
          }
          legend.push(l)
        })
        a.data=s
        a.legend=legend
        return a;
      },
      drawLine(data) {

        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById(data.elementId))
        // 绘制图表
        myChart.setOption({
          color: this.colors,
          title: {text: ''},
          tooltip: {
            trigger: 'axis',
//            extraCssText:'width:auto;height:auto;'
          },
          toolbox: {
            show: false
          },
          calculable: true,
          legend: {
            data: data.legend
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.xAxis
          },
          yAxis: {},
          series: [{
            smooth: 0.4,
            type: 'line',
            data: data.yAxis,
            markPoint: {
              data: data.markPoint
            }
          }]
        });
      },
      drawBar(data) {

        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById(data.elementId))
        // 绘制图表
        myChart.setOption({
          color: this.colors,
          title: {text: ''},
          tooltip: {
            trigger: 'axis',
            extraCssText:'width:auto;height:auto;'
          },
          toolbox: {
            show: false
          },
          calculable: true,
          legend: {
            data: data.legend
          },
          xAxis: {
            type: 'category',
            boundaryGap: true,
            data: data.xAxis
          },
          yAxis: {},
          series: data.series
        });
      },
      drawPie(data) {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById(data.elementId))
        // 绘制图表
        myChart.setOption({
          color: this.colors,
          tooltip: {
            trigger: 'item',
            formatter: "{b} {c}",
//            extraCssText:'width:auto;height:auto;'
          },
          toolbox: {
            show: false
          },
          calculable: true,
          legend: {
//            orient: 'vertical',
//            right: 10,
//            top: 20,
//            bottom: 20,
            data: data.legend
          },
          series: [
            {
              name: '',
              type: 'pie',
              radius: '55%',
              data: data.data,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        });
      },
      drawPie1(data) {
        let self = this
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById(data.elementId))
        // 绘制图表
        myChart.setOption({
          color: this.colors,
          tooltip: {
            trigger: 'item',
            formatter: "{b} {c}",
            extraCssText:'width:auto;height:auto;'
          },
          toolbox: {
            show: false
          },
          calculable: true,
          legend: {
            orient: 'vertical',
            right: 10,
            top: 40,
            bottom: 20,
            data: data.legend,
            formatter: function (params) {
              // console.log(params);
//              for (var i = 0; i < option.series[0].data.length; i++) {
//                if (option.series[0].data[i].name == params) {
//                  return params +":"+ option.series[0].data[i].value+"起";
//                }
//              }
              return params + '  ' + data.legendParams[params]
            }
          },
          series: [
            {
              center: ['40%', '50%'],
              name: '',
              type: 'pie',
              radius: '55%',
              data: data.data,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        });
      }
    }
  }
</script>
<style scoped>
  .cell-bar{
    font-size: 16px;
  }
  .visit-person-label{
    color: #436BB3;
    /*font-weight: bold;*/
  }
  .visit-person-title{
    color: #333333;
  }
  .info-plan{
    padding: 5px 16px;
    position: relative;
  }
  .info-plan:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    width: 100%;
    color: #D9D9D9;
    transform-origin: 0 0;
    transform: scaleY(0.5);
  }
  .h-inline-bar{
    width: 100%;
    overflow: hidden;
    box-sizing: border-box;
  }
  .h-inline-bar .h-inline-item{
    display: inline-block;
    min-width: 49%;
    line-height: 1.7;
    box-sizing: border-box;
  }
  .info-title{
    display: inline-block;
    width: 4.5em;
    font-size: 15px;
    color: #9A9A9A;
  }
  .info-value{
    color: #333333;
    font-size: 15px;
  }
  .grid-box{

  }
  .grid-box-item{
    padding: 10px;
    text-align: center;
  }
  .grid-box-item:active{
    /*top: 1px;*/
    z-index: 0;
    background: white;
  }
  .grid-box:before{
    z-index: 2;
  }
  .grid-item-title{
    font-size: 14px;
    color: #BBB;
  }
  .grid-item-value{
    font-size: 15px;
    color: #101010;
  }
  .btn-box{
    padding: 10px 16px 0px;
    display: flex;
    justify-content:space-between;
  }
  .width-title{
    width: 5em;
  }
  .look-dept-detail{
    color: #406AB4;
  }
  .checker-item{
    font-size: 14px;
    padding: 4px;
    width: 5.5em;
    text-align: center;
    border:1px solid #DDDDDD;
    color: #999999;
    border-radius: 15px;
  }
  .checker-item-selected{
    border-color: #436BB3;
    color: #4569B5;
  }
  .checker-1{

  }
  .checker-2{
    right: 16px;
  }
  .checker-3{
    bottom: 10px;
    right: 16px;
  }
  .charts div{
    width: 100%;
    height: 300px;
  }
  .tb-header{
    color: #999999;
  }
  .bg{
    background: #233172;
  }
</style>
