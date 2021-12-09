<template>
  <div class="page">
    <view-box>
      <x-header slot="header">取号候诊</x-header>

      <!--<div>

              <group>
            <cell>
              <span slot="title">
                <span class="order-no-title">订单号</span>
                <span>1243453</span>
              </span>
              <span class="status-text">
                <span  >停诊</span>
              </span>
            </cell>
         </group>
          <div>
            <div class="doctor-info-bar">
              <img >
              <div class="doctor-info">
                <strong>黄猪</strong><span class="doctor-info-jobtitle">主任医生 </span>
                <div class="doctor-info-text">内分泌科</div>
                <div class="doctor-info-text">深圳龙华</div>
              </div>
              <x-button mini class="take-btn" @click.native="getNumber(item)" >取号</x-button>
            </div>
          </div>
          <div class="booking-info-box">
            <div class="booking-info-plan own-web-plan">
              <div class="booking-info-bar">
                <span class="booking-info-title">姓名</span>
                <span class="booking-info-value">刘湘</span>
              </div>
              <div class="booking-info-bar">
                <span class="booking-info-title">时间</span>
                <span class="booking-info-value">2018-05-23( 三 ) 19:33</span>
              </div>
              <div class="booking-info-bar">
                <span class="booking-info-title">费用</span>
                <span class="booking-info-value">￥300</span>
              </div>
            </div>
          </div>
          <div class="wait-number" >
            <div>
              <div>
                <span>您的排队号是:</span><span class="line-no">33333</span>
               <span  class="take-text">
                  已轮到您就诊
                </span>
                <span >
                  <span>前面还有</span>
                  <span class="front-people-text"> 6</span>
                  <span>人</span>
                  <span class="tip-text" >,请留意叫号</span>
                </span>
              </div>

            </div>
          </div>
      </div>
      -->

      <div v-if="waitingList.length>0">
        <div v-for="item in waitingList">

          <group>
            <cell>
            <span slot="title">
              <span class="order-no-title">订单号</span>
              <span>{{item.reserveid}}</span>
            </span>
              <span class="status-text">
              <span v-if="isTaken(item.cantaketime,item.endtaketime) == 1 && item.status == 0 "
                    class="can-take">已到取号时间</span>
              <span v-if="isTaken(item.cantaketime,item.endtaketime) == 0 && item.status == 0 " class="waiting-take">还有{{waitingDate(item.cantaketime)}}才可取号</span>
              <span v-if="isTaken(item.cantaketime,item.endtaketime) == 2 && item.status !== 4"
                    class="already-end-take-time">已过取号时间</span>
              <span v-if="item.status==4" class="already-take">已取号</span>
              <span v-if="item.status==1">已退号</span>
              <span v-if="item.status==2">爽约</span>
              <span v-if="item.status==3">已就诊</span>
              <span v-if="item.status==5">停诊</span>
            </span>
            </cell>
          </group>
          <div>
            <div class="doctor-info-bar">
              <img :src="item.doctorphoto">
              <div class="doctor-info">
                <strong>{{ item.doctorname }}</strong><span class="doctor-info-jobtitle">{{ item.doctorrank }}</span>
                <div class="doctor-info-text">{{item.departmentname}}</div>
                <div class="doctor-info-text">{{item.hospitalname}}</div>
              </div>
              <x-button mini class="take-btn" v-if="item.status!=4&&isTaken(item.cantaketime,item.endtaketime)!=2" @click.native="getNumber(item)"
                        :disabled="isTaken(item.cantaketime,item.endtaketime) != 1 || item.status != 0">取号
              </x-button>
            </div>
          </div>
          <div class="booking-info-box">
            <div class="booking-info-plan own-web-plan">
              <div class="booking-info-bar">
                <span class="booking-info-title">姓名</span>
                <span class="booking-info-value">{{item.realname}}</span>
              </div>
              <div class="booking-info-bar">
                <span class="booking-info-title">时间</span>
                <span class="booking-info-value">{{item.regdate}} ( {{item.weekday}} ) {{item.regtime}}</span>
              </div>
              <div class="booking-info-bar">
                <span class="booking-info-title">费用</span>
                <span class="booking-info-value">￥{{item.bsregisterfee}}</span>
              </div>
            </div>
          </div>
          <div class="wait-number" v-if="item.status == 4">
            <div>
              <div>
                <span>您的排队号是:</span><span class="line-no">{{item.lineno}}</span>
                <span v-if="item.frontpeople == 0" class="take-text">
                已轮到您就诊
              </span>
                <span v-else>
                <span>前面还有</span>
                <span class="front-people-text"> {{item.frontpeople}} </span>
                <span>人</span>
                <span class="tip-text" v-if="item.frontpeople < 3 && item.frontpeople>0"> 请留意叫号</span>
              </span>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <figure class="empty-plan">
          <img src="@icon/ico-no.png" alt="">
          <p class="empty-text">今天没有可取的预约号</p>
          <div class="btn-box">
            <x-button @click.native="goRegHistory" type="primary" class="own-btn">查看预约记录</x-button>
          </div>
        </figure>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    computed: {
      ...mapState({
        waitingList: state => state.waitingList,
        waitingItem: state => state.waitingItem,
        hospitalInfo: state => state.hospital.current,
//        isCanTakeNo: state => state.isCanTakeNo
      }),
      cardInfo: function () {
        return this.$store.state.selectedCards['QHHZ'];
      },
    },
    created() {
      let isCanTakeNo = localStorage.getItem('isCanTakeNo',true);
      if (isCanTakeNo=='true') {
        this.gettakeno();
        localStorage.setItem('isCanTakeNo',false);
      }
      this.getTakeNoList()
      this.timer = setInterval(()=>{
        this.getTakeNoList()
      }, 5000);
    },
    data() {
      return {
        timer:'',
//        waitingList:[{
//          reghistoryid:'123456',
//          doctorid:'1',
//          reserveid:'123456789',
//          password:'123',
//          hospitalid:'61',
//          status:'0',//预约状态(0已预约、1已退号 、2爽约 、3已就诊、4已取号 、5停诊)
//          hospitalname:'测试医院',
//          departmentname:'消化科',
//          doctorname:'张三',
//          doctorphoto:'',
//          doctorrank:'主职医生',
//          realname:'李四',
//          regdate:'2018-05-16',
//          regtime:'08:00-12:00',
//          doctorspecialty:'',
//          countofcollection:'2',
//          countofreghistory:'3',
//          countofreview:'3',
//          isexpert:'1',
//          treatmentnotice:'',
//          bsregisterfee:'15.00',
//          bsclinicfee:'15.00',
//          bsexpertfee:'15.00',
//          riid:'30318',
//          cardno:'123456',
//          cardtype:'1',
//          weekday:'星期一',
//          cantaketime:'16:00',
//          endtaketime:'18:00',
//          lineno:'Y106',
//          frontpeople:'5'
//        }]
      }
    },
    beforeDestroy(){
      clearInterval(this.timer);
    },
    methods: {
      ...mapActions(["getTodayTakeNoList", "isPayOrder", "getTakeNo"]),
      getTakeNoList() {
        this.getTodayTakeNoList({
          hospitalcode: this.hospitalInfo.hospitalcode,
          isTakeNo:0
        });
      },
      isTaken(starttime, endtaketime) {

        let localH = new Date().getHours();
        let localM = new Date().getMinutes();
        let localMinutes = parseInt(localH * 60) + parseInt(localM);

        let startH = parseInt(starttime.split(':')[0]);
        let startM = parseInt(starttime.split(':')[1]);
        let startMinutes = parseInt(startH * 60) + parseInt(startM);

        let endH = parseInt(endtaketime.split(':')[0]);
        let endM = endtaketime.split(':').join('')[1];
        let endMinutes = parseInt(endH * 60) + parseInt(endM);

        if (startMinutes <= localMinutes && localMinutes <= endMinutes) {
          return 1; //可以取号
        } else if (startMinutes > localMinutes) {
          return 0; //还没到取号时间
        } else {
          return 2; //已过取号时间
        }
      },
      getNumber(item) {
        let self = this
        if (item.status == 0) {
          this.$vux.confirm.show({
            title: '您确定要立刻取号吗？',
            content: '建议您到医院后再取号，以免过号。',
            confirmText: '立即取号',
            onConfirm() {
              // 保存
              self.$store.commit('updateWaitItem', item);
              self.$store.commit('updateCardIsNewPage', true);
              shareInst.client.push({
                path: '/waitingSelectCard',
                query: {
                  routeName: 'waiting',
                  funKey:'QHHZ',
                  title:'取号候诊'
                }
              })
            },
            onCancel() {
            }
          })
        }
      },
      gettakeno() {
        this.getTakeNo({
          reghistoryid: this.waitingItem.reghistoryid,
          reserveid: this.waitingItem.reserveid,
          password: this.waitingItem.password||'',
          cardno: this.cardInfo.cardno,
          cardtype: this.cardInfo.cardtype,
          hospitalid: this.waitingItem.hospitalid,
          isTakeNo:1
        }).then((res) => {
          if (res.bsrestut == 0) {
            this.getTakeNoList();
            this.$vux.alert.show({
              title: '取号成功',
              content: '您的排队号是' + res.lineno,
            })
          } else {
            this.$vux.alert.show({
              title: res.title,
              content: res.message,
            })
          }
        });
      },

      waitingDate(date) {
        let n = new Date();
        let now = n.getHours()*60+n.getMinutes();
        let takeTime = date.split(':');
        let canTake = parseInt(takeTime[0])*60+parseInt(takeTime[1])
        if (canTake <= now) {
          return '';
        }
        let space = parseInt(canTake - now);
        let hourSpace = space % (24 * 60);
        let hour = parseInt(hourSpace / 60);
        let minute = hourSpace % 60 + 1;
        let d = '';
        if (hour > 0) {
          d += hour + '小时';
        }
        if (minute > 0) {
          d += minute + '分';
        }
        return d;
      },
      goRegHistory() {
        shareInst.client.push({
          path: '/myRegister',
          query: {
            index: 0
          }
        }, this)
      },
    }
  }
</script>
<style lang="scss" scoped>
  .empty-plan {
    text-align: center;
    margin-top: 100px;
    width: 100%;
  }

  .empty-text {
    margin-top: 10px;
    color: #999;
  }

  .btn-box {
    padding: 10px 20px;
  }

  .order-no-title {
    color: #bbb;
  }

  .already-end-take-time {
    color: #999;
    font-size: 0.875rem;
  }

  .waiting-take {
    color: #bbb;
    font-size: 0.875rem;
  }

  .can-take {
    color: #5677FC;
  }

  .take-btn {
    margin-top: 20px;
    float: right;
    background: #fff;
    color: $mainColor;
    border: 1px solid $mainColor;
  }
  .take-btn:disabled{
    color: #BBBBBB;
    border:1px solid #BBBBBB;
  }
  .take-btn:after {
    border: 0;
  }

  .doctor-info-bar {
    border-bottom: 0px;
    background: #fff;
  }

  .booking-info-box {
    padding: 0px 10px 15px 10px;
    background: #fff;
  }

  .wait-number {
    text-align: center;
    background: #fff;
    padding-bottom: 10px;
  }

  .line-no {
    color: #5677FC;
  }

  .take-text {
    color: #ff4949;
  }

  .front-people-text {
    color: #ff4949;
  }

  .tip-text {
    color: #ff4949;
  }

  .already-take {
    color: #5677FC;
  }

  .status-text {
    font-size: 0.875rem;
  }

  .own-web-plan {
    background: #F3F6FC;
  }

  .doctor-info-bar strong{
    color: black;
  }
  .booking-info-bar .booking-info-title{
    width: 30px;
  }
</style>
