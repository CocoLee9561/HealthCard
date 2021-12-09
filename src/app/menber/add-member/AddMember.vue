<template>
  <div class="page">
    <view-box>
      <x-header slot="header">添加就诊人</x-header>
      <div class="page-content">
        <tab v-model="selected" v-if="disChild&&needRemain" class="own-tab">
          <tab-item>成年人</tab-item>
          <tab-item>儿童/老人</tab-item>
        </tab>
        <!-- tab-container -->
        <div class="own-addmember-info-wrap">
          <div v-if="selected==0" key="成年人">
            <group gutter="0">
              <x-input @on-change="nameInputChange" text-align="right" :max="20" :show-clear="false" :required="true"
                       placeholder="请在此输入姓名"
                       v-model="name">
                <span slot="label">姓名<span class="title-desc">（必填）</span></span>
              </x-input>



              <popup-radio title="关系" class="my-picker" :options="contacts" v-model="contact"></popup-radio>
              <popup-radio v-if="isShowSex" title="性别" class="my-picker" :options="consexes" v-model="consex"></popup-radio>

              <cell v-if="isShowType" title="证件类型" value="cardType" is-link v-model="cardType" @click.native="chooseCardType"></cell>

              <x-input v-show="this.cardTypeKey != 5" id="zhengjian" @on-change="cardNumberInputChange" text-align="right" :show-clear="false" :required="true" type="text" placeholder="请在此输入证件号码" v-model="cardNumber">
                <span v-if="!isShowType" slot="label">身份证/就诊卡号<span class="title-desc">（必填）</span></span>
                <span v-if="isShowType"slot="label">证件号<span class="title-desc">（必填）</span></span>
              </x-input>

              <x-input v-if="isShowAddr"  text-align="right" :max="50" :show-clear="false" :required="true" type="text" placeholder="请在此输入地址" v-model="verificCode">
                <span slot="label">地址<span class="title-desc">（必填）</span></span>
              </x-input>
              <datetime v-if="isShowBirth" v-model="childrenBirthday" start-date="1900-01-01" format="YYYY-MM-DD"
                        title="出生日期">
              </datetime>
              <x-input  @on-change="guardPhoneInputChange" text-align="right" :max="11" :show-clear="false" :required="true" type="number"
                       placeholder="请在此输入手机号"
                       v-model="guardianPhone">
                <span slot="label">手机号<span class="title-desc">（必填）</span></span>
              </x-input>

              <x-input v-if="isShowEmsCode" text-align="right" placeholder="请输入验证码" label-width="4em" v-model="emsCode" required>
                <div style="width: 4em;" slot="label">验证码</div>
                <span slot="right">
                  <x-button :disabled="(btnFlag)||(!checkOk)||(countdown>0)" v-if="showCodeBtn" type="primary" mini
                            size="small" class=" own-btn login-get-emscode-btn"
                            @click.native="getEmsCode()">{{ btnText }}
                  </x-button>
                </span>
              </x-input>
            </group>

            <!-- <div class="own-illustrate-wrap">
              <p class="own-illustrate">
                <span slot="title" class="select-card-page-tips">线上医疗服务严格遵守实名制，请仔细检查所填信息</span>
              </p>
              <p class="own-illustrate" v-if="disChild&&needRemain">
                <span slot="title" class="select-card-page-tips">没有身份证件的请选择【儿童/老人】</span>
              </p>
            </div> -->
            <div class="hint-text" v-html="audltText">

            </div>


            <div style="width: 100%;box-sizing: border-box;padding: 20px;">
              <x-button :disabled="saveBtnFlag1" type="primary" size="large" @click.native="addFamily(1)"
                        class="own-btn">确定
              </x-button>
            </div>
          </div>
          <div v-if="selected==1" key="儿童/老人">
<!--            <group gutter="0">
              <x-input text-align="right" @on-change="childNameInputChange" :max="20" :show-clear="false"
                       :required="true" placeholder="请在此输入姓名"
                       v-model="childrenName">
                <span slot="label">姓名<span class="title-desc">（必填）</span></span>
              </x-input>
              <cell title="性别" :value="childrenGender" is-link  @click.native="genderPopupVisible = true">
                <span v-if="!childrenGender">请选择性别</span>
              </cell>
              <datetime v-model="childrenBirthday" start-date="1900-01-01" format="YYYY-MM-DD"
                        title="出生日期">
              </datetime>
              <popup-radio title="关系" :options="contacts" v-model="childrenContact"></popup-radio>
            </group>-->
<!--          <group>
              <x-input text-align="right" @on-change="guardNameInputChange" :max="20" :show-clear="false"
                       :required="true" placeholder="请在此输入监护人姓名"
                       v-model="guardianName"
              >
                <span slot="label">监护人姓名<span class="title-desc">（必填）</span></span>
              </x-input>
              <cell title="监护人证件类型" value="guardianCardType" is-link v-model="guardianCardType"
                    @click.native="chooseCardType"></cell>
              <x-input @on-change="guardCardNumberInputChange" text-align="right" :show-clear="false" :required="true"
                       type="text"
                       placeholder="请在此输入监护人证件号码" v-model="guardianCardNumber">
                <span slot="label">监护人证件号<span class="title-desc">（必填）</span></span>
              </x-input>
              <x-input @on-change="guardPhoneInputChange" text-align="right" :show-clear="false" :required="false"
                       type="text"
                       placeholder="请在此输入监护人手机号码" v-model="guardianPhone">
                <span slot="label">监护人手机号</span>
              </x-input>
            </group>-->

            <div class="hint-text" v-html="noAudltText">

            </div>
            <!--<div style="margin-top: 10px;" class="member-add-tip-bar">-->
            <!--<span><img style="position: relative;top: 2px;" src="@icon/tip.png" width="14" alt=""></span>-->
            <!--请仔细检查所填信息，有误则无法使用线上便捷服务-->
            <!--</div>-->

            <div style="width: 100%;box-sizing: border-box;padding: 20px;">
              <x-button :disabled="saveBtnFlag2" type="primary" size="large" @click.native="addFamily(0)" class="own-btn">确定</x-button>
            </div>
          </div>
        </div>
      </div>
      <!--<mt-popup style="width: 100%"-->
      <!--v-model="contactPopupVisible"-->
      <!--position="bottom">-->
      <!--<mt-picker :slots="contacts" valueKey="value" @change="onContactValueChange"></mt-picker>-->
      <!--</mt-popup>-->
      <!--<mt-popup style="width: 100%"-->
      <!--v-model="cardTypePopupVisible"-->
      <!--position="bottom">-->
      <!--<mt-picker :slots="cardTypes" valueKey="value" @change="oncardTypeValueChange"></mt-picker>-->
      <!--</mt-popup>-->

      <actionsheet v-model="cardTypePopupVisible" :menus="cardTypes"
                   @on-click-menu="oncardTypeValueChange"></actionsheet>
      <actionsheet v-model="genderPopupVisible" :menus="genders" @on-click-menu="onGenderValueChange"></actionsheet>
    </view-box>
  </div>
</template>

<script>

  import {mapActions, mapState} from 'vuex'
  import {contactList, idCardTypes,conSexList} from '@constant.js'
  import {Datetime,Actionsheet,Tab, TabItem, PopupRadio} from 'vux'
  import {IdentityCodeValid} from '../../../common/tools/Tools'
  import des from '@common/libs/des'
  export function getUrlKey (name) {
    console.log("init window.location.href:",window.location.href)
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(window.location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
  }
  export default {
    components: {
      Tab, TabItem, PopupRadio,Actionsheet,Datetime
    },
    computed: {
      ...mapState({
        isHaveSelf: state => state.isHaveSelf,
        hospitalInfo: state => state.hospital.current,
        memberType:state=>state.memberType,
        hintText:state=>state.hintText,
      }),
      saveBtnFlag1() {
        if ((this.hospitalInfo.hospitalcode == '18452' || this.hospitalInfo.hospitalcode == '18449') && this.cardTypeKey == 5){
          console.log("5555555")
          return !(this.name)
        } else if (this.hospitalInfo.hospitalcode == '54056'){
          return !(this.cardTypeKey == 1 && this.cardNumber && this.emsCode.length >= 4);
        } else if (this.hospitalInfo.hospitalcode == '18828'){
          return !(this.cardTypeKey == 1 && this.cardNumber && this.emsCode.length >= 4);
        } else if (this.hospitalInfo.hospitalcode == '18455'){
          console.log("1111111")
          console.log(this.cardTypeKey)
          console.log(this.cardNumber)
          console.log(this.cardNumber.length)
          return !(this.cardTypeKey == 1 && this.cardNumber.length >= 10);
        } else {
          return !(this.name && ((this.cardTypeKey == 1 && IdentityCodeValid(this.cardNumber))));
        }
      },
      saveBtnFlag2() {
        return !(this.childrenName && this.guardianName && ((this.guardianCardTypeKey == 1 && IdentityCodeValid(this.guardianCardNumber)) || (this.guardianCardTypeKey != 1 && this.guardianCardNumber)))
      },
      disChild() {
        return this.hospitalInfo.disChild != 1
      },
      isShowEmsCode:function(){
        let clientId = this.hospitalInfo.clientId
        return (clientId=='S-110000-53422' && this.routeName != 'editCard') || clientId=='S-410900-54056' || clientId=='S-410100-18828'
//        return true
      },isShowType:function(){
        let clientId = this.hospitalInfo.clientId
        return clientId != 'S-410900-54056' || clientId != 'S-410328-18455';
//        return true
      },
      isShowMsg:function(){
        let clientId = this.hospitalInfo.clientId
        return clientId=='S-410328-18456'
//        return true
      },
      isShowAddr:function(){
        let clientId = this.hospitalInfo.clientId
        return clientId=='S-410328-18456'
//        return true
      },
      isShowSex:function(){
        let clientId = this.hospitalInfo.clientId
        return clientId=='S-410328-18452' || clientId=='S-410323-18449'
//        return true
      },
      isShowBirth:function(){
        let clientId = this.hospitalInfo.clientId
        console.log("ss")
        console.log(this.cardTypeKey)
        return (clientId=='S-410328-18452' || clientId=='S-410323-18449') && this.cardTypeKey == 5;
//        return true
      },
      funKey:function(){
        return this.$routeData.funKey
      },

    },
    mounted() {

    },
    created() {

      this.loadHintText({//成年人
        hospitalcode:this.hospitalInfo.hospitalcode,
        funcode:this.funKey,
        type: 1,
        isAdult:1
      }).then((res)=>{
        this.audltText=res
      })
      this.loadHintText({//未成年人
        hospitalcode:this.hospitalInfo.hospitalcode,
        funcode:this.funKey,
        type: 1,
        isAdult:0
      }).then((res)=>{
        this.noAudltText=res
      })

      if (this.isHaveSelf) {
        this.contact = '亲属'
        this.childrenContact = '亲属'
      } else {
        this.contact = '本人'
      }
      if(this.memberType&&this.memberType=='self'){
        this.contacts=['本人']
      }else if(this.memberType&&this.memberType=='other'){
        this.contacts=[]
        contactList.forEach(val=>{
          if(val!='本人'){
            this.contacts.push(val)
          }
        })
      }
      contactList.forEach((val, index) => {
        if (this.selected == 0) {//成人
          if (val.value == this.contact) {
            this.contacts[0].defaultIndex = index
          }
        } else {
          if (val.value == this.childrenContact) {
            this.contacts[0].defaultIndex = index
          }
        }
      })

      //  判断医院  是否需要隐藏 儿童/老人 模块
      let clientId = shareData.clientId || this.$store.state.hospital.current.clientId;

      this.needRemain = clientId !== "S-230100-52953";
      console.log(clientId);
//      P-440300-000
    },
    data() {
      let wechatCode = getUrlKey("wechatCode");
      console.log("wechatCode:"+wechatCode);
      return {
        audltText:'',
        noAudltText:'',
        isChangePatient: sessionStorage.getItem('updateChangePatient'),
        selected: 0,
        name: '',
        childrenName: '',
        guardianName: '',
        contact: '本人',
        childrenContact: '亲属',
        childrenGender:'',
        childrenBirthday:'请选择出生日期',
        cardType: '中国大陆居民身份证',
        cardTypeKey: '1',
        guardianCardType: '中国大陆居民身份证',
        guardianCardTypeKey: '1',
        cardNumber: '',
        guardianCardNumber: '',
        guardianPhone:'',
        contactPopupVisible: false,
        cardTypePopupVisible: false,
        saveFlag: false,
        contacts: contactList,
        consexes: conSexList,
        consex: '请选择性别',
        cardTypes: idCardTypes,
        needRemain: true,
        checkOk: true,
        showCodeBtn: false,
        countdown:0,
        btnText: '获取验证码',
        emsCode:'',
        verificCode:'',
        genders: {1:'男',2:'女'},
        genderPopupVisible:false,
        wechatCode:wechatCode
      }
    },
    methods: {
      ...mapActions(["saveRelative","getBindCardCode","onLineBuildRecord","getAlreadyCard","loadHintText","sendVerificationCode"]),
      addFamily(isadult) {
        this.saverelative(isadult);
      },
      getEmsCode() {
        console.log("fasongduanxin")
        let clientId = this.hospitalInfo.clientId
        if(clientId=='S-410900-54056'){
          this.getBindCardCode({
//          riid: this.curMember.riid,
            realname: this.name,
            cardtype: this.cardTypeKey,
            cardno: this.cardNumber,
            mobile: this.guardianPhone,
          }).then((res)=>{
            console.log("duanxinfanhui"+res)
            this.$vux.alert.show({
              title: '提示',
              content: '验证码已发送,请注意查收'
            })
            this.btnFlag = true
            this.countdown=59
            this.btnText = '重发(60)'
            this.reBtn()
          })
        }if(clientId=='S-410100-18828'){
          let mobile = des.strEnc(this.guardianPhone, 'weixin', 'development', 'stefan')
          this.sendVerificationCode(mobile+"_"+this.cardNumber).then((res)=>{
            this.countdown=59
            this.btnText = '重发(60)'
            this.reBtn()
          })
        }else{
          this.getBindCardCode({
//          riid: this.curMember.riid,
            realname: this.name,
            cardtype: this.cardTypeKey,
            cardno: this.cardNumber,
          }).then((res)=>{
            this.$vux.alert.show({
              title: '提示',
              content: '验证码已发送到'+res.realname+':'+res.phone.substring(0,3)+'****'+res.phone.substring(res.phone.length-4,res.length)
            })
            this.btnFlag = true
            this.countdown=59
            this.btnText = '重发(60)'
            this.reBtn()
          })
        }

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
      isCid(str) {
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        return reg.test(str)
      },
      cardNumberInputChange() {
        let clientId = this.hospitalInfo.clientId;
        this.$nextTick(() => {
          if (this.cardTypeKey == 1) {
            /*if(clientId=='S-410900-54056'){
              if (this.cardNumber.length == 8 || this.cardNumber.length == 18){
                console.log("满足显示验证码按钮")
                this.showCodeBtn = true;
              }
            }*/


            if (this.cardNumber.length > 18) {
              this.cardNumber = this.cardNumber.substring(0, 18);
            }
            if(clientId!='S-410900-54056'){
              this.cardNumber = this.cardNumber.replace(/[^(^\d{15})|(^\d{18})|(^\d{17}(\d|X|x)$)]/, '')
            }
            if((this.cardNumber.length==18||this.cardNumber.length==15) && clientId !='S-410100-18828' && clientId !='S-410900-54056'){
              this.showCodeBtn=true
            }
          }else{
            if(this.cardNumber!=''){
              this.showCodeBtn=true
            }
          }
        })
      },
      guardCardNumberInputChange() {
        this.$nextTick(() => {
          if (this.guardianCardTypeKey == 1) {
            if (this.guardianCardNumber.length > 18) {
              this.guardianCardNumber = this.guardianCardNumber.substring(0, 18);
            }
            this.guardianCardNumber = this.guardianCardNumber.replace(/[^(^\d{15})|(^\d{18})|(^\d{17}(\d|X|x)$)]/, '')
          }
        })
      },
      guardPhoneInputChange(){
        let clientId = this.hospitalInfo.clientId;
        console.log("112233")
        this.$nextTick((res)=>{
          if(this.guardianPhone.length>11){
            this.guardianPhone = this.guardianPhone.substring(0,11);
          }
          this.guardianPhone=this.guardianPhone.replace(/[^\d]/g,'')
        })
      },
      nameInputChange() {
        this.$nextTick(() => {
          if (this.name.length > 20) {
            this.name = this.name.substring(0, 20)
          }
          this.name = this.name.replace(/[^\u4E00-\u9FA5a-zA-Z·s]/g, '')
        })
      },
      guardNameInputChange() {
        this.$nextTick(() => {
          if (this.guardianName.length > 20) {
            this.guardianName = this.guardianName.substring(0, 20)
          }
          this.guardianName = this.guardianName.replace(/[^\u4E00-\u9FA5a-zA-Z]/g, '')
        })
      },
      childNameInputChange() {
        this.$nextTick(() => {
          if (this.childrenName.length > 20) {
            this.childrenName = this.childrenName.substring(0, 20)
          }
          this.childrenName = this.childrenName.replace(/[^\u4E00-\u9FA5a-zA-Z]/g, '')
        })
      },
      onGenderValueChange(key, name) {
        this.childrenGender = name
      },
      saverelative(isadult) {
        if(this.isShowEmsCode&&this.emsCode==''){
          this.$vux.toast.show({type:'text',text:'请输入验证码'})
          return;
        }
        let params = {};
        if (this.selected == 0) {//成人
          let clientId = this.hospitalInfo.clientId
            if(this.guardianPhone.length != 11){
              this.$vux.toast.show({type:'text',text:'请输入正确的手机号'})
              return;
            }
            if(this.verificCode.length <= 0){
              this.$vux.toast.show({type:'text',text:'请输入地址'})
              return;
            }
            params = {
              relation: this.contact,
              realname: this.name,
              certifitype: this.cardTypeKey,
              guardiancerttype: '1',
              cid: this.cardNumber,
              guardianPhone:this.guardianPhone,
              verificCode:this.verificCode,
              isadult: isadult,
              guardianname: this.wechatCode
            }

        } else {//儿童
          params = {
            relation: this.childrenContact,
            realname: this.childrenName,
            certifitype: '1',
//            cid:this.guardianCardNumber,
            guardianname: this.guardianName,
            guardiancerttype: this.guardianCardTypeKey,
            guardiancardno: this.guardianCardNumber,
            birthday:this.childrenBirthday=='请选择出生日期'?'':this.childrenBirthday,
            gender:this.childrenGender,
            guardianPhone:this.guardianPhone,
            isadult: isadult
          }
        }
        this.saveRelative(params).then((res) => {
          this.$vux.toast.show({type: 'text', text: '添加就诊人成功'})
          if(this.hospitalInfo.clientId&&this.hospitalInfo.clientId.substring(0,1)=='S'){
            this.getAlreadyCard({
              riid:res.riid,
              hospitalcode:'18456',
              name:res.realname,
              cid:res.cid||res.guardiancardno,
              mobile:res.mobile,
              busi:this.funKey
            }).then((_res)=>{
              console.log(_res);
              this.selectMember(res);
            })
          }
        })
      },
      selectMember: function (member) {
        let nextRoute = this.$routeData.to;
        if (this.isChangePatient == 1 && (nextRoute.name == 'SelectCardPage' || nextRoute.path == '/SelectCardPage')) {
          this.$store.commit("selectTempMember", member);
        } else {
          this.$store.commit("selectMember", member);
        }
        this.$store.commit('updateCardIsNewPage', true);
        if (nextRoute) {
          if (typeof(nextRoute) == 'number') {
            shareInst.client.replaceWithData(nextRoute)
          } else {
            shareInst.client.replace(nextRoute)
          }
        } else {
          shareInst.client.back()
        }
      },
      chooseContact() {
        this.contactPopupVisible = true;
      },
      chooseCardType() {
        console.log("123")
        console.log("this.cardTypeKey:",this.cardTypeKey)
        if((this.hospitalInfo.hospitalcode == '18452' || this.hospitalInfo.hospitalcode == '18449') && this.cardTypeKey == 5){
          console.log("hahahhhahaha")
        }
        this.cardTypePopupVisible = true;
      },
      onContactValueChange(picker, values) {
        if (this.selected == 0) {
          this.contact = values[0].value
        } else {
          this.childrenContact = values[0].value
        }
      },
      oncardTypeValueChange(key, name) {
        if (this.selected == 0) {
          this.cardType = name
          this.cardTypeKey = key
        } else {
          this.guardianCardType = name
          this.guardianCardTypeKey = key
        }
      },

    }
  }


</script>
<style lang="scss" scoped>
  .hint-text{
    padding: 16px 16px;
    font-size: 14px;
  }
  .page-content {

  }

  .mint-field-core {
    text-align: right;
  }

  .member-add-tip-bar {
    padding: 13px 10px;
    border-bottom: 1px solid #D9D9D9;
    color: #333;
    width: 100%;
    font-size: 14px;
    background: #fff;
  }

  .title-desc {
    color: #ADADAD;
  }

  .own-addmember-info-wrap {
    margin-top: 15px;
  }

  .select-card-page-tips {
    font-size: 15px;
    color: #999;
  }

  .own-illustrate {
    text-indent: 10px;
  }

  .own-illustrate-wrap {
    margin-top: 10px;
  }
  .login-get-emscode-btn {
    margin: 0px;
    vertical-align: super;
    float: right;
    height: 27px;
  }
</style>
