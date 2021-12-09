<template>
<div class="page">
  <view-box>
    <x-header slot="header">预约结果</x-header>
    <div class="result-box">
      <icon v-if="natItem.state==-1" type="warn" is-msg></icon>
      <icon v-else type="success" is-msg></icon>
      <div v-if="!natItem.hospitalcode" class="status-text">{{natItem.message}}</div>
      <div v-if="natItem.hospitalcode" class="status-text">请点击下方[支付费用]按钮进行缴费!</div>
      <div v-if="natItem.invoiceno">
        <span class="booking-result-info-title">发票号:</span>
        <span class="booking-result-info-value">{{natItem.invoiceno}}</span>
      </div>
      <div v-if="natItem.barcode&&natItem.barcode.length>0">
        <barcode v-for="(item,index) in natItem.barcode" :key="index" class="barcode"  :value="item" :options="{ displayValue: true,tag:'img',margin:0,width:48/item.length,height:90 ,fontSize:22}"></barcode>
      </div>

<!--      <div v-if="natItem.yyhbarcode">-->
<!--        <barcode  class="barcode"  :value="natItem.yyhbarcode" :options="{ displayValue: true,tag:'img',margin:0,width:48/natItem.yyhbarcode.length,height:90 ,fontSize:22}"></barcode>-->
<!--      </div>-->

    </div>

    <div class="btn-box">
      <x-button class="own-btn" v-if="natItem.isCancel == '1'" @click.native="cancel">取消预约</x-button>
      <x-button class="own-btn" v-if="natItem.isTopay == '1'" @click.native="toPay">支付费用</x-button>
      <!--<div v-if="natItem.isTopay == '1'">-->
      <div v-if="!natItem.hospitalcode" align="center"><b>预约成功</b></div>
      <div v-if="!natItem.hospitalcode"><br/>请返回掌上医院首页点击<strong>【门诊缴费】</strong>继续完成缴费</div>
      <!--</div>-->
    </div>
  </view-box>
</div>
</template>

<script>
import {mapActions,mapState} from "vuex";
import { dateFormat,Icon  } from 'vux'
import XDialog from 'vux/src/components/x-dialog/index'
export default {
  computed: {
    ...mapState({
      selectedMember: state => state.selectedMember,
      hospitalInfo: state => state.hospital.current,
      natItem:state => state.natItem
    }),
    cardInfo: function () {
      return this.$store.state.selectedCards[this.funKey];
    },
  },
  components: {
    XDialog,
    Icon
  },
  data(){
    return {
      funKey:'HSJY'
    }
  },
  created () {
    this.natItem={
      barcode:'123456789'
    }
  },
  methods:{
    ...mapActions(['reqNatItemCancel']),
    toPay(){
      let payload = {
        funKey:'MZJF',
        card:this.cardInfo
      };
      this.$store.commit("selectCard", payload);
      shareInst.client.push({
        name: "OutpatientList",
        query: {
            funKey: "MZJF"
        }
      })
    },
    cancel(){
      let that = this
      this.$vux.confirm.show({
        title: '取消预约',
        content: '确认取消预约吗？',
        onShow () {

        },
        onHide () {
        },
        onCancel () {
        },
        onConfirm () {
          that.cancelOrder()
        }
      })

    },
    cancelOrder(){
      this.reqNatItemCancel({
        riid:this.selectedMember.riid,
        cardno:this.cardInfo.cardno,
        hospitalcode: this.hospitalInfo.hospitalcode,
        natId:this.natItem.natId,
        sendNo:this.natItem.sendNo
      }).then((res)=>{
        this.$vux.toast.text('取消成功');
        shareInst.client.back();
      })
    },
    formatDate(date){
      return dateFormat(new Date(date),'YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style lang="scss" scoped>

  .page{
    .result-box{
      background: white;
      text-align: center;
      padding: 30px 30px 10px;
      box-sizing: border-box;
      .status-text{
        font-size: 20px;
        margin-top: 16px;
        margin-bottom: 20px;
      }
    }

    .btn-box{
      margin-top:50px;
      padding: 0 20px;
    }
  }
  .barcode{
    width: 100%;
    & + .barcode{
      margin-top: 10px;
    }
  }
</style>
