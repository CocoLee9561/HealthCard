<template>

  <group :gutter="10">
    <div class="pay-form-title line-bottom">请选择支付方式</div>
    <div class="method-box">
      <cell @click.native="selectedMethod(method)" v-for="(method, index) in payMethodList" :key="index"
            :class="['pay-button',{selected:method.selected}]">
        <img src="@icon/payment/icon_selected@2x.png" width="18" v-show="method.selected"/>
        <img slot="icon" :src="method.icon" width="22" height="22" class="pay-icon">
        <span class="pay-type-name" slot="title">
          {{method.name}}
          <span class="allbalance-text" v-if="method.type==4">
            剩余<span class="allbalance-money">￥{{totalBalance}}</span>
          </span>
        </span>
      </cell>
    </div>
  </group>


</template>

<script>
import {mapGetters} from 'vuex'
  /**
   * @props payMethods : Array  支付方式对象数组
   * @event selected : 选择支付方式时触发，会把被选择的支付方式对象作为参数传出来
   */
  export default {
    name: "PayMethod",
    props: {
      payMethods: {
        type: Array,
        default: []
      },
      funKey:''
    },
    computed:{
      ...mapGetters(["totalBalance"]),
      cardInfo: function () {
        return this.$store.state.selectedCards[this.funKey];
      },
    },
    data: function () {
      let payMethodList = this.payMethods.filter(function (method) {
        return method;
      });
      return {
        payMethodList: payMethodList,
      };
    },
    mounted: function () {

      shareInst.pm = this;

//      let defaultMethod = this.payMethodList.find(function (method) {
//        return method.selected;
//      });
//
//      if (defaultMethod) {
//        this.selectedMethod(defaultMethod);
//      }
      if(this.payMethodList.length==1){
        this.selectedMethod(this.payMethodList[0]);
      }else{
        this.selectedMethod({});
      }
    },
    methods: {
      selectedMethod: function (methodInfo) {
        let payMethodList = this.payMethodList;
        payMethodList.forEach(function (method) {
          method.selected = method.type == methodInfo.type;
        });

        this.payMethodList = [...payMethodList];
        this.$emit("selected", methodInfo);
      }
    }
  }
</script>

<style lang="scss" scoped>

  .pay-form-title {
    padding: 10px 16px;
    font-size: 14px;
    color: $subtitle-color;
  }

  .method-box {
    width: 100%;

    .pay-button {
      /*filter: grayscale(1);*/
      padding: 10px 16px;

      .pay-type-name{
        color: $fontColor;

        .allbalance-text{
          text-align: end;
          padding-left: 5px;
          color: $subtitle-color;
          .allbalance-money{
            color: #ff9c00;
          }
        }

      }
      .pay-icon {
        margin-right: 10px;
      }
    }

    .selected {
      /*border-width: 3px;*/
      filter: none;
    }

    .icon {
      width: 22px;
    }

  }
  .allbalance{
    font-size:0.8rem;
    color: red;
    text-align: end;
  }

</style>
