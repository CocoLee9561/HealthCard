import Client from "./Client";
import {clientEventNameMap} from "./Client";
import {osName,qbrCode,QR_Type,Bar_Type,payMethodMap} from  '@constant.js' ;
import {ConditionBack,augModeMap,Actions,Conditions} from '@tools/ConditionBack/index.js'



export default class Alipay extends Client{


  static  osName = osName.alipay ;

  static synTest(){
    return  window.AlipayJSBridge  || /alipay/i.test(navigator.userAgent) ;
  }

  static asynTest(resolve, reject){
    document.byAddEventListener('AlipayJSBridgeReady', resolve);
  }






  showWebNavBar = false ; //是否显示 web 导航条 ；

  requestType = "6";

  allowPayMethods = [payMethodMap.alipay];   //允许的支付方式

  navBarClickHandles = {
    title:null,
    subtitle:null,
    rightButtons:[]
  } ;



  constructor(){
    super();

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
       * 如果 Locat 是有效数字，则 用 AlipayJSBridge.call('popWindow') 关闭当前的 window ；
       * 如果 Locat 不是有效数字，则用 router 路由到指定位置；
       */
      Alipay: new ConditionBack({
        condition: Conditions.judgeLocatIsNumber,
        action: Actions.createJudgeLocatIsNumberAction((backLocat, conditionResult, conditionBack)=> {

          if  (this.alipayPayPageLocat){
            // 关闭当前打开的页面
            if (backLocat) {
              popData = {
                command: "router",
                params: {
                  data:backLocat
                }
              };
            }

            AlipayJSBridge.call('popWindow', {
              data:popData
            });
          }else {
            shareInst.router.pushWithData(backLocat);
          }

        }, (backLocat, conditionResult, conditionBack)=> {

          if  (this.alipayPayPageLocat){
            // 关闭当前打开的页面

            let popData = null;

            let backStepNum = backLocat - 1;
            if (backStepNum !== 0) {
              popData = {
                command: "router",
                params: {
                  data:-backStepNum
                }
              };
            }

            AlipayJSBridge.call('popWindow', {
              data:popData
            });
          }else {
            shareInst.router.go(-backLocat);
          }

        }),
        augMode: augModeMap.constant,
        augmenter: 0
      })


    };


  }






  _init() {
    this._addEventListener();
  }




  /**
   * 添加事件监听
   * @private
   */
  _addEventListener(){

    this._addNavBarEventListeners({
      titleClick: "title",
      subtitleClick: "subtitle",
      optionMenu: "rightButtons"
    });


    //备注：10.0.15客户端以上，容器新增了"pagePause","pageResume","appPause","appResume"事件，用于业务区分是哪种情况触发的pause 或 resume。
    document.byAddListenerForMultipleEvent(["pause","resume","pagePause","pageResume","appPause","appResume"], (event)=>{


      let clientEventName = null ;
      let data = null ;

      switch (event.type) {
        case "pause" :{
          clientEventName = clientEventNameMap.webHide ;
          break;
        }

        case "resume" :{
          clientEventName = clientEventNameMap.webShow ;
          data = event.data ;
          break;
        }


        case "pagePause" :{
          clientEventName = clientEventNameMap.webHide ;
          break;
        }

        case "pageResume" :{
          clientEventName = clientEventNameMap.webShow ;
          // data = event.data ;
          break;
        }

        case "appPause" :{
          clientEventName = clientEventNameMap.background ;
          break;
        }

        case "appResume" :{
          clientEventName = clientEventNameMap.foreground ;
          // data = event.data ;
          break;
        }

      }

      console.log("-----dispatchClientEvent：",event,clientEventName,data)

      this.dispatchClientEvent(clientEventName,data) ;


    });

  }




  /**
   * webview 显示
   */
  webShowHandle(data){
    super.webShowHandle(data);

    let exeResult = this.executeCommand(data);
    if (!exeResult.finish) {
      //如果命令末执行成功

    }

  }





  _transformBtnOptClickToFun(btnOptClick){

    let clickFun = null ;

    if (btnOptClick) {

      if (typeof btnOptClick == "function") {
        clickFun = btnOptClick;
      } else {

        clickFun = (event) => {
          this.pushWithData(btnOptClick, event);
        };

      }

    }


    return clickFun ;
  }

  /**
   * 批量添加导航条的事件
   * @param eventOptions : {[eventName:string]:[navBarClickHandleName:string]}  添加事件的配置对象；该对象的属性名是要添加的事件名，属性值是 navBarClickHandles 中对应的事件处理程序的属性名；
   * @private
   */
  _addNavBarEventListeners(eventConf){

    Object.keys(eventConf).forEach((eventName)=> {

      document.byAddEventListener(eventName, (event)=>{


        let handleKey = eventConf[eventName] ;
        let handle = this.navBarClickHandles[handleKey] ;
        switch (eventName) {
          case "optionMenu" :{
            let handIndex = event.data.index ;
            handle = handle[handIndex];
            break ;
          }

        }



        if (handle){
          handle(event);
        }

      }, false) ;
    });

  }




  updateNavTitleOptions(standTitleOptions){
    let {title, subtitle} = standTitleOptions ;

    let params = {
      title: (title && title.text) || '\u200b' ,
      subtitle: (subtitle && subtitle.text) || '\u200b'
    } ;


    this.navBarClickHandles.title = title && this._transformBtnOptClickToFun(title.click) ;
    this.navBarClickHandles.subtitle = subtitle && this._transformBtnOptClickToFun(subtitle.click) ;

    AlipayJSBridge.call('setTitle', params);
  }


  updateNavRightOptions(navRightOptions){
    let {more, buttonOptionsList} = navRightOptions ;


    let params = {};
    let rightButtons = [] ;



    if (!more.hide || buttonOptionsList) {

      let menus = [];
      if (buttonOptionsList){

        buttonOptionsList.forEach((btnOpt)=> {
          menus.push({title:btnOpt.text});
          let btnHandle = this._transformBtnOptClickToFun(btnOpt.click);
          rightButtons.push(btnHandle);
        });

      }

      if (!more.hide){
        let aliMore = {
          icontype:more
        };
        menus.unshift(aliMore);
        let moreHandle = this._transformBtnOptClickToFun(more.click);
        rightButtons.unshift(moreHandle);

      }


      params.menus = menus ;
      params.override = true ;

    }else {
      params.reset = true ;
    }

    this.navBarClickHandles.rightButtons = rightButtons ;

    AlipayJSBridge.call('setOptionMenu',params);
    AlipayJSBridge.call('showOptionMenu');

  }




  //二维码：开始

  /**
   * 热苗二维码或者条形码
   * @param scanOptions : ScanOptions  二维码配置对象
   * scanOptions.type : QR_Type常量 | Bar_Type常量 扫描目标类型
   *
   * @return Promise
   * 成功回调参数 succResult
   * succResult.code : string  二维码条形码的code
   *
   * 失败的回调参数 error
   * error.code; 		 错误编码
   *
   */
  scanQRCode(scanOptions = {}){
    let {type = QR_Type} = scanOptions  ;

    return new Promise((resolve, reject)=>{

      let apOptions = {
        type: type,
        actionType: 'scan'
      };

      AlipayJSBridge.call('scan',apOptions , function(result) {
        let {error, barCode, qrCode,codeType,codeContent, cardNumber} = result ;

        if (!error){

          let result = {};

          if (qrCode){
            // result.type = QR_Type ;
            result.type = codeType ;
            result.code = qrCode ;
          }else {
            // result.type = Bar_Type ;
            result.type = codeType ;
            result.code = barCode ;
          }

          resolve(result);

        }else {
          console.log(result)
          reject({code:error});
        }

      });

    });

  }



  scanQRCodeFromImg(scanOptions){
    return this.scanQRCode(scanOptions);
  }



  //二维码：结束







    //生活号支付兼容：开始


    //生活用于支付的页面的路由位置
    alipayPayPageLocat = {path:"/paymentPage"} ;

  //用于存储 alipayPayData 的 key； alipayPayData 是传给新的 window 的用于支付的数据
  alipayPayDataKey = "alipayPayData";




  /**
   * 在网页中进行的支付宝支付
   * @param payHtmlStr : 支付宝返回的 html 文本
   * @returns {complete: boolean, info: any}
   * @private
   */
  _alipayWebPay(payHtmlStr){

    let result = {
      complete:false,
      info:"payHtmlStr无效"
    };

    if (!payHtmlStr) {
      result.info = "payHtmlStr无效" ;
    }else if (this.alipayPayPageLocat) {  // 如果 Alipay 的实例的 alipayPayPageLocat 属性有值，则会在支付宝的新window中进行支付；


      let alipayPayData = {
        payHtmlStr:payHtmlStr,
        valid : true
      };
      localStorage.setAnyItem(this.alipayPayDataKey, alipayPayData);


      let payPageURLStr = shareInst.router.locationToURLStr(this.alipayPayPageLocat) ;

      //用新 window 打开支付页
      AlipayJSBridge.call('pushWindow', {
        url: payPageURLStr
      });

      result = {
        complete:true,
        info: "调用支付成功"
      };


    }else {   // 如果 Alipay 的实例的 alipayPayPageLocat 属性无值，则会使用父类的支付逻辑，即：不是在支付宝的新window中进行支付的；
      result = super._alipayWebPay(payHtmlStr);
    }


    return result;

  }




  /**
   * 断续支付
   * @returns {complete: boolean, info: string}
   *
   *
   * 注意：
   * - 此方法用于并且需要在 支付拉起页面 调用；
   * - 支付拉起页面 是用于在新 window 中调起支付的页面；
   * - 需要把 支付拉起页面 的位置（也可以是 URL地址）设置给 Alipay 的实例的 alipayPayPageLocat 属性；
   */
  continuePay(){

    let result = {
      complete:false,
      info:"payHtmlStr无效"
    };



    let alipayPayData = localStorage.getParsedItem(this.alipayPayDataKey);


    if (alipayPayData && alipayPayData.valid) {
      result = super._alipayWebPay(alipayPayData.payHtmlStr);

      alipayPayData.valid = false ;
      localStorage.setAnyItem(this.alipayPayDataKey, alipayPayData);
    }

    return result ;

  }



    //dele:支付宝支付webview的返回操作
    _backForAlipay(params){

        let locat = params ;

        let numParam = parseInt(params);
        if (params && isNaN(numParam)) {
            super._backForAlipay(params)
          console.log('---原來')
        }else {
            AlipayJSBridge.call('popWindow');
          console.log('---支付寶返回')
        }

    }







    //生活号支付兼容：结束



}
