<template>
  <div>
    <div class="flex-box" :value="value">
      <div class="flex-tab-bar">
        <div class="flex-item" v-for="(item,index) in tabList" :key="index">
          <div @click="clickTab(index+1)" :class="{'selected':currTab==1}">
            {{item}}
            <img src="@icon/drop_down_press.png" v-if="currTab==(index+1)">
            <img src="@icon/drop_down_default.png" v-else>
          </div>
        </div>
      </div>
      <transition name='opera'>
        <a class="popup-bg" v-show="currTab!=''" @click="popupClick"></a>
      </transition>
      <transition name="slide">
        <div class="popup-content" v-show="currTab!=''">
          <slot name="content"></slot>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>

  export default {
    name:'popup-tab',
    computed: {

    },
    created() {

    },
    props:{
      value:{
        default:'',
      },
      tabList:{
        default:['就诊人','卡类型']
      }
    },
    watch:{
      value:function(val){
        this.currTab=val
      }
    },
    data() {
      return {
        currTab:''
      }
    },
    methods: {
      clickTab(flag){
        if(this.currTab==flag){
          this.currTab=''
          return;
        }
        this.currTab=flag
        this.$emit('input', this.currTab)
        this.$emit('tab-change', this.val);
      },
      popupClick(e){
        this.currTab=''
      },
    }
  }
</script>
<style scoped>
  .flex-box{
    pointer-events: none;
    position: absolute;
    width:100%;
    height: 100%;
    overflow: hidden;
    z-index: 905;
  }
  .flex-tab-bar{
    pointer-events: auto;
    overflow: hidden;
    background: white;
    position: relative;
    z-index: 903;
  }
  .flex-item{
    float: left;
    padding: 10px;
    box-sizing: border-box;
    width: 50%;
    color: #343434;
    text-align: center;
  }
  .flex-item img{
    vertical-align: middle;
    width: 10px;
  }
  .flex-item .selected{
    color: #4768AB;
  }
  .popup-bg{
    pointer-events: auto;
    background: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 900;
  }
  .popup-content{
    border-top: 1px solid #D9D9D9;
    pointer-events: auto;
    position: relative;
    z-index: 901;
    max-height: 300px;
    overflow-y: auto;
  }
  .opera-enter-active, .opera-leave-active {
    opacity:1;
    transition-duration:400ms
  }
  .opera-enter, .opera-leave-to{
    opacity: 0;
  }

  .slide-enter-active, .slide-leave-active {
    top:0;
    transition-duration: 300ms
  }
  .slide-enter, .slide-leave-to{
    top:-100%;
  }
</style>
