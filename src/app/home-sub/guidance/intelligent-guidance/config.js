// 路由：开始


// 路由：结束





// store：开始

import {guidance} from '@network/Api'

export let intelligentGuidanceStoreConfigs = [
  {
    state:{
      guidanceBody:{},
      guidanceBodyList:[],
      currentPart:{},
      questionList:[],
      currQuestion:{},
      recommendDepartments:[],
      smartSex:'man',
      smartDirection:'front'
    },
    mutations:{
      updateSmartSex(state,data){
        state.smartSex=data
      },
      updateSmartDirection(state,data){
        state.smartDirection=data
      },
      updateCurrentPart(state,data){
        state.currentPart=data
      },
      updateQuestionList(state,data){
        state.questionList=[]
        state.currQuestion=data
        state.questionList.push(data)
      },
      questionOk(state){
        if(state.currQuestion.yes.type==1){
          state.questionList[state.questionList.length-1].result='yes'
          state.questionList.push(state.currQuestion.yes.wenti)
          state.currQuestion=state.currQuestion.yes.wenti
        }
      },
      questionCancel(state){
        if(state.currQuestion.no.type==1){
          state.questionList[state.questionList.length-1].result='no'
          state.questionList.push(state.currQuestion.no.wenti)
          state.currQuestion=state.currQuestion.no.wenti
        }
      },
      updateCurrQuestion(state,data){
        state.currQuestion=data
      },
      updateRecommendDepartments(state,data){
        state.recommendDepartments=data
      }
    },
    actions:{
      loadGuidance:function({commit,state},params){
        let hospitalCode = state.hospital.current.hospitalcode
        // let hospitalCode = 53485
        let sex = params.sex
        let url = `/zndz/${hospitalCode}/${sex}/data.json`
        state.guidanceBodyList=[]
        return guidance(url,params).then((res)=>{
          state.guidanceBody=res
          let _list = []
          Object.keys(res).forEach((key)=>{
            _list.push(res[key])
          })
          state.guidanceBodyList=_list.sort(function (funA, funB) {
            return funA.order - funB.order;
          })
          return res;
        })
      }
    }
  },
]
// store：结束
