<template>
  <div class="page">
    <view-box>
      <x-header slot="header">我的就诊卡</x-header>
      <div>
        <div class="barcode-image-box">
          <!--<img :src="barcardurl" style="width: 100%;">-->
          <barcode style="width: 90%;" :value="selectedCard.cardno" :options="{ displayValue: true,tag:'img',margin:0,width:5,height:140 ,fontSize:30}"></barcode>
          <vue-qr class="qr-box"  :text="barCodeText" :margin="16"></vue-qr> <!--:logoSrc="require('@icon/img_aboutme@2x.png')"-->
        </div>
        <group>
          <cell>
            <span slot="title">卡类型</span>
            <span>{{selectedCard.cardname}}</span>
          </cell>
        </group>
        <group>
          <cell>
            <span slot="title">就诊人</span>
            <span>{{selectedCard.realname}}</span>
          </cell>
          <cell v-if="selectedCard.cardtype==1||selectedCard.cardtype==5||selectedCard.cardtype==7||selectedCard.cardtype==8">
            <span slot="title">就诊医院</span>
            <span>{{selectedCard.hospitalname}}</span>
          </cell>
          <cell v-if="selectedCard.cardtype==2||selectedCard.cardtype==3||selectedCard.cardtype==4">
            <span slot="title">地区</span>
            <span>{{selectedCard.regionname}}</span>
          </cell>
          <x-input v-model="cardNo" text-align="right" :max="20" :disabled="!canEdit()" @on-change="cardNoInputChange" :required="true" placeholder="请在此输入卡号">
            <span slot="label">卡号</span>
          </x-input>
        </group>
        <div class="btn-box">
          <x-button class="own-btn" :disabled="!saveBtnFlag" @click.native="savecard()">确定</x-button>
          <x-button class="del-btn" v-if="canEdit()" @click.native="onDeleteCard()">删除此卡</x-button>
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import VueQr from 'vue-qr'
  export default {
    computed: {
      ...mapState({
        selectedCard:state=>state.selectedCard,
        hospitalInfo:state=>state.hospital.current
      }),
      barcardurl:function(){
        let host=location.host
        if(host.startsWith('localhost')){
          host='blb-weixintest.clearofchina.com'
        }
//        blb-weixintest.clearofchina.com/api/barcode/getbarcodeimage?uid=-1&ticket=-1&barcode=19594591&type=0
        return 'http://'+host+'/api/barcode/getbarcodeimage?uid=-1&ticket=-1&barcode='+this.selectedCard.cardno+'&type=0'
      }
    },
    components:{
      VueQr
    },
    created() {
      this.cardNo=this.selectedCard.cardno
      this.freshenBarCodeText();
    },
    beforeDestroy(){
      if(this.timer!=''){
        clearInterval(this.timer);
      }
    },
    data() {
      return {
        cardNo:'',
        saveBtnFlag:false,
        barCodeText:'',
        timer:''
      }
    },
    methods: {
      ...mapActions(["deleteCard","saveCard"]),
      freshenBarCodeText(){
        if(this.hospitalInfo.qrcodeAutoRefresh==1){
          this.barCodeText=new Date().getTime()+'^o^'+this.selectedCard.cardno
          this.timer = setInterval(()=>{
            this.barCodeText=new Date().getTime()+'^o^'+this.selectedCard.cardno
          }, 15000);
        }else{
          this.barCodeText=this.selectedCard.qrCode
        }
      },
      canEdit(){
        let result = this.selectedCard.cardtype!=6&&this.selectedCard.cardtype!=7&&this.selectedCard.cardtype!=8
        return result
      },
      cardNoInputChange(){
        this.$nextTick(()=>{
          if(this.selectedCard.cardno==this.cardNo){
            this.saveBtnFlag=false
            return;
          }
          if(this.canEdit()){
            this.saveBtnFlag=true
            if(this.cardNo.length>20){
              this.cardNo = this.cardNo.substring(0,20)
            }
            this.cardNo=this.cardNo.replace(/[^0-9a-zA-Z]/g,"");
          }
        })
      },
      savecard() {
        if(this.cardNo==''){
          this.$vux.toast.show({type:'text',text:'请输入卡号'})
          return;
        }
        this.saveCard({
          riid: this.selectedCard.riid,
          realname: this.selectedCard.realname,
          cardtype: this.selectedCard.cardtype,
          cardno: this.cardNo,
          hospitalcode: this.selectedCard.hospitalcode,
          hospitalname: this.selectedCard.hospitalname,
          areaid: this.selectedCard.regionid,
          pkcard: this.selectedCard.id
        }).then((res) => {
          if(!data.result){
            this.$vux.alert.show({
              title: '提示',
              content:data.msg||"业务请求失败",
              onShow () {

              },
              onHide () {

              }
            })
            return;
          }
          this.$vux.toast.text('编辑卡成功')
          shareInst.client.back();
        });
      },
      deletecard() {
        this.deleteCard({
          riid: this.selectedCard.riid,
          pkcard: this.selectedCard.id
        }).then((res) => {
          this.$vux.toast.show({type:'text',text:'删除卡成功'})
          shareInst.client.back();
        })
      },
      onDeleteCard() {
        let self=this
        this.$vux.confirm.show({
          title:'删除卡',
          content: '你确定要删除此卡吗？',
          confirmText:'删除',
          cancelText:'取消',
          onCancel () {
          },
          onConfirm () {
            self.deletecard()
          }
        })
      },
    }
  }
</script>
<style scoped>
  .qr-box > img{
    width: 60% !important;
  }
  .btn-box{
    padding: 20px;
  }
  .del-btn{
    color: red;
  }
  .barcode-image-box{
    text-align: center;
    padding: 20px 0px 0px;
    background: white;
  }

</style>
