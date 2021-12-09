import Vue from 'vue';
import Vuex from 'vuex';

import { appStoreConfigs } from './app/config.js';


Vue.use(Vuex);


let localStorageState = localStorage.getParsedItem('StoreState');
let storeOptions = Vuex.Store.mergeStoreConfigsWhitInitState(appStoreConfigs,localStorageState);

const store = new Vuex.Store(storeOptions);
window.shareInst._store = store;

/**
 * 给 window.shareInst 对象 添加计算属性 store ，用以获取全局的 store
 */
Object.defineProperty(window.shareInst, 'store', {
  get: function () {
    return this._store;
  }
});

/*
//恢复数据
window.byAddListenerForMultipleEvent(["pageshow","foreground","displayChange"], function (event) {


  console.log("---store监听的事件：" + event.type);


  if (event.type == "displayChange" ) {

    let {webviewID,action} = event.data  ;
    let currWVO = window.plus.webview.currentWebview();

    if (! (currWVO.id != webviewID && action == "close" ) ){
      return ;
    }
  }

  if (event.type == "pageshow" && !event.persisted) {
    return ;
  }



  let localStorageState = localStorage.getParsedItem('StoreState');
  store.replaceState(localStorageState);

  console.log(`--恢复数据${event.type}`)
});
*/


window.byAddListenerForMultipleEvent(["pagehide","background","willClosed","displayChange","willQuit"],function (event) {

  console.log("---store监听的事件：" + event.type);


  if (event.type == "displayChange" ) {

    let {webviewID,action} = event.data  ;
    let currWVO = window.plus.webview.currentWebview();

    if (!(currWVO.id != webviewID && action == "show" ) ){
      return ;
    }
  }




  store.saveState();

  console.log(`--保存数据${event.type}`)
})



export default store


