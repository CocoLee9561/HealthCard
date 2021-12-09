<template>
  <div class="page">
    <view-box>
      <x-header slot="header">住院详情</x-header>
      <change-patient :realname="selectedMember.realname" :cardno="cardInfo.cardno" :to="changePatientTo"></change-patient>
      <div>
        <group :gutter="10" class="hospitallization-depsite-table" style="margin: 10px;">
          <cell is-link @click.native="toHistory" class="line-bottom line-intent">
            <span class="hospitalization-status-text" v-if="stayHospitalInfo.inflag" :class="{'inflag':stayHospitalInfo.inflag=='是'}"
                  slot="title">{{stayHospitalInfo.inflag == '是' ? '住院中' : '已出院'}}</span>
            <span v-else slot="title"></span>
            <span class="view-histroy">查看住院历史</span>
          </cell>
            <div class="booking-result-plan line-bottom line-intent" style="padding: 0px 16px 10px;">
              <div class="booking-result-info-bar">
                <span class="booking-result-info-title">住院号</span>
                <span class="booking-result-info-value">{{stayHospitalInfo.stayhospitalnum?stayHospitalInfo.stayhospitalnum:'--'}}</span>
              </div>
              <div class="booking-result-info-bar">
                <span class="booking-result-info-title">医院</span>
                <span class="booking-result-info-value">{{stayHospitalInfos.length>0?hospitalInfo.hospitalname:'--'}}</span>
              </div>
              <div class="booking-result-info-bar">
                <span class="booking-result-info-title">科室</span>
                <span class="booking-result-info-value">{{stayHospitalInfo.departmentname?stayHospitalInfo.departmentname:'--'}}</span>
              </div>
              <div class="booking-result-info-bar">
                <span class="booking-result-info-title">病区</span>
                <span class="booking-result-info-value">{{stayHospitalInfo.bingqu?stayHospitalInfo.bingqu:'--'}}</span>
              </div>
              <div class="booking-result-info-bar">
                <span class="booking-result-info-title">病床</span>
                <span class="booking-result-info-value">{{stayHospitalInfo.bednum?stayHospitalInfo.bednum:'--'}}</span>
              </div>
              <div class="booking-result-info-bar">
                <span class="booking-result-info-title">诊断</span>
                <span class="booking-result-info-value">{{stayHospitalInfo.zhenduan?stayHospitalInfo.zhenduan:'--'}}</span>
              </div>
              <div class="booking-result-info-bar">
                <span class="booking-result-info-title">入院</span>
                <span class="booking-result-info-value">{{stayHospitalInfo.stayhospitaldate?stayHospitalInfo.stayhospitaldate:'--'}}</span>
                <span class="right-text">{{stayHospitalInfo.inflag == '是' ? '已入院' : '共住院'}}<span
                  class="days"> {{stayHospitalInfo.days?stayHospitalInfo.days:'--'}} </span>天</span>
              </div>
            </div>
          <table border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td class="td-depsite">
                <div>
                  <div class="deposit-title">预交金余额</div>
                  <div class="money-text deposit-money">￥{{deposit.amountbalance||'0'}}</div>
                  <mt-button @click.native="toComplementDeposit" class="card-select-btn" mini
                             :disabled="stayHospitalInfo.inflag !='是'"> 补交预交金
                  </mt-button>
                </div>
              </td>
              <td class="td-depsite">
                <div @click="toDepositList">
                  <div class="deposit-title">预交金总额</div>
                  <div class="money-text deposit-money">￥{{deposit.amount||'0'}}</div>
                  <div class="view-histroy">查看预交记录> </div>
                </div>
              </td>
            </tr>
          </table>
        </group>

        <group :gutter="10" v-if="stayHospitalList.length>0" class="line-bottom">
          <cell>
            <span slot="title">费用总额<span class="sub-text" v-if="stayHospitalInfo.inflag == '是'">（不含今日费用）</span></span>
            <span class="money-text money">￥{{stayTotalFee}}</span>
          </cell>
        </group>
        <div v-if="stayHospitalList.length>0">
          <group gutter="0">
            <cell is-link v-for="(item,index) in stayHospitalList" :key="index"
                  @click.native="toHospitalizationList(item)">
              <span slot="title">{{item.date}}</span>
              <span>￥{{item.todaymoney}}</span>
            </cell>
          </group>
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    computed: {
      ...mapState({
        selectedMember: state => state.selectedMember,
        hospitalInfo: state => state.hospital.current,
        stayHospitalInfo: state => state.stayHospitalInfo,
        stayHospitalInfos:state=>state.stayHospitalInfos,
        deposit: state => state.deposit,
        stayHospitalList: state => state.stayHospitalList,
        stayTotalFee: state => state.stayTotalFee,
        isNewPage: state => state.isNewPage
      }),
      cardInfo: function () {
        return this.$store.state.selectedCards[this.funKey];
      },
      funKey: function () {
        return this.$routeData.funKey
      },
      changeSize:function(){
        return this.$routeData.routeName=='deposit'?2:3
      },
      routeName:function(){
        return this.$routeData.routeName
      },
      changePatientTo(){
        return {
          name: "MemberList",
          query: {
            funKey: this.$routeData.funKey,
            title: "住院预交金",
            hideBack: true,
            prompt: "您要查询谁的住院预交金？",
            to: JSON.stringify({
              name: "SelectCardPage",
              query: {
                funKey: this.$routeData.funKey,
                title: "住院预交金",
                to: -2
              }
            })

          },
        }
      }
    },
    mounted(){
    },
    created() {
      this.$store.commit('updateStayMember',{
        hospCode:this.hospitalInfo.hospitalcode,
        member:this.selectedMember,
        card:this.cardInfo
      })
      if (this.isNewPage) {
        this.stayHospitalAllInfo({
          hospitalcode: this.hospitalInfo.hospitalcode,
          riid: this.cardInfo.riid,
          cid: this.selectedMember.cid||this.selectedMember.guardiancardno,
          stayhospitalnum:this.cardInfo.cardno,
          ishis: 1
        }).then((res) => {
          if(this.stayHospitalInfos&&this.stayHospitalInfos.length>0) {
            this.stayhospitallist()
            this.loadDeposit()
          }
        })
      } else {
        if(this.stayHospitalInfos&&this.stayHospitalInfos.length>0) {
          this.stayhospitallist()
          this.loadDeposit()
        }
      }

    },
    data() {
      return {

      }
    },
    methods: {
      ...mapActions(["stayHospitalAllInfo", "getDeposit", "getStayHospitalList"]),
      loadDeposit(){
        this.getDeposit({
          hospitalcode: this.hospitalInfo.hospitalcode,
          stayhospitalnum: this.cardInfo.cardno,
          serialnum: this.stayHospitalInfo.serialnum,
          cardtype: this.cardInfo.cardtype,
          riid:this.selectedMember.riid
        })
      },
      stayhospitallist() {
        let endtime = ''
        if (this.stayHospitalInfo.inflag == '是') {
          var today = new Date();
          endtime = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        } else {
          endtime = this.stayHospitalInfo.leavehospitaldate;
        }
        this.getStayHospitalList({
          hospitalcode: this.hospitalInfo.hospitalcode,
          stayhospitalnum: this.stayHospitalInfo.stayhospitalnum,
          phone: this.selectedMember.mobile,
          starttime: this.stayHospitalInfo.stayhospitaldate,
          endtime: endtime,
          serialnum:this.stayHospitalInfo.serialnum,
          isloaditem:2,
          riid:this.selectedMember.riid
        })
      },
      toHistory() {
        if(this.hospitalInfo.hospitalcode == '18448'){
          console.log("123")
          shareInst.client.push({
            path: '/AGhospitalizationHistory',
            query: {
              funKey: this.funKey
            }
          })
        }else{
          shareInst.client.push({
            path: '/hospitalizationHistory',
            query: {
              funKey: this.funKey
            }
          })
        }

      },
      toDepositList() {
        if(this.stayHospitalInfos&&this.stayHospitalInfos.length>0) {
          shareInst.client.push({
            path: '/depositList',
            query: {
              funKey: this.funKey
            }
          })
        }
      },
      toComplementDeposit() {
        shareInst.client.push({
          path: '/complementDeposit',
          query: {
            funKey: this.funKey
          }
        })
      },
      toHospitalizationList(item) {
        shareInst.client.push({
          path: '/hospitalizationList',
          query: {
            name: "HospitalizationList",
            routeName: 'deposit',
            dateString: item.date,
            funKey: this.funKey,
            title: '住院清单'
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .hospitalization-status-text {
    color: $fontColor;
    font-size: 14px;
  }

  .inflag {
    color: $mainColor;
    border: 0;
  }

  .deposit-title {
    text-align: left;
    padding: 0px 10px;
    color: #bbb;
    font-size: 14px;
  }

  .deposit-money {
    font-size: 20px;
  }

  .view-histroy {
    font-size: 14px;
    color: #999;
  }

  .sub-text {
    color: #bbb;
  }

  .money-text {
    /*color: #F06A00;*/
    text-indent: 15px;
  }

  .days {
    color: #F06A00;
  }

  .right-text {
    float: right;
    color: #999;
  }

  .hosptalidation-deposit-plan {
    /*background: #F3F6FC;*/
  }
  .hospitallization-depsite-table{
    box-shadow: 5px 5px 5px #ccc;
  }
  .hospitallization-depsite-table table {
    border-collapse: collapse;
    border: 0px solid #E1E1E1;
    width: 100%;
    background: #fff;
    color: #888;
    font-size: 14px;
  }

  .hospitallization-depsite-table table tr {
    height: 40px;
  }

  .hospitallization-depsite-table table td {
    border-top: 0;
    border-right: 1px solid #E1E1E1;
    border-bottom: 1px solid #E1E1E1;
    border-left: 0;
    text-indent: 10px;

  }

  .doctor-text-black {
    color: #333;
  }

  .hospitallization-depsite-table table tr:last-child td {
    border-bottom: 0;
  }

  .hospitallization-depsite-table table tr td:last-child {
    border-right: 0;
  }

  .hospitallization-depsite-table .td-depsite {
    width: 65px;
    height: 50px;
    margin: 10px;
    padding: 15px 1px;
    width: 50%;
  }

  .td-depsite .view-histroy {
    line-height: 3.2;
    color: $mainColor
  }

  .card-select-btn {
    font-size: 12px;
    background: #fff;
    margin-top: 5px;
    border: 1px solid $mainColor;
    border-radius: 100px;
    box-shadow: none;
    color: $mainColor;
    margin-left: 15px;
    line-height: 1.6;
    height: 20px;
    margin-top: 10px;
  }

  .money {
    color: #F43530;
  }
</style>
