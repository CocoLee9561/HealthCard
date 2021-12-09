const NucleicInscpetList = () =>
    import ( /* webpackChunkName: "nucleic" */ './NucleicInscpetList')

const NucleicInscpetResult = () =>
    import ( /* webpackChunkName: "nucleic" */ './NucleicInscpetResult')

export let nucleicInscpetRoutesConfigs = [{
        path: '/nucleicInscpetList',
        name: 'NucleicInscpetList',
        meta: {
            title: "核酸检验",
            isShow: true,
            showLoading: true
        },
        component: NucleicInscpetList
    },
    {
        path: '/nucleicInscpetResult',
        name: 'NucleicInscpetResult',
        meta: {
            title: "核酸检验",
            isShow: true,
            showLoading: true
        },
        component: NucleicInscpetResult
    },
];

// 路由：结束




// store：开始
import tool from '@common/libs/tool'
import { natItemList, natItemSub, natItemSign, natItemCancel, natItemResult,natItemSignList } from '@network/Api'
export let nucleicInscpetStoreConfigs = [{
    state: {
        natList: [],
        natInfo: {},
        natItem: {},
    },
    mutations: {
        updateNatResult(state, params) {
            state.natItem = params || {}
        }
    },
    actions: {
        reqNatItemList({ commit, state }, params) {
            return natItemList(params).then((res) => {
                state.natInfo = res || {}
                state.natList = (res && res.list) || []
                return res;
            })
        },
        reqNatItemSub({ commit, state }, params) {
            return natItemSub(params).then((res) => {
                if (res && res.length > 0) {
                    let barcode = []
                    res.forEach((item) => {
                        if (item.barcode) {
                            barcode.push(item.barcode)
                        }
                    })
                    res[0].barcode = barcode
                    state.natItem = res[0];
                } else {
                    res.length = res || {};
                }
                return res;
            })
        },
        reqNatItemSign({ commit, state }, params) {
            return natItemSign(params).then((res) => {
                return res;
            })
        },
        reqNatItemCancel({ commit, state }, params) {
            return natItemCancel(params).then((res) => {
                return res;
            })
        },
        reqNatItemResult({ commit, state }, params) {
            return natItemResult(params).then((res) => {
                if (res && res.length > 0) {
                    state.natItem = res[0];
                } else {
                    res.length = res || {};
                }
                return res;
            })
        },
        reqNatItemSignList({commit,state},params){
          return natItemSignList(params).then((res)=>{
            let natItem = {
              state:'0',
              message:'预约成功',
              sendNo:'',
              natId :'',
              isCancel :'0',
              isTopay :'0',
              barcode:[],
              invoiceno:'',
            }
            let barcode = []
            let invoiceno = ''
            if(res.length>0){
              res.forEach((item)=>{
                if(item.content){
                  barcode.push(item.content)
                }
                invoiceno = item.invoiceno
              })
            }
            natItem.invoiceno = invoiceno
            console.log("123invoice:",invoiceno)
            console.log("natItem.invoiceno:",natItem.invoiceno)
            natItem.barcode = barcode
            state.natItem = natItem
          })
        }
    }
}];
// store：结束
