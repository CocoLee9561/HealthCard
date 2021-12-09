<template>
  <div class="page">
      <view-box>
        <x-header slot="header">专家介绍</x-header>
        <iframe frameborder="no" style="width: 100%;height: 100%;" :src="url"></iframe>
      </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    computed: {
      ...mapState({
        hospitalInfo:state=>state.hospital.current
      }),
    },
    created() {
      this.url=`http://${window.location.host}/doctorintro/${this.hospitalInfo.hospitalcode}/index.html?_=${new Date().getTime()}`;
    },
    data() {
      return {
        url:''
      }
    },
    methods: {
      ...mapActions([""]),
    }
  }
</script>
<style>

</style>
