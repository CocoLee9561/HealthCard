
// 路由：开始

import {myRegisterChildRoutes,myRegisterStoreConfigs} from "./my-register/config";
import {myFocusChildRoutes,myFocusStoreConfigs} from "./my-focus/config";
import {mySpeakChildRoutes,mySpeakStoreConfigs} from "./my-speak/config";
import {aboutUsChildRoutes,aboutUsStoreConfigs} from "./about-us/config";

import MyRegister from './my-register/MyRegister'
import MyFocus from './my-focus/MyFocus'
import MySpeak from './my-speak/MySpeak'
import AboutUs from './about-us/AboutUs'

export let mySubChildRoutes = [
  {
    path: '/myRegister',
    name: 'MyRegister',
    component:MyRegister,
    meta:{
      title: "我的挂号",
      isShow: true
    },
  },{
    path: '/myFocus',
    name: 'MyFocus',
    component:MyFocus,
    meta:{
      title: "我的关注",
      isShow: true
    },
  },{
    path: '/mySpeak',
    name: 'MySpeak',
    component:MySpeak,
    meta:{
      title: "我有话说",
      isShow: true
    },
  },{
    path: '/aboutUs',
    name: 'AboutUs',
    component:AboutUs,
    meta:{
      title: "关于我们",
      isShow: true
    },
  },
  ...myRegisterChildRoutes,
  ...myFocusChildRoutes,
  ...mySpeakChildRoutes,
  ...aboutUsChildRoutes
];


// 路由：结束







// store：开始

export let mySubStoreConfigs = [

  ...myRegisterStoreConfigs,
  ...myFocusStoreConfigs,
  ...mySpeakStoreConfigs,
  ...aboutUsStoreConfigs
];
// store：结束
