// 路由：开始

import Home from './home/Home'
import {homeStoreConfigs} from './home/config'

import My from './my/My'
import {messageStoreConfigs} from './message/config'

import Message from './message/Message'
import {myStoreConfigs} from './my/config'

export let entryChildRoutes = [
  {
    path: 'home',
    alias:"",
    name: 'Home',
    component:Home
  },
  {
    path: '/message',
    name: 'Message',
    component:Message
  },
  {
    path: 'my',
    name: 'My',
    component:My,
    // meta:{needLogIn:true}
  }
];

// 路由：结束





// store：开始

export let entryStoreConfigs = [
    {
        state: {}
    },
  ...homeStoreConfigs,
  ...messageStoreConfigs,
  ...myStoreConfigs
]
// store：结束
