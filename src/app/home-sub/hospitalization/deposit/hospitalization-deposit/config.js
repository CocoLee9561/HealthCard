
// 路由：开始


export let hospitalizationDepositChildRoutes=[

]


// 路由：结束





// store：开始
import {stayhospitalallinfo,deposit,stayhospitallist} from '@network/Api'
export let hospitalizationDepositStoreConfigs = [
  {
    state:{
      stayHospitalInfos:[],
      stayHospitalInfo:{},
      deposit:{},
      stayHospitalList:[],
      hospitalwords:'',
      stayTotalFee:0.0,
      stayMember:{},
      stayCard:{}
    },
    mutations:{
      updateStayHospitalInfo:function(state,data){
        state.stayHospitalInfo=data
      },
      updateStayMember:function(state,data){
        state.stayMember[data.hospCode]=data.member
        state.stayCard[data.hospCode]=data.card
      }
    },
    actions:{
      stayHospitalAllInfo:function({commit,state},params){
        state.stayHospitalInfos=[]
        state.stayHospitalInfo={}
        state.stayTotalFee=0.0
        state.totalDeposit=0.0
        state.aveDepositFee='--';
        state.stayHospitalList=[]
        state.deposit={}
        return stayhospitalallinfo(params).then((res)=>{
          state.stayHospitalInfos=res;
          if(res.length>0){
            state.stayHospitalInfo=res[0]
          }else{
            state.stayHospitalInfo={}
          }
          return res;
        })
      },
      getDeposit:function({commit,state},params){
        state.deposit={}
        return deposit(params).then((res)=>{
          state.deposit=res;
          return res;
        })
      },
      getStayHospitalList:function({commit,state},params){
        state.stayTotalFee=0.0
        state.totalDeposit=0.0
        state.aveDepositFee='--';
        state.stayHospitalList=[]
        return stayhospitallist(params).then((res)=>{
          state.stayHospitalList=res.alldata
          state.hospitalwords=res.hospitalwords
          let total=0.0;
          res.alldata.forEach((val)=>{
            total+=parseFloat(val.todaymoney)
          })

          if(res.alldata.length>0){
            state.aveDepositFee=(total/res.alldata.length).toFixed(2)
          }else{
            state.aveDepositFee='--';
          }

          state.stayTotalFee=total.toFixed(2)
          return res;
        })
      }
    }
  }
]

// store：结束
