<template>
  <div class="page">
    <view-box>
      <x-header slot="header">支付测试</x-header>
      <div style="margin: 20px;">
        <checker v-model="payType" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
          <checker-item :value="5">公众号支付</checker-item>
          <checker-item :value="7">微信H5支付</checker-item>
          <checker-item :value="6">支付宝H5支付</checker-item>
        </checker>
      </div>
      <div style="padding: 20px;">
        <x-button class="own-btn" style="margin-top: 100px;" @click.native="pay">支付</x-button>
      </div>

      <div style="padding: 20px;">
        <x-button class="own-btn" @click.native="scan">扫码</x-button>
        <div>{{code}}</div>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import {Checker,CheckerItem} from 'vux'
  import {getTextWeiXinCongfig} from '@network/Api'
  import {weChatConf} from  '@constant.js' ;
  export default {
    computed: {
      ...mapState([""]),
    },
    components:{
      Checker,CheckerItem
    },
    created() {

    },
    data() {
      return {
        payType:'',
        code:''
      }
    },

    methods: {
      ...mapActions(["testPaySign"]),
      pay(){
        this.testPaySign({
          paytype:this.payType
        }).then((res)=>{
          res.payType = this.payType;
          res.nextLocation = {
            path: "/confirmLoading"
          };
          window.shareInst.client.payment(res).then((res) => {

              //this.$vux.alert.show({
              //  title:'支付',
              //  content:'支付完成'
              //})

          });
        })
      },
      scan(){
//        shareInst.client.scanQRCode().then((res)=>{
//          this.code=res.code
//        })

        let url = location.href ;
        this._wxConfig(url);

        let slef=this

        shareInst.wx.ready((res)=>{
          shareInst.wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            success: function (res) {

              let result = {
                code:res.resultStr  // 当needResult 为 1 时，扫码返回的结果
              };
              slef.code=res.resultStr
            },
            fail:function (error) {
              alert('error')
            }
          });
        })


      },
      _wxConfig(currentUrl){

        getTextWeiXinCongfig(currentUrl).then(function (mainData) {

          let {appId:appId,timestamp:timestamp,noncestr:nonceStr,signature:signature} = mainData ;
          let debug = byDebug.wechat ;

          let wxConfig = {
            debug:debug,  // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId:appId,  // 必填，公众号的唯一标识
            timestamp:timestamp,  // 必填，生成签名的时间戳
            nonceStr:nonceStr,  // 必填，生成签名的随机串
            signature:signature,  // 必填，签名
            jsApiList:weChatConf.jsApiList // 必填，需要使用的JS接口列表
          };

          shareInst.wx.config(wxConfig);

        });


      }
    }
  }
</script>
<style scoped>
  .demo1-item{
    padding: 5px 10px;
    border: 1px solid #C9C9C9;
    border-radius: 5px;
  }
  .demo1-item-selected{
    border: 1px solid #0B63BC;
    color: #0B63BC;
  }
</style>
