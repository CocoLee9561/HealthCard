// 路由：开始

// 路由：结束


// store：开始
import {getwxoutpaylist} from '@network/Api'

export let outpatientListMessageStoreConfigs = [
  {
    state: {
      outpatientMessageList: []
    },
    mutations: {},
    actions: {
      getWxOutPayList: function ({commit, state}, params) {
        state.outpatientMessageList=[]
        return getwxoutpaylist(params).then((res) => {
          state.outpatientMessageList = res
          return res;
        })
      }
    }
  }
]
// store：结束
