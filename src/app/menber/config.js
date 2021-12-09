import {addMemberStoreConfigs} from './add-member/config'
import {memberListStoreConfigs} from './member-list/config'
import {addCardStoreConfigs} from './add-card/config'
import {editMemberStoreConfigs} from "./edit-member/config";
import {buildRecordStoreConfigs} from './build-record/config'

import MemberList from './member-list/MemberList'
import AddMember from './add-member/AddMember'
import AddCard from './add-card/AddCard'
import EditMember from './edit-member/EditMember'
import BuildRecord from './build-record/BuildRecord'
// 路由：开始



import SelectCard from './select-card/SelectCard'
import {selectCardStoreConfigs} from './select-card/config'


import SelectCardPage from './select-card-page/SelectCardPage'
// import {selectCardStoreConfigs} from './select-card-page/config'

import AddMemberCard from './add-member/AddMemberCard'

export let menberChildRoutes = [
  {
    path: '/memberList',
    name: 'MemberList',
    component:MemberList,
    meta:{
      title: "就诊人列表",
      isShow: true
    },
  },{
    path: '/addMember',
    name: 'AddMember',
    component:AddMember,
    meta:{
      title: "添加就诊人",
      isShow: true
    },
  },{
    path: '/addMemberCard',
    name: 'AddMemberCard',
    component:AddMemberCard,
    meta:{
      title: "绑定住院信息",
      isShow: true
    },
  },{
    path: '/addCard',
    name: 'AddCard',
    component:AddCard,
    meta:{
      title: "添加/编辑卡",
      isShow: true
    },
  },



  {
    path: '/SelectCard',
    name: 'SelectCard',
    component:SelectCard,
    meta:{
      title: "选择卡",
      isShow: true
    },
  },
  {
    path: '/SelectCardPage',
    name: 'SelectCardPage',
    component:SelectCardPage,
    meta:{
      title: "选择卡",
      isShow: true
    },
  },{
    path: '/editMember',
    name: 'EditMember',
    component:EditMember,
    meta:{
      title: "编辑就诊人",
      isShow: true
    },

  },{
    path: '/buildRecord',
    name: 'BuildRecord',
    component:BuildRecord,
    meta:{
      title: "在线建卡",
      isShow: true
    },
  }
];


// 路由：结束









// store：开始

export let menberStoreConfigs = [
  ...addMemberStoreConfigs,
  ...memberListStoreConfigs,
  ...addCardStoreConfigs,
  ...editMemberStoreConfigs,

  ...selectCardStoreConfigs,
  ...buildRecordStoreConfigs
];
// store：结束
