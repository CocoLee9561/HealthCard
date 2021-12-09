<template>
  <div class="page">
    <view-box>
      <x-header slot="header">
        我有话说
        <span slot="right" @click="commit">完成</span>
      </x-header>
      <div class="tip-bar  own-tip-bar">
        <span slot="title">500字不够？加入QQ粉丝群：115732002</span>
      </div>
      <group>
        <x-textarea v-model="value" :rows="5" :max="500"
                    placeholder="亲爱的，我们重视你的想法，如果你的建议被采纳，将会获得我们精心准备的礼物哦"></x-textarea>
      </group>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import {XTextarea} from 'vux'

  export default {
    components: {
      XTextarea
    },
    computed: {
      ...mapState([""]),
    },
    created() {

    },
    data() {
      return {
        value: ''
      }
    },
    methods: {
      ...mapActions([""]),
    }
  }
</script>
<style>
  .own-tip-bar {
    padding: 5px;
    background: #FFF5E4;
    color: #F06A00;
    border-bottom: 0;
    opacity: 0.7;
  }
</style>
