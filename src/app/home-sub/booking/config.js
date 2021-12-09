// 组件导入模板
// const 组件名 = () => import(/* webpackChunkName: "booking" */ '路径')


// 路由：开始

// import DoctorList from './doctor-list/DoctorList'
const DoctorList = () => import(/* webpackChunkName: "booking" */ './doctor-list/DoctorList')
import {doctorListStoreConfigs} from './doctor-list/config'

// import DoctorInfo from './doctor-info/DoctorInfo'
const DoctorInfo = () => import(/* webpackChunkName: "booking" */ './doctor-info/DoctorInfo')
import {doctorInfoStoreConfigs} from './doctor-info/config'


// import ChooseMemberCard from './choose-member-card/ChooseMemberCard'
const ChooseMemberCard = () => import(/* webpackChunkName: "booking" */ './choose-member-card/ChooseMemberCard')
import {chooseMemberCardStoreConfigs} from './choose-member-card/config'

// import BookingPay from './booking-pay/BookingPay'
const BookingPay = () => import(/* webpackChunkName: "booking" */ './booking-pay/BookingPay')
import {bookingPayStoreConfigs} from './booking-pay/config'

// import BookingResult from './booking-result/BookingResult'
const BookingResult = () => import(/* webpackChunkName: "booking" */ './booking-result/BookingResult')
import {bookingResultStoreConfigs} from './booking-result/config'

// import ReviewList from './review-list/ReviewList'
const ReviewList = () => import(/* webpackChunkName: "booking" */ './review-list/ReviewList')
import {reviewListStoreConfigs} from "./review-list/config";

// import ReviewDetail from './review-detail/ReviewDetail'
const ReviewDetail = () => import(/* webpackChunkName: "booking" */ './review-detail/ReviewDetail')
import {reviewDetailStoreConfigs} from "./review-detail/config";

const BookingDetail = () => import(/* webpackChunkName: "booking" */ './booking-detail/BookingDetail')
import {bookingDetailStoreConfigs} from "./booking-detail/config";

export let bookingRoutesConfigs = [
  {
    path: '/doctorList',
    name: 'DoctorList',
    meta:{
      title: "医生列表",
      isShow: true,
      showLoading:true
    },
    component: DoctorList
  },{
    path: '/doctorInfo',
    name: 'DoctorInfo',
    component: DoctorInfo,
    meta:{
      title: "医生信息",
      isShow: true,
      showLoading:true
    },
  },{
    path: '/chooseMemberCard',
    name: 'ChooseMemberCard',
    component: ChooseMemberCard,
    meta:{
      title: "选择就诊人",
      isShow: true,
      showLoading:true
    },
  },{
    path: '/bookingPay',
    name: 'BookingPay',
    component: BookingPay,
    meta:{
      title: "挂号支付",
      isShow: true,
      showLoading:true
    },
  },{
    path: '/bookingResult',
    name: 'BookingResult',
    component: BookingResult,
    meta:{
      title: "挂号结果",
      isShow: true,
      showLoading:true
    },
  },{
    path: '/reviewList',
    name: 'ReviewList',
    component: ReviewList,
    meta:{
      title: "评论",
      isShow: true,
      showLoading:true
    },
  },{
    path: '/reviewDetail',
    name: 'ReviewDetail',
    component: ReviewDetail,
    meta:{
      title: "评论详情",
      isShow: true,
      showLoading:true
    },
  },
  {
    path: '/bookingDetail',
    name: 'BookingDetail',
    component: BookingDetail,
    meta:{
      title: "挂号详情",
      isShow: true,
      showLoading:true
    },
  }
];

// 路由：结束




// store：开始
import tool from '@common/libs/tool'
export let bookingStoreConfigs = [
  {
    state: {
      bookingResult:{}
    },
    mutations:{
      updateBookingResult(state,data){
        state.bookingResult=data;
      }
    },
  },
  ...doctorListStoreConfigs,
  ...doctorInfoStoreConfigs,
  ...chooseMemberCardStoreConfigs,
  ...bookingPayStoreConfigs,
  ...bookingResultStoreConfigs,
  ...reviewListStoreConfigs,
  ...reviewDetailStoreConfigs,
  ...bookingDetailStoreConfigs
];
// store：结束
