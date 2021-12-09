<template>
  <view-box body-padding-bottom="0">
    <x-header slot="header"> 来院导航</x-header>

    <iframe id="map" seamless="seamless" :src="mapUrl"></iframe>

  </view-box>

</template>

<script>
  import {mapState,mapActions} from "vuex"


  export default {
    name: "Navigation",
    computed:{
      ...mapState(["hospitalInfo"]),
      mapUrl:function () {
        return `http://uri.amap.com/marker?position=${this.position}&name=${this.hospitalInfo.bsHospitalName}&coordinate=gaode&callnative=0` ;
      },

      position:function () {
        return `${this.hospitalInfo.bsWarp},${this.hospitalInfo.bsWeft}`
      }
    },
    created:function(){
      this.queryRegHospAndDepts();

    },
    methods:{
      ...mapActions(["queryRegHospAndDepts"]),
    }
  }
</script>

<style lang="scss" scoped>

  #map {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }

</style>
