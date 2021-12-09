<template>
  <div class="choose-date-bar" :value="value">
    <div class="day pre-day" @click="preDate()"><i class="arrow arrow-left"></i>前一日</div>
    <div class="choose-date">
      <div class="choose-date-box" @click="onChooseDate()">
        <div class="choose-date-label">选择日期</div>
        <div class="choose-date-date">{{this.date}}<img src="@icon/lower.png"/></div>
      </div>
    </div>
    <div class="day next-day" :class="{disable:disableNext()}" @click="nextDate()">后一日<i class="arrow arrow-right"></i></div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import tool from '@common/libs/tool'

  export default {
    name:'ChooseDateBar',
    computed: {
      ...mapState([]),
    },
    props:{
      value:{
        type:String,
        default:''
      }
    },
    watch:{
      value:function(val){
        this.date=val
      }
    },
    created() {
      this.today=this.getToday()
      this.leftDate=this.getStartDate(this.today,1)
      if(this.value){
        this.date=this.value
      }else{
        this.date=this.leftDate
        this.$emit('input', this.date)
      }
    },
    data() {
      return {
        date:'',
        today:'',
        leftDate:''
      }
    },
    methods: {
      ...mapActions([""]),
      disableNext(){
        return this.date>=this.leftDate
      },
      preDate(){
        this.date=this.getStartDate(this.date,1)
        this.$emit('input', this.date)
        this.$emit('on-change', this.date)
      },
      nextDate(){
        if(this.date>=this.leftDate){

        }else{
          this.date=this.getStartDate(this.date,-1)
          this.$emit('input', this.date)
          this.$emit('on-change', this.date)
        }
      },
      onChooseDate(){
        this.$emit('on-choose-date',this.date)
      },
      getToday(){
        let now = new Date();
        return tool.dateFormat(now, 'yyyy-MM-dd');
      },
      getStartDate(date,day){
        let now = new Date(date);
        now.setDate(now.getDate()-day)
        return tool.dateFormat(now, 'yyyy-MM-dd');
      },
    }
  }
</script>
<style scoped>
  .choose-date-bar{
    background: #fff;
    width: 100%;
    text-align: center;
    overflow: hidden;
    display: flex;
    box-sizing: border-box;
    border-bottom:1px solid #F4F4F4;
  }
  .day{
    line-height: 40px;
    color: #999999;
    padding: 5px 16px;
    font-size: 14px;
  }
  .pre-day{
    float: left;
  }
  .next-day{
    float: right;
  }
  .choose-date-box{
    padding: 5px 16px;
    display: inline-block;
    line-height: 1.4;
  }
  .choose-date-box:active{
    background: #EDEDED;
  }
  .choose-date{
    flex: 1;
  }
  .choose-date-label{
    color: #999999;
    font-size: 13px;
  }
  .choose-date-date{
    color: #333333;
    font-size: 16px;
  }
  .arrow:after{
    content: " ";
    display: inline-block;
    height: 8px;
    width: 8px;
    border-width: 2px 2px 0 0;
    border-color: #bbb;
    border-style: solid;
  }
  .arrow-left:after{
    transform: rotate(-135deg);
  }
  .arrow-right:after{
    transform: rotate(45deg);
  }
  .day:active{
    background: #EDEDED;
  }
  .day.disable .arrow:after{
    border-color: #EDEDED;
  }
  .day.disable:active{
    background: #fff;
  }
  .day.disable{
    color: #EDEDED;
  }
  .choose-date-date img{
    height: 0.5em;
    margin-left: 5px;
    vertical-align: middle;
  }
</style>
