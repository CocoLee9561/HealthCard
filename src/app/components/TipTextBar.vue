<template>
  <div class="tip-text-bar">
    <div class="tip-text-bar-icon" v-if="showIcon">
      <img src="@icon/booking/icon_tips.png"/>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>
<script>


  export default {
    name:'tipTextBar',
    props:{
      showIcon:{
        default:true
      }
    },
    computed: {

    },
    created() {

    },
    data() {
      return {}
    },
    methods: {

    }
  }
</script>
<style scoped lang="scss">
  .tip-text-bar{
    padding:10px 16px;
    color: $subtitle-color;
    display: flex;
    font-size: 14px;
    line-height: 1.6;
    .tip-text-bar-icon{
      margin-right: 5px;
      margin-top: -1px;
      img{
        width: 14px;
        height: 14px;
        vertical-align: middle;
      }
    }

  }
</style>
