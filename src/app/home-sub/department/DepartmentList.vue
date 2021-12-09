<template>
  <div class="page">
    <view-box body-padding-bottom="0px" body-padding-top="0px">
      <div slot="header" ref="departmentHeaderId" id="department_header_id">
        <x-header  :title="title" class="header"></x-header>
        <group gutter="0" class="last-choose-dept-group" v-if="lastRegDoctor&&lastRegDoctor.doctorname">
          <cell is-link class="last-choose-dept" @click.native="toDoctorInfo">
            <span slot="title">上次{{bookType==0?'预约':'挂号'}}科室&nbsp;&nbsp;&nbsp;&nbsp;{{lastRegDoctor.doctorname}} | {{lastRegDepartment.departmentname}}</span>
          </cell>
        </group>
      </div>
      <div style="height: 100%;box-sizing: border-box;overflow: hidden;" :style="{paddingBottom:bottomPadding+'px'}">
        <div v-if="departmentList.length>0" style="height: 100%;overflow: auto;">
          <div v-if="!isSingleColumn" class="catagroy-list">
            <div class="catagroy-list-left">
              <ul>
                <li v-for="item in departmentList" :class="{active: activeName == item.departmentname}"
                    @click="clickOneDepartment(item)">
                  <p>{{item.departmentname}}</p>
                </li>
              </ul>
            </div>
            <div class="catagroy-list-right">
              <ul>
                <li v-for="item in childrens" @click="itemClick(item)">{{item.departmentname}}</li>
              </ul>
            </div>
          </div>
          <div v-else>
            <group gutter="0">
              <cell v-for="(item,index) in departmentList" :key="index" is-link :title="item.departmentname"
                    @click.native="itemClick(item)"></cell>
            </group>
          </div>
        </div>
        <div v-else class="vux-center empty-page">
          {{tipText}}
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>

  import {funModules} from '@constant.js'
  import {mapState, mapActions} from 'vuex'
  import Vue from 'vue'
  import VueCookies from 'vue-cookies'
  Vue.use(VueCookies)
  export default {
    computed: {
      ...mapState({
        hospitalInfo: state => state.hospital.current,
        isSingleColumn: state => state.isSingleColumn,
        departmentList: state => state.departmentList,
        lastRegDepartment:state=>state.lastRegDepartment,
        lastRegDoctor:state=>state.lastRegDoctor
      }),
      title: function () {
        let routeData = this.$routeData;
        let title = routeData.title || funModules[routeData.funKey].name;
        return title;
      },
      bookType: function () {
        return this.$routeData.bookType;
      },
      bottomPadding:function(){
        let a = 0;
        if(this.lastRegDoctor&&this.lastRegDoctor.doctorname){
          a=a + 44;
        }
        if(shareInst.client.showWebNavBar){
          a=a+46;
        }
        return a;
      }
    },
    mounted () {
      let hsCode = this.hospitalInfo.hospitalcode
      if (hsCode === '18451') {
        if (!document.cookie.includes('ck=')) {
          this.$vux.alert.show({
            title: '温馨提示',
            content: '<p><span><span>1.门诊上班时间：上午8:30-12:00；下午13:00-16:30！<br />2.挂号当日当次有效，过时作废！<br />3.就医期间请全程规范佩戴口罩！<br />4.需要报账的病人请到门诊收费窗口办理！<br /></span></span></p>',
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
          this.$cookies.set('ck', 'yes', 3600)
        }
      }


      if (hsCode === '18452') {
        // if (!document.cookie.includes('ln=')) {
          this.$vux.alert.show({
            title: '温馨提示',
            content: '<p><span><span>本院预约挂号采用实名制，凭有效身份证件号码及电话号码进行登记：一位患者同个专科只能预约一个医生号。就诊说明：1、看诊当日，请您在预约时段之前到现场候诊；2、在预约时段30分钟内未来就诊者，由分诊护士安排重新拍号；3、当日未来就诊者，视为爽约，爽约三次，将列入预约诊疗黑名单，12个月内无法预约挂号。&nbsp;<br/>&nbsp;<br/>退号说明：1、预约看诊日，当日0:00之前，可以在本服务号“我的预约记录”中操作退号，挂号费用将原路返回您的付款账户；2、预约看诊日，当日0：00之后，请您到门诊人工窗口退费，不可线上退号，谢谢您的理解。<br/></span></span></p><p><span><span></span></span></p>',
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
          // this.$cookies.set('ln', 'yes', 3600)
        // }
      }
    },
    created() {
      this.getRegDepartmentList({
        hospitalid: this.hospitalInfo.pkregHospitalId,
        regtype:this.bookType
      }).then((res)=>{
        this.tipText='暂无科室信息'
        if(res.length>0){
          this.clickOneDepartment(res[0])
        }
      });
      let self=this
      // this.bottomPadding = this.getBottomPadding()
      this.getLatestRegDepartment({
        hospitalid:this.hospitalInfo.pkregHospitalId
      }).then((res)=>{
        this.getLatestRegDoctor({
          departmentid:this.lastRegDepartment.departmentid
        }).then((res)=>{
          self.$nextTick((res)=>{
            let header = this.$refs.departmentHeaderId;
            if(header){
              // this.bottomPadding=header.offsetHeight
            }
          })
        })
      })

    },
    data() {
      return {
        activeName: '',
        childrens: [],
        tipText:'正在加载科室中...',
        // bottomPadding:0
      }
    },
    methods: {
      ...mapActions(["getRegDepartmentList", "selectedDepartment","getLatestRegDepartment","getLatestRegDoctor"]),
      clickOneDepartment(item) {
        this.childrens = item.children
        this.activeName = item.departmentname
      },
      itemClick(item) {
        this.$store.commit('updateTabSelected',0)
        this.selectedDepartment(item)
        let nextRoute = this.$routeData.to;
        shareInst.client.push(nextRoute)
      },
      toDoctorInfo(){
        this.$store.commit('updateTabSelected',0)
        this.selectedDepartment(this.lastRegDepartment)
        shareInst.client.push({
          path:'/doctorInfo',
          query:{
            bookType: this.bookType,
            doctorId: this.lastRegDoctor.doctorid,
            funKey: this.$routeData.funKey,
            departmentId: this.lastRegDepartment.departmentid,
            isFirstPatient: this.$routeData.isFirstPatient
          }
        })
      },
      getBottomPadding:function(){
        let a = 0;
        if(this.lastRegDoctor&&this.lastRegDoctor.doctorname){
          a=a + 44;
        }
        if(shareInst.client.showWebNavBar){
          a=a+46;
        }
        return a;
      }
    }
  }
</script>
<style>
  .catagroy-list {
    width: 100%;
    height: 100%;
    /*height:100vh;*/
  }

  .catagroy-list-left {
    overflow: hidden;
    width: 40%;
    height: 100%;
    float: left;
  }

  .catagroy-list-right {
    overflow: hidden;
    width: 60%;
    float: left;
    height: 100%;
    background: #fff;
  }

  .catagroy-list ul {
    margin: 0px;
    padding: 0px;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .catagroy-list li {
    height: auto;
    line-height: 48px;
    list-style: none;
    /*width: 101%;*/
  }

  .catagroy-list li p {
    margin: 0px;
    margin-left: 20px;
  }

  .catagroy-list ul li:focus {
    background-color: #ffffff;
  }

  .catagroy-list-right li {
    height: auto;
    line-height: 48px;
    margin-left: 20px;
    list-style: none;
  }

  .active {
    background: #ffffff;
    color: #4b6baf;
  }
  .last-choose-dept{
    background: #FFF9E1;
    color: #9F9E9B !important;
  }
  .last-choose-dept-group{
  }
</style>
