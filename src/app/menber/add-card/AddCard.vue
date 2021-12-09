<template>
  <div class="page">
    <view-box>
      <x-header slot="header">{{routeName!='editCard'?'添加卡':'卡信息'}}</x-header>
      <div v-if="routeName=='editCard'" class="barcode-image-box">
        <barcode style="width: 90%;" :value="cardInfo.cardno" :options="{ displayValue: true,tag:'img',margin:0,width:5,height:140 ,fontSize:30}"></barcode>
        <vue-qr class="qr-box"  :text="barCodeText" :margin="16"></vue-qr>
      </div>
      <div>
        <group>
          <cell title="卡类型" :value="cardType" :is-link="routeName != 'editCard'&&!routeCardType" @click.native="chooseCardType">
          </cell>
        </group>
        <group>
          <popup-radio v-if="isChooseMember" title="姓名" :options="memberList" v-model="cMember" :readonly="!isChooseMember" @on-hide="onMemberChange" placeholder="请选择就诊人"></popup-radio>
          <cell v-else title="姓名" :value="curMember.realname" @click.native="memberCellVisible=true">
          </cell>
          <cell v-show="cardTypeKey==1||cardTypeKey==5||cardTypeKey==7||cardTypeKey==8" title="医院" :is-link="funKey=='GRZX' && routeName != 'editCard'" :value="hospitalName" @click.native="onChooseHospital">
          </cell>
          <!--<cell v-show="cardTypeKey==4||cardTypeKey==3||cardTypeKey==2" title="地区" :value="areaName" @click.native="onChooseArea" :is-link="routeName != 'editCard'"></cell>-->
          <x-address :hide-district="true" title="地区" v-show="cardTypeKey==4||cardTypeKey==3||cardTypeKey==2" v-if="routeName != 'editCard'&&areaCellVisible" v-model="areaNames" :list="addressAreas" placeholder="请选择地区"></x-address>
          <cell v-show="cardTypeKey==4||cardTypeKey==3||cardTypeKey==2" title="地区" :is-link="routeName!='editCard'&&!areaCellVisible" :value="areaName" v-else></cell>
          <x-input title="卡号" :disabled="!canEdit()" text-align="right" :show-clear="true" :max="20" @on-change="cardNoInputChange" :required="true" :placeholder="'请在此输入身份证/就诊卡'" v-model="cardNo">
            <span slot="label">{{cardType}}<span class="title-desc">（必填）</span></span>
          </x-input>
          <x-input v-if="isShowEmsCode" text-align="left" placeholder="请输入验证码" label-width="4em" v-model="emsCode" required>
            <div style="width: 4em;" slot="label">验证码</div>
            <span slot="right">
              <x-button :disabled="(btnFlag)||(!checkOk)||(countdown>0)" v-if="showCodeBtn" type="primary" mini size="small" class=" own-btn login-get-emscode-btn"
                                         @click.native="getEmsCode()">{{ btnText }}
              </x-button>
            </span>
          </x-input>
        </group>
      </div>

      <div class="hint-text" v-html="hintText">

      </div>
      <div style="padding: 20px;" v-if="(canEdit()&&(routeName=='editCard'&&cardNo!=cardInfo.cardno&&cardNo))||routeName!='editCard'">
        <x-button type="primary" size="large" @click.native="addCard()" class="own-btn">确定</x-button>
      </div>

      <div class="build-record-box" v-if="routeName!='editCard'&&hospitalInfo.isRecordOnline==1&&isBuild&&isOnLineBuild()">
        没有{{this.cardType}}？<a class="own-build-a" mini @click="toBuildRecord">在线建卡</a>
      </div>

      <div v-if="routeName=='editCard'&&canEdit()" style="margin: 10px 0px;text-align: center;color: red;font-size: 14px;">
        <div style="padding: 5px;" @click="onDeleteCard">删除此卡</div>
      </div>

      <!--<mt-popup style="width: 100%"-->
                <!--v-model="areaPopupVisible"-->
                <!--position="bottom">-->
        <!--<mt-picker :slots="areas" valueKey="name" @change="areaValueChange"></mt-picker>-->
      <!--</mt-popup>-->

      <actionsheet v-model="cardTypePopupVisible" :menus="cardTypes" @on-click-menu="onCardTypeValueChange"></actionsheet>
      <actionsheet v-model="hospitalPopupVisible" :menus="hospitals" @on-click-menu="hospitalValueChange"></actionsheet>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import {Actionsheet,PopupPicker ,XAddress,PopupRadio} from 'vux'
  import VueQr from 'vue-qr'
  export default {
    computed: {
      ...mapState({
        hospitalInfo: state => state.hospital.current,
        memberInfo: state => state.selectedMember,
        tempMemberInfo:state => state.tempSelectedMember,
        cardInfo: state => state.selectedCard,
        addressAreas:state=>state.addressAreas,
        hintText:state=>state.hintText,
      }),
      routeName: function () {
        return this.$routeData.routeName
      },
      funKey: function () {
        return this.$routeData.funKey
      },
      routeCardType: function () {
        return this.$routeData.cardType
      },
      isBuild:function(){
        return this.$routeData.isBuild&&this.$routeData.isBuild!='false'
      },
      routeCardName:function(){
        return this.$routeData.cardName
      },
      validCardTypes:function(){
        let validCardTypes = this.$store.state.validCardType[this.funKey] || [];
        return validCardTypes ;
      },
      isShowEmsCode:function(){
        let clientId = this.hospitalInfo.clientId
//        return clientId=='S-110000-53422' && this.routeName != 'editCard'
        return false
      },
      isChooseMember:function(){
        return this.$routeData.isChooseMember||this.$routeData.isChooseMember=='true'
      }
    },
    components: {
      Actionsheet,PopupPicker,XAddress,PopupRadio,VueQr
    },
    created() {

      this.loadHintText({//成年人
        hospitalcode:this.hospitalInfo.hospitalcode,
        funcode:this.funKey,
        type: 0,
      }).then((res)=>{
      })


      let isChangePatient = sessionStorage.getItem('updateChangePatient');
      if(isChangePatient==1){
        this.curMember=this.tempMemberInfo
      }else{
        this.curMember=this.memberInfo
      }
      if (this.routeName && this.routeName == 'editCard') {
        this.initData();
      } else if(this.hospitalInfo&&this.hospitalInfo.hospitalname){
        this.hospitalName = this.hospitalInfo.hospitalname
        this.hospitalCode = this.hospitalInfo.hospitalcode
      }
      if (this.funKey&&this.routeName!='editCard'&&!this.routeCardType) {
        this.reqValidCardType(this.funKey).then((res) => {
          let self=this
          let menus = res.reduce(function(preMenus, card){
            if(card.cardtypeid<6){
              preMenus[card.cardtypeid] = card.cardtype ;
              if(!self.routeCardType&&!self.cardTypeKey){
                self.cardTypeKey=card.cardtypeid
                self.cardType=card.cardtype
              }
            }
            return preMenus;
          }, {});
          this.cardTypes=menus
        })
      }else if(this.routeCardType){
        this.cardTypeKey=this.routeCardType
        this.cardType=this.routeCardName
      }
      this.getallcustomerhospital();
      this.getallareasdata();

      if(this.isChooseMember){
        this.curMember={}
        this.reqMemberList().then((res)=>{
          let _member=[]
          res.forEach((val)=>{
            _member.push({key:val.riid,value:val.realname})
          })
          this.memberList=_member
        })
      }

      if(this.routeName=='editCard'){
        this.freshenBarCodeText();
      }
    },
    data() {
      return {
        barCodeText:'',
        timer:'',
        isChangePatient:sessionStorage.getItem('updateChangePatient'),
        cardTypePopupVisible: false,
        hospitalPopupVisible: false,
        areaPopupVisible: false,
        areaCellVisible:false,
        memberCellVisible:false,
        curMember:{},
        cMember:'',
        memberList:[],
        cardType: '',
        cardTypeKey: '',
        hospitalName: '请选择医院',
        hospitalCode: '',
        areaNames:[],
        areaName: '请选择地区',
        areaKey: '',
        cardNo: '',
        cardTypes: {},
        hospitals: {},
        img:'',
        isFirltIn:true,
        areas: [
          {
            flex: 1,
            values: [],
            textAlign: 'center'
          },
          {
            flex: 1,
            values: [],
            textAlign: 'center'
          }
        ],
        checkOk: true,
        showCodeBtn: false,
        countdown:0,
        btnText: '获取验证码',
        emsCode:''
      }
    },
    beforeDestroy(){
      if(this.timer!=''){
        clearInterval(this.timer);
      }
    },
    methods: {
      ...mapActions(["reqAllHospital", "getAllAreasData", "saveCard", "deleteCard", "reqValidCardType","getBarCodeImage","getAllCustomerAreas","reqMemberList","getBindCardCode","loadHintText"]),
      onMemberChange(){
        this.memberList.forEach((val)=>{
          if(val.key==this.cMember){
            this.curMember={riid:val.key,realname:val.value}
          }
        })
      },
      getEmsCode() {
        this.getBindCardCode({
          riid: this.curMember.riid,
          realname: this.curMember.realname,
          cardtype: this.cardTypeKey,
          cardno: this.cardNo,
//          hospitalcode: this.hospitalCode,
//          hospitalname: this.hospitalName,
//          areaid: this.areaKey,
//          pkcard: '',
//          verificCodeType:'0'
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
      freshenBarCodeText(){
        if(this.hospitalInfo.qrcodeAutoRefresh==1){
          this.barCodeText=new Date().getTime()+'^o^'+this.cardInfo.cardno
          this.timer = setInterval(()=>{
            this.barCodeText=new Date().getTime()+'^o^'+this.cardInfo.cardno
          }, 15000);
        }else{
          this.barCodeText=this.cardInfo.cardno
        }
      },
      initData() {
        this.cardTypeKey = this.cardInfo.cardtype
        this.areaName = this.cardInfo.areaname || '请选择地区'
        this.areaKey = this.cardInfo.area
        this.hospitalCode = this.cardInfo.hospitalcode
        this.cardNo = this.cardInfo.cardno
        this.cardType=this.cardInfo.name
      },
      getParent(value){
        let parent='';
        this.addressAreas.forEach((val,index)=>{
          if(value==val.value){
            parent=val.parent
            return;
          }
        })
        return parent;
      },
      initDefArea(){
        this.areaCellVisible=true
        this.areaNames=[]
        let clientId=shareInst.clientId
        if(!clientId){
          return;
        }
        let areasSplit = clientId.split('-');
        if(areasSplit.length<=1){
          return;
        }
        let city = areasSplit[1]
        this.addressAreas.forEach((val,index)=>{
          if(city==val.value){
            this.areaNames.push(val.parent);
            this.areaNames.push(val.value);
            return;
          }
        })

      },
      canEdit(){
        let result = this.cardTypeKey!=6&&this.cardTypeKey!=7&&this.cardTypeKey!=8
        return result
      },
      onChooseHospital() {
        if(this.funKey=='GRZX'&&this.routeName != 'editCard'){
          this.hospitalPopupVisible = true
        }
      },
      chooseCardType() {
        if (this.routeName == 'editCard' || this.routeCardType) {

        } else {
          this.cardTypePopupVisible = true
        }
      },
      onChooseArea() {
        if(this.routeName != 'editCard'){
          this.areaPopupVisible = true
        }
      },
      isOnLineBuild(){
        let result=false
        this.validCardTypes.forEach((value,index)=>{
          if(value.isrecordonline==1){
            result =true
            return;
          }
        })
        return result;
      },
      onCardTypeValueChange(key, item) {
        this.cardType = item
        this.cardTypeKey = key
      },
      hospitalValueChange(key, item) {
        this.hospitalName = item || ''
        this.hospitalCode = key || ''
      },
      areaValueChange(picker, values) {
        if (!values[0]) {
          return;
        }
        if (this.areaKey == values[1].id) {
          this.areas[1].values = values[0].childrenlist
        }
        this.areaName = values[1].name || ''
        this.areaKey = values[1].id || ''
      },
      areaHide(flag){
        if(!flag){
          this.areaName = ''
          this.areaKey = ''
        }
      },
      areaChange(ids,names){
        if(ids.length>0){
          this.areaKey=ids[ids.length-1]
          this.areaName=names[names.length-1]
        }
      },
      getallcustomerhospital() {
        let self=this
        this.reqAllHospital({}).then((res) => {
          let menus=res.reduce(function(preMenus, hosp){
            preMenus[hosp.hospitalcode] = hosp.hospitalname ;
            if(self.hospitalCode&&self.hospitalCode==hosp.hospitalcode){
              self.hospitalName=hosp.hospitalname
            }
            return preMenus;
          }, {});
          this.hospitals=menus
        })
      },
      getallareasdata() {
        this.getAllCustomerAreas({}).then((res)=>{
          this.initDefArea()
        })

//        this.getAllAreasData({}).then((res) => {
//          this.areas[0].values = res
//          this.areas[1].values = res[0].childrenlist
//          res.forEach((val, index) => {
//            if (val.childrenlist) {
//              val.childrenlist.forEach((cVal, cIndex) => {
//                if (cVal.id == this.areaKey) {
//                  this.areas[0].defaultIndex = index;
//                  this.areas[1].defaultIndex = cIndex;
//                }
//              })
//            }
//          })
//        })
      },
      cardNoInputChange(){
        this.$nextTick(()=>{
          if(this.cardInfo.cardno==this.cardNo){
            return;
          }
          if(this.canEdit()){
            if(this.cardNo.length>20){
              this.cardNo = this.cardNo.substring(0,20)
            }
            this.cardNo=this.cardNo.replace(/[^0-9a-zA-Z]/g,"");
            this.showCodeBtn=true
            this.checkOk=this.cardNo!=''
          }
        })
      },
      savecard() {
        if(this.cardNo==''){
          this.$vux.toast.show({type:'text',text:'请输入卡号'})
          return;
        }
        if(this.isShowEmsCode&&this.emsCode==''){
          this.$vux.toast.show({type:'text',text:'请输入验证码'})
          return;
        }
        this.saveCard({
          riid: this.curMember.riid,
          realname: this.curMember.realname,
          cardtype: this.cardTypeKey,
          cardno: this.cardNo,
          hospitalcode: this.hospitalCode,
          hospitalname: this.hospitalName,
          areaid: this.areaKey,
          pkcard: this.routeName == 'editCard' ? this.cardInfo.pkcard : '',
          verificCodeType:this.isShowEmsCode?'0':'1',
          verificCode	:this.emsCode
        }).then((data) => {
          let _this = this
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
          var res=data.data
          this.$store.commit('selectMember', res)
          // this.$vux.toast.show({type:'text',text:this.routeName == 'editCard'?'编辑卡成功':'添加卡成功'})
          let cardList=res.cardlist;
          cardList.forEach((card)=>{
            if(card.cardno==this.cardNo&&card.cardtype==this.cardTypeKey){
              this.$store.commit('selectCard',{
                funKey:this.funKey,
                card:card
              })
            }
          })
          this.$store.commit('updateIsNewPage', true);
//          if(this.isChangePatient==1){
//            this.$store.commit("selectMember", this.tempSelectedMember);
//          }
          this.$store.commit('updateCardIsNewPage', false);
          this.$vux.alert.show({
            title: '提示',
            content:this.routeName == 'editCard'?'编辑卡成功':'添加卡成功',
            onShow () {

            },
            onHide () {
              _this.toNext()
            }
          })
        });
      },
      toNext(){
          let nextRoute = this.$routeData.to;
          if(nextRoute){
            if(typeof(nextRoute)=='number'){
              if(this.isChangePatient==1){
                sessionStorage.setItem('updateChangePatient',0)
                shareInst.client.replaceWithData(nextRoute-1)
              }else{
                sessionStorage.setItem('updateChangePatient',0)
                shareInst.client.replaceWithData(nextRoute)
              }
            }else{
              sessionStorage.setItem('updateChangePatient',0)
              this.$store.commit('updateTabSelected',0)
              shareInst.client.replace(nextRoute)
            }
          }else{
            shareInst.client.back();
          }
      },
      addCard() {
        if(this.isChooseMember&&this.cMember==''){
          this.$vux.toast.text("请选择就诊人");
          return;
        }
        if(this.cardTypeKey==4||this.cardTypeKey==3||this.cardTypeKey==2){
          if(this.areaNames.length<=0){
            this.$vux.toast.text("请选择地区");
            return;
          }
          this.areaKey=this.areaNames[this.areaNames.length-1]
        }else{
          if(!this.hospitalCode){
            this.$vux.toast.text("请选择医院");
            return;
          }
        }
        this.savecard();
      },
      deletecard() {
        this.deleteCard({
          riid: this.cardInfo.riid,
          pkcard: this.cardInfo.pkcard
        }).then((res) => {
          this.$store.commit('selectMember', res)
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
      isEdit() {
        return this.routeName == 'editCard';
      },
      toBuildRecord(){
        shareInst.client.push({
          path:'/buildRecord',
          query:{
            cardType:this.cardType,
            funKey:this.funKey
          }
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  .hint-text{
    padding: 16px 16px;
    font-size: 14px;
  }
  .mint-field-core {
    text-align: right;
  }
  .build-record-box{
    padding: 20px;
  }
  .own-build-a{
  	color:#426BB6;
  	border-bottom: 1px solid #426bb6;
  }
  .title-desc{
    color: #ADADAD;
  }
  .barcode-image-box{
    padding: 20px 0px 0px 0px;
    text-align: center;
    background: white;
  }
</style>
