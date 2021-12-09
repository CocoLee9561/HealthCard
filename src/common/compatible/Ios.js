import App from './App'
import {osName} from  '@constant.js' ;

import CmdURL from '@tools/CommandURL.js'

export default class Ios extends App{
  static osName = osName.ios;

  requestType = "3";

  scheme = "blb-weixintest.clearofchina.com" ;   //客户的 Scheme



  //支付：开始


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

    let cmdData = super._weChatRedirectUrlForLocat(loca) ;


    let redirectUrl = CmdURL.urlStringify({
      protocol: this.scheme ,
      namespaces : window.location.hostname ,
      command : "url" ,
      params : {
        data : cmdData
      }
    }) ;

    console.log("---redirectUrl:" + redirectUrl);

    return redirectUrl ;
  }



  //微信支付的 Referer
  _WXH5PayReferer(){
    return `${this.scheme}://` ;
  }





  //支付：结束






}
