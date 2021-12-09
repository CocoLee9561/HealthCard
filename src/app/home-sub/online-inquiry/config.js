const InquiryList = () =>
    import ( /* webpackChunkName: "inquiry" */ './InquiryList')
const InquiryDoctor = () =>
    import ( /* webpackChunkName: "inquiry" */ './InquiryDoctor')
const MyInquiry = () =>
    import ( /* webpackChunkName: "inquiry" */ './MyInquiry')
const ReplyInquiry = () =>
    import ( /* webpackChunkName: "inquiry" */ './ReplyInquiry')
const DoctorLogin = () =>
    import ( /* webpackChunkName: "inquiry" */ './DoctorLogin')
const DoctorResetPwd = () =>
    import ( /* webpackChunkName: "inquiry" */ './DoctorResetPwd')
export let inquiryRoutesConfigs = [{
        path: '/inquiryList',
        name: 'InquiryList',
        meta: {
            title: "医生列表",
            isShow: true,
            showLoading: true
        },
        component: InquiryList
    },
    {
        path: '/inquiryDoctor',
        name: 'InquiryDoctor',
        meta: {
            title: "医生列表",
            isShow: true,
            showLoading: true
        },
        component: InquiryDoctor
    },
    {
        path: '/myInquiry',
        name: 'MyInquiry',
        meta: {
            title: "医生列表",
            isShow: true,
            showLoading: true
        },
        component: MyInquiry
    },
    {
        path: '/replyInquiry',
        name: 'ReplyInquiry',
        meta: {
            title: "医生列表",
            isShow: true,
            showLoading: true
        },
        component: ReplyInquiry
    },
    {
        path: '/doctorLogin',
        name: 'DoctorLogin',
        meta: {
            title: "医生列表",
            isShow: true,
            showLoading: true
        },
        component: DoctorLogin
    },
    {
        path: '/doctorResetPwd',
        name: 'DoctorResetPwd',
        meta: {
            title: "医生列表",
            isShow: true,
            showLoading: true
        },
        component: DoctorResetPwd
    }
];

// 路由：结束




// store：开始
import tool from '@common/libs/tool'
import {doctorLogin,doctorResetPwd,reqDList,reqDListBytId,reqDoctorReply,reqDoctorList,reqThreadAsk,uploadFile,reqHzList} from '@network/Api'
export let inquiryStoreConfigs = [{
    state: {
        inquiryList: {},
        myInquiryList:[],
        replyInquiryList:[],
        inquiryDoctorList:[],
        inquiryDoctorInfo:{},
        dToken:''
    },
    mutations: {

    },
    actions: {
      reqDoctorLogin({commit,state},params) {
        return doctorLogin(params).then((res)=>{
          state.dToken = res
          return res;
        })
      },
      reqDoctorResetPwd({commit,state},params) {
        params = Object.assign(params,{dtoken:state.dToken})
        return doctorResetPwd(params).then((res)=>{
          return res;
        })
      },
      reqDList({commit,state},params) {
        params = Object.assign(params,{dtoken:state.dToken})
        return reqDList(params).then((res)=>{
          state.myInquiryList = res||[]
          return res;
        })
      },
      reqDListBytId({commit,state},params) {
        // params = Object.assign(params,{dtoken:state.dToken})
        return reqDListBytId(params).then((res)=>{
          state.replyInquiryList= res||[]
          return res;
        })
      },
      reqDoctorReply({commit,state},params) {
        params = Object.assign(params,{dtoken:state.dToken})
        return reqDoctorReply(params).then((res)=>{
          return res;
        })
      },
      reqDoctorList({commit,state},params) {
        let hid = state.hospital.current.hospitalCode
        // params = Object.assign(params,{hid:hid})
        return reqDoctorList({
          hid:hid
        }).then((res)=>{
          state.inquiryDoctorList=res||[]
          return res;
        })
      },
      reqThreadAsk({commit,state},params) {
        let hid = state.hospital.current.hospitalCode
        if(!params.hid){
          params.hid = hid
        }
        // params = Object.assign(params,{dtoken:state.dToken})
        return reqThreadAsk(params).then((res)=>{
          return res;
        })
      },
      setInquiryDoctorInfo({commit,state},params){
        state.inquiryDoctorInfo = params
      },
      uploadFile({commit,state},params){
        return uploadFile(params).then((res)=>{
          return res.data;
        })
      },
      reqHzList({commit,state},params){
        let hid = state.hospital.current.hospitalCode
        return reqHzList({
          hid:hid
        }).then((res)=>{
          state.myInquiryList = res
          return res;
        })
      }
    }
}];
// store：结束