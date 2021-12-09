<template>
  <div class="page">
    <view-box>
      <x-header slot="header">院长日报</x-header>
      <group :gutter="0">
        <cell class="date-tip-bar">
          <span slot="icon">
            <img src="@icon/icon_calendar.png"/>
          </span>
          <span slot="title">请选择您要查询的日期</span>
        </cell>
      </group>
      <group>
      <calendar ref="Calendar" @choseDay="choseDay" :futureDayHide="getFutureDayHide()"></calendar>
      </group>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import Calendar from 'vue-calendar-component';
  import tool from '@common/libs/tool'
  export default {
    computed: {
      ...mapState([]),
      date:function(){
        return this.$routeData.date
      },
      routeName:function(){
        return this.$routeData.routeName
      }
    },
    components: {
      Calendar
    },
    mounted(){
      if(this.date){
        this.$refs.Calendar.ChoseMonth(this.date);
      }
    },
    created() {

    },
    data() {
      return {}
    },
    methods: {
      ...mapActions([""]),
      getFutureDayHide(){
        let now = new Date();
        now.setDate(now.getDate()-1)
        return now.getTime()/1000+'';
      },
      choseDay(date){
        let _date=tool.dateFormat(new Date(date), 'yyyy-MM-dd');
        if(_date==this.date){
          return;
        }
        if(this.routeName=='toDeanDaily'){
          shareInst.client.push({
            path:'/deanDaily',
            query:{
              routeDate:_date
            }
          })
        }else{
          shareInst.client.backWithData({"routeDate":_date})
        }
      }
    }
  }
</script>
<style>
  .wh_content_all{
    background-color: white !important;
    color: #333 !important;
  }
  .wh_isToday{
    background: transparent !important;
  }
  .wh_content_item .wh_chose_day{
    background: #26C6DA !important;
    color: white !important;
  }
  .wh_item_date{
    color: #333 !important;
  }
  .wh_content_item .wh_other_dayhide,
  .wh_content_item .wh_want_dayhide{
    color: #bfbfbf !important;
  }
  .wh_top_changge li,
  .wh_top_tag{
    color: #333 !important;
  }
  .wh_jiantou2{
    border-top: 2px solid #333 !important;
    border-right: 2px solid #333 !important;
  }
  .wh_jiantou1{
    border-top: 2px solid #333 !important;
    border-left: 2px solid #333 !important;
  }
  .date-tip-bar{
    font-size: 16px;
    color: #999999;
  }
  .date-tip-bar img{
    width: 1em;
    vertical-align: middle;
    margin-right: 8px;
    margin-top: -4px;
  }
</style>
