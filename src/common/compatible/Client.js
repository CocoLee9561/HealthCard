//requesttype 意义:  1web 2 安卓 3iOS 4 微信  5其他

import {payMethodMap,osName} from  '@constant.js' ;
import CmdURL from '@tools/CommandURL.js'


import {BackScheme,ConditionBack,augModeMap,Actions,Conditions} from '@tools/ConditionBack/index.js'
import {redirectCA,goLocatUseRouterA} from '@tools/ConditionAction.js'



//应用事件名字常量
export const clientEventNameMap = {
  background:"background",  //应用进入后台
  foreground: "foreground", //应用进入前台
  launch: "launch", //应用启动
  willClosed: "willClosed", //webview将要被关闭
  willQuit: "willQuit", //应用将要被退出
  webShow: "webShow" ,  //webview 显示
};


export default class Client {



  //不能重载的成员：开始

  //用户保存各个子类的单例
  static _onlyInstanceMap = {} ;

  //获取当前子类的单例
  static get onlyInstance(){
    if (!this._onlyInstanceMap[this.osName]){
      this._onlyInstanceMap[this.osName] = new this();
    }

    return this._onlyInstanceMap[this.osName]
  }


  get osName(){
    return this.constructor.osName;
  }


  /**
   * 测试当前环境是否是当前类所对应的客户端环境
   * @param asyn ? : boolean   可选；默认值：false ； 表示是否要进入异步测试
   * @return Client类型的实例  || Promise  ；
   *
   * 当 asyn  为 true 时， 返回 Promise 实例，Promise 实例解决时的参数为 当前Client类型的实例；
   * 当 asyn 为 fasle 或 被省略时， 返回当前Client类型的实例；
   *
   */
  static test(asyn) {
    if (asyn){

      return new Promise( (resolve, reject)=> {

        if (this.synTest()) {
          resolve(this.onlyInstance);
        } else {
          this.asynTest(()=> {resolve(this.onlyInstance)},()=>{reject()});
        }

      });

    }else {

      if (this.synTest()) {
        return this.onlyInstance;
      }else {
        return null;
      }

    }


  }



  //不能重载的成员：结束




  //环境检测：开始


  //系统名字
  static  osName = osName.client ;


  /**
   * 同步测试
   * @return boolean    表示是否是当前类型的对应的客户环境
   */
  static synTest(){
    return false;
  }

  /**
   * 异步测试
   * @param resolve : function   , 测试成功的回调函数
   * @param reject  : function   , 测试失败的回调函数
   */
  static asynTest(resolve, reject){

  }


  //环境检测：结束










  //构造函数：开始

  /*
  经过研究分析，发现：JS的构造函数 constructor 的执行步骤如下：
  1. 先进行该类的方法的创建；
  2. 然后执行 super()，调用父类的构造函数；
  3. 再执行类的属性的创建和默认值的设置；
  4. 最后执行构造函数 constructor 中 super() 下面的语句；

  所以，当需要把逻辑抽离到父类，在父类中访问子类的属性时，就获取不到子类的属性，因为此时子类的属性还末创建和设置；
  为了解决这个问题，我设计了如下解决方案：

  1. 定义一个用于创建被父类依赖的属性（简称：父类依赖属性）的方法 `initProperty()`；并在该方法中首先向上调用该方法 `super.initProperty()`， 注意：最顶层类的该方法不需要向上调用 ;
  2. 定义一个用于执行依赖子类属性的操作（简称：子类依赖操作）的方法 `initAction()` ; 并在该方法中首先向上调用该方法 `super.initAction()` ，注意：最顶层类的该方法不需要向上调用 ；
  3. 在最顶层的类的构造函数中调用 先调用 创建父类依赖属性的方法 `this.initProperty()` ，然后再调用 执行 子类依赖操作 的方法 `this.initAction()` ；

  注意：
  - 由于 `initProperty()`  和  `initAction()`  是在最顶层类的构造函数中调用的，所以子类的构造函数中的 `super()` 语句下的代码会在 这2个方法（`initProperty()` 和 `initAction()`）之后执行；

  */
  constructor(){


    //先调用 创建父类依赖属性的方法
    let initProperty = this.initProperty ;
    if (initProperty && (typeof initProperty) == "function") {
      this.initProperty();
    }

    //再调用 执行 子类依赖操作 的方法
    let initAction = this.initAction ;
    if (initAction && (typeof initAction) == "function") {
      this.initAction();
    }

  }


  /*
  该方法用于创建被父类依赖的属性（简称：父类依赖属性） ；

  注意：
  - 子类需要在该方法中首先向上调用该方法 `super.initProperty()`；
  - 最顶层类的该方法不需要向上调用 ;
  - 由于 `initProperty()`  和  `initAction()`  是在最顶层类的构造函数中调用的，所以子类的构造函数中的 `super()` 语句下的代码会在 这2个方法（`initProperty()` 和 `initAction()`）之后执行；

  */

  initProperty(){
    // super.initProperty();

    /*
   创建返回方案实例；

   注意：
   该属性不可以以类的实例属性的方式创建；因为该属性会在 initAction 中用到；如果以类的实例属性的方式创建，则会造成：在执行 initAction 时，该属性还末创建的问题；
   */

    this.backScheme = new BackScheme(
      //backMap
      {

        Redirect: new ConditionBack({
          condition: redirectCA.conditions.judgeIsRedirect,
          action: redirectCA.actions.createRedirectAction(),
          augMode: augModeMap.constant,
          augmenter: 1
        }),


        /**
         * 如果 Locat 是有效数字，则执行正常的 ConditionBack 返回 ；
         * 如果 Locat 不是有效数字，则用 router 路由到指定位置；
         */
        WXH5Pay: new ConditionBack({
          condition: Conditions.judgeLocatIsNumber,
          action: Actions.createJudgeLocatIsNumberAction(goLocatUseRouterA),
          augMode: augModeMap.constant,
          augmenter: 1
        }),

        /**
         * 如果 Locat 是有效数字，则执行正常的 ConditionBack 返回 ；
         * 如果 Locat 不是有效数字，则用 router 路由到指定位置；
         */
        Alipay: new ConditionBack({
          condition: Conditions.judgeLocatIsNumber,
          action: Actions.createJudgeLocatIsNumberAction(goLocatUseRouterA),
          augMode: augModeMap.constant,
          augmenter: 3
        })

      },
      //backStack
      [


        /**
         * 当 locat 是 不是 number 类型时，用 router 导航 locat
         */
        new ConditionBack({
          condition: Conditions.locatIsNotNumber,
          action: goLocatUseRouterA,
          augMode: augModeMap.constant,
          augmenter: 0
        }),




        /**
         * 在有重定向标识时执行重定向
         */
        new ConditionBack({
          condition: redirectCA.conditions.isRedirect,
          action: Actions.normal,
          augMode: augModeMap.constant,
          augmenter: 1
        }),



        /**
         * 做正常的返回或者路由导航
         * 此 conditionBack 一般放在最后
         */
        new ConditionBack({
          condition: Conditions.judgeLocatIsNumber,
          action:Actions.createJudgeLocatIsNumberAction(goLocatUseRouterA),
          augMode: augModeMap.constant,
          augmenter: 0
        })



      ]);

  }



  /*
  该方法用于执行依赖子类属性的操作（简称：子类依赖操作）

  注意：
  - 子类需要在该方法中首先向上调用该方法 `super.initAction()`；
  - 最顶层类的该方法不需要向上调用 ;
  - 由于 `initProperty()`  和  `initAction()`  是在最顶层类的构造函数中调用的，所以子类的构造函数中的 `super()` 语句下的代码会在 这2个方法（`initProperty()` 和 `initAction()`）之后执行；

  */

  initAction(){
    // super.initAction();

    // 添加子类自己设置的 appendBackMap 和 backStack : 开始

    let appendBackMap = this.appendBackMap ;
    if (appendBackMap) {
      this.backScheme.appendBackMap(this.appendBackMap);
    }

    let backStack =  this.backStack ;
    if (backStack) {
      this.backScheme.backStack = backStack ;
    }

    // 添加子类自己设置的 appendBackMap 和 backStack : 结束

  }


  //构造函数：结束







  //事件：开始

  dispatchClientEvent(eventName,data){

    if (eventName) {

      let eventHandle = eventName + "Handle" ;
      this[eventHandle](data) ;

      let clientEvent = new Event(eventName, {"bubbles": true});
      clientEvent.data = data ;
      window.dispatchEvent(clientEvent);
    }
  }








  /**
   * 应用进入前台的处理器
   */
  foregroundHandle(data){
    let exeResult = this.executeCommand(data);

    if (!exeResult.finish) {
      //如果命令末执行成功

    }

  }






  /**
   * 应用进入后台的处理器
   */
  backgroundHandle(data){

  }



  /**
   * 应用启动的处理器
   */
  launchHandle(data){

  }



  /**
   * webview将要关闭的处理器
   */
  willClosedHandle(data){

  }



  /**
   * 应用将要退出的处理器
   */
  willQuitHandle(data){

  }




  /**
   * webview 显示
   */
  webShowHandle(data){

  }


  //事件：结束



  //命令：开始

  /**
   * 执行命令
   * @param data: string | { protocol: string ,namespaces : string ,command: string ,params: any}     命令数据
   */
  executeCommand(data){

    let exeResult = {
      finish: false,
      info: null
    };

    if (!data) {
      return exeResult ;
    }

    let cmdObj = data;

    if (typeof data == "string") {
      cmdObj = CmdURL.parse(data) ;
    }

    let { namespaces,command,params } = cmdObj ;

    let cmdData = params && params.data ;

    if (!command) {
      return exeResult;
    }

    switch (true) {

      //通过URL跳转
      case command.includes("url") :{
        window.location.href = cmdData ;
        exeResult.finish = true;
        break;
      }


      //通过 router 跳转
      case command.includes("router")  :{
        shareInst.router.pushWithData(cmdData);
        exeResult.finish = true;
        break;
      }

    }



    return exeResult;

  }


  //命令：结束




  showWebNavBar = true ; //是否显示 web 导航条 ；

  requestType = "5";
  payTypeId = 0 ;   //支付类型

  scheme = "http" ;   //客户的 Scheme

  allowPayMethods = [payMethodMap.weChatWeb,payMethodMap.alipay];   //允许的支付方式


  /**
   * 准备状态
   * @return {Promise<void> | *}
   */
  get ready(){
    if (!this._ready){
      this._ready = Promise.resolve();
    }

    return this._ready;
  }




  /**
   * 把 位置对象 loca 转成微信的回调地址
   * @param loca : Location   位置对象
   * @return string   微信的回调地址
   * @private
   *
   *
   * 注意：
   * 在IOS的包壳应用中使用微信的h5支付调起微信App支付完成后，点击身份的 完成 触发返回时，会在浏览器中调整 url ，
   * 解决方案是： 把回调 URL 的 scheme 设置为 本App 的 scheme ，这些在相应的客户的兼容模块里做，所以 ios 需要重载此方法
   *
   */
  _weChatRedirectUrlForLocat(loca){
    return shareInst.router.locationToURLStr(loca) ;
  }


  /**
   * 是否是微信环境
   * @returns {boolean}
   */
  isWeChat(){
    return this.constructor.osName==osName.weChat
  }

  /**
   * 是否是支付宝环境
   * @returns {boolean}
   */
  isAliPay(){
    return this.constructor.osName==osName.alipay
  }

  /**
   * 支付
   * @param payOptions
   * @returns Promise<any>
   *
   * payOptions 中可能包含的字段如下：
   * payType : 支付类型
   * nextLocation : string | RouteLocation 支付流程结束后跳转的位置，可以是完整的url字符串，或者 router 的位置对象；
   *
   */
  payment(payOptions){
    let {payType,nextLocation} = payOptions;
    console.log("55555")
    console.log(payType)
    console.log(nextLocation)



    return new Promise((resolve, reject)=>{

      let result = null;

      switch (payType) {
        case payMethodMap.weChatWeb.type :{
          let payString = payOptions.payString ;
          let mweb_url =  payString && payString.mweb_url ;
          let redirect_url = this._weChatRedirectUrlForLocat(nextLocation);
          result = this._weChatWebPay(mweb_url,redirect_url);

          break;
        }
        case payMethodMap.alipay.type:{
          result = this._alipayWebPay(payOptions.payString);
          break;
        }
        case payMethodMap.alipayApp.type:{
          result = this._alipayWebPay(payOptions.payString);
          break;
        }



        // case payMethodMap.checkoutCounter.type:{
        //   result = this._checkoutCounter(payOptions);
        //   break;
        // }





      }





      if (result.complete) {
        resolve(result.info);
      }else {
        reject(result.info);
      }


    });



  }


  // _checkoutCounter(payOptions){
  //   console.log("----payOptions：",payOptions);
  //
  //   if (payOptions.istianquanpay == 1) {
  //
  //   }else {
  //
  //   }
  //
  // }




  /**
   * 在网页中进行的支付宝支付
   * @param payHtmlStr : 支付宝返回的 html 文本
   * @returns {complete: boolean, info: any}
   * @private
   */
  _alipayWebPay(payHtmlStr){

    let result = {
      complete:false,
      info:"参数不正确"
    };

    let payEle = document.createElement("div");
    payEle.innerHTML = payHtmlStr ;
    document.body.appendChild(payEle);
    let fromEle = payEle.getElementsByTagName("form")[0];

    if (fromEle) {
      fromEle.submit();

      result.complete = true;
      result.info = "调用支付成功";
    }



    return result;
  }




  /**
   * 在网页中进行的微信支付
   * @param mwebUrl  : 微信的支付页面
   * @param redirectUrl : 支付流程结束后的返回页面
   * @returns {complete: boolean, info: any}
   * @private
   */
  _weChatWebPay(mwebUrl,redirectUrl){
    let result = {
      complete:true,
      info:"成功调用支付"
    };

    if (mwebUrl) {


      let paramsStr = "" ;

      if (redirectUrl){
        redirectUrl = encodeURIComponent(redirectUrl);
        paramsStr = `&redirect_url=${redirectUrl}` ;
      }


      let finalMwebUrl = mwebUrl + paramsStr ;

      this._weChatWebPayLaunchMwebUrl(finalMwebUrl) ;


    }else {

      result.complete = false;
      result.info = "mwebUrl不能为空" ;
    }


    return result;

  }


  /**
   * 加载微信支付的页面
   * @param mwebUrl
   * @private
   */
  _weChatWebPayLaunchMwebUrl(mwebUrl){
    window.location.href = mwebUrl ;
  }







  //路由：开始


  /**
   *
   * @param to : Location | number | "back" | "forward"   要导航的目标位置；
   * @param routeData ? : any   需要存储的路由数据
   * @param from ? : Route | string   用于生成 routeDataKey ；默认值：router.currentRoute；
   * @param onComplete ? | function
   * @param onAbort ? | function
   *
   * 注意：
   * - 当 to 是  number | "back" | "forward" 时，返回 null，并且会自动触发导航，其它情况，会返回解析后的目标位置对象；
   *
   * - 目标路由通过 查询参数 query.dataKey 来拿到 routeDataKey = fromKey + toKey
   *
   *    - 当 from 是 对象或者 路径时，fromKey 是解析后的路径
   *    - 当 from 是 非路径字符串（根据字符串中是否包含 `/` 来判断 ）时，fromKey 就是 from
   *    - 其它情况 fromKey 就是 "any"
   *
   *    - 当 to 是 number 类型 或者是 "back" 或 "forward" 时，toKey 是 "any" ;
   *    - 其它情况，toKey 是 解析后的路径
   *
   */
  pushWithData(to,data,from, onComplete, onAbort){

    shareInst.router.pushWithData(to,data,from,onComplete, onAbort)
  }





  /**
   *
   * @param to : Location | number | "back" | "forward"   要导航的目标位置；
   * @param routeData ? : any   需要存储的路由数据
   * @param from ? : Route | string   用于生成 routeDataKey ；默认值：router.currentRoute；
   * @param onComplete ? | function
   * @param onAbort ? | function
   *
   * 注意：
   * - 当 to 是  number | "back" | "forward" 时，返回 null，并且会自动触发导航，其它情况，会返回解析后的目标位置对象；
   *
   * - 目标路由通过 查询参数 query.dataKey 来拿到 routeDataKey = fromKey + toKey
   *
   *    - 当 from 是 对象或者 路径时，fromKey 是解析后的路径
   *    - 当 from 是 非路径字符串（根据字符串中是否包含 `/` 来判断 ）时，fromKey 就是 from
   *    - 其它情况 fromKey 就是 "any"
   *
   *    - 当 to 是 number 类型 或者是 "back" 或 "forward" 时，toKey 是 "any" ;
   *    - 其它情况，toKey 是 解析后的路径
   *
   */
  replaceWithData(to,data,from, onComplete, onAbort){
    shareInst.router.replaceWithData(to,data,from,onComplete, onAbort)
  }




  goWithData(n, routeData, from) {
    shareInst.router.goWithData(n, routeData, from);
  }


  backWithData (routeData, from) {
    shareInst.router.backWithData(routeData, from);
  }


  forwardWithData (routeData, from) {
    shareInst.router.forwardWithData(routeData, from);
  }


  setRouteData(key, routeData) {
    shareInst.router.setRouteData(key, routeData) ;
  }


  getRouteData(dataKey) {
    return shareInst.router.getRouteData(dataKey) ;
  }




  push(location, onComplete, onAbort){
    shareInst.router.push(location, onComplete, onAbort);
  }

  replace(location, onComplete, onAbort){
    shareInst.router.replace(location, onComplete, onAbort);
  }


  go(n){
    shareInst.router.go(n);
  }


  /**
   * 指定 back的 atuo 操作 包含的 webview 的id
   * @type Array<string>
   */
  // autoBackWebviewIDs = [];

  /**
   * 指定 back的 atuo 操作 排除的 webview 的id
   * @type Array<string>
   */
  autoBackExcludeWebviewIDs = [];

  //获取首页的 WebviewID
  get homePageWebviewID(){
    return "__W2A__" + location.hostname ;
  }



  forward(){
    shareInst.router.forward();
  }



  //路由：结束





  //导航条：开始
  updateNavBarOptions(navBarOptions){

    if (!this.showWebNavBar) {
      let {left,title,right} = navBarOptions ;
      let standardTitleOptions = this._transformTitleOptionsToStandard(title);

      this.updateNavLeftOptions(left);
      this.updateNavTitleOptions(standardTitleOptions);
      this.updateNavRightOptions(right);

    }

  }


  _transformTitleOptionsToStandard(navTitleOptions){
    let {title:titleOptions,buttonOptionsList} = navTitleOptions ;

    let titleBtnOptions = null ;
    let subTitleBtnOptions = null ;


    if (titleOptions.hide ){

      if (buttonOptionsList){
        titleBtnOptions =  buttonOptionsList[0] ;
        subTitleBtnOptions = buttonOptionsList[1] ;
      }


    }else {
      titleBtnOptions = titleOptions ;
      subTitleBtnOptions = buttonOptionsList && buttonOptionsList[0] ;
    }


    let standardTitleOptions = {
      title:titleBtnOptions,
      subtitle:subTitleBtnOptions
    };


    return standardTitleOptions ;

  }




  updateNavLeftOptions(navLeftOptions){

  }

  updateNavTitleOptions(navTitleOptions){

  }


  updateNavRightOptions(navRightOptions){

  }





  //导航条：结束











  //二维码：开始

  /**
   * 通过图片扫描条码数据
   * @param path
   * @param filters
   * @return {Promise<any>}
   */
  scanQRCodeFromImg({path, filters} ){
    return Promise.reject({message:"无法调取摄像头"});
  }


  scanQRCode(scanOptions){
    return Promise.reject({message:"无法调取摄像头"});
  }


  /**
   * 开始条码识别
   * 开始调用系统摄像头获取图片数据进行扫描识别，当识别出条码数据时通过onmarked回调函数返回。
   * @param options : BarcodeOptions 可选 条码识别的参数
   */
  qrCodeRestart(options){
  }



  /**
   * 设置闪光灯的开或关
   * @param open :  boolean 必选;是否开启闪光灯;可取值true或false，true表示打开闪光灯，false表示关闭闪光灯。
   */
  qrCodeSetFlash( open ){
  }

  /**
   * 结束对摄像头获取图片数据进行条码识别操作，同时关闭摄像头的视频捕获。 结束后可调用start方法重新开始识别。
   */
  qrCodeCancel(){
  }

  /**
   * 释放控件占用系统资源，调用close方法后控件对象将不可使用。
   */
  qrCodeClose(){
  }


  //二维码：结束





  //back处理器:开始

  /**
   * 可自定义返回策略的返回
   * @param key ? : string     可选；返回策略 backMap 中的key，会执行 backMap 中的相应的 conditionBack ；
   * @param locat ? : any     可选；在执行 conditionBack 时，给 conditionBack.back(locat) 函数传递的位置参数 ;
   * @returns boolean  表示是否执行成功
   *
   */
  back(key,locat){
    if(locat){
      let numParams = parseInt(locat) ;
      if (!isNaN(numParams) && numParams != 0){
        locat = -numParams ;
      }
    }
    return this.backScheme.back(locat,key);
  }





  //back处理器:结束






}
