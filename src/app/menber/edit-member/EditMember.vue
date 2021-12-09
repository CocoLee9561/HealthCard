<template>
  <div class="page">
    <view-box>
      <x-header slot="header">就诊人管理</x-header>
      <tab v-model="selected" class="own-tab">
        <tab-item>个人信息</tab-item>
        <tab-item>就诊卡</tab-item>
      </tab>
      <div>
        <div v-if="selected==0">
          <group>
            <cell title="头像" v-model="headerFile" @click.native="uploadHeader" class="header-img">
              <img v-if="headerFile" :src="headerFile" width="60px"/>
              <img v-else-if="memberInfo.gender=='女'" src="@icon/member/icon_member_girl.png" width="60px"/>
              <img v-else src="@icon/member/icon_member_boy.png" width="60px"/>
            </cell>
          </group>
          <group>
            <x-input title="姓名" :max="20" :disabled="name!=''" text-align="right" :show-clear="false" :required="true" placeholder="请输入真实姓名" @on-blur="updaterealname" v-model="name"></x-input>
            <cell title="性别" :value="gender" :is-link="!memberInfo.cid||!memberInfo.gender" v-model="gender" @click.native="chooseGender"></cell>
            <!--<cell title="关系" value="contact" is-link v-model="contact" @click.native="chooseContact"></cell>-->
            <popup-radio title="关系" :options="contacts" v-model="contact" :readonly="memberInfo.relation=='本人'" @on-hide="onContactChange"></popup-radio>
          </group>
          <group>
            <cell title="证件类型" value="cardType" :is-link="!memberInfo.cid" v-model="cardType" @click.native="chooseCardType(1)"></cell>
            <x-input title="证件号" @on-change="cardNumberValid" text-align="right" :disabled="memberInfo.cid!=''"  :show-clear="false" :required="true" type="text" placeholder="请输入证件号码" @on-blur="updateidcard" v-model="cardNumber"
                      ></x-input>
            <datetime v-model="birthday" start-date="1900-01-01" format="YYYY-MM-DD" :readonly="memberInfo.cid!=''&&memberInfo.bsbirthday!=''" @on-change="change"
                      title="出生日期"></datetime>
            <!--<cell v-else>-->
                <!--<span slot="title">出生日期</span>-->
                <!--<span>{{birthday}}</span>-->
            <!--</cell>-->
            <x-input title="手机号" @on-change="phoneValid" is-type="china-mobile" text-align="right" :show-clear="true" placeholder="请输入手机号码" @on-blur="updatemobilenumber" v-model="phone"></x-input>
          </group>
<!--          <group>
            <x-input title="监护人姓名" @on-change="guardianNameVali" :max="20" :disabled="memberInfo.guardianname!=''" text-align="right" :show-clear="false" placeholder="请输入监护人真实姓名" @on-blur="updateguardianname" v-model="guardianName"
                      ></x-input>
            <cell title="监护人证件类型" value="guardianCardType" :is-link="!memberInfo.guardiancardno" v-model="guardianCardType"
                     @click.native="chooseCardType(0)"></cell>
            <x-input text-align="right" @on-change="guardianCardNoValid" :show-clear="false"  :disabled="this.memberInfo.guardiancardno!=''"  title="监护人证件号" type="text" placeholder="请输入监护人证件号码" @on-blur="updateguardiancardno"
                      v-model="guardianCardNumber"></x-input>
            <x-input @on-change="guardPhoneValid" title="监护人手机号" is-type="china-mobile" text-align="right" :show-clear="true" placeholder="请输入监护人手机号码" @on-blur="updateguardianphone"
                      v-model="guardianPhone"></x-input>
          </group>-->

          <div style="margin: 30px 16px;text-align: center;color: red;font-size: 14px;">
            <!--<span style="padding: 5px;@click="deleteFamily"">删除就诊人</span>-->
            <mt-button size="large" @click="deleteFamily" type="default" class='warn-text'>删除就诊人</mt-button>
          </div>

        </div>
        <div v-if="selected==1">
          <div class="card-list-contain">
            <swipeout>
              <swipeout-item :disabled="item.cardtype==6||item.cardtype==7||item.cardtype==8" transition-mode="follow" v-for="(item,index) in myCardList" :key="index">
                <div slot="right-menu">
                  <swipeout-button @click.native="onDdeleteCard(item)" type="warn">删除</swipeout-button>
                </div>
                <div class="card-list-item " slot="content" @click="editCard(item)"><!--@click="editCard(item)"-->
                  <img v-show="item.cardtype==1" src="@icon/cardtypetwo.png">
                  <img v-show="item.cardtype==2" src="@icon/cardtypeone.png">
                  <img v-show="item.cardtype==3" src="@icon/cardtypethree.png">
                  <img v-show="item.cardtype==4" src="@icon/cardtypefour.png">
                  <img v-show="item.cardtype==5" src="@icon/cardtypefive.png">
                  <img v-show="item.cardtype==6" src="@icon/cardtypesix.png">
                  <img v-show="item.cardtype==7" src="@icon/cardtypetwo.png">
                  <img v-show="item.cardtype==8" src="@icon/cardtypefive.png">
                  <div class="card-list-item-info">
                    <div class="card-list-item-bar">
                      <span>{{item.cardname}}</span>
                      <span class="card-list-item-area">
                        <span v-show="item.cardtype==1 || item.cardtype==5 || item.cardtype==7 || item.cardtype==8">{{item.hospitalname}}</span>
                        <span v-show="item.cardtype==2 || item.cardtype==3 || item.cardtype==4">{{item.areaname}}</span>
                      </span>
                    </div>
                    <div class="card-list-item-no">{{item.cardno.split('_')[0]}}</div>
                  </div>

                </div>
              </swipeout-item>
            </swipeout>
            <div style="padding: 20px;" class="card-botton-wrap">
              <mt-button @click.native="cardTypeSheetVisible=true" size="large">
                <img src="@icon/my/addcard_symbol.png" height="20" width="20" slot="icon">
                添加卡
              </mt-button>

            </div>
          </div>

        </div>
      </div>
      <!--<popup style="width: 100%;background: #fff"-->
                <!--v-model="contactPopupVisible"-->
                <!--position="bottom">-->
        <!--<mt-picker :slots="contacts" valueKey="value" @change="onContactValueChange"></mt-picker>-->
      <!--</popup>-->
      <actionsheet v-model="cardTypePopupVisible" :menus="cardTypes" @on-click-menu="onCardTypeValueChange"></actionsheet>
      <actionsheet v-model="guardCardTypePopupVisible" :menus="cardTypes" @on-click-menu="onGuardCardTypeValueChange"></actionsheet>
      <actionsheet v-model="genderPopupVisible" :menus="genders" @on-click-menu="onGenderValueChange"></actionsheet>
      <actionsheet v-model="cardTypeSheetVisible" :menus="cards" @on-click-menu="onChooseCardType"></actionsheet>
    </view-box>
  </div>
</template>
<script>

  import {Datetime, Cell, Group, Swipeout, SwipeoutItem, SwipeoutButton,Tab, TabItem,Popup,Actionsheet,PopupRadio} from 'vux'
  import {mapState, mapActions, mapGetters} from 'vuex'
  import {contactList, idCardTypes} from '@constant.js'
  import {IdentityCodeValid} from '../../../common/tools/Tools'


  export default {
    components: {
      Datetime, Cell, Group, Swipeout, SwipeoutItem, SwipeoutButton,Tab, TabItem,Popup,Actionsheet,PopupRadio
    },
    computed: {
      ...mapState({
        memberInfo: state => state.selectedMember,
        cardList:state=>state.cardList
      }),
      selected:{
        get:function(){
          return this.$store.state.tabSelected||0
        },
        set:function(val){
          this.$store.commit('updateTabSelected',val)
        }
      },
      myCardList:function(){
        let _myCardList=[];
        this.cardList.forEach((val)=>{
          if(val.cardtype!=6){
            _myCardList.push(val);
          }
        })
        return _myCardList
      },
      validCardTypes:function(){
        let validCardTypes = this.$store.state.validCardType[this.funKey] || [];
        return validCardTypes ;
      },
    },
    created() {
      this.initData();

      this.reqValidCardType(this.funKey).then((res) => {
        let self=this
        let menus = res.reduce(function(preMenus, card){
          if(card.cardtypeid<6){
            preMenus[card.cardtypeid] = card.cardtype ;
          }
          return preMenus;
        }, {});
        this.cards=menus
      })
    },
    watch: {
      selected:function(val){

      },
      contactPopupVisible:function(val){
        if(!val){
          this.updateRelationShip({
            riid:this.memberInfo.riid,
            relationship:this.contact
          })
        }
      }
    },
    data() {
      return {
//        selected: 0,
//        myCardList:[],
        funKey:'GRZX',
        cards:{},
        name: '',
        guardianName: '',
        contact: '',
        cardType: '请选择证件类型',
        cardTypeKey: '',
        guardianCardType: '请选择监护人证件类型',
        guardianCardTypeKey: '',
        cardNumber: '',
        guardianCardNumber: '',
        contactPopupVisible: false,
        cardTypePopupVisible: false,
        guardCardTypePopupVisible:false,
        genderPopupVisible: false,
        cardTypeSheetVisible:false,
        headerFile: '',
        gender: '',
        genderKey: '',
        birthday: '',
        phone: '',
        guardianPhone: '',
        dateVisiable: false,
        contacts: contactList,
        cardTypes: idCardTypes,
        genders: {1:'男',2:'女'}
      }
    },
    methods: {
      ...mapActions(["updateRelationShip","updateCertType","deleteCard","updateRealName", "updateIdCard", "updateMobileNumber", "updateHeight", "updateBloodType", "updateGender", "updateBirthday", "updateGuardianName", "updateGuardianCardNo", "updateGuardianPhone", "updateGuardianCertType", "deleteRelativeInfo","reqValidCardType"]),
      initData() {
        this.name = this.memberInfo.realname;
        this.guardianName = this.memberInfo.guardianname;
        this.contact = this.memberInfo.relation;
        this.cardType = this.memberInfo.certifitype?idCardTypes[this.memberInfo.certifitype]:'请选择证件类型';
        this.cardTypeKey = this.memberInfo.certifitype;
        this.guardianCardType = this.memberInfo.guardiancerttype?idCardTypes[this.memberInfo.guardiancerttype]:'请选择监护人证件类型';
        this.guardianCardTypeKey = this.memberInfo.guardiancerttype;
        this.cardNumber = this.formatCid(this.memberInfo.cid);
        this.guardianCardNumber = this.formatCid(this.memberInfo.guardiancardno);
        this.headerFile = this.memberInfo.headshoturl;
        this.gender = this.memberInfo.gender||'请选择性别';
        this.birthday = this.memberInfo.bsbirthday||'请选择出生日期';
        this.phone = this.memberInfo.mobile;
        this.guardianPhone = this.memberInfo.guardianphone;
//        this.contacts[0].values.forEach((val, index) => {
//          if (val.value == this.memberInfo.relation) {
//            this.contacts[0].defaultIndex = index
//          }
//        })
      },
      formatCid(cid){
        if(cid&&cid.length>8){
          return cid.substring(0,4)+'****'+cid.substr(cid.length-4);
        }else{
          return cid;
        }
      },
      guardianNameVali(){

        this.$nextTick(()=>{
          if(this.memberInfo.guardianname==this.guardianName){
            return;
          }
          if(this.guardianName.length>20){
            this.guardianName = this.guardianName.substring(0,20)
          }
          this.guardianName=this.guardianName.replace(/[^\u4E00-\u9FA5a-zA-Z]/g,'')
        })
      },
      guardianCardNoValid(){
        this.$nextTick(()=>{
          if(this.memberInfo.guardiancardno){
            return;
          }

          if(this.guardianCardTypeKey==1){
            if(this.guardianCardNumber.length>18){
              this.guardianCardNumber = this.guardianCardNumber.substring(0,18);
            }
            this.guardianCardNumber=this.guardianCardNumber.replace(/[^(^\d{15})|(^\d{18})|(^\d{17}(\d|X|x)$)]/,'')
          }
        })
      },
      cardNumberValid(){
        this.$nextTick(()=>{

          if(this.memberInfo.cid){
            return;
          }

          if(this.cardTypeKey==1){
            if(this.cardNumber.length>18){
              this.cardNumber = this.cardNumber.substring(0,18);
            }
            this.cardNumber=this.cardNumber.replace(/[^(^\d{15})|(^\d{18})|(^\d{17}(\d|X|x)$)]/,'')
          }
        })
      },
      phoneValid(){
        this.$nextTick((res)=>{
          if(this.memberInfo.mobile==this.phone){
            return;
          }

          if(this.phone.length>11){
            this.phone = this.phone.substring(0,11);
          }
          this.phone=this.phone.replace(/[^\d]/g,'')
        })
      },
      guardPhoneValid(){
        this.$nextTick((res)=>{
          if(this.memberInfo.guardianphone==this.guardianPhone){
            return;
          }

          if(this.guardianPhone.length>11){
            this.guardianPhone = this.guardianPhone.substring(0,11);
          }
          this.guardianPhone=this.guardianPhone.replace(/[^\d]/g,'')
        })
      },
      onDdeleteCard(item){
        let self=this
        this.$vux.confirm.show({
          title:'删除卡',
          content: '你确定要删除此卡吗？',
          confirmText:'删除',
          cancelText:'取消',
          onCancel () {
          },
          onConfirm () {
            self.deleteCard({
              riid: item.riid,
              pkcard: item.pkcard
            }).then((res) => {
              self.$vux.toast.text('删除卡成功')
              self.$store.commit('selectMember', res)
            })
          }
        })

      },
      chooseContact() {
        if(this.memberInfo.relation!='本人'){
          this.contactPopupVisible=true;
        }
      },
      chooseCardType(flag) {
        if(flag==1&&!this.memberInfo.cid){
          this.cardTypePopupVisible=true;
        }else if(flag==0&&!this.memberInfo.guardiancardno){
          this.guardCardTypePopupVisible=true
        }
      },
      onContactChange(){
        if(this.contact!=this.memberInfo.relation){
          this.updateRelationShip({
            riid:this.memberInfo.riid,
            relationship:this.contact
          }).then((res)=>{
            if(!res.result){
              this.$vux.toast.text(res.msg)
              this.contact=this.memberInfo.relation
            }
          })
        }
      },
      onContactValueChange(picker, values) {
        this.contact = values[0].value
      },
      onGenderValueChange(key, name) {
        this.gender = name
        this.updategender();
      },
      onGuardCardTypeValueChange(key,name) {
        this.guardianCardType = name
        this.guardianCardTypeKey = key
        this.updateguardiancerttype()
      },
      onCardTypeValueChange(key,name) {
        this.cardType = name
        this.cardTypeKey = key
        this.updateCertType({
          riid:this.memberInfo.riid,
          certtype:this.cardTypeKey
        })
      },
      uploadHeader() {

      },
      chooseGender() {
        if(!this.memberInfo.cid||!this.memberInfo.gender){
          this.genderPopupVisible = true
        }
      },
      deleteFamily() {
        let self=this
        this.$vux.confirm.show({
          title:'删除就诊人',
          content: '你确定要删除此就诊人吗？',
          confirmText:'删除',
          cancelText:'取消',
          onCancel () {
          },
          onConfirm () {
            self.deleterelativeinfo();
          }
        })
      },
      editCard(item) {
        item.cardno=item.cardno.split('_')[0]
        this.$store.commit('updateSelectedCard', item)
        shareInst.client.push({
          path: '/addCard',
          query: {
            routeName: 'editCard',
            funKey: this.funKey,
            isBuild:false,
            to:-1
          }
        });
      },
      isOnLineBuild(){
        let result=false
        this.validCardTypes.forEach((value,index)=>{
          if(value.isrecordonline==1){
            result=true
            return;
          }
        })
        return result;
      },
      onChooseCardType(key,name){
        this.addCard(key,name)
      },
      addCard(key,name) {
        shareInst.client.push({
          path: '/addCard',
          query: {
            funKey: this.funKey,
            isBuild:this.isOnLineBuild(),
            cardType:key,
            cardName:name,
            to:-1
          }
        });
      },
      change(value) {
        this.updateBirthday({
          riid: this.memberInfo.riid,
          birthday: value
        })
      },
      updaterealname() {
        if(!this.memberInfo.realname){
          this.updateRealName({
            riid: this.memberInfo.riid,
            realname: this.name
          })
        }
      },
      updateidcard() {
        if(((this.cardTypeKey==1&&IdentityCodeValid(this.cardNumber))||this.cardTypeKey!=1)&&!this.memberInfo.cid) {
          this.updateIdCard({
            riid: this.memberInfo.riid,
            cid: this.cardNumber
          }).then((res)=>{
            this.cardNumber = this.formatCid(this.memberInfo.cid);
          })
        }else if(this.cardTypeKey==1){
          this.cardNumber=''
          this.$vux.toast.text('请输入正确的身份证号码')
        }
      },
      isPoneAvailable(str) {
        var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        if (!myreg.test(str)) {
          return false;
        } else {
          return true;
        }
      },
      updatemobilenumber() {
        if(this.isPoneAvailable(this.phone)){
          this.updateMobileNumber({
            riid: this.memberInfo.riid,
            mobile: this.phone
          })
        }else{
          if(this.phone.length>11){
            this.phone=this.phone.substring(0,11);
            this.$vux.toast.show({type:'text',text:'请输入正确的手机号码'})
          }
          this.phone = this.phone.replace(/[^\d]/g,"");
        }
      },
      updategender() {
        this.updateGender({
          riid: this.memberInfo.riid,
          gender: this.gender
        })
      },
      updateguardianname() {
        if(!this.memberInfo.guardianname){
          this.updateGuardianName({
            riid: this.memberInfo.riid,
            guardianname: this.guardianName
          })
        }
      },
      updateguardiancardno() {
        if(((this.guardianCardTypeKey==1&&IdentityCodeValid(this.guardianCardNumber))||this.guardianCardTypeKey!=1)&&!this.memberInfo.guardiancardno){
          this.updateGuardianCardNo({
            riid: this.memberInfo.riid,
            guardiancardno: this.guardianCardNumber
          }).then((res)=>{
            this.guardianCardNumber = this.formatCid(this.memberInfo.guardiancardno);
          })
        }else if(this.guardianCardTypeKey==1){
          this.guardianCardNumber=''
          this.$vux.toast.text('请输入正确的身份证号码')
        }
      },
      updateguardianphone() {
        if(this.isPoneAvailable(this.guardianPhone)) {
          this.updateGuardianPhone({
            riid: this.memberInfo.riid,
            guardianphone: this.guardianPhone
          })
        }else{
          if(this.guardianPhone.length>11){
            this.guardianPhone=this.guardianPhone.substring(0,11);
            this.$vux.toast.show({type:'text',text:'请输入正确的手机号码'})
          }
          this.guardianPhone = this.guardianPhone.replace(/[^\d]/g,"");
        }
      },
      updateguardiancerttype() {
        this.updateGuardianCertType({
          riid: this.memberInfo.riid,
          guardiancerttype: this.guardianCardTypeKey
        })
      },
      deleterelativeinfo() {
        this.deleteRelativeInfo({
          riid: this.memberInfo.riid,
        }).then((res) => {
          this.$vux.toast.text('删除就诊人成功')
          shareInst.client.back();
        })
      }
    }
  }
</script>
<style scoped>
  .mint-field-core {
    text-align: right ;
  }

  .card-list-item {
    margin: 10px;
    background: #fff;
    border-radius: 3px;
    padding: 5px;
    display: block;
    overflow: hidden;
    border-radius: 4px;
  }

  .card-list-item:active {
    background: #f5f5f5;
  }

  .card-list-item img {
    float: left;
    vertical-align: middle;
    width: 2.4rem;
	margin-top:3px;
  }

  .card-list-item-info {
    float: left;
    margin-left: 10px;
  }

  .card-list-item-bar {
    font-size: 12px;
    color: #BBBBBB;
  }

  .card-list-item-no {
    color: #333;
    margin-top: 3px;
  }

  .card-list-item-area {
    position: absolute;
    right: 26px;
  }

  .mint-cell:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    left: 15px;
  }

  .mint-cell:first-child:before {
    border-top: 1px solid #fff !important;
  }

  .weui-cells:after {
    border-bottom: 1px solid #fff !important;
  }

  .mint-cell:last-child {
    background-image: -webkit-linear-gradient(bottom, #fff, #fff 50%, transparent 50%);
    background-image: linear-gradient(bottom, #fff, #fff 50%, transparent 50%);
  }

  .mint-cell .mint-cell-wrapper {
    background-image: -webkit-linear-gradient(top, #F1F1F1, #F1F1F1 50%, transparent 50%);
    background-image: linear-gradient(180deg, #F1F1F1, #F1F1F1 50%, transparent 50%);
  }

  .mint-cell:first-child .mint-cell-wrapper {
    background-image: -webkit-linear-gradient(top, #fff, #fff 50%, transparent 50%);
    background-image: linear-gradient(180deg, #fff, #fff 50%, transparent 50%);
  }

  .mint-cell-wrapper {
    padding: 0 16px;
  }

  .header-img {
    /*padding: 8px 0;*/
  }

  .warn-text {
    color: #FF4949;
    box-shadow: 0;
  }

  .mint-navbar .mint-tab-item.is-selected {
    border-bottom: 3px solid #4b6baf;
    color: #4b6baf;
  }

  .mint-tab-item-label {
    font-size: 14px;
  }

  .card-list-contain .mint-cell-title {
    display: none;
  }

  .card-list-contain .mint-cell-right {
    right: -1px;
  }

  .card-botton-wrap .mint-button--default {
    color: #656b79;
    background-color: #F4F4F4;
    box-shadow: none;
    border-bottom: 1px solid #D9D9D9;
    border-radius: 0;
    text-align: left;
  }
</style>
