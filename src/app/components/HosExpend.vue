<template>
  <div class="component">
    <div class="item-header line-top" @click='expendAction(item)'>
      <span class="item-name">{{item.itemname||''}}</span>
      <div class="item-money">
        <span>￥{{toThousands(item.itemmoney)}}</span>
        <x-icon class="arrow" v-if="isfold" type="ios-arrow-down" size="20"></x-icon>
        <x-icon class="arrow" v-if="!isfold" type="ios-arrow-up" size="20"></x-icon>
      </div>
    </div>
    <div class="item-detail" v-if="!isfold">
      <div class="item-cell vux-center">
        <span>单据号</span> <span>{{item.rcptno}}</span>
      </div>
      <div class="item-cell vux-center">
        <span>名称</span> <span>{{item.pitemName||item.itemname||''}}</span>
      </div>
      <div class="item-cell vux-center">
        <span>单位</span> <span>{{item.unit}}</span>
      </div>
      <div class="item-cell vux-center">
        <span>单价</span> <span>￥{{toThousands(item.price)}}</span>
      </div>
      <div class="item-cell vux-center">
        <span>数量</span> <span>{{item.numcount}}</span>
      </div>
      <div class="item-cell vux-center">
        <span>优惠金额</span> <span>￥{{toThousands(item.saleprice)}}</span>
      </div>
      <div class="item-cell vux-center">
        <span>金额</span> <span>￥{{toThousands(item.itemmoney)}}</span>
      </div>
      <div class="item-cell vux-center">
        <span>就诊日期</span> <span>{{item.date}}</span>
      </div>
    </div>
  </div>

</template>

<script>

  export default {
    name: 'HosExpend',
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
      },
      toThousands(num){
        num = parseFloat(num).toFixed(2);
        return (num || 0.00).toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
      },
    },
    watch: {
      item(val, oldval) {

      }
    }

  }

</script>

<style scoped lang="scss">
  .item-header {
    padding: 10px 16px;
    overflow: auto;
    background-color: white;
    display: flex;
  }
  .item-header .item-name{
    flex:1;
    margin-right: 10px;
    color: $fontColor;
    font-size:14px;
  }

  .item-header .item-money{
    display: flex;
    align-items: center;
    color: $fontColor;
  }

  .item-header span:first-child {

  }

  .item-detail {
    padding: 10px 16px;
    background-color: #f1f8fd;
  }

  .item-cell {
    padding-right: 5px;
    display: flex;
    padding-top: 1px;
    padding-bottom: 1px;
    overflow: hidden;
  }

  .item-cell span:first-child {
    color: $valueColor;
    text-align: right;
    font-size: 14px;

  }

  .item-cell span:last-child {
    margin-left: 15px;
    color: $subtitle-color;
    font-size: 14px;
    float: right;
    text-align: right;
    flex: 1;
  }
  .arrow{
    fill:#D5D5D5;
    float:right;
    margin-right: -4px;
    vertical-align: middle;
  }
</style>
