// 路由：开始



// 路由：结束





// store：开始

import {getfunctionlist,gethomepagelist,getHomeFuncList,getFuncList,getNewfunctionlist,isHasMember} from '@network/Api'
import {funModules} from  '@constant.js'

export let homeStoreConfigs = [{
  state:{
    funList:[],
    funcList:[],
    homePageList:[],
    memberType:'',
    hasMember:{}
  },

  getters:{

  },

  mutations:{
    setMemberType(state,memberType){
      state.memberType = memberType;
    },
    setFuncList:function(state,funcList){
      if(funcList&&funcList.menus){
        funcList.menus.forEach(function (funListItem) {
          if(funListItem.menubtns){
            funListItem.menubtns.forEach((funItem)=>{
              let bsFunctionCode = funItem.bsFunctionCode;
              // let icon = funItem.icon
              // Object.assign(funItem, funModules[bsFunctionCode]);
              let to = funModules[bsFunctionCode]?funModules[bsFunctionCode].to:{}
              to = JSON.parse(JSON.stringify(to))
              if(to.query){
                to.query.memberType = funItem.memberType
              }else{
                to.query={
                  memberType:funItem.memberType
                }
              }
              funItem.to=to
              if (state.hospital.current.isFirstPatient == 1) {
                let isRegNeedCard=state.hospital.current.regNeedCard&&state.hospital.current.regNeedCard.length>0;
                if (bsFunctionCode == 'DRGH' || (isRegNeedCard&&bsFunctionCode == 'YYGH')) {
                  funItem.to = {
                    name: "MemberList",
                    query: {
                      memberType:funItem.memberType,
                      funKey: bsFunctionCode,
                      title: bsFunctionCode == 'DRGH' ? '当日挂号' : '预约挂号',
                      hideBack: true,
                      prompt: bsFunctionCode == 'DRGH' ?"您要为谁挂号？":'您要为谁预约？',
                      to: JSON.stringify({
                        name: "SelectCardPage",
                        query: {
                          memberType:funItem.memberType,
                          funKey: bsFunctionCode,
                          title: bsFunctionCode == 'DRGH' ? '当日挂号' : '预约挂号',
                          to: JSON.stringify({
                            name: "DepartmentList",
                            query: {
                              memberType:funItem.memberType,
                              routeName: bsFunctionCode == 'DRGH' ? "curRegister" : 'bookingRegister',
                              bookType: bsFunctionCode == 'DRGH' ? '1' : '0',
                              funKey: bsFunctionCode,
                              title: '选择科室',
                              hideBack: false,
                              to: JSON.stringify({
                                name: "DoctorList",
                                query: {
                                  memberType:funItem.memberType,
                                  bookType: bsFunctionCode == 'DRGH' ? '1' : '0',
                                  funKey: bsFunctionCode,
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
                  };
                }else if(!isRegNeedCard&&bsFunctionCode == 'YYGH'){
                  funItem.to = {
                    name: "MemberList",
                    query: {
                      memberType:funItem.memberType,
                      funKey: bsFunctionCode,
                      title: '预约挂号',
                      hideBack: true,
                      prompt: "您要为谁预约？",
                      to: JSON.stringify({
                        name: "DepartmentList",
                        query: {
                          memberType:funItem.memberType,
                          routeName: bsFunctionCode == 'DRGH' ? "curRegister" : 'bookingRegister',
                          bookType: bsFunctionCode == 'DRGH' ? '1' : '0',
                          funKey: bsFunctionCode,
                          title: '选择科室',
                          hideBack: false,
                          to: JSON.stringify({
                            name: "DoctorList",
                            query: {
                              memberType:funItem.memberType,
                              bookType: bsFunctionCode == 'DRGH' ? '1' : '0',
                              funKey: bsFunctionCode,
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
                  };
                }
              }
            })
          }
        })
        state.funcList=funcList
      }
    },
    setFunList:function(state,funlist){
      if(funlist){
        funlist.forEach(function (funListItem) {
          if(funListItem.functionList){
            funListItem.functionList.forEach((funItem)=>{
              let bsFunctionCode = funItem.bsFunctionCode;
              // let icon = funItem.icon
              // Object.assign(funItem, funModules[bsFunctionCode]);
              funItem.to=funModules[bsFunctionCode]?funModules[bsFunctionCode].to:{}
              if (state.hospital.current.isFirstPatient == 1) {
                let isRegNeedCard=state.hospital.current.regNeedCard&&state.hospital.current.regNeedCard.length>0;
                if (bsFunctionCode == 'DRGH' || (isRegNeedCard&&bsFunctionCode == 'YYGH')) {
                  funItem.to = {
                    name: "MemberList",
                    query: {
                      memberType:funItem.memberType,
                      funKey: bsFunctionCode,
                      title: bsFunctionCode == 'DRGH' ? '当日挂号' : '预约挂号',
                      hideBack: true,
                      prompt: bsFunctionCode == 'DRGH' ?"您要为谁挂号？":'您要为谁预约？',
                      to: JSON.stringify({
                        name: "SelectCardPage",
                        query: {
                          memberType:funItem.memberType,
                          funKey: bsFunctionCode,
                          title: bsFunctionCode == 'DRGH' ? '当日挂号' : '预约挂号',
                          to: JSON.stringify({
                            name: "DepartmentList",
                            query: {
                              memberType:funItem.memberType,
                              routeName: bsFunctionCode == 'DRGH' ? "curRegister" : 'bookingRegister',
                              bookType: bsFunctionCode == 'DRGH' ? '1' : '0',
                              funKey: bsFunctionCode,
                              title: '选择科室',
                              hideBack: false,
                              to: JSON.stringify({
                                name: "DoctorList",
                                query: {
                                  memberType:funItem.memberType,
                                  bookType: bsFunctionCode == 'DRGH' ? '1' : '0',
                                  funKey: bsFunctionCode,
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
                  };
                }else if(!isRegNeedCard&&bsFunctionCode == 'YYGH'){
                  funItem.to = {
                    name: "MemberList",
                    query: {
                      memberType:funItem.memberType,
                      funKey: bsFunctionCode,
                      title: '预约挂号',
                      hideBack: true,
                      prompt: "您要为谁预约？",
                      to: JSON.stringify({
                        name: "DepartmentList",
                        query: {
                          memberType:funItem.memberType,
                          routeName: bsFunctionCode == 'DRGH' ? "curRegister" : 'bookingRegister',
                          bookType: bsFunctionCode == 'DRGH' ? '1' : '0',
                          funKey: bsFunctionCode,
                          title: '选择科室',
                          hideBack: false,
                          to: JSON.stringify({
                            name: "DoctorList",
                            query: {
                              memberType:funItem.memberType,
                              bookType: bsFunctionCode == 'DRGH' ? '1' : '0',
                              funKey: bsFunctionCode,
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
                  };
                }
              }
            })
          }
        })
        state.funList=funlist
      }
    },
    saveFunList:function (state,funlist) {
      if (funlist) {


        funlist.forEach(function (funItem) {
          let bsFunctionCode = funItem.bsFunctionCode;
          Object.assign(funItem, funModules[bsFunctionCode]);
          if (state.hospital.current.isFirstPatient == 1) {
            let isRegNeedCard=state.hospital.current.regNeedCard&&state.hospital.current.regNeedCard.length>0;
            if (bsFunctionCode == 'DRGH' || (isRegNeedCard&&bsFunctionCode == 'YYGH')) {
              funItem.to = {
                name: "MemberList",
                query: {
                  funKey: bsFunctionCode,
                  title: bsFunctionCode == 'DRGH' ? '当日挂号' : '预约挂号',
                  hideBack: true,
                  prompt: bsFunctionCode == 'DRGH' ?"您要为谁挂号？":'您要为谁预约？',
                  to: JSON.stringify({
                    name: "SelectCardPage",
                    query: {
                      funKey: bsFunctionCode,
                      title: bsFunctionCode == 'DRGH' ? '当日挂号' : '预约挂号',
                      to: JSON.stringify({
                        name: "DepartmentList",
                        query: {
                          routeName: bsFunctionCode == 'DRGH' ? "curRegister" : 'bookingRegister',
                          bookType: bsFunctionCode == 'DRGH' ? '1' : '0',
                          funKey: bsFunctionCode,
                          title: '选择科室',
                          hideBack: false,
                          to: JSON.stringify({
                            name: "DoctorList",
                            query: {
                              bookType: bsFunctionCode == 'DRGH' ? '1' : '0',
                              funKey: bsFunctionCode,
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
              };
            }else if(!isRegNeedCard&&bsFunctionCode == 'YYGH'){
              funItem.to = {
                name: "MemberList",
                query: {
                  funKey: bsFunctionCode,
                  title: '预约挂号',
                  hideBack: true,
                  prompt: "您要为谁预约？",
                  to: JSON.stringify({
                    name: "DepartmentList",
                    query: {
                      routeName: bsFunctionCode == 'DRGH' ? "curRegister" : 'bookingRegister',
                      bookType: bsFunctionCode == 'DRGH' ? '1' : '0',
                      funKey: bsFunctionCode,
                      title: '选择科室',
                      hideBack: false,
                      to: JSON.stringify({
                        name: "DoctorList",
                        query: {
                          bookType: bsFunctionCode == 'DRGH' ? '1' : '0',
                          funKey: bsFunctionCode,
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
              };
            }
          }
        });

        funlist = funlist.sort(function (funA, funB) {
          return funA.bsOrderNo - funB.bsOrderNo;
        });

      }else {
        funlist = Object.values(funModules);
      }

      state.funList = funlist;
    },
    saveFunList2: function (state, funlist) {
      if (funlist&&funlist.btns) {
        //遍历所有 对象 过滤重新组装成前端方便显示构造的数组
        for (let funlistItem in funlist.btns) {
          let pageMenuList = funlist.btns[funlistItem];
          pageMenuList.forEach(function (funItem) {
            let bsFunctionCode = funItem.bsFunctionCode;
            // Object.assign(funItem, shareData.funModules[bsFunctionCode]);
            funItem.to=funModules[bsFunctionCode]?funModules[bsFunctionCode].to:{}
            //判断老年人 特殊处理
            if (state.hospital.current.isFirstPatient == 1) {
              let isRegNeedCard = state.hospital.current.regNeedCard && state.hospital.current.regNeedCard.length > 0;
              if (bsFunctionCode == 'DRGH' || (isRegNeedCard && bsFunctionCode == 'YYGH')) {
                funItem.to = {
                  name: "MemberList",
                  query: {
                    funKey: bsFunctionCode,
                    title: bsFunctionCode == 'DRGH' ? '当日挂号' : '预约挂号',
                    hideBack: true,
                    prompt: bsFunctionCode == 'DRGH' ? "您要为谁挂号？" : '您要为谁预约？',
                    to: JSON.stringify({
                      name: "SelectCardPage",
                      query: {
                        funKey: bsFunctionCode,
                        title: bsFunctionCode == 'DRGH' ? '当日挂号' : '预约挂号',
                        to: JSON.stringify({
                          name: "DepartmentList",
                          query: {
                            routeName: bsFunctionCode == 'DRGH' ? "curRegister" : 'bookingRegister',
                            bookType: bsFunctionCode == 'DRGH' ? '1' : '0',
                            funKey: bsFunctionCode,
                            title: '选择科室',
                            hideBack: false,
                            to: JSON.stringify({
                              name: "DoctorList",
                              query: {
                                bookType: bsFunctionCode == 'DRGH' ? '1' : '0',
                                funKey: bsFunctionCode,
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
                };
              } else if (!isRegNeedCard && bsFunctionCode == 'YYGH') {
                funItem.to = {
                  name: "MemberList",
                  query: {
                    funKey: bsFunctionCode,
                    title: '预约挂号',
                    hideBack: true,
                    prompt: "您要为谁预约？",
                    to: JSON.stringify({
                      name: "DepartmentList",
                      query: {
                        routeName: bsFunctionCode == 'DRGH' ? "curRegister" : 'bookingRegister',
                        bookType: bsFunctionCode == 'DRGH' ? '1' : '0',
                        funKey: bsFunctionCode,
                        title: '选择科室',
                        hideBack: false,
                        to: JSON.stringify({
                          name: "DoctorList",
                          query: {
                            bookType: bsFunctionCode == 'DRGH' ? '1' : '0',
                            funKey: bsFunctionCode,
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
                };
              }
            }
          });
          pageMenuList = pageMenuList.sort(function (funA, funB) {
            return funA.bsOrderNo - funB.bsOrderNo;
          });
        }
      } else {
        for (let funlistItem in funlist) {
          let pageMenuList = funlist[funlistItem];
          pageMenuList = Object.values(shareData.funModules);
        }
      }
      state.funList = funlist;
    }
  },

  actions:{
    reqFunList:function ({commit,state}) {
      let hospitalcode  = state.hospital.current.hospitalcode || '' ;
      // let {uid,token:ticket} = state.user;

      if (hospitalcode) {

        let data = {hospitalcode} ;

        getfunctionlist(data).then(function (funList) {
          commit("saveFunList",funList);
        });

      }else {
        commit("saveFunList",null);
      }

    },
    reqFunList2: function ({commit, state}) {
      let hospitalcode = state.hospital.current.hospitalcode || '';
      // let {uid,token:ticket} = state.user;
      if (hospitalcode) {
        let data = {hospCode:hospitalcode};
        return getNewfunctionlist(data).then(function (funList) {
          commit("saveFunList2", funList);
        });
      } else {
        commit("saveFunList2", null);
      }
    },
    getHomePageList:function({commit,state},params){
      if(!params){
        params={}
      }
      Object.assign(params,{
        bsHospitalCode:shareInst.store.state.hospital.current.hospitalcode
      })
      return gethomepagelist(params).then((res)=>{
        state.homePageList=res
        return res;
      })
    },
    regHomeFuncList:function({commit,state},params){
      return getHomeFuncList({
        hospCode:shareInst.store.state.hospital.current.hospitalcode
      }).then((res)=>{
        commit('setFunList',res)
        return res;
      })
    },
    getFuncList({commit,state},type){
      return getFuncList({
        hospCode:shareInst.store.state.hospital.current.hospitalcode,
        type:type
      }).then((res)=>{
        commit('setFuncList',res);
        return res;
      })
    },
    setMemberType({commit,state},memberType){
      commit('setMemberType',memberType)
    },
    isHasMember({commit,state},params){
      return isHasMember(params).then((res)=>{
        state.hasMember = res
        return res;
      })
    }
  }

}];
// store：结束
