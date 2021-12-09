<template>
<div class="page">
  <view-box>
    <x-header slot="header">核酸检验</x-header>
    <change-patient :realname="selectedMember.realname" :cardno="cardInfo.cardno"
                      :to="changePatientTo"></change-patient>
    <div class="content">
      <div v-if="natList&&natList.length>0">
        <group :gutter="10">
          <div class="nat-title line-bottom">核酸检验预约</div>
          <cell v-for="(item,index) in natList" :key="index" :title="item.natName">
            <div v-if="natInfo.isPay=='1'" class="price-text">￥{{item.price}}</div>
          </cell>
        </group>
        <pay-method v-if="natInfo.isToResult!='1'&&natInfo.isPay=='1'" :funKey="funKey" :payMethods="allowPayMethods" @selected="selectedPayMethod"></pay-method>
        <div class="matter-box" v-if="natInfo.matter">
          <div class="matter-title">预约注意事项</div>
          <div class="matter-content" v-html="natInfo.matter"></div>
        </div>
      </div>
      <div v-else>
        <div class="vux-center empty-page" style="height: 500px;">
          暂无预约信息
        </div>
      </div>
    </div>
    <footer slot="bottom" v-if="this.hospitalInfo.hospitalcode!='18451'">
      <div v-if="natInfo.isToResult!='1'" @click="register" class="bottom-button"><strong>预约</strong><span v-if="natInfo.isPay=='1'">(￥{{totalFee}})</span></div>
      <div v-else class="bottom-button" @click="toResult">预约结果</div>
    </footer>
    <footer slot="bottom" v-if="this.hospitalInfo.hospitalcode=='18451'">
      <div v-if="natInfo.isToResult!='1'" @click="register" class="bottom-button"><strong>缴费</strong><span v-if="natInfo.isPay=='1'">(￥{{totalFee}})</span></div>
      <div v-else class="bottom-button" @click="toResult">预约结果</div>
    </footer>
    <!-- <footer slot="bottom" @click="register"  class="bottom-button">预约<span v-if="natInfo.isPay=='1'">(￥{{totalFee}})</span></footer> -->
  </view-box>
</div>
</template>

<script>
import {mapActions,mapState,mapGetters} from "vuex";
import { dateFormat } from 'vux'
import ChangePatient from "../../components/ChangePatient";
export default {
  computed: {
    ...mapState({
      selectedMember: state => state.selectedMember,
      hospitalInfo: state => state.hospital.current,
      natList:state => state.natList,
      natInfo:state => state.natInfo
    }),
    ...mapGetters(["allowPayMethods", "totalBalance"]),
    cardInfo: function () {
      return this.$store.state.selectedCards[this.funKey];
    },
    funKey: function () {
      return this.$routeData.funKey
    },
    totalFee(){
      return this.natInfo.totalFee
    },
    ids(){
      let ids = '';
      this.natList.forEach(item => {
        ids = ids+item.natId+','
      });
      if(ids){
        ids = ids.substring(0,ids.length-1);
      }
      return ids;
    },
    codes(){
      let codes = '';
      this.natList.forEach(item => {
        codes = codes+(item.natCode||'')+','
      });
      if(codes){
        codes = codes.substring(0,codes.length-1);
      }
      return codes;
    },

    changePatientTo() {
      return {
        name: "MemberList",
        query: {
          funKey: this.funKey,
          title: "核酸检验",
          hideBack: false,
          prompt: "您要为谁预约核酸检验？",
          to: JSON.stringify({
            name: "SelectCardPage",
            query: {
              funKey: this.funKey,
              title: "核酸检验",
              to: -2
            }
          })

        },
      }
    },
  },
  components: {
    ChangePatient
  },

  data(){
    return {
      payMethod:{}
    }
  },
  mounted () {
    let hsCode = this.hospitalInfo.hospitalcode
    if (hsCode === '18451') {
      // if (!document.cookie.includes('ck=')) {
        this.$vux.alert.show({
          title: '注意事项',
          content: '<div style="text-align:left"><p><span><span>1.自助开具新冠病毒核酸检测目前仅对无新冠流行病学史、发热、呼吸道症状的患者及普通人群开放。<br />2.近期从中高风险地区返犍人员请到发热门诊就诊。<br />3.检测当日不能在线取消及退费，如当日需取消请到院进行取消并退费。因疫情防控，为避免退费浪费时间，请慎重选择。<br />4.核酸检测流程：缴费成功后凭缴费记录到核酸采集点完成核酸采集。<br />5.核酸检测时间：上午8:30-12:00，下午13:00-16:30。请合理安排时间，错峰检测。<br />6.新冠核酸检测报告领取时间：<br />每天12:00前采样标本，15:30-16:00左右取报告；<br />每天13:00后采样标本，第二天或者当晚21点以后取报告。<br />若无需取报告，可登录天府健康通小程序在线查询结果。<br /></span></span></p></div>',
          onShow () {
            console.log('Plugin: I\'m showing')
            this.$vux.alert.isVisible()
          },
          onHide () {
            console.log('Plugin: I\'m hiding')
            this.$vux.alert.hide()
          }
        })
        // 一个小时缓存
        // this.$cookies.set('ck', 'yes', 3600)
      // }
    }
  },
  created () {
    this.reqNatItemList({
      riid:this.selectedMember.riid,
      cardno:this.cardInfo.cardno,
      hospitalcode: this.hospitalInfo.hospitalcode
    })
  },
  methods:{
    ...mapActions(["reqNatItemList","reqNatItemSub","reqNatItemSign","reqNatItemSignList"]),
    selectedPayMethod(payMethod) {
      this.payMethod = payMethod
    },
    register(){
      if(this.natInfo.isPay == '1' ){
        this.toPay();
      }else{
        this.toRegister();
      }

    },
    toResult(){
      this.reqNatItemSignList({
        riid:this.selectedMember.riid,
        cardno:this.cardInfo.cardno,
        hospitalcode: this.hospitalInfo.hospitalcode,
        natId:this.ids,
        natCode:this.codes||''
      }).then((res)=>{
        shareInst.client.push({
          path: 'nucleicInscpetResult'
        })
      })
    },
    toPay(){
      if (!this.payMethod.type) {
        this.$vux.alert.show({
          title: '提示',
          content: '请选择支付方式',
          onShow() {
          },
          onHide() {
          }
        })
        return;
      }
      if (this.payMethod.type == 4) {
        if (parseFloat(this.totalFee) > parseFloat(this.totalBalance)) {
          let self=this
          let diffMoney = parseFloat(this.totalBalance) - parseFloat(this.totalFee)
          diffMoney = Math.abs(diffMoney)
          this.$vux.confirm.show({
            title: '提示',
            content: '就诊卡余额不足，请前往充值！',
            onConfirm() {
              shareInst.client.push({path: '/PayForm', query: {funKey: self.funKey, routeName: 'nucleicInscpet',diffMoney:diffMoney}})
            }
          })
          return;
        }
      }
      this.reqNatItemSign({
        riid:this.selectedMember.riid,
        cardno:this.cardInfo.cardno,
        cardtype:this.cardInfo.cardtype,
        hospitalcode: this.hospitalInfo.hospitalcode,
        itemid:this.ids,
        hospitalfee:this.totalFee,
        thirdpayfee:this.totalFee,
        paytype:this.payMethod.type
      }).then((res)=>{
        if(res.signresult==0) {
          let payInfo = {
            riid:this.selectedMember.riid,
            title:'核酸检验',
            orderNo: res.orderNo,
            cardNo: this.cardInfo.cardno,
            cardType:this.cardInfo.cardtype,
            hospitalcode:this.hospitalInfo.hospitalcode,
            pkregHospitalId:this.hospitalInfo.pkregHospitalId,
            regPayType: this.payMethod.type,
            payTypeName: this.payMethod.name,
            routeName: 'nucleicInscpet',
            memberName: this.selectedMember.realname,
            ids:this.ids,
            codes:this.codes||''
          }
          localStorage.setItem("pay-info", JSON.stringify(payInfo));

          res.payType = this.payMethod.type;
          res.nextLocation = {
            path: "/confirmLoading"
          };
          shareInst.client.payment(res).then((res) => {
            if (shareInst.client.isWeChat()) {
              shareInst.client.push({
                path: '/confirmLoading'
              })
            }
          });
        }else{
          this.$vux.alert.show({
            title:res.bstitle,
            content:res.bsmessage
          })
        }
      })
    },
    toRegister(){
      this.reqNatItemSub({
        riid:this.selectedMember.riid,
        cardno:this.cardInfo.cardno,
        hospitalcode: this.hospitalInfo.hospitalcode,
        natId:this.ids,
        natCode:this.codes||''
      }).then((res)=>{
        shareInst.client.push({
          path: 'nucleicInscpetResult'
        })
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
    .nucleic-list{
      .nucleic-item-box{
        margin: 16px;
        box-shadow: 5px 20px 10px #ddd;
        position: relative;
        margin-bottom: 40px;
        .bottom-line{
          background-image: url('../../../common/assets/image/sanjiao.png');
          background-size: 17px 20px;
          background-repeat: repeat-x;
          height: 20px;
          position: absolute;
          bottom: -20px;
          left: 0;
          right: 0;
        }
      }
      .nucleic-item{
        background: white;
        padding: 16px;


        .nucleic-item-title{
          font-size: 16px;
          color: #333;
        }
        .nucleic-item-content{
          margin: 16px 0;
          color: #666;
          font-size: 16px;
        }
        .btn-box{
          margin-top: 30px;
          margin-bottom: 15px;
        }
      }
    }
  }

  .matter-box{
    padding: 16px;
    .matter-title{
      color:#FF9C00;
      font-size: 15px;
    }
    .matter-content{
      color: #666;
      margin-top: 5px;
      font-size: 15px;
    }
  }
  .price-text{
    color: #FF4949;
  }
  .bottom-button{
    background: white;
    color: #0000CD;
    height: 50px;
    text-align: center;
    line-height: 50px;
    font-weight: 600;
    font-size: 18px;
    &:active{
      opacity: 0.8;
    }
  }

  .nat-title{
    padding: 10px 16px;
    font-size: 14px;
    color: #999;
    & + .weui-cell::before{
      border: none;
    }
  }
</style>
