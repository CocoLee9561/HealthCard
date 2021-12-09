import Client from "./Client";
import {clientEventNameMap} from "./Client";

import {osName,qbrCode,QR_Type,Bar_Type,navBarStyles} from  '@constant.js' ;



import {ConditionBack,augModeMap,WebviewBack,specialWebviewTypeID,webviewIDIsTypeID,Actions,Conditions,getAllTypeIDsByWebviewID} from '@tools/ConditionBack/index.js'
import {redirectCA,goLocatUseRouterA,goLocatUseRouterOnBackWebviewA,isNeedQuitC} from '@tools/ConditionAction.js'

import {webviewEventBroadcast,dispenseEventSeries,dispenseEventSeriesInLaunch} from '@tools/Webview.js' ;

export default class App extends Client{

  static osName = osName.app;

  static synTest(){

    let userAgent = navigator.userAgent;

    let contHtml5Plus = /Html5Plus/i.test(userAgent);

    let osRegExp = new RegExp(this.osName,"i");
    let contSelf = osRegExp.test(userAgent);

    if (contHtml5Plus && contSelf) {
      return true;
    } else if (window.plus) {
      return osRegExp.test(plus.os.name);
    }

    return false;
  }

  static asynTest(resolve, reject){
    document.byAddEventListener("plusready", () => {
      let osRegExp = new RegExp(this.osName,"i");
      if (osRegExp.test(plus.os.name)) {
        resolve();
      }
    });
  }




  scheme = "allprocess" ;   //客户的 Scheme









  constructor(...rest){
    super(...rest);

    this._init();

  }


  /*
  该方法用于创建被父类依赖的属性（简称：父类依赖属性） ；

  注意：
  - 子类需要在该方法中首先向上调用该方法 `super.initProperty()`；
  - 最顶层类的该方法不需要向上调用 ;
  - 由于 `initProperty()`  和  `initAction()`  是在最顶层类的构造函数中调用的，所以子类的构造函数中的 `super()` 语句下的代码会在 这2个方法（`initProperty()` 和 `initAction()`）之后执行；

  */

  initProperty(){
    super.initProperty();




    /**
     * 追加的 backMap
     * @type {key:ConditionBack}
     * @private
     */
    this.appendBackMap = {
      /**
       * 如果 Locat 是有效数字，则会 跳过目标webviwe并继序返回 ；
       * 如果 Locat 不是有效数字，则会 在 backWebview 中用 router 导航 locat；
       */
      WXH5Pay: new WebviewBack({
        targetTypeID:"WXH5Pay",
        backTypeID:specialWebviewTypeID.LaunchWebview,
        condition: Conditions.judgeLocatIsNumber,
        action: Actions.createJudgeLocatIsNumberAction(goLocatUseRouterOnBackWebviewA,Actions.jumpTargetAndContinue),
        augMode: augModeMap.constant,
        augmenter: 0
      }),

      /**
       * 如果 Locat 是有效数字，则会 跳过目标webviwe并继序返回 ；
       * 如果 Locat 不是有效数字，则会 在 backWebview 中用 router 导航 locat；
       */
      Alipay: new WebviewBack({
        targetTypeID:"Alipay",
        backTypeID:specialWebviewTypeID.LaunchWebview,
        condition: Conditions.judgeLocatIsNumber,
        action: Actions.createJudgeLocatIsNumberAction(goLocatUseRouterOnBackWebviewA,Actions.jumpTargetAndContinue),
        augMode: augModeMap.constant,
        augmenter: 0
      }),



      /**
       * 在 Launch 中进行返回
       */
      BackOnLaunch: new WebviewBack({
        targetTypeID:specialWebviewTypeID.CurrentWebview,
        backTypeID:specialWebviewTypeID.LaunchWebview,
        condition: Conditions.judgeLocatIsNumber,
        action: Actions.createJudgeLocatIsNumberAction(goLocatUseRouterOnBackWebviewA,Actions.jumpTargetAndContinue),
        augMode: augModeMap.constant,
        augmenter: 0
      }),



    };



    /**
     * 返回栈
     * @type Array<ConditionBack>
     * @private
     */
    this.backStack = [


      /**
       * 当 locat 是 不是 number 类型时，在 backWebview 中用 router 导航 locat
       */
      new WebviewBack({
        targetTypeID:specialWebviewTypeID.CurrentWebview,
        backTypeID:specialWebviewTypeID.LaunchWebview,
        condition: Conditions.locatIsNotNumber,
        action: goLocatUseRouterOnBackWebviewA,
        augMode: augModeMap.constant,
        augmenter: 0
      }),


      /**
       * 在 LaunchWebview 中，当 router.isOnSpecialLocats 或者 history.length <= 1 时，退出应用
       */
      new WebviewBack({
        targetTypeID:specialWebviewTypeID.LaunchWebview,
        backTypeID:specialWebviewTypeID.LaunchWebview,
        condition: isNeedQuitC,
        action: Actions.quit,
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


    ];




  }


  _init(){

    this.ready.then((plus)=> {
      this._configEnv();
      this._addEventListener();
      this._closeSplashscreen();
      this._setWebView();

    });

  }



  _configEnv(){




    //分发事件系列
    if (!window.dispenseEventSeries) {
      window.dispenseEventSeries = dispenseEventSeries ;
    }


    //在 LaunchWebview 中分发事件系列
    if (!window.dispenseEventSeriesInLaunch) {
      window.dispenseEventSeriesInLaunch = dispenseEventSeriesInLaunch ;
    }


    //添加往所有webview中派发事件的方法
    if (!window.webviewEventBroadcast) {
      window.webviewEventBroadcast = webviewEventBroadcast ;
    }








  }






  /**
   * plus 是否准备完毕
   * @return {Promise|Promise<any>}
   */
  get ready(){
    if (!this._ready){
      this._ready = new Promise((resolve, reject)=>{
        if(window.plus && window.plus.isReady){
          resolve(window.plus);
        }else{
          document.byAddEventListener( "plusready", (event)=>{
            resolve(window.plus);
          });
        }
      });
    }

    return this._ready;
  }




  //关闭启动界面
  _closeSplashscreen(){
    if (window.plus && window.plus.navigator.hasSplashscreen()) {
      window.plus.navigator.closeSplashscreen();
    }

  }


  /**
   * 添加事件监听
   * @private
   */
  _addEventListener(){

    document.byAddListenerForMultipleEvent(["pause","background","resume","foreground","trimmemory"], (event)=>{


      let clientEventName = null ;
      let data = null ;

      switch (event.type) {
        case "pause" :{
          clientEventName = clientEventNameMap.background ;
          break;
        }

        case "background" :{
          clientEventName = clientEventNameMap.background ;
          break;
        }


        case "resume" :{
          clientEventName = clientEventNameMap.foreground ;
          data = plus.runtime.arguments ;
          break;
        }

        case "foreground" :{
          clientEventName = clientEventNameMap.foreground ;
          data = plus.runtime.arguments ;
          break;
        }

        case "trimmemory" :{
          clientEventName = clientEventNameMap.willQuit ;
          break;
        }

      }


      this.dispatchClientEvent(clientEventName,data) ;


    });


    let currWVO = plus.webview.currentWebview();

    currWVO.addEventListener("show", ()=> {
      console.log('----show;this:' + JSON.stringify(this));

      this.dispatchClientEvent(clientEventNameMap.webShow,null) ;

    });

    currWVO.addEventListener( "close", (event)=>{
      this.dispatchClientEvent(clientEventNameMap.willClosed,null) ;
    });






    if  (!window.commonAppendJS){ //如果 App 壳中的 common.append.js 文件还没有加载过

      currWVO.addEventListener("show", function(event) {
        console.log('----App:show;this:' + JSON.stringify(this));

        let webviewID = this && this.id ;
        dispenseEventSeriesInLaunch("Broadcast", "displayChange", {
          webviewID: webviewID,
          action: "show"
        });

      });

      currWVO.addEventListener( "close", function(event){
        console.log('----App:close;this:' + JSON.stringify(this));

        let webviewID = this && this.id ;
        dispenseEventSeriesInLaunch("Broadcast", "displayChange", {
          webviewID: webviewID,
          action: "close"
        });
      });



      //监听返回事件：开始
      plus.key.addEventListener("backbutton", function(event) {
        console.log("---App:backbutton");
        if (window.shareInst) {
          window.shareInst.client.back();
        }else{
          history.back();
        }

      });



    }


  }



  /**
   * 配置webview
   * @private
   */
  _setWebView() {
    let currentWV = plus.webview.currentWebview();

    //启动webview
    if (webviewIDIsTypeID(currentWV.id ,specialWebviewTypeID.LaunchWebview)) {
      currentWV.setStyle({
        'popGesture': 'none'
      });
    }


  }









  //二维码：开始

  /**
   * 通过图片扫描条码数据
   * @param path
   * @param filters
   *
   *
   * @return Promise
   * 成功回调参数 succResult
   * succResult.code : string   必选;  二维码条形码的code
   * succResult.type : 必选 ; 识别到的条码类型，是二维码还是条形码
   * succResult.typeId: ( Number ) 必选 识别到的条码类型id
   * succResult.code: ( String ) 必选 识别到的条码数据
   * succResult.file: ( String ) 可选 识别到的条码图片文件路径
   *
   * 失败的回调参数 error
   *
   */
  scanQRCodeFromImg({path, filters} ){

    return new Promise(function (resolve, reject) {
      // plus.barcode.scan( path, function (typeId, code, file) {
      //
      //   let qbrCodeInfo = qbrCode.getPropValueForId(typeId);
      //   let qbrCodeType = qbrCodeInfo && qbrCodeInfo.type ;
      //
      //   let result = {type:qbrCodeType,typeId,code,file};
      //   resolve(result)
      // }, function (error) {
      //   reject(error);
      // },filters);


      let ele = document.createElement("div");
      ele.id="div-scan"
      ele.setAttribute("style",'width:100%;height:100%;position:absolute;top:0;left:0;z-index:10000;background:black;');
      document.body.appendChild(ele);



      var barScan = new plus.barcode.Barcode("div-scan",[plus.barcode.QR,plus.barcode.AZTEC]);
      barScan.onmarked = function(type,code,file){
        var result = {type:type,code:code}
        document.body.removeChild(ele)
        barScan.close()
        resolve(result)
      };
      barScan.onerror = function(error){
        document.body.removeChild(ele)
        barScan.close()
        reject(error)
      }
      barScan.start({conserve:true});
    });

  }


  /**
   * 热苗二维码或者条形码
   * @param scanOptions
   * scanOptions.id: string  必选 条码识别控件在Webview窗口的DOM节点的id值
   * 为了定义条码识别控件在Webview窗口中的位置，需要指定控件定位标签（div或objecct）的id号，系统将根据此id号来确定条码识别控件的大小及位置。
   *
   * scanOptions.styles: BarcodeStyles  可选 条码识别控件样式
   *
   * scanOptions.conserve: boolean  可选  是否保存成功扫描到的条码数据时的截图；
   * 如果设置为true则在成功扫描到条码数据时将图片保存，并通过onmarked回调函数的file参数返回保存文件的路径。默认值为false，不保存图片。
   *
   * scanOptions.filename: string  可选  保存成功扫描到的条码数据时的图片路径
   * 可通过此参数设置保存截图的路径或名称，如果设置图片文件名称则必须指定文件的后缀名（必须是.png），否则认为是指定目录，文件名称则自动生成。
   *
   * scanOptions.vibrate: boolean  可选  成功扫描到条码数据时是否需要震动提醒
   * 如果设置为true则在成功扫描到条码数据时震动设备，false则不震动。默认值为true。
   *
   * scanOptions.sound: sring 可选  成功扫描到条码数据时播放的提示音类型
   * 可取值： "none" - 不播放提示音； "default" - 播放默认提示音（5+引擎内置）。 默认值为"default"。
   *
   *
   * @return Promise
   * 成功回调参数 succResult
   * succResult.code : string   必选;  二维码条形码的code
   * succResult.type : 必选 ; 识别到的条码类型，是二维码还是条形码
   * succResult.typeId: ( Number ) 必选 识别到的条码类型id
   * succResult.code: ( String ) 必选 识别到的条码数据
   * succResult.file: ( String ) 可选 识别到的条码图片文件路径
   *
   * 失败的回调参数 error
   * error.code 	 错误编码
   * error.message  错误描述信息
   */
  scanQRCode(scanOptions){
    let {id,styles,conserve,filename,vibrate,sound} = scanOptions ;

    return new Promise((resolve, reject)=>{
      let qrCode = this._creatQRCode(id,styles);
      qrCode.onmarked = function ( typeId, code, file ) {
        /*
        type : 识别到的条码类型，是二维码还是条形码
        typeId: ( Number ) 必选 识别到的条码类型id
        code: ( String ) 必选 识别到的条码数据
        file: ( String ) 可选 识别到的条码图片文件路径
        */

        let qbrCodeInfo = qbrCode.getPropValueForId(typeId);
        let qbrCodeType = qbrCodeInfo && qbrCodeInfo.type ;

        let result = {type:qbrCodeType,typeId,code,file};
        resolve(result);
      }

      qrCode.onerror = function ( error ) {
        /*
        error.code; 			// 错误编码
        error.message;	// 错误描述信息
        */
        reject(error) ;
      }

      this.qrCodeRestart({conserve,filename,vibrate,sound});

    })

  }


  /**
   * 开始条码识别
   * 开始调用系统摄像头获取图片数据进行扫描识别，当识别出条码数据时通过onmarked回调函数返回。
   * @param options : BarcodeOptions 可选 条码识别的参数
   */
  qrCodeRestart(options){
    if (this._qrCode){
      let startOptions = options || this._qrCode.startOptions ;
      this._qrCode.startOptions = startOptions ;
      this._qrCode.setFlash(startOptions);
    }
  }



  /**
   * 设置闪光灯的开或关
   * @param open :  boolean 必选;是否开启闪光灯;可取值true或false，true表示打开闪光灯，false表示关闭闪光灯。
   */
  qrCodeSetFlash( open ){
    if (this._qrCode){
      this._qrCode.setFlash(open);
    }
  }

  /**
   * 结束对摄像头获取图片数据进行条码识别操作，同时关闭摄像头的视频捕获。 结束后可调用start方法重新开始识别。
   */
  qrCodeCancel(){
    if (this._qrCode){
      this._qrCode.cancel();
    }

  }

  /**
   * 释放控件占用系统资源，调用close方法后控件对象将不可使用。
   */
  qrCodeClose(){
    if (this._qrCode){
      this._qrCode.close();
      this._qrCode = null;
    }
  }


  _creatQRCode(id,styles){
    let qrCode = new plus.barcode.Barcode( id,null,styles);
    this._qrCode = qrCode ;
    return qrCode ;
  }


  //二维码：结束






  //支付：开始

  /**
   * 加载微信支付的页面
   * @param mwebUrl
   * @private
   */
  _weChatWebPayLaunchMwebUrl(mwebUrl){
    let wxH5PayReferer = this._WXH5PayReferer();

    let wxPayWV = plus.webview.create(mwebUrl,"WXH5Pay",{
      additionalHttpHeaders:{
        Referer: wxH5PayReferer
      },
      backButtonAutoControl:"close",
      // titleNView:{
      //   ...navBarStyles,
      //   autoBackButton:true
      // }
    } );

    wxPayWV.appendJsFile('_www/WXH5Pay.append.js');

    wxPayWV.show();

  }


  //微信支付的 Referer
  _WXH5PayReferer(){
    return location.href ;
  }




  //支付：结束






  //back处理器: 开始




  /**
   * 可自定义返回策略的返回
   * @param key ? : string     可选；返回策略 backMap 中的key，会执行 backMap 中的相应的 conditionBack ；
   * @param locat ? : any     可选；在执行 conditionBack 时，给 conditionBack.back(locat) 函数传递的位置参数 ;
   * @returns boolean  表示是否执行成功
   *
   * 注意：
   * - key 的默认值为当前 webview 的 typeID ; 可通过 this.autoBackWebviewIDs 指定可供作为 默认值的 typeID ; 可通过 this.autoBackExcludeWebviewIDs 指定不能作为默认值的 typeID ;
   */
  back(key,locat){

    let backKey = key ;

    if (!backKey) {
      let currWV = window.plus && window.plus.webview.currentWebview() ;

      if (currWV) {

        let wvID = currWV.id ;
        let allTypeIDs = getAllTypeIDsByWebviewID(wvID);

        //去除 CurrentWebview 、 TopWebview 的干扰；因为无效 wvID 为何任，allTypeIDs 中一定包含 CurrentWebview ，当当前是 TopWebview 时，allTypeIDs 也一定包含 TopWebview ;
        let selfWebviewTypeIDs = [specialWebviewTypeID.CurrentWebview,specialWebviewTypeID.TopWebview];
        allTypeIDs = allTypeIDs.filter((item)=>{
          return !selfWebviewTypeIDs.includes(item);
        });

        let typeID = allTypeIDs[0] || wvID;

        let isInclu = this.autoBackWebviewIDs ? this.autoBackWebviewIDs.includes(typeID) : true ;
        let isExclu = this.autoBackExcludeWebviewIDs ? this.autoBackExcludeWebviewIDs.includes(typeID) : false ;

        if (isInclu && !isExclu) {
          backKey = typeID ;
        }

      }

    }


    return super.back(backKey,locat);

  }




  //back处理器: 结束


}
