<template>
  <div class="page">
    <view-box>
      <x-header slot="header">智能导诊</x-header>
      <group :gutter="0">
        <cell class="tip-bar jgck-tip">
          <span slot="icon">
            <img src="@icon/ico-other01.png" width="20px">
          </span>
          <span slot="title">以下是根据您所选症状推荐的就诊科室，结果<span class="jgck-text">仅供参考</span></span>
        </cell>
      </group>
      <group>
        <cell v-for="(item,index) in recommendDepartments" :key="index">
          <span slot="title">{{item.name}}</span>
          <span>
            <x-button mini @click.native="toBookingRegister(item)" v-if="item.regtype==2||item.regtype==3" class="register-btn booking-register-btn">预约挂号</x-button>
            <x-button mini @click.native="toCurrRegister(item)" v-if="item.regtype==1||item.regtype==3" class="register-btn curr-register-btn">当日挂号</x-button>
          </span>
        </cell>
      </group>
      <div class="tip-box">
        <div class="tip-title">温馨提示</div>
        <div class="tip-desc">每个人对疾病、病状描述的理解可能不一样，此处推荐的就诊科室仅供参考</div>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    computed: {
      ...mapState({
        recommendDepartments:state=>state.recommendDepartments,
        hospitalInfo:state=>state.hospital.current
      }),
    },
    created() {

    },
    data() {
      return {}
    },
    methods: {
      ...mapActions([""]),
      toBookingRegister(item){
        if (this.hospitalInfo.isFirstPatient==1) {
          let isRegNeedCard=this.hospitalInfo.regNeedCard&&this.hospitalInfo.regNeedCard.length>0;
          if(isRegNeedCard) {
            shareInst.client.push({
              name: "MemberList",
              query: {
                funKey: 'YYGH',
                title: '预约挂号',
                hideBack: true,
                prompt: "您要为谁预约？",
                to: JSON.stringify({
                  name: "SelectCardPage",
                  query: {
                    funKey: 'YYGH',
                    title: '预约挂号',
                    to: JSON.stringify({
                      name: "DepartmentList",
                      query: {
                        routeName: "bookingRegister",
                        bookType: 0,
                        funKey: 'YYGH',
                        title: '选择科室',
                        hideBack: false,
                        to: JSON.stringify({
                          name: "DoctorList",
                          query: {
                            bookType: 0,
                            funKey: 'YYGH',
                            title: "医生列表",
                            isFirstPatient: 1,
                            to: JSON.stringify({
                              name: "DoctorInfo",
                            })
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }else{
            shareInst.client.push({
              name: "MemberList",
              query: {
                funKey: 'YYGH',
                title: '预约挂号',
                hideBack: true,
                prompt: "您要为谁预约？",
                to: JSON.stringify({
                  name: "DepartmentList",
                  query: {
                    routeName: "bookingRegister",
                    bookType: 0,
                    funKey: 'YYGH',
                    title: '选择科室',
                    hideBack: false,
                    to: JSON.stringify({
                      name: "DoctorList",
                      query: {
                        bookType: 0,
                        funKey: 'YYGH',
                        title: "医生列表",
                        isFirstPatient: 1,
                        to: JSON.stringify({
                          name: "DoctorInfo",
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        } else {
          shareInst.client.push({
            name: "DepartmentList",
            query: {
              routeName: "bookingRegister",
              bookType: 0,
              funKey: 'YYGH',
              title: '选择科室',
              hideBack: false,
              to: JSON.stringify({
                name: "DoctorList",
                query: {
                  bookType: 0,
                  funKey: "YYGH",
                  title: "医生列表",
                  to: JSON.stringify({
                    name: "DoctorInfo"
                  })
                }
              })
            }
          })
        }
      },
      toCurrRegister(item){
        if (this.hospitalInfo.isFirstPatient==1) {

          shareInst.client.push({
            name: "MemberList",
            query: {
              funKey: 'DRGH',
              title: '当日挂号',
              hideBack: true,
              prompt: "您要为谁挂号？",
              to: JSON.stringify({
                name: "SelectCardPage",
                query: {
                  funKey: 'DRGH',
                  title: '当日挂号',
                  to: JSON.stringify({
                    name: "DepartmentList",
                    query: {
                      routeName: "curRegister",
                      bookType: '1',
                      funKey: 'DRGH',
                      title: '选择科室',
                      hideBack: false,
                      to: JSON.stringify({
                        name: "DoctorList",
                        query: {
                          bookType: 1,
                          funKey: 'DRGH',
                          title: "医生列表",
                          isFirstPatient: 1,
                          to: JSON.stringify({
                            name: "DoctorInfo",
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        } else {

          shareInst.client.push({
            name: "DepartmentList",
            query: {
              routeName: "curRegister",
              bookType: 1,
              funKey: 'DRGH',
              title: '选择科室',
              hideBack: false,
              to: JSON.stringify({
                name: "DoctorList",
                query: {
                  bookType: 1,
                  funKey: "DRGH",
                  title: "医生列表",
                  to: JSON.stringify({
                    name: "DoctorInfo"
                  })
                }
              })
            }
          });
        }
      }
    }
  }
</script>
<style>
  .jgck-tip .weui-cell__hd{
    align-self: start;
  }
</style>
<style scoped>

  .jgck-text{
    color: #FF576C;
    font-weight: bold;
  }
  .register-btn{
    margin-top: 0px !important;
    color: white;
  }
  .booking-register-btn{
    color: #2DCE85;
    background: transparent;
  }
  .booking-register-btn:after{
    border: 2px solid #2DCE85;
    border-radius: 5px;
  }
  .curr-register-btn{
    background: transparent;
    color: #FEA734;
  }
  .curr-register-btn:after{
    border: 2px solid #FEA734;
    border-radius: 5px;
  }
  .tip-box{
    margin-top: 16px;
    font-size: 14px;
    padding: 15px;
  }
  .tip-title{
    color: #FD8D21;
    font-weight: bold;
  }
  .tip-desc{
    color: #656565;
  }
  .tip-bar{
    color: #333;
    font-size: 15px;
  }
  .tip-bar img{
    margin-right: 10px;
  }
  .weui-cell:before{
    left: 0;
  }
  .weui-btn{
    overflow: visible;
  }
</style>
