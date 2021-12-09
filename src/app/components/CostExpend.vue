<template>
  <div class="component">
    <div class="item-header line-bottom" @click='expendAction(item)'>
      <span class="item-name">{{item.itemname||'--'}}</span>
      <div class="item-money">
        <span style="margin-right:5px;color:#f43530;font-size:14px;"><!--￥{{item.amount||'&#45;&#45;'}}--></span>
        <x-icon style="fill:#999;margin-top:-2px;" v-if="isfold" type="ios-arrow-down" size="25"></x-icon>
        <x-icon style="fill:#999;margin-top:-2px;" v-if="!isfold" type="ios-arrow-up" size="25"></x-icon>
      </div>
    </div>
    <div class="item-detail line-bottom" v-if="!isfold">

      <div class="item-cell">
        <span>名称</span> <span>{{item.itemname||'--'}}</span>
      </div>
      <div class="item-cell">
        <span>数量</span> <span>{{item.quantity||'--'}}</span>
      </div>
      <div class="item-cell">
        <span>单位</span> <span>{{item.unit||'--'}}</span>
      </div>
<!--      <div class="item-cell">
        <span>单价</span> <span>￥{{item.itemprice||'&#45;&#45;'}}</span>
      </div>-->
    </div>
  </div>

</template>

<script>

  export default {
    name: 'CostExpend',
    data() {
      return {
        isfold: true
      }
    },
    created() {

    },
    props: {
      item: Object
    },
    methods: {
      expendAction(item) {
        this.isfold = !this.isfold;
        this.$emit('expendAction', item);
      }
    },
    watch: {
      item(val, oldval) {
        console.log(val.isfold)
      }
    }

  }

</script>

<style scoped>
  .item-header {
    padding: 10px 15px;
    overflow: auto;
    background-color: white;
    display: flex;
  }
  .item-header .item-name{
    color:#333;
    font-size:14px;
    flex: 1;
  }

  .item-header .item-money{
    display: flex;
    align-items: center;
  }

  .item-header span:first-child {

  }

  .item-detail {
    padding: 5px 15px;
    background-color: #f3f6fb;
  }

  .item-cell {
    padding-right: 10px;
    display: flex;
    padding-top: 3px;
    padding-bottom: 3px;
    overflow: hidden;
    align-items: center;
  }

  .item-cell span:first-child {
    color: #666;
    text-align: right;
    font-size: 14px;

  }

  .item-cell span:last-child {
    margin-left: 15px;
    color: #333;
    font-size: 14px;
    flex: 1;
  }

</style>
