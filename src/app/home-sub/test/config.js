// 组件导入模板
// const 组件名 = () => import(/* webpackChunkName: "review" */ '路径')

// 路由：开始


// import WaitingList from './waiting-list/WaitingList'
const PayTest = () => import(/* webpackChunkName: "paytest" */ './PayTest')


export let payTestChildRoutes = [
  {
    path: '/payTest',
    name: 'PayTest',
    meta:{
      title: "支付测试",
      isShow: true,
      showLoading:true
    },
    component:PayTest
  }
];

// 路由：结束





// store：开始
import {testPaySign} from '@network/Api'
export let payTestStoreConfigs = [
  {
    state:{

    },
    mutations:{

    },
    actions:{
      testPaySign:function({commit,state},params){
        return testPaySign(params).then((res)=>{
          return res;
        })
      }
    }
  },

]
// store：结束
