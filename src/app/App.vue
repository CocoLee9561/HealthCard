<template>
  <!--<transition  name="fade" >-->
  <router-view v-if="isRouterAlive"></router-view>
  <!--</transition>-->
</template>

<script>

  import {mapActions} from 'vuex'

export default {
  name: 'app',
  provide(){
    return {
      reload: this.reload
    }
  },
  data(){
    return{
      isRouterAlive:true
    }
  },
  created(){
    this.getHospitalInfo({});
  },
  methods:{
    ...mapActions(["getHospitalInfo"]),
    hospitalInfo(){

    },
    reload(){
      this.isRouterAlive=false
      this.$nextTick(()=>{
        this.isRouterAlive=true
      })
    }

  }
}
</script>


<style lang="less">
@import '~vux/src/styles/reset.less';
</style>


<style lang="scss">
  html, body {
    background: #F5F5F5;
    height: 100%;
    width: 100%;
    overflow-x: hidden;
  }



  .fade-enter-active, .fade-leave-active {
    transition: transform .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    /*opacity: 0;*/
    transform: translateX(155px);
  }
</style>
