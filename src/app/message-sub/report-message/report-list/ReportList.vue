<template>
  <div class="page">
    <view-box>
      <x-header slot="header">报告</x-header>
      <div class="list" v-if="reportMessageList.length>0">
        <cell class="item" v-for="(item,index) in reportMessageList" :key="index" is-link
              @click.native="selectReportHandle(item)">
          <p class="title" slot="title">{{item.pitemname}}
          </p>

          <p slot="inline-desc" class="desc">
            <span class="key">报告时间</span>
            <span class="value">{{item.resultdate}}</span>
          </p>
          <p class="state">已完成</p>
        </cell>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    computed: {
      ...mapState(["reportMessageList"]),
      key:function(){
        return this.$routeData.key
      }
    },
    created() {
      this.getReportData({key: this.key})
    },
    data() {
      return {}
    },
    methods: {
      ...mapActions(["getReportData"]),
      selectReportHandle(item){
        this.$store.commit('updateReportMessageDetail',item)
        shareInst.client.push({
          path:'/message/reportDetail'
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .list {

    .weui-cells {
      background-color: #f4f4f4;
    }

    .item {
      background-color: #fff;
      font-size: 16px;
      margin-top: 14px;

      &::before {
        border-style: none;
      }


      .title {
        color: #333333;
      }

      .desc {
        margin-top: 5px;
        color: #333333;
        .key{
          margin-right: 20px;
        }
      }

      .state {
        color:#4b6baf;
      }


    }

    .prompt {
      background-color: #4ec7ff ;
      color:#fff ;
    }
  }

</style>
