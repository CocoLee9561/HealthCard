<template>
  <div class="page">
    <view-box>
      <x-header slot="header">挂号确认</x-header>
      <div>
        <div class="cmc-doctor-info-bar">
          <img :src="doctorInfo.doctorphoto">
          <div class="doctor-name-bar">
            <div class="doctor-name">{{doctorInfo.doctorname}}</div>
            <div class="doctor-rank">{{doctorInfo.doctorrank}}</div>
          </div>
        </div>
        <!--<div class="cmc-info-plan">-->
        <!--<div class="cmc-info-bar">-->
        <!--<div class="cmc-info-title">医院</div>-->
        <!--<div class="cmc-info-value">{{doctorInfo.hospitalname}}</div>-->
        <!--</div>-->
        <!--<div class="cmc-info-bar">-->
        <!--<div class="cmc-info-title">科室</div>-->
        <!--<div class="cmc-info-value">{{doctorInfo.departmentname}}</div>-->
        <!--</div>-->
        <!--<div class="cmc-info-bar">-->
        <!--<div class="cmc-info-title">费用</div>-->
        <!--<div class="cmc-info-value">￥{{bookingData.registerfee}}</div>-->
        <!--</div>-->
        <!--<div class="cmc-info-bar">-->
        <!--<div class="cmc-info-title">日期</div>-->
        <!--<div class="cmc-info-value">{{bookingData.regdate}}</div>-->
        <!--</div>-->
        <!--</div>-->
        <group gutter="0">
          <cell class="booking-info-cell">
            <span slot="title">就诊医院&nbsp;&nbsp;&nbsp;&nbsp;<span
              class="booking-info-value">{{doctorInfo.hospitalname}}</span></span>
          </cell>
          <cell class="booking-info-cell">
            <span slot="title">就诊科室&nbsp;&nbsp;&nbsp;&nbsp;<span class="booking-info-value">{{doctorInfo.departmentname}}</span></span>
          </cell>
          <cell class="booking-info-cell">
            <span slot="title">就诊日期&nbsp;&nbsp;&nbsp;&nbsp;<span
              class="booking-info-value">{{bookingData.regdate}}<span v-if="bookingData.weekDate">({{bookingData.weekDate}})</span></span></span>
          </cell>
          <cell class="booking-info-cell">
            <span slot="title">挂号费用&nbsp;&nbsp;&nbsp;&nbsp;<span
              class="booking-info-money">￥{{bookingData.registerfee}}</span></span>
          </cell>
        </group>
        <group>
          <cell is-link @click.native="rightPopupVisible=true">
            <span slot="title" class="cmc-weektype-title">就诊时段</span>
            <span class="cmc-weektype-value">{{getWorkTypeName(scheduleInfo.worktype)}} {{scheduleInfo.timequantum}}</span>
          </cell>
        </group>

        <group>
          <div>
            <div v-if="isShowMemberList" class="choose-member-plan">
              <div style="margin-left: 15px;font-size: 16px;">请选择就诊人</div>
              <div>
                <!--<div class="choose-member-box" v-for="item in memberList">-->
                  <!--<div class="choose-member" @click="chooseMemeber(item)">{{item.realname}}</div>-->
                <!--</div>-->
                <cell-box>
                  <checker v-model="currMember" class="member-radio" radio-required selected-item-class="choose-member-selected" default-item-class="choose-member"
                           type="radio">
                    <checker-item v-for="(item,index) in memberList" :key="index" @on-item-click="chooseMemeber" :value="item" v-if="showMember(item)">{{item.realname}}</checker-item>
                    <div class="add-member-btn" @click="addMember" v-if="showAddMember()">
                      <img src="@icon/my/addcard_symbol.png">
                      <span>添加</span>
                    </div>
                  </checker>
                </cell-box>

              </div>
            </div>
            <div v-else>
              <cell @click.native="memberBarClick" is-link>
                <span slot="title" class="cmc-cell-title">就诊人</span>
                <span class="cmc-cell-value">{{currMember.realname}}</span>
              </cell>
            </div>
          </div>

        </group>
        <group v-if="isRegNeedCard" gutter="0">
          <div>
            <div v-if="isShowCardList" class="choose-member-plan">
              <div style="margin-left: 15px;font-size: 16px;color: #AFAFAF;">请选择就诊卡</div>
              <div>
                <div class="select-card-box">
                  <select-card disabled="true" :need-sort="needSort" :fun-key="funKey" @on-change="chooseCard"></select-card>
                </div>
              </div>
            </div>
            <div v-if="isFirstPatient==1">
              <cell is-link>
                <span slot="title" class="cmc-cell-title">{{currCard.name}}</span>
                <span class="cmc-cell-value">{{currCard.cardno}}</span>
              </cell>
            </div>
          </div>
        </group>

        <div class="own-tip-bar">
          选错就诊卡将无法就诊，请仔细检查您的就诊卡号
        </div>
        <div style="margin: 20px 10px;">
          <mt-button :disabled="!isCanOk" size="large" @click.native="okClick" type="primary" class="own-btn">确定
          </mt-button>
        </div>
      </div>
      <popup
        :popup-style="{zIndex:701}"
        v-model="rightPopupVisible"
        position="right" style="width: 70%;height: 100%;"
        popup-transition="popup-fade">
        <div style="height: 100%;width: 100%;">
          <div class="booking-time-quantum-title">请选择时间段</div>
          <div v-if="scheduleList.length>0">
            <div v-for="(item,index) in scheduleList" :key="index" @click="chooseSchedule(item)" class="booking-time-quantum-item"
                 :class="{stripe:index%2==0}">
              <div class="booking-time-quantum">{{item.timequantum}}</div>
              <div class="booking-time-order" v-if="item.isorder==1&&item.basenum!=''&&item.basenum>=0">还有 <span class="basenum">{{item.basenum}}</span>
                个号
              </div>
              <div v-if="item.isorder!=1" class="already-booking-full">已约满</div>
            </div>
          </div>
          <div v-else class="vux-center empty-page">
            没有可{{bookType==0?'预约':'挂号'}}的时间段
          </div>
        </div>
      </popup>
    </view-box>
  </div>
</template>
<script>
  import SelectCard from '../../../menber/select-card/SelectCard'
  import {mapState, mapGetters, mapActions} from 'vuex'
  import {Popup} from 'vux'

  export default {
    components: {
      SelectCard: SelectCard,Popup
    },
    computed: {
      ...mapState({
        hospitalInfo: state => state.hospital.current,
        doctorInfo: state => state.doctorInfo,
        scheduleInfo: state => state.selectedSchedule,
        bookingData: state => state.bookingData,
        memberList: state => state.memberList,
        selectedMember: state => state.selectedMember,
        scheduleList: state => state.scheduleList,
        memberType:state=>state.memberType
//        selectedCard:state => state.selectedCards[this.funKey]
      }),
      ...mapGetters(["cardList"]),
      bookType: function () {
        return this.$routeData.bookType
      },
      funKey: function () {
        return this.$routeData.funKey
      },
      selectedCard: function () {
        return this.$store.state.selectedCards[this.$routeData.funKey];
      },
      isFirstPatient: function () {
        return this.$routeData.isFirstPatient
      }
    },
    created() {
      //  判断医院 是否需要身份证排序
      let clientId = shareData.clientId || this.$store.state.hospital.current.clientId ;
      this.needSort = clientId == "S-230100-52953";

      this.currMember = this.selectedMember;
      this.memberName = this.currMember.realname;
      if (this.memberName) {
        this.currCard = this.selectedCard;
        if (this.currCard) {
          this.cardNo = this.currCard.cardno;
        }
      }

      if (this.isFirstPatient == 1) {
        this.isShowMemberList = false;
        this.isShowCardList = false;
      } else {
        if (this.memberName) {
          this.isShowMemberList = false;
          this.isShowCardList = true;
        } else {
          this.isShowMemberList = true;
          this.isShowCardList = false;
        }
      }
      if (this.bookType == 0 && (!this.hospitalInfo.regNeedCard || this.hospitalInfo.regNeedCard.length == 0)) {
        this.isRegNeedCard = false
      } else {
        this.isRegNeedCard = true
      }
      this.reqMemberList();
    },
    watch: {
      currMember: function (val, oldValue) {

        if ((this.memberName != '' && this.cardNo != '') || (!this.isRegNeedCard && this.memberName != '')) {
          this.isCanOk = true
        } else {
          this.isCanOk = false
        }
      },
      currCard: function (val) {
        if ((this.memberName != '' && this.cardNo != '') || (!this.isRegNeedCard && this.memberName != '')) {
          this.isCanOk = true
        } else {
          this.isCanOk = false
        }
      }
    },
    data() {
      return {
        isShowMemberList: true,
        isShowCardList: false,
        isCanOk: false,
        currMember: {},
        currCard: {},
        memberName: '',
        cardNo: '',
        isRegNeedCard: true,
        rightPopupVisible:false,
        needSort:false
      }
    },
    methods: {
      ...mapActions(["reqMemberList", "regConfirmation"]),
      showAddMember(){
        if(!this.memberType||this.memberType=='other'){
          return true;
        }
        let isShow = true
        this.memberList.forEach((item)=>{
           if(item.relation=='本人'){
             isShow = false
           }
        })
        return isShow;
      },
      showMember(member){
        if(!this.memberType){
          return true;
        }else if(this.memberType=='self'&&member.relation=='本人'){
          return true;
        }else if(this.memberType=='other'&&member.relation!='本人'){
          return true;
        }else{
          return false;
        }
      },
      getWorkTypeName(workType){
//        1上午，2下午 3晚上4中午 5白天 6全天 7凌晨
        let workTypes = {"1":"上午","2":"下午","3":"晚上","4":"中午","5":"白天","6":"全天","7":"凌晨","8":"前夜","9":"后夜"};
        return workTypes[workType]
      },
      chooseMemeber(item) {
        this.isShowMemberList = false;
        this.isShowCardList = true;
        this.currMember = item;
        this.memberName = item.realname
        this.$store.commit('selectMember', item);
        let clientId = this.hospitalInfo.clientId
        if(clientId=='S-230100-52953'){
          this.$vux.alert.show({
            title: '提示',
            content: '如有门诊卡，请添加并选择挂号。无卡患者请选择身份证挂号，就诊前到自助机办卡。',
          })
        }
        let hsCode = this.hospitalInfo.hospitalcode
        if (hsCode === '18451') {
          this.$vux.alert.show({
            title: '温馨提示',
            content: '<p><span><span>请选择身份证或者就诊卡号，再进行挂号</span></span></p>',
            onShow () {
              console.log('Plugin: I\'m showing')
              this.$vux.alert.isVisible()
            },
            onHide () {
              console.log('Plugin: I\'m hiding')
              this.$vux.alert.hide()
            }
          })
        }
      },
      regconfirmation() {//预约挂号
        let bookingInfo = {
          title:this.bookType==0?'预约挂号':'当日挂号',
          regPayType: this.curPayType,
          routeName: 'register',
          bookType: this.bookType,
          doctorNotice: this.doctorInfo.treatmentnotice,
          bsstatus: 0,
          payresult:5,
          registerfee: '￥'+this.bookingData.registerfee,
          doctorName: this.doctorInfo.doctorname,
          doctorRank: this.doctorInfo.doctorrank,
          doctorSpecialty: this.doctorInfo.doctorspecialty,
          dotcorPhoto: this.doctorInfo.doctorphoto,
          hospitalDeptName: this.doctorInfo.departmentname,
          hospitalName: this.doctorInfo.hospitalname,
          realName: this.selectedMember.realname,
          doctorid: this.doctorInfo.doctorid,
          hospitalid: this.doctorInfo.hospitalid,
          riid: this.selectedMember.riid,//亲友ID
          regDate: this.bookingData.regdate,
          worktype: this.scheduleInfo.worktype,
          regTime: this.scheduleInfo.timequantum,
          scheduleid: this.scheduleInfo.scheduleid,
          cardno: this.isRegNeedCard ? this.currCard.cardno : '',
          cid: this.selectedMember.cid||this.selectedMember.guardiancardno,
          cardtype: this.isRegNeedCard ? this.currCard.cardtype : '',
        };
        this.regConfirmation({
          doctorid: this.doctorInfo.doctorid,
          departmentid: this.doctorInfo.departmentid,
          hospitalid: this.doctorInfo.hospitalid,
          riid: this.currMember.riid,//亲友ID
          workdate: this.bookingData.regdate,
          worktype: this.scheduleInfo.worktype,
          regtime: this.scheduleInfo.timequantum,
          scheduleid: this.scheduleInfo.scheduleid,
          cardno: this.isRegNeedCard ? this.currCard.cardno : '',
          cid: this.currMember.cid,
          cardtype: this.isRegNeedCard ? this.currCard.cardtype : '',
          regtype:this.bookType
        }).then((res) => {
          bookingInfo.reserveid = res.reserveid;
          bookingInfo.statusText = (this.bookType==0?'预约':'')+ '挂号成功'
          bookingInfo.orderNo = res.orderno;
          bookingInfo.status = 0;
          this.$store.commit('updateBookingResult', bookingInfo);
          shareInst.client.push({
            path: '/bookingResult',
            query: {
              bookType: this.bookType,
              funKey: this.funKey
            }
          })
        })
      },
      chooseSchedule(item){
        this.$store.commit('updateSelectedSehedule', item)
        this.rightPopupVisible=false
      },
      chooseCard(item) {

        let payload = {
          funKey:this.funKey,
          card:item
        };
        this.$store.commit("selectCard", payload);

        if (!item) {
          this.currCard = {};
          this.cardNo = '';
        } else {
          this.currCard = item;
          this.cardNo = item.cardno;
        }
      },
      addMember() {
        shareInst.client.push({
          path: '/addMember',
          query: {
            routeName: 'register',
            to:-1,
            funKey:this.funKey
          }
        })
      },
      memberBarClick() {
        if (this.isFirstPatient != 1) {
          this.isShowMemberList = true;
          this.isShowCardList = false;
//          this.$store.commit('selectMember', {});
        }
      },
      okClick: function () {
        if(this.bookType==0){
          if (this.doctorInfo.regPayType == 0) {
            this.regconfirmation();
          } else {
            shareInst.client.push({
              path: '/bookingPay',
              query: {
                bookType: this.bookType,
                funKey: this.funKey
              }
            })
          }
        }else{
          if (this.doctorInfo.currRegPayType == 0) {
            this.regconfirmation();
          } else {
            shareInst.client.push({
              path: '/bookingPay',
              query: {
                bookType: this.bookType,
                funKey: this.funKey
              }
            })
          }
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  .cmc-doctor-info-bar {
    padding: 10px;
    background: #fff;
    height: 70px;
    box-sizing: border-box;
    position: relative;
    border-bottom: 1px solid #f5f5f5;
    vertical-align: middle;
  }

  .cmc-doctor-info-bar img {
    width: 50px;
    height: 50px;
    float: left;
    border-radius: 50%;
    vertical-align: middle;
  }

  .cmc-doctor-info-bar strong {
    vertical-align: middle;
  }

  .cmc-doctor-info-bar span {
    color: #BBBBBB;
    font-size: 14px;
    vertical-align: text-bottom;
  }

  .cmc-info-plan {
    background: #fff;
    padding: 10px;
    font-size: 14px;
  }

  .cmc-info-bar {
    margin-top: 5px;
  }

  .cmc-info-bar .cmc-info-title {
    color: #BBBBBB;
    float: left;
    margin-right: 10px;
  }

  .cmc-weektype-bar {
    background: #fff;
    font-size: 14px;
    position: relative;
    padding: 10px;
  }

  .cmc-weektype-title {
    color: #383838;
  }

  .cmc-weektype-value {
    color: #A4A4A4;
  }

  .cmc-cell-bar-arrow:after {
    border: solid 2px #c8c8cd;
    border-bottom-width: 0;
    border-left-width: 0;
    content: " ";
    top: 50%;
    right: 20px;
    position: absolute;
    width: 5px;
    height: 5px;
    -webkit-transform: translateY(-50%) rotate(45deg);
    transform: translateY(-50%) rotate(45deg);
  }
  .member-radio{
    display: flex;
    flex-wrap: wrap;
    width: 100%;

    .choose-member {
      flex-basis: 29%;
      align-items: center;
      text-align: center;
      border: 1px solid #E4E4E4;
      color: #333333;
      border-radius: 4px;
      line-height: 3;
      margin-bottom: 15px;
    }
    .choose-member:nth-child(3n-1) {
      margin: 0 17px 15px;
    }
    .choose-member-selected{
      color: #436AB3;
      border:1px solid #436AB3;
    }
    .add-member-btn {
      padding: 10px 0px;
      flex-basis: 29%;
      display: inline-block;
      box-sizing: border-box;
      border-radius: 4px;
      text-align: center;
      border:1px solid #E6E6E6;
      color: #999999;
      font-size: 16px;
      margin-bottom: 15px;
    }
    .add-member-btn:nth-child(3n-1) {
      margin: 0 17px 15px;
    }
    .add-member-btn img {
      width: 16px;
      height: 16px;
      vertical-align: middle;
    }

    .add-member-btn:active {
      border:1px solid #436AB3;
    }
  }
  .choose-member-plan {
    padding: 10px 0px;
    background: #fff;
    font-size: 14px;
    display: flow-root;
  }

  .choose-member-box {
    width: 33%;
    padding: 5px 10px;
    color: #fff;
    box-sizing: border-box;
    float: left;
  }


  .choose-member:active {
    /*background: #738FFE;*/
  }



  .cmc-cell-bar {
    background: #fff;
    font-size: 14px;
    position: relative;
    padding: 10px;
  }

  .cmc-cell-title {

  }

  .cmc-cell-value {
    color: #939393;
  }

  .cmc-cell-bar:active {
    background: #f5f5f5;
  }

  .choose-card-box {
    width: 50%;
    padding: 5px 10px;
    box-sizing: border-box;
    float: left;
  }

  .choose-card-box .choose-card {
    background: #FAFAF0;
    padding: 10px;
    border-radius: 3px;
    border: 1px solid #F1F1EE;
  }

  .choose-card-box .choose-card strong {
    margin-top: 3px;
    font-size: 13px;
  }

  .choose-card-box .choose-card.checked {
    border: 2px solid #8BC34A;
    padding: 9px;
  }

  .cmc-tip-bar {
    box-sizing: border-box;
    padding: 13px 10px;
    border-bottom: 1px solid #D9D9D9;
    color: #333;
    width: 100%;
    font-size: 14px;
    background: #fff;
  }

  .select-card-box {
    padding: 0 16px;
  }

  .own-tip-bar {
    box-sizing: border-box;
    clear: both;
    padding: 5px;
    background: #FFF5E4;
    color: #F06A00;
    border-bottom: 0;
    opacity: 0.7;
  }

  .doctor-name-bar {
    margin-left: 60px;
  }

  .doctor-name-bar .doctor-name {
    color: #303030;
    font-size: 16px;
  }

  .doctor-name-bar .doctor-rank {
    color: #A7A7A7;
    font-size: 14px;
  }

  .booking-info-cell {

  }

  .booking-info-cell .booking-info-value {
    color: #6F6F6F;
  }

  .booking-info-cell .booking-info-money {
    color: #FFA600;
  }
  .booking-time-quantum-title {
    box-sizing: border-box;
    /*border-bottom: 1px solid #f5f5f5;*/
    background: #fff;
    font-size: 18px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }

  .booking-time-quantum-item {
    padding: 0px 20px;
    box-sizing: border-box;
    /*border-bottom: 1px solid #f5f5f5;*/
    background: #fff;
    font-size: 14px;
    position: relative;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }

  .booking-time-quantum-item:after {
    border: solid 2px #c8c8cd;
    border-bottom-width: 0;
    border-left-width: 0;
    content: " ";
    top: 50%;
    right: 10px;
    position: absolute;
    width: 8px;
    height: 8px;
    -webkit-transform: translateY(-50%) rotate(45deg);
    transform: translateY(-50%) rotate(45deg);
  }

  .booking-time-quantum-item.stripe {
    background: #F4F4F4;
    /*border-top: 1px solid #9E9E9D;*/
  }

  .booking-time-quantum-item .booking-time-quantum {
    float: left;
  }

  .booking-time-quantum-item .booking-time-order span {
    color: #4569B3;
  }

  .booking-time-quantum-item .booking-time-order {
    margin-right: 5px;
    float: right;
  }

  .booking-time-quantum-item .already-booking-full {
    color: #CFCFCF;
    float: right;
  }

</style>
