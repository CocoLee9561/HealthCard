<template>
  <div class="my-switch" :class="{'my-switch-on' : val==activeValue}"  :value="value"  @click.stop="toggle">
    <div v-if='val!=activeValue' class="weui-div-1">{{defaultText}}</div>
    <div v-if='val==activeValue' class="weui-div-2">{{activeText}}</div>
  </div>
</template>
<script>

  export default {
    name:'MySwitch',
    computed: {

    },
    created() {

    },
    props: {
      value:{
        default:false,
      },
      'activeValue':{
        default:true
      },
      'defaultValue':{
        default:false
      },
      'activeText': {
        type:String,
        default:''
      },
      'defaultText':{
        type:String,
        default:''
      },
      'activeColor':{
        type:String,
        default:'#04BE02'
      }
    },
    data() {
      return {
        val:this.value
      }
    },
    methods: {
      toggle(){
        this.val=(this.val==this.activeValue)?this.defaultValue:this.activeValue
        this.$emit('input', this.val)
        this.$emit('changeSwitch', this.val);
      }
    }
  }
</script>
<style scoped>
  .my-switch{
    position:relative;
    font-weight: bold;
    cursor:pointer;
    height: 32px;
    min-width: 60px;
    background: #DFDFDF;
    border: 1px solid #DFDFDF;
    box-sizing: border-box;
    border-radius: 16px;
    transition: background-color 0.1s, border 0.1s;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select:none;
  }
  .my-switch-on{
    border-color: #F2DC37;
    background-color: #F2DC37;
  }
  .weui-div-2{
    margin-left:10px;
    line-height:30px;
    font-size:12px;
    color: #333333;
    margin-right: 35px;
  }
  .weui-div-1{
    margin-right:10px;
    line-height:30px;
    font-size:12px;
    color: #999999;
    margin-left: 35px;
  }
  .my-switch:after{
    content: " ";
    position: absolute;
    background: #fff;
    top: 0;
    left: 0;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    z-index: 101;
    transition: 5s;
  }
  .my-switch-on:after {
    left: auto;
    right: 0px;
  }
</style>
