<template>
  <div class="page">
    <view-box>
      <x-header :left-options="{preventGoBack:true}" @on-click-back="backHandle" slot="header">手机验证</x-header>
      
      <div style="margin-top: 0px;">
        <div style="width:100%;text-align: center;opacity: 0.5;">
          <img style="width:50%" src="@icon/hospital/hospital.png">
        </div>
        <div class="login-input-bar">
          <img src="@icon/user.png">
          <input @keyup="mobileInputChange" v-model="phone" placeholder="请输入手机号码" style="width: 150px;"/>
          <span class="phone-error-tip" v-if="phone.length>=11&&!isPoneAvailable(phone)">手机号码格式有误</span>
        </div>
        <div class="line-horizontal" v-show="isShowSms"></div>
        <div class="login-input-bar" v-show="isShowSms">
          <img src="@icon/coded.png">
          <input maxlength="4" @keyup="codeInputChange" v-model="emsCode" placeholder="请输入短信验证码" style="width: 150px;"/>
          <x-button :disabled="(btnFlag)||(!checkOk)||(countdown>0)" v-if="showCodeBtn" type="primary" mini size="small" class=" own-btn login-get-emscode-btn"
                     @click.native="getEmsCode()">{{ btnText }}
          </x-button>
        </div>
      </div>
      <div style="padding: 0px 20px;">
        <x-button type="primary" size="large" :disabled="loginBtnFlag" class="own-btn" style="margin-top: 20px;" @click.native="login">确定
        </x-button>
        <div style="margin-top: 20px;" class="login-tip-bar" v-if="false">
          <check-icon :value.sync="checkOk">点击"确定"即表示您同意XXXXX</check-icon>
          <span @click="toFwtk" class="login-fwtk"> 服务条款</span>
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>

  import {getverificationcode, loginorregister} from '@network/Api'
  import des from '@common/libs/des'
  import {mapActions, mapState} from 'vuex'
  import {CheckIcon} from 'vux'
  export default {
    components: {
//      Button
      CheckIcon
    },
    created() {
      if(this.isShowSms){
        this.emsCode='';
      }else{
        this.emsCode='0000';
      }
    },
    computed:{
      ...mapState({
        hospitalInfo: state => state.hospital.current,
      }),
      loginBtnFlag:function(){
        return !(this.checkOk && this.isPoneAvailable(this.phone) && this.emsCode&&this.emsCode.length==4)
      },
      isShowSms(){
        let isSms = (this.hospitalInfo.isVerification&&this.hospitalInfo.isVerification==1)?true:false
        if(isSms){
          this.emsCode='';
        }else{
          this.emsCode='0000';
        }
        return isSms
      }
    },
    data() {
      return {
        phone: '',
        emsCode: '0000',
        btnText: '获取验证码',
        btnFlag: false,
//        loginBtnFlag: true,
        checkOk: true,
        showCodeBtn: false,
        countdown:0
      }
    },
    watch: {
      phone: function (val, oldVal) {
        if (this.isPoneAvailable(val)) {
          this.showCodeBtn = true
          this.btnFlag=false
        }else{
          this.btnFlag=true
        }
      },
    },
    methods: {
      backHandle:function(event){

        if (this.$routeData.redirect){
          this.$router.go(-2);
        }else {
          this.$router.back()
        }

      },
      codeInputChange(){
        this.emsCode = this.emsCode.replace(/^0*(0\.|[1-9])/, '$1');//解决 粘贴不生效
//        this.money = this.money.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
        this.emsCode = this.emsCode.replace(/[^\d]/g,"");  //清除“数字”以外的字符  只能整数
      },
      getEmsCode() {
        this.btnFlag = true
//        let a=tool.encrypt(this.phone);
//        console.log(a)
//        let mobile=tool.base64(a)
        let mobile = des.strEnc(this.phone, 'weixin', 'development', 'stefan')
//        getverificationcode({
//          mobile:mobile
//        }).then(function(res){
//          localStorage.setItem('uid',res.data.uid);
//          localStorage.setItem('token',res.data.token);
//        })
        this.sendVerificationCode(mobile).then((res)=>{
          this.countdown=59
          this.btnText = '重发(60)'
          this.reBtn()
        })
      },
      reBtn() {
        let self = this
        var timer = setTimeout(() => {
          if (this.countdown == 0) {
            self.btnText = '获取验证码'
            self.btnFlag = false
          } else {
            self.btnText = '重发(' + this.countdown + ')';
            this.countdown--;
            this.reBtn()
          }
        }, 1000);
      },
      isPoneAvailable(str) {
        var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        if (!myreg.test(str)) {
          return false;
        } else {
          return true;
        }
      },
      login() {

//        loginorregister({
//          mobile:this.phone,
//          identifycode:this.emsCode
//        }).then(function(res){
//
//        })
        this.logIn({mobile: this.phone, identifycode: this.emsCode}).then((res) => {
          shareInst.client.go(-1);
        });

      },
      mobileInputChange(val){
        this.phone = this.phone.replace(/^0*(0\.|[1-9])/, '$1');//解决 粘贴不生效
//        this.money = this.money.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
        this.phone = this.phone.replace(/[^\d]/g,"");  //清除“数字”以外的字符  只能整数
      },
      toFwtk() {
        shareInst.client.push({path: '/'});
      },
      ...mapActions(['logIn', 'sendVerificationCode'])
    }
  }

</script>
<style scoped>
  .login-input-bar {
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    padding: 10px 10px;
    line-height: 1;
    vertical-align: middle;
  }

  .login-input-bar input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius: 0;
    border: 0;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    outline: 0;
    line-height: 1.6;
    font-size: inherit;
    /*vertical-align: super;*/
  }

  .login-input-bar input:focus {
    border: 0px solid #000;
  }
  .login-input-bar input::placeholder{
    color: #cacaca;
  }
  .login-input-bar img {
    width: 18px;
    height: 18px;
    margin-right: 10px;
    vertical-align: middle;
  }

  .line-horizontal {
    width: 100%;
    height: 1px;
    background: #F5F5F5;
  }

  .login-get-emscode-btn {
    margin: 0px;
    vertical-align: super;
    float: right;
    height: 27px;
  }

  .login-tip-bar {
    font-size: 14px;
  }

  .login-tip-span {
    color: #333;
  }

  .login-tip-bar a {
    color: blue;
  }
  .phone-error-tip{
    float: right;
    display: block;
    color:#E6AB5D;
    margin-top: 5px;
  }
</style>
