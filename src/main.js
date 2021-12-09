// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './beforeLaunch'




import '../static/css/base.scss'





// vue模块：开始
import Vue from 'vue'
Vue.config.productionTip = false


import echarts from 'echarts'
Vue.prototype.$echarts = echarts

// 导入全局组件 : 开始
import {PayMethod,ChangePatient,TipTextBar} from '@app/components/index.js'
import {ViewBox,XHeader,ByAlert,ByConfirm} from '@components/index'

//完整导入 MintUI
   import MintUI from 'mint-ui'
   import 'mint-ui/lib/style.css'
   Vue.use(MintUI);

//按需导入 MintUI 和 vux
// import { Swipe, SwipeItem } from 'mint-ui'
import {XButton,Grid, GridItem,Group,Cell,CellBox,Checker, CheckerItem ,XInput,Actionsheet,CellFormPreview,XTable,WechatPlugin,LoadingPlugin,ConfirmPlugin,AlertPlugin,ToastPlugin,DatetimePlugin} from 'vux'

//导入 vue-wechat-title
import VueWechatTitle from 'vue-wechat-title' ;


Vue.usePlugins([WechatPlugin,LoadingPlugin,VueWechatTitle,ConfirmPlugin,AlertPlugin,ToastPlugin,DatetimePlugin]);
Vue.regComponents({ XHeader,ViewBox,ByAlert,ByConfirm,XButton,Grid, GridItem,Group,Cell,CellBox ,Checker, CheckerItem,XInput,Actionsheet,CellFormPreview,XTable,PayMethod,ChangePatient,TipTextBar});
// 导入全局组件：结束

import VueBarcode from '@xkeshi/vue-barcode'
Vue.component('barcode', VueBarcode);

import router from './router.js'
import store from './store.js'
import App from '@app/App'





/* eslint-disable no-new */
window.shareInst._app = new Vue({
  el: '#app-box',
  router,
  store,
  components: { App },
  template: '<App/>',
  beforeDestroy:function () {
    store.saveState();
  }
});

// vue模块：结束




/**
 * 给 window.shareInst 对象 添加计算属性 app ，获取全局的 app
 */
Object.defineProperty(window.shareInst, 'app', {
  get: function () {
    return this._app;
  }
});





//解析funModules:形始
import {parseFunModules} from '@tools/Tools' ;
import {funModules} from "@constant.js"

let locationProps = ["to","from","back"];
parseFunModules(funModules,locationProps,router);
//解析funModules:结束





Vue.prototype.publicUrl =  `${window.location.href.split('#')[0]}#`;


window.shareInst._wx = Vue.wechat ;
/**
 * 给 window.shareInst 对象 添加计算属性 wx ，获取全局的微信的jssdk对象
 */
Object.defineProperty(window.shareInst, 'wx', {
  get: function () {
    return this._wx;
  }
});


//mark:PWA配置
if (process.env.PWA && 'serviceWorker' in navigator) {
  window.byAddEventListener('load', function(){
    navigator.serviceWorker.register(`${__webpack_public_path__}service-worker.js`).then(registration => {
      console.log('ServiceWorker 注册成功: ', registration);
    }).catch(registrationError => {
      console.log('ServiceWorker 注册失败: ', registrationError);
    });
  });
}


