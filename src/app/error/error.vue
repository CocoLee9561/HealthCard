<template>
  <div class="vux-center" style="height:500px;">
    <div v-if="msg.length==0" style="text-align:center;line-height: 80px;">
      系统正在维护中
    </div>
    <div v-else style="text-align:center;line-height: 80px;">
      <img src="@icon/ic_wrong@2x.png" width="50%" alt="系统错误">
      <div style="color:#999999">{{msg}}</div>
    </div>
  </div>
</template>

<script>

  export default {
    computed:{
      msg:function(){
        return this.$routeData.msg||''
      }
    },
    created() {

    },
    data() {
      return {
      }
    }
  }

</script>
