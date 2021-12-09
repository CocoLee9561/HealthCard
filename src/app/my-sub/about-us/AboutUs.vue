<template>
  <div class="page">
    <view-box>
      <x-header slot="header">关于我们</x-header>
      <div>
        <div class="about-top">
          <img src="@icon/img_aboutme@2x.png">
          <div class="gray-text">全流程2.0</div>
          <div>客服电话：<a href="tel:4008557995">4008557995</a></div>
        </div>
        <div class="about-bottom">
          <div>深圳巨鼎医疗设备有限公司 版权所有</div>
          <div>Copyright@2018 JuDing Inc.</div>
          <div>All Rights Reserved</div>
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    computed: {
      ...mapState([""]),
    },
    created() {

    },
    data() {
      return {}
    },
    methods: {
      ...mapActions([""]),
    }
  }
</script>
<style scoped>
  .about-top {
    text-align: center;
    margin-top: 50px;
  }

  .about-top img {
    width: 30%;
  }

  .about-top div {
    line-height: 2;
  }

  .gray-text {
    color: #bbb;
  }

  .about-bottom {
    position: absolute;
    bottom: 50px;
    text-align: center;
    width: 100%;
    color: #bbb;
    font-size: 12px;
    line-height: 2;
  }
</style>
