<template>
  <div class="page">
    <view-box>
      <x-header slot="header" title="选择医院"></x-header>
      <!-- <mt-search v-model="searchHospitalName"></mt-search>-->
      <div v-if="hospList.length>0">
        <div class="hospital-list" v-for="item in hospList" @click="selected(item)">
          <img class="hospital-list-li-img hospital-image" :src="item.logo" alt="">
          <dl class="hospital-list-li-dl-left">
            <dt>
              <strong>{{ item.hospitalname }}</strong>
            </dt>
            <dd class="hospital-list-li-dl-left-dd">
              <img src="@icon/hospital_level.png" alt="" width="14" class="hospital-list-li-dd-icon">
              <!--	<img src="../../../../common/assets/icon/home/ic_level@2x.png" alt="" width="14" class="hospital-list-li-dd-icon">-->
              <span v-if="item.level">{{ item.level }}</span>
            </dd>
            <dd>
              <img src="@icon/hospital_name.png" alt="" width="14" class="hospital-list-li-dd-icon">
              <!--  	<img src="../../../../common/assets/icon/home/ic_hosipital_symbol@2x.png" alt="" width="14"  class="hospital-list-li-dd-icon">-->
              <span v-if="item.type">{{item.type}}</span>
            </dd>
          </dl>
          <dl class="hospital-list-li-dl-right">
            <dt v-if="item.districtname">
              {{item.districtname}}
            </dt>
          </dl>
        </div>
      </div>
      <div class="vux-center empty-page" v-else>
        暂无可用的医院列表
      </div>
    </view-box>
  </div>
</template>
<script>

  import {mapActions, mapMutations, mapState} from 'vuex'
import { debug } from 'util';

  export default {
    created() {
      if(this.uid&&this.ticket){
        this.$store.commit("saveLoginResult",{
          uid:this.uid,
          token:this.ticket
        })
      }
      this.reqAllHospital();
    },
    watch: {
      searchHospitalName: function (val) {

      },
      hospList: function (val, oldVal) {
        if (val.length == 1){
          this.selected(val[0],true);
        }
      },
    },
    data() {
      return {
        searchHospitalName: '',
//        routeName:this.$routeData.routeName
        // hospList:[]
      }
    },
    computed: {
      ...mapState({
        hospList: function (state) {
          return state.hospital.all;
        },
        stayMember:state=>state.stayMember,
        outpatientMember:state=>state.outpatientMember,
        outpatientCard:state=>state.outpatientCard,
        stayCard:state=>state.stayCard
      }),
      routeName: function () {
        return this.$routeData.routeName
      },
      uid:function(){
        return this.$routeData.uid
      },
      ticket:function(){
        return this.$routeData.ticket
      }
    },
    methods: {
      ...mapActions(["reqAllHospital","outpatientHint"]),
      ...mapMutations(["currentHospital"]),
      selected(hosp, auto) {

        this.currentHospital(hosp);
        this.outpatientHint();
        let toLocat = null ;

        if (this.routeName == 'ChooseHospital') {
          shareInst.client.back();
        } else if (this.routeName == 'bookingRegister') {
          if (hosp.isFirstPatient==1) {
            let isRegNeedCard=hosp.regNeedCard&&hosp.regNeedCard.length>0;
            if(isRegNeedCard) {
              toLocat = {
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
                          isFirstPatient: 1,
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
              }
            }else{
              toLocat = {
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
                      isFirstPatient: 1,
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
              }
            }
          } else {
            toLocat = {
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
            } ;
            // shareInst.client.push({
            //   name: "DepartmentList",
            //   query: {
            //     routeName: "bookingRegister",
            //     bookType: 0,
            //     funKey: 'YYGH',
            //     title: '选择科室',
            //     hideBack: false,
            //     to: JSON.stringify({
            //       name: "DoctorList",
            //       query: {
            //         bookType: 0,
            //         funKey: "YYGH",
            //         title: "医生列表",
            //         to: JSON.stringify({
            //           name: "DoctorInfo"
            //         })
            //       }
            //     })
            //   }
            // });
          }
        } else if (this.routeName == 'curRegister') {
          if (hosp.isFirstPatient==1) {

            toLocat = {
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
                        isFirstPatient: 1,
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
            } ;

            // shareInst.client.push({
            //   name: "MemberList",
            //   query: {
            //     funKey: 'DRGH',
            //     title: '当日挂号',
            //     hideBack: true,
            //     prompt: "你要为谁挂号？",
            //     to: JSON.stringify({
            //       name: "SelectCardPage",
            //       query: {
            //         funKey: 'DRGH',
            //         title: '当日挂号',
            //         to: JSON.stringify({
            //           name: "DepartmentList",
            //           query: {
            //             routeName: "curRegister",
            //             bookType: '1',
            //             funKey: 'DRGH',
            //             title: '选择科室',
            //             hideBack: false,
            //             to: JSON.stringify({
            //               name: "DoctorList",
            //               query: {
            //                 bookType: 1,
            //                 funKey: 'DRGH',
            //                 title: "医生列表",
            //                 isFirstPatient: 1,
            //                 to: JSON.stringify({
            //                   name: "DoctorInfo",
            //                 })
            //               }
            //             })
            //           }
            //         })
            //       }
            //     })
            //   }
            // })
          } else {

            toLocat = {
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
            };

          }
        } else if (this.routeName == 'hospitalInfo') {
          toLocat = {
            path: '/hospitalInfo',
          } ;

          // shareInst.client.push({
          //   path: '/hospitalInfo',
          // });
        } else if (this.routeName == 'recharge') {
          toLocat = {
            name:"MemberList",
            query:{
              funKey:"MZCZ",
              title:"门诊充值",
              hideBack:true,
              prompt:"您要为谁充值？",
              to:JSON.stringify({
                name:"SelectCardPage",
                query:{
                  funKey:"MZCZ",
                  title:"门诊充值",
                  to:JSON.stringify({
                    name:"PayForm",
                    query:{
                      funKey:'MZCZ',
                      routeName:'recharge'
                    }
                  })
                }
              })
            },
          } ;

          // shareInst.client.push({
          //   name:"MemberList",
          //   query:{
          //     funKey:"MZCZ",
          //     title:"门诊充值",
          //     hideBack:true,
          //     prompt:"您要为谁充值？",
          //     to:JSON.stringify({
          //       name:"SelectCardPage",
          //       query:{
          //         funKey:"MZCZ",
          //         title:"门诊充值",
          //         to:JSON.stringify({
          //           name:"PayForm",
          //           query:{
          //             funKey:'MZCZ',
          //             routeName:'recharge'
          //           }
          //         })
          //       }
          //     })
          //   },
          // });
        } else if (this.routeName == 'rechargeList') {
          toLocat = {
            name:"MemberList",
            query:{
              funKey:"CZJL",
              title:"充值记录",
              hideBack:true,
              prompt:"您要查看谁的充值记录？",
              to:JSON.stringify({
                name:"SelectCardPage",
                query:{
                  funKey:"CZJL",
                  title:"充值记录",
                  to:JSON.stringify({
                    name:"RechargeList",
                    query:{
                      funKey:'CZJL',
                      routeName:'recharge'
                    }
                  })
                }
              })
            },
          } ;
        } else if (this.routeName == 'OutpatientPayment') {
//          if(this.outpatientMember[hosp.hospitalcode]){
//            this.$store.commit('selectMember',this.outpatientMember[hosp.hospitalcode]);
//            this.$store.commit('selectCard',{
//              funKey:'MZJF',
//              card:this.outpatientCard[hosp.hospitalcode]
//            });
//            toLocat = {
//              name:"OutpatientList",
//              query:{
//                funKey:"MZJF"
//              }
//            }
//          }else{
            toLocat = {
              path: '/memberList',
              query: {
                funKey: "MZJF",
                title: "门诊缴费",
                hideBack: true,
                prompt: "您要查询谁的门诊费用？",
                to: JSON.stringify({
                  name: "SelectCardPage",
                  query: {
                    funKey: "MZJF",
                    title: "门诊缴费",
                    to: JSON.stringify({
                      name:"OutpatientList",
                      query:{
                        funKey:"MZJF"
                      }
                    })
                  }
                })
              }
            } ;
//          }

          // shareInst.client.push({
          //   path: '/memberList',
          //   query: {
          //     funKey: "MZJF",
          //     title: "门诊缴费",
          //     hideBack: true,
          //     prompt: "您要查询谁的门诊费用？",
          //     to: JSON.stringify({
          //       name: "SelectCardPage",
          //       query: {
          //         funKey: "MZJF",
          //         title: "门诊缴费",
          //         to: JSON.stringify({
          //           name:"OutpatientList",
          //           query:{
          //             funKey:"MZJF"
          //           }
          //         })
          //       }
          //     })
          //   }
          // }, this)
        } else if (this.routeName == 'deposit') {
//          if(this.stayMember[hosp.hospitalcode]){
//            this.$store.commit('selectMember',this.stayMember[hosp.hospitalcode]);
//            this.$store.commit('selectCard',{
//              funKey:'ZYYJJ',
//              card:this.stayCard[hosp.hospitalcode]
//            });
//            toLocat={
//              name:"HospitalizationDeposit",
//              query:{
//                funKey:"ZYYJJ",
//                routeName:'deposit'
//              }
//            }
//          }else{
            toLocat = {
              path: '/memberList',
              query: {
                funKey: "ZYYJJ",
                title: "住院预交金",
                hideBack: true,
                prompt: "您要查询谁的住院预交金？",
                to: JSON.stringify({
                  name: "SelectCardPage",
                  query: {
                    funKey: "ZYYJJ",
                    title: "住院预交金",
                    to: JSON.stringify({
                      name: "HospitalizationDeposit",
                      query:{
                        funKey: "ZYYJJ"
                      }
                    })
                  }
                })
              }
            } ;
//          }

        } else if (this.routeName == 'hospitalizationList') {
          toLocat = {
            name: "MemberList",
            query: {
              funKey: "ZYQD",
              title: "住院清单",
              hideBack: true,
              prompt: "您要查询谁的住院清单？",
              to: JSON.stringify({
                name: "SelectCardPage",
                query: {
                  funKey: "ZYQD",
                  title: "住院清单",
                  to: JSON.stringify({
                    name: "HospitalizationList",
                    query: {
                      title: "住院清单",
                      funKey: "ZYQD",
                      routeName: 'hospitalizationList'
                    }
                  })
                }
              })
            },
          };


        } else if (this.routeName == 'outpatientList') {
          toLocat = {
            name: "MemberList",
            query: {
              funKey: "MZQD",
              title: "门诊清单",
              hideBack: true,
              prompt: "您要查询谁的门诊清单？",
              to: JSON.stringify({
                name: "SelectCardPage",
                query: {
                  funKey: "MZQD",
                  title: "门诊清单",
                  to: JSON.stringify({
                    name: "HospitalizationList",
                    query: {
                      title: "门诊清单",
                      funKey: "MZQD",
                      routeName: 'outpatientList'
                    }
                  })
                }
              })
            },
          };

          // shareInst.client.push({
          //   name: "MemberList",
          //   query: {
          //     funKey: "MZQD",
          //     title: "门诊清单",
          //     hideBack: true,
          //     prompt: "您要查询谁的门诊清单？",
          //     to: JSON.stringify({
          //       name: "SelectCardPage",
          //       query: {
          //         funKey: "MZQD",
          //         title: "门诊清单",
          //         to: JSON.stringify({
          //           name: "HospitalizationList",
          //           query: {
          //             title: "门诊清单",
          //             funKey: "MZQD",
          //             routeName: 'outpatientList'
          //           }
          //         })
          //       }
          //     })
          //   },
          // })
        } else if (this.routeName == 'waiting') {
          toLocat = {
            name: "WaitingList",
            query: {
              funKey: "QHHZ",
              title: "取号候诊",
            },
          } ;


        } else if (this.routeName == 'review') {
          toLocat = {
            name: "ReviewDoctorList",
            query: {
              funKey: "JYDP",
              title: "就医点评",
            },
          } ;


        }else if(this.routeName=='departmentIntro'){
//          window.location.href=`http://${window.location.host}/deptintro/${hosp.hospitalcode}/index.html`;
          toLocat={
            path:'/departmentIntro'
          }
        }else if(this.routeName=='doctorIntro'){
//          window.location.href=`http://${window.location.host}/doctorintro/${hosp.hospitalcode}/index.html`;
          toLocat={
            path:'/doctorIntro'
          }
        }else if(this.routeName=='queryReport'){
          toLocat = {
            name:"MemberList",
            query:{
              funKey:"BGCX",
              title:"报告查询",
              hideBack:true,
              prompt:"您要查询谁的报告？",
              to:JSON.stringify({
                name:"SelectCardPage",
                query:{
                  funKey:"BGCX",
                  title:"报告查询",
                  to:JSON.stringify({
                    name:"ReportList",
                    query:{
                      funKey:"BGCX",
                    }
                  })
                }
              })
            },
          };

        }else if(this.routeName=='navigation'){
          toLocat = {
            name:'Navigation'
          } ;
        }else if(this.routeName=='guidance'){
          this.$store.commit('updateTabSelected',0)
          this.$store.commit('updateSmartDirection','front');
          this.$store.commit('updateSmartSex','man')
          toLocat = {
            path:'/intelligentGuidance'
          }
        }else if(this.routeName=='myCard'){
          toLocat = {
            path:'/myCardList',
            query:{
              funKey:'WDJZK'
            }
          }
        }else if(this.routeName=='waitingDoctor'){
          toLocat = {
            name:"MemberList",
            query:{
              funKey:"HZCX",
              title:"候诊查询",
              hideBack:true,
              prompt:"您要查询谁的候诊信息？",
              to:JSON.stringify({
                name:"SelectCardPage",
                query:{
                  dataKey:'waitingDoctor',
                  funKey:"HZCX",
                  title:"候诊查询",
                  to:JSON.stringify({
                    name:"WaitingDoctor",
                    query:{
                      funKey:'HZCX'
                    }
                  })
                }
              })

            },
          }
        }else if(this.routeName=='buildCard'){
          toLocat = {
            name:"MemberList",
            query:{
              funKey:"ZXJD",
              title:"在线建档",
              hideBack:true,
              prompt:"您要给谁在线建档？",
              to:JSON.stringify({
                path:"/buildRecord",
                query:{
                  funKey:'ZXJD'
                }
              })
            }
          }
        }else if(this.routeName == 'alreadyPayList'){
          toLocat = {
            name:"MemberList",
            query:{
              funKey:"JFJL",
              title:"缴费记录",
              hideBack:false,
              prompt:"您要查询谁的缴费记录？",
              to:JSON.stringify({
                name:"SelectCardPage",
                query:{
                  dataKey:'outpatientPayment',
                  funKey:"JFJL",
                  title:"缴费记录",
                  to:JSON.stringify({
                    name:"AlreadyPayList",
                    query:{
                      funKey:"JFJL"
                    }
                  })
                }
              })
            },
          }
        }else if(this.routeName=='allDepositList'){
          toLocat = {
            name:"MemberList",
            query:{
              funKey:"YJJL",
              title:"预交记录",
              hideBack:true,
              prompt:"您要查询谁的预交记录？",
              to:JSON.stringify({
                name:"SelectCardPage",
                query:{
                  dataKey:'allDepositList',
                  funKey:"YJJL",
                  title:"预交记录",
                  to:JSON.stringify({
                    name:"AllDepositList",
                    query:{
                      funKey:"YJJL",
                      routeName:'deposit'
                    }
                  })
                }
              })
            },
          }
        }




        if (toLocat) {

          if  (auto){
            shareInst.client.replace(toLocat);
          }else {
            shareInst.client.push(toLocat);
          }

        }



      }




    }
  }
</script>
<style>
  .hospital-list {
    padding: 10px 16px;
    background: #fff;
    width: 100%;
    clear: both;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
  }

  .hospital-list:after{
    content: ' ';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #D9D9D9;
    transform-origin: 0 100%;
    transform: scaleY(0.5);
  }

  .hospital-list .hospital-image {
    width: 4.2rem;
    height: 4.2rem;
    float: left;
  }

  .hospital-list .hospital-list-li-dl-left {
    float: left;
  }

  .hospital-list .hospital-list-li-dl-right {
    float: right;
  }

  .hospital-list dl {
    margin: 0px;
  }

  .hospital-list strong {
    margin-left: 10px;
    margin-top: 0px;
  }

  .hospital-list dd {
    margin-left: 10px;
    font-size: 13px;
    color: #333;
    line-height: 1.5;
  }

  .hospital-list .hospital-list-li-dl-left-dd {
    margin-top: 3px;
  }

  .hospital-list dd span {
    margin-left: 5px;
  }

  .hospital-list .hospital-list-li-dl-right {
    color: #ABABAB;
    font-size: 15px;
  }

  .hospital-list:active {
    background: #EEE;
  }

  .hospital-list-li-dd-icon {
    position: relative;
    top: 0.1rem;
  }
</style>
