import Vue from 'vue'
import Router from 'vue-router'
import {appChildRoutes} from '@app/config.js'
import {loadindTexts,funModules,locatPropsOfRouteData,specialLocats} from '@constant.js'


Vue.use(Router)


const router =  new Router({
  routes: appChildRoutes
});

window.shareInst._router = router;

/**
 * 给 window.shareInst 对象 添加计算属性 router ，用以获取全局的 router
 */
Object.defineProperty(window.shareInst, 'router', {
  get: function () {
    return this._router;
  }
});


//设置或者检查所有路由位置对象的属性名数组;
router.locatPropsOfRouteData = locatPropsOfRouteData



/**
 * 设置特殊的路由位置
 * 目前用于：
 * - App 中在特殊位置时按设备的返回按钮会使App退出
 */
router.specialLocats = specialLocats ;


//设置路由的通过 store 存取路由数据的相关配置
router.setRouteDataMutation = "setRouteData" ;
router.getRouteDataFromStore = function (store,dataKey) {
  return store.state.route.data[dataKey] ;
} ;



/**
 * 登录授权
 * 注意：
 * 如果某个路由需要 登录，则只需要在其路由配置中的 meta 中 添加 needLogIn 字段，值为 true
 */
router.beforeEach(function(to, from, next){
  //todo: 登录的meta字段
  let needLogIn = to.matched.some(function(record){return record.meta.needLogIn});
  if (needLogIn) {

    if (router.app.$store.state.isLogIn) {
      next()
    } else {
      // fixme: 跳到登录页面
      next({
        name: 'LogIn',
        query: { next: to.fullPath,redirect:true }
      })
    }
  } else {
    next();
  }
});





// 加载状态启动
router.beforeEach(function(to, from, next){
  //登录的meta字段
  let showLoading = to.matched.some(function(record){return record.meta.showLoading});
  if (showLoading && router.app.$vux) {
  //  显示加载状态
    router.app.$vux.loading.show({
      text:loadindTexts.pageSwitch
    });
  }
  next();
});

// 加载状态关闭
router.afterEach(function (to, from) {
  // 登录的meta字段
  let showLoading = to.matched.some(function(record){return record.meta.showLoading});
  if (showLoading && router.app.$vux) {
    //  关闭加载状态
    router.app.$vux.loading.hide();
  }
});








export default router
