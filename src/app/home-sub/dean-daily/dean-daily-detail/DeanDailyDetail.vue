<template>
  <div class="page" :class="{'bg':!isEmpty}">
    <view-box :body-padding-bottom="isShowNavBar?'96px':'50px'" body-padding-top="0">
      <div slot="header">
        <x-header>院长日报</x-header>
        <choose-date-bar @on-change="dateChange" @on-choose-date="onChooseDate" v-model="date"></choose-date-bar>
      </div>
      <div v-if="!isEmpty">

        <group v-if="deanDaily.menzhenzhuyuanpaycount">
          <cell class="cell-bar">
            <span class="visit-person-title" slot="title">当日总收入（门诊+住院）</span>
            <span class="visit-person-label">{{deanDaily.menzhenzhuyuanpaycount}}</span>
          </cell>
        </group>

        <group>
          <cell class="cell-bar">
            <span class="visit-person-title" slot="title">门急诊人次</span>
            <span class="visit-person-label">{{deanDaily.menjizhencount}}</span>
          </cell>

          <!--<div class="info-plan">-->
            <!--<div class="h-inline-bar">-->
              <!--<div class="h-inline-item">-->
                <!--<span class="info-title">门诊人次</span>-->
                <!--<span class="info-value">{{deanDaily.menzhencount}}</span>-->
              <!--</div>-->
              <!--<div class="h-inline-item">-->
                <!--<span class="info-title">预约就诊</span>-->
                <!--<span class="info-value">{{deanDaily.regiscount}}</span>-->
              <!--</div>-->
            <!--</div>-->
            <!--<div class="h-inline-bar">-->
              <!--<div class="h-inline-item">-->
                <!--<span class="info-title">急诊人次</span>-->
                <!--<span class="info-value">{{deanDaily.jizhencount}}</span>-->
              <!--</div>-->
              <!--<div class="h-inline-item">-->
                <!--<span class="info-title">预约率</span>-->
                <!--<span class="info-value">{{deanDaily.regrate}}</span>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->


          <div class="charts">
            <div id="menZhenLine"></div>
          </div>

          <div class="charts">
            <div id="menZhenCountPie"></div>
          </div>


          <v-chart v-if="showVChart" ref="menzhenLine" :data="menzhenZhexian">
            <v-scale x :tick-count="7" type="timeCat" mask="MM/DD" />
            <v-scale y field="allmenjizhenhiuzhencount" ></v-scale>
            <v-tooltip :show-item-marker="false" show-x-value />
            <v-point
              :style="{
                stroke: '#fff',
                lineWidth: 1
              }"
              shape="smooth" />
            <v-line shape="smooth" />
          </v-chart>

          <v-chart v-if="showVChart" ref="menzhenCountPie" :data="menzhenCountBing">
            <v-tooltip />
            <v-scale y field="percent" />
            <v-pie :radius="0.85" series-field="hospitalname" />
            <v-legend :options="{position: 'right'}" />
          </v-chart>
          <x-table :cell-bordered="false">
            <thead>
              <tr class="tb-header">
                <th>院区</th>
                <th>门急诊</th>
                <!--<th>急诊</th>-->
                <!--<th>预约</th>-->
                <!--<th>预约率</th>-->
              </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in deanDaily.menzhenyuanbingcount">
              <td :style="{'color':colors[index]}">{{item.hospitalname}}</td>
              <td>{{item.percent}}</td>
              <!--<td>{{item.sjizhenjiuzhencount}}</td>-->
              <!--<td>{{item.sregiscount}}</td>-->
              <!--<td>{{item.sregrate}}</td>-->
            </tr>
            </tbody>
          </x-table>

        </group>

        <group>

          <cell class="cell-bar look-dept-cell" :is-link="false">
            <span class="visit-person-title" slot="title">门诊收入</span>
            <span v-if="false" class="look-dept-detail">查看科室详情</span>
          </cell>

          <div class="info-plan">
            <div class="h-inline-bar">
              <div class="h-inline-item">
                <span class="info-title">当日收入</span>
                <span class="info-value">￥{{deanDaily.menzhentotalpay}}</span>
              </div>
              <div class="h-inline-item" v-if="false">
                <span class="info-title">医保金额</span>
                <span class="info-value">￥0.00</span>
              </div>
            </div>
            <div class="h-inline-bar">
              <div class="h-inline-item">
                <span class="info-title">次均费用</span>
                <span class="info-value">￥{{deanDaily.menzhencijunpay}}</span>
              </div>
              <div class="h-inline-item" v-if="false">
                <span class="info-title">自费金额</span>
                <span class="info-value">￥0.00</span>
              </div>
            </div>
          </div>


          <div class="charts">
            <div id="menZhenBar"></div>
          </div>


          <v-chart v-if="showVChart" ref="menzhenBar" :data="menzhenZhuzhuang">
            <v-scale x field="date" type="timeCat" mask="MM/DD" />
            <v-scale y field="amount" />
            <v-bar series-field="type" adjust="stack" />
            <v-legend></v-legend>
            <v-tooltip/>
          </v-chart>

          <grid class="grid-box" :cols="2" :show-lr-borders="false">
            <grid-item class="grid-box-item">
              <div class="grid-item-title">药品收入</div>
              <div class="grid-item-value">￥{{deanDaily.menzhenyaopinpay}}</div>
            </grid-item>
            <grid-item class="grid-box-item">
              <div class="grid-item-title">药占比</div>
              <div class="grid-item-value">{{deanDaily.menzhenyaopercent}}</div>
            </grid-item>
            <grid-item class="grid-box-item">
              <div class="grid-item-title">材料收入</div>
              <div class="grid-item-value">￥{{deanDaily.menzhencailiaopay}}</div>
            </grid-item>
            <grid-item class="grid-box-item">
              <div class="grid-item-title">材料占比</div>
              <div class="grid-item-value">{{deanDaily.menzhenhaopercent}}</div>
            </grid-item>
          </grid>

          <checker radio-required @on-change="outpatientValueChange" class="btn-box" v-model="outpatientValue" default-item-class="checker-item" selected-item-class="checker-item-selected">
            <checker-item class="checker-1" :value="1">收入</checker-item>
            <checker-item class="checker-2" :value="2">药占比</checker-item>
            <checker-item class="checker-3" :value="3">材料占比</checker-item>
          </checker>


          <div class="charts">
            <div id="menZhenPie"></div>
          </div>

          <v-chart v-if="showVChart" ref="menzhenPie" :data="menzhenBing">
            <v-tooltip />
            <v-scale y field="percent" />
            <v-pie :radius="0.85" series-field="hospitalname" />
            <v-legend :options="mzLegendOptions" />
          </v-chart>


        </group>

        <group>

          <cell class="cell-bar">
            <span class="visit-person-title" slot="title">(住院)在院人数</span>
            <span class="visit-person-label">{{deanDaily.zaiyuancount}}</span>
          </cell>

          <div class="info-plan">
            <div class="h-inline-bar">
              <div class="h-inline-item">
                <span class="info-title">入院人次</span>
                <span class="info-value">{{deanDaily.ruyuancount}}</span>
              </div>
              <div class="h-inline-item" v-if="false">
                <span class="info-title width-title">开放病床</span>
                <span class="info-value">0</span>
              </div>
            </div>
            <div class="h-inline-bar">
              <div class="h-inline-item">
                <span class="info-title">出院人次</span>
                <span class="info-value">{{deanDaily.chuyuancount}}</span>
              </div>
              <div class="h-inline-item" v-if="false">
                <span class="info-title width-title">床位使用率</span>
                <span class="info-value">0.00%</span>
              </div>
            </div>
          </div>

          <div class="charts">
            <div id="zhuYuanLine"></div>
          </div>


          <div class="charts">
            <div id="zhuYuanCountPie"></div>
          </div>

          <x-table :cell-bordered="false">
            <thead>
            <tr class="tb-header">
              <th>院区</th>
              <th>在院</th>
              <th>入院</th>
              <th>出院</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in deanDaily.zhuyuanyuanbingcount">
              <td :style="{'color':colors[index]}">{{item.hospitalname}}</td>
              <td>{{item.percent}}</td>
              <td>{{item.sruyuanCount}}</td>
              <td>{{item.schuyuanCount}}</td>
            </tr>
            </tbody>
          </x-table>

          <v-chart v-if="showVChart" ref="zhuyuanLine" :data="zhuyuanZhexian" >
            <v-scale x :tick-count="7" field="date" type="timeCat" mask="MM/DD" />
            <v-scale y field="allzhuyuancount"></v-scale>
            <v-tooltip :show-item-marker="false" show-x-value />
            <v-point
              :style="{
                stroke: '#fff',
                lineWidth: 1
              }"
              shape="smooth" />
            <v-line shape="smooth" />
          </v-chart>

          <v-chart v-if="showVChart" ref="zhuyuanCountPie" :data="zhuyuanCountBing">
            <v-tooltip />
            <v-scale y field="percent" />
            <v-pie :radius="0.85" series-field="hospitalname" />
            <v-legend :options="{position: 'right'}" />
          </v-chart>


        </group>


        <group>

          <cell class="cell-bar look-dept-cell" :is-link="false">
            <span class="visit-person-title" slot="title">住院收入</span>
            <span v-if="false" class="look-dept-detail">查看科室详情</span>
          </cell>


          <div class="info-plan">
            <div class="h-inline-bar">
              <div class="h-inline-item">
                <span class="info-title">当日收入</span>
                <span class="info-value">￥{{deanDaily.zhuyuantotalpay}}</span>
              </div>
              <div class="h-inline-item" v-if="false">
                <span class="info-title">医保金额</span>
                <span class="info-value">￥0.00</span>
              </div>
            </div>
            <div class="h-inline-bar">
              <div class="h-inline-item">
                <span class="info-title">次均费用</span>
                <span class="info-value">￥{{deanDaily.zhuyuancijunpay}}</span>
              </div>
              <div class="h-inline-item" v-if="false">
                <span class="info-title">自费金额</span>
                <span class="info-value">￥0.00</span>
              </div>
            </div>
          </div>


          <div class="charts">
            <div id="zhuYuanBar"></div>
          </div>

          <v-chart v-if="showVChart" ref="zhuyuanBar" :data="zhuyuanZhuzhuang">
            <v-scale x field="date" type="timeCat" mask="MM/DD" />
            <v-scale y field="amount" />
            <v-bar series-field="type" adjust="stack" />
            <v-tooltip />
          </v-chart>


          <grid class="grid-box" :cols="2" :show-lr-borders="false">
            <grid-item class="grid-box-item">
              <div class="grid-item-title">药品收入</div>
              <div class="grid-item-value">￥{{deanDaily.zhuyuanyaopinpay}}</div>
            </grid-item>
            <grid-item class="grid-box-item">
              <div class="grid-item-title">药占比</div>
              <div class="grid-item-value">{{deanDaily.zhuyuanyaopercent}}</div>
            </grid-item>
            <grid-item class="grid-box-item">
              <div class="grid-item-title">材料收入</div>
              <div class="grid-item-value">￥{{deanDaily.zhuyuancailiaopay}}</div>
            </grid-item>
            <grid-item class="grid-box-item">
              <div class="grid-item-title">材料占比</div>
              <div class="grid-item-value">{{deanDaily.zhuyuanhaopercent}}</div>
            </grid-item>
            <grid-item class="grid-box-item">
              <div class="grid-item-title">临床路径入径人数</div>
              <div class="grid-item-value">{{deanDaily.linchuangyujingcount}}</div>
            </grid-item>
            <grid-item class="grid-box-item">
              <div class="grid-item-title">单病种结算人数</div>
              <div class="grid-item-value">{{deanDaily.danbingzhongjiesuancount}}</div>
            </grid-item>
            <grid-item class="grid-box-item">
              <div class="grid-item-title">临床路径入径率</div>
              <div class="grid-item-value">{{deanDaily.linchuangyujingpercent}}</div>
            </grid-item>
            <grid-item class="grid-box-item">
              <div class="grid-item-title">单病种结算人数占比</div>
              <div class="grid-item-value">{{deanDaily.danbingzhongjiesuanpercent}}</div>
            </grid-item>
          </grid>


          <checker radio-required @on-change="hospitalizationValueChange" class="btn-box" v-model="hospitalizationValue" default-item-class="checker-item" selected-item-class="checker-item-selected">
            <checker-item class="checker-1" :value="1">收入</checker-item>
            <checker-item class="checker-2" :value="2">药占比</checker-item>
            <checker-item class="checker-3" :value="3">材料占比</checker-item>
          </checker>


          <div class="charts">
            <div id="zhuYuanPie"></div>
          </div>

          <v-chart v-if="showVChart" ref="zhuyuanPie" :data="zhuyuanBing">
            <v-tooltip />
            <v-pie :radius="0.85" series-field="hospitalname" />
            <v-legend :options="zyLegendOptions" />
          </v-chart>



        </group>


        <group v-if="false">

          <cell class="cell-bar">
            <span class="visit-person-title" slot="title">建卡人数</span>
            <span class="visit-person-label">126</span>
          </cell>

          <div class="info-plan">
            <div class="h-inline-bar">
              <div class="h-inline-item">
                <span class="info-title">社保建卡</span>
                <span class="info-value">56</span>
              </div>
              <div class="h-inline-item">
                <span class="info-title">在线建卡</span>
                <span class="info-value">12</span>
              </div>
            </div>
            <div class="h-inline-bar">
              <div class="h-inline-item">
                <span class="info-title">社保比例</span>
                <span class="info-value">44.44%</span>
              </div>
              <div class="h-inline-item">
                <span class="info-title">在线比例</span>
                <span class="info-value">9.5%</span>
              </div>
            </div>
          </div>



          <v-chart ref="jiankaLine" :data="data">
            <v-scale x :tick-count="7" type="timeCat" mask="MM/DD" />
            <v-tooltip :show-item-marker="false" show-x-value />
            <v-line />
          </v-chart>

        </group>


        <group v-if="false">

          <cell class="cell-bar">
            <span class="visit-person-title" slot="title">体检收入</span>
            <span class="visit-person-label">￥11038.27</span>
          </cell>

          <div class="info-plan">
            <div class="h-inline-bar">
              <div class="h-inline-item">
                <span class="info-title">体检人次</span>
                <span class="info-value">56</span>
              </div>
              <div class="h-inline-item">
                <span class="info-title">医保金额</span>
                <span class="info-value">￥610.23</span>
              </div>
            </div>
            <div class="h-inline-bar">
              <div class="h-inline-item">
                <span class="info-title">次均费用</span>
                <span class="info-value">￥155.46</span>
              </div>
              <div class="h-inline-item">
                <span class="info-title">自费金额</span>
                <span class="info-value">￥10428.04</span>
              </div>
            </div>
          </div>



          <v-chart ref="tijianBar" :data="data" >
            <v-scale x :tick-count="7" type="timeCat" mask="MM/DD" />
            <v-tooltip :show-item-marker="false" show-x-value />
            <v-bar />
          </v-chart>

        </group>


        <group v-if="false">

          <cell class="cell-bar">
            <span class="visit-person-title" slot="title">危重人数</span>
            <span class="visit-person-label">28</span>
          </cell>

          <div class="info-plan">
            <div class="h-inline-bar">
              <div class="h-inline-item">
                <span class="info-title">转离危重</span>
                <span class="info-value">5</span>
              </div>
              <div class="h-inline-item">
                <span class="info-title">死亡人数</span>
                <span class="info-value">1</span>
              </div>
            </div>
            <div class="h-inline-bar">
              <div class="h-inline-item">
                <span class="info-title">转离比例</span>
                <span class="info-value">17.9%</span>
              </div>
              <div class="h-inline-item">
                <span class="info-title">死亡比例</span>
                <span class="info-value">3.6%</span>
              </div>
            </div>
          </div>


          <v-chart ref="weizhongBar" :data="deanDaily.menzhenzhuzhuang">
            <v-scale x field="date" type="timeCat" mask="MM/DD" />
            <v-scale y field="amount" />
            <v-bar series-field="type" adjust="stack" />
            <v-tooltip />
          </v-chart>

        </group>



      </div>
      <div v-else>
        <div>
          <div class="vux-center" style="margin-top: 100px;" >
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
  import {VChart,VScale,VTooltip,VLine,VBar,VLegend,VPie,VPoint,Grid, GridItem,Checker, CheckerItem,XTable } from 'vux'
  import ChooseDateBar from '../../../components/ChooseDateBar'
  import tool from '@common/libs/tool'

  export default {
    computed: {
      ...mapState(["deanDaily"]),
      routeDate:function(){
        return this.$routeData.routeDate
      }
    },
    components:{
      VChart,VScale,VTooltip,VLine,VBar,VLegend,VPie,VPoint,ChooseDateBar,Grid, GridItem,Checker, CheckerItem,XTable
    },
    created() {


    },
    mounted(){
      if(this.routeDate){
        this.date=this.routeDate;
      }else{
        this.date=this.getLeftDate()
      }
      this.loadPresidentLogs(this.date)

    },
    data() {
      return {
        date:'',
        colors:['#1890FF','#2FC25A','#FACC14','#233273'],
        isShowNavBar:shareInst.client.showWebNavBar,
        outpatientValue:1,
        hospitalizationValue:1,
        menzhenBing:[],
        zhuyuanBing:[],
        menzhenCountBing:[],
        zhuyuanCountBing:[],
        menzhenZhexian:[],
        menzhenZhuzhuang:[],
        zhuyuanZhexian:[],
        zhuyuanZhuzhuang:[],
        menzhenBingLendge:{},
        zhuyuanBingLendge:{},
        showVChart:true,
        isEmpty:false,
        data:[
          { date: '2017-06-05', value: 116 },
          { date: '2017-06-06', value: 129 },
          { date: '2017-06-07', value: 135 },
          { date: '2017-06-08', value: 86 },
          { date: '2017-06-09', value: 73 },
          { date: '2017-06-10', value: 85 },
          { date: '2017-06-11', value: 73 },
          { date: '2017-06-12', value: 68 },
          { date: '2017-06-13', value: 92 },
          { date: '2017-06-14', value: 130 },
          { date: '2017-06-15', value: 245 },
          { date: '2017-06-16', value: 139 },
          { date: '2017-06-17', value: 115 },
          { date: '2017-06-18', value: 111 },
          { date: '2017-06-19', value: 309 },
          { date: '2017-06-20', value: 206 },
          { date: '2017-06-21', value: 137 },
          { date: '2017-06-22', value: 128 },
          { date: '2017-06-23', value: 85 },
          { date: '2017-06-24', value: 94 },
          { date: '2017-06-25', value: 71 },
          { date: '2017-06-26', value: 106 }],
        data1:[
          { name: '诊疗收入', 月份: 'Jan.', 月均降雨量: 18.9 },
          { name: '诊疗收入', 月份: 'Feb.', 月均降雨量: 28.8 },
          { name: '诊疗收入', 月份: 'Mar.', 月均降雨量: 39.3 },
          { name: '诊疗收入', 月份: 'Apr.', 月均降雨量: 81.4 },
          { name: '诊疗收入', 月份: 'May.', 月均降雨量: 47 },
          { name: '诊疗收入', 月份: 'Jun.', 月均降雨量: 20.3 },
          { name: '诊疗收入', 月份: 'Jul.', 月均降雨量: 24 },
          { name: '诊疗收入', 月份: 'Aug.', 月均降雨量: 35.6 },
          { name: '药品收入', 月份: 'Jan.', 月均降雨量: 12.4 },
          { name: '药品收入', 月份: 'Feb.', 月均降雨量: 23.2 },
          { name: '药品收入', 月份: 'Mar.', 月均降雨量: 34.5 },
          { name: '药品收入', 月份: 'Apr.', 月均降雨量: 99.7 },
          { name: '药品收入', 月份: 'May.', 月均降雨量: 52.6 },
          { name: '药品收入', 月份: 'Jun.', 月均降雨量: 35.5 },
          { name: '药品收入', 月份: 'Jul.', 月均降雨量: 37.4 },
          { name: '药品收入', 月份: 'Aug.', 月均降雨量: 42.4 }
        ],
        data2: [
          { name: '芳华', percent: 0.4, a: '1' },
          { name: '妖猫传', percent: 0.2, a: '1' },
          { name: '机器之血', percent: 0.18, a: '1' },
          { name: '心理罪', percent: 0.15, a: '1' },
          { name: '寻梦环游记', percent: 0.05, a: '1' },
          { name: '其他', percent: 0.02, a: '1' }
        ],
        mzLegendOptions: {
          position: 'right',
          itemFormatter:this.formatMzBingLenged
        },
        zyLegendOptions: {
          position: 'right',
          itemFormatter:this.formatZyBingLenged
        }
      }
    },
    methods: {
      ...mapActions(["presidentLogs"]),
      formatMzBingLenged(val){
        return val + '  '+this.menzhenBingLendge[val];
      },
      formatZyBingLenged(val){
        return val + '  '+this.zhuyuanBingLendge[val];
      },
      dateChange(date){
        this.loadPresidentLogs(date)
      },
      loadPresidentLogs(date){
        this.showVChart=false
        this.presidentLogs({
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
      getLeftDate(){
        let now = new Date();
        now.setDate(now.getDate()-1);
        return tool.dateFormat(now, 'yyyy-MM-dd');
      },
      onChooseDate(date){
        shareInst.client.push({
          path:'/chooseDate',
          query:{
            date:this.date
          }
        })
      },
      toDeptDetail(){
        shareInst.client.push({
          path:'/deptDetail'
        })
      },
      outpatientValueChange(val){
        switch (val){
          case 1:
            this.menzhenBing=this.deanDaily.menzhenyuanbingshouru
            break;
          case  2:
            this.menzhenBing=this.deanDaily.menzhenyuanbingyaozhan
            break;
          case 3:
            this.menzhenBing=this.deanDaily.menzhenyuanbingcailiao
            break;
        }
        this.menzhenBingLendge={}
        this.menzhenBing.forEach((value)=>{
          let v=value.percent;
          if(val==2||val==3){
            v=`${((value.percent*10000)/100).toFixed(2)}%`
          }
          this.menzhenBingLendge[value.hospitalname]=v
        })
        this.$nextTick(( res )=> {
          let a = this.formatPieData(this.menzhenBing,val==2||val==3)
          a.legendParams=this.menzhenBingLendge
          a.elementId='menZhenPie'
          this.drawPie1(a)
        })

      },
      hospitalizationValueChange(val){
        switch (val){
          case 1:
            this.zhuyuanBing=this.deanDaily.zhuyuanyuanbingshouru
            break;
          case  2:
            this.zhuyuanBing=this.deanDaily.zhuyuanyuanbingyaozhan
            break;
          case 3:
            this.zhuyuanBing=this.deanDaily.zhuyuanyuanbingcailiao
            break;
        }
        this.zhuyuanBingLendge={}
        this.zhuyuanBing.forEach((value)=>{
          let v=value.percent;
          if(val==2||val==3){
            v=`${((value.percent*10000)/100).toFixed(2)}%`
          }
          this.zhuyuanBingLendge[value.hospitalname]=v
        })
        this.$nextTick(( res )=> {
          let a = this.formatPieData(this.zhuyuanBing,val==2||val==3)
          a.elementId='zhuYuanPie'
          a.legendParams=this.zhuyuanBingLendge
          this.drawPie1(a)
        })
      },
      formatDate(val){
        return val.substring(5,val.length).replace('-','/');
      },
      formatBarData(val){
        let a={}
        let menzhenZX=[]
        let menzhenZY=[]
        let menzhenL=[]
        let menzhenS={}
        val.forEach((res)=>{
          let x = this.formatDate(res.date)
          if(!menzhenS[res.type]){
            menzhenS[res.type]=[]
            menzhenL.push(res.type)
          }
          menzhenS[res.type].push(res.amount)
          if(!this.isInArray(menzhenZX,x)){
            menzhenZX.push(x)
          }
        })
        menzhenL.forEach((res)=>{
          menzhenZY.push({type:'bar',data:menzhenS[res],name:res,stack: '总量',label: {
            normal: {
              show: true,
            }
          }})
        })

        a.xAxis=menzhenZX
        a.series=menzhenZY
        a.legend=menzhenL
        return a;
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
      reloadChart(){

        this.showVChart=false

        this.outpatientValueChange(this.outpatientValue);
        this.hospitalizationValueChange(this.hospitalizationValue)

        this.menzhenZhexian={};
        let menzhenX=[]
        let menzhenY=[]
        let menzhenP=[]
        this.deanDaily.menzhenzhexian.forEach((res)=>{
          menzhenX.push(this.formatDate(res.date));
          menzhenY.push(res.allmenjizhenhiuzhencount)
          menzhenP.push({
            xAxis:this.formatDate(res.date),yAxis:res.allmenjizhenhiuzhencount,value:res.allmenjizhenhiuzhencount
          })
          this.menzhenZhexian.xAxis=menzhenX
          this.menzhenZhexian.yAxis=menzhenY
          this.menzhenZhexian.markPoint=menzhenP
        })
        this.menzhenZhexian.elementId='menZhenLine'
        this.$nextTick((res)=>{
          this.drawLine(this.menzhenZhexian)
        })

//        this.$nextTick((res)=>{
//          this.$refs.menzhenLine.rerender()
//        })

//        this.menzhenZhuzhuang=this.deanDaily.menzhenzhuzhuang
//        this.$nextTick((res)=>{
//          this.$refs.menzhenBar.rerender()
//        })

        this.menzhenZhuzhuang=this.formatBarData(this.deanDaily.menzhenzhuzhuang)
        this.menzhenZhuzhuang.elementId='menZhenBar'

        this.$nextTick((res)=>{
          this.drawBar(this.menzhenZhuzhuang)
        })


//        this.zhuyuanZhexian=this.deanDaily.zhuyuanzhexian
//        this.$nextTick((res)=>{
//          this.$refs.zhuyuanLine.rerender()
//        })

        this.zhuyuanZhexian={};
        let zhuyuanX=[]
        let zhuyuanY=[]
        let zhuyuanP=[]
        this.deanDaily.zhuyuanzhexian.forEach((res)=>{
          zhuyuanX.push(this.formatDate(res.date));
          zhuyuanY.push(res.allzhuyuancount)
          zhuyuanP.push({
            xAxis:this.formatDate(res.date),yAxis:res.allzhuyuancount,value:res.allzhuyuancount
          })
          this.zhuyuanZhexian.xAxis=zhuyuanX
          this.zhuyuanZhexian.yAxis=zhuyuanY
          this.zhuyuanZhexian.markPoint=zhuyuanP
        })
        this.zhuyuanZhexian.elementId='zhuYuanLine'
        this.$nextTick((res)=>{
          this.drawLine(this.zhuyuanZhexian)
        })


//        this.zhuyuanZhuzhuang=this.deanDaily.zhuyuanzhuzhuang
//        this.$nextTick((res)=>{
//          this.$refs.zhuyuanBar.rerender()
//        })

        this.zhuyuanZhuzhuang=this.formatBarData(this.deanDaily.zhuyuanzhuzhuang)
        this.zhuyuanZhuzhuang.elementId='zhuYuanBar'
        this.drawBar(this.zhuyuanZhuzhuang)

//        this.menzhenCountBing = this.deanDaily.menzhenyuanbingcount
//        this.$nextTick((res)=>{
//          this.$refs.menzhenCountPie.rerender()
//        })

        this.menzhenCountBing = this.formatPieData(this.deanDaily.menzhenyuanbingcount,false)
        this.menzhenCountBing.elementId='menZhenCountPie'
        this.drawPie(this.menzhenCountBing)

//        this.zhuyuanCountBing = this.deanDaily.zhuyuanyuanbingcount
//        this.$nextTick((res)=>{
//          this.$refs.zhuyuanCountPie.rerender()
//        })
        this.zhuyuanCountBing = this.formatPieData(this.deanDaily.zhuyuanyuanbingcount,false)
        this.zhuyuanCountBing.elementId='zhuYuanCountPie'
        this.drawPie(this.zhuyuanCountBing)
//          this.$refs.menzhenPie.rerender()
//          this.$refs.zhuyuanPie.rerender()
//          this.$refs.jiankaLine.rerender()
//          this.$refs.tijianBar.rerender()
//          this.$refs.weizhongBar.rerender()

      },
      isInArray(arr,value){
        for(var i = 0; i < arr.length; i++){
          if(value === arr[i]){
            return true;
          }
        }
        return false;
      },
      drawLine(data){

        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById(data.elementId))
        // 绘制图表
        myChart.setOption({
          color:this.colors,
          title: { text: '' },
          tooltip: {
            trigger: 'axis'
          },
          toolbox:{
            show:false
          },
          calculable : true,
          legend: {
            data:data.legend
          },
          xAxis: {
            type : 'category',
            boundaryGap : false,
            data: data.xAxis
          },
          yAxis: {},
          series: [{
            smooth: 0.4,
            type: 'line',
            data: data.yAxis,
            markPoint:{
              data:data.markPoint
            }
          }]
        });
      },
      drawBar(data){

        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById(data.elementId))
        // 绘制图表
        myChart.setOption({
          color:this.colors,
          title: { text: '' },
          tooltip: {
            trigger: 'axis'
          },
          toolbox:{
            show:false
          },
          calculable : true,
          legend: {
            data:data.legend
          },
          xAxis: {
            type : 'category',
            boundaryGap : true,
            data: data.xAxis
          },
          yAxis: {},
          series: data.series
        });
      },
      drawPie(data){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById(data.elementId))
        // 绘制图表
        myChart.setOption({
          color:this.colors,
          tooltip: {
            trigger: 'item',
            formatter: "{b} {c}"
          },
          toolbox:{
            show:false
          },
          calculable : true,
          legend: {
//            orient: 'vertical',
//            right: 10,
//            top: 20,
//            bottom: 20,
            data:data.legend
          },
          series: [
            {
              name: '',
              type: 'pie',
              radius : '55%',
              data:data.data,
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
      drawPie1(data){
        let self=this
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById(data.elementId))
        // 绘制图表
        myChart.setOption({
          color:this.colors,
          tooltip: {
            trigger: 'item',
            formatter: "{b} {c}"
          },
          toolbox:{
            show:false
          },
          calculable : true,
          legend: {
            orient: 'vertical',
            right: 10,
            top: 40,
            bottom: 20,
            data:data.legend,
            formatter: function (params) {
              // console.log(params);
//              for (var i = 0; i < option.series[0].data.length; i++) {
//                if (option.series[0].data[i].name == params) {
//                  return params +":"+ option.series[0].data[i].value+"起";
//                }
//              }
              return params+'  '+data.legendParams[params]
            }
          },
          series: [
            {
              center: ['40%', '50%'],
              name: '',
              type: 'pie',
              radius : '55%',
              data:data.data,
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
