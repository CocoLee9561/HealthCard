
import axios from 'axios'


import { Toast } from 'mint-ui';

import tool from '@common/libs/tool'
export class HttpRequest {


  //mark:新增
  // dependentPro 请求依赖的 Promise
  set dependentPro (newValue) {
    if (this._dependentResolve) {
      this._dependentResolve(newValue);
    }

    this._dependentPro = newValue ;
  }

  get dependentPro () {
    if (!this._dependentPro) {
      this._dependentPro = new Promise((resolve, reject)=> {
        this._dependentResolve = resolve ;
      });
    }

    return this._dependentPro ;
  }

  //mark:结束





  /**
   * 创建HTTP请求对象
   * @param httpConfig : Object  HTTP的配置对象，
   *
   * httpConfig 中可配置的字段如下：
   *
   * httpConfig.baseURL : string    基URL
   * httpConfig.method  : string    默认的请求方式
   * httpConfig.reqTransforms : [(ReqOptions)=>ReqOptions]  转换请求选项的转换函数数组，用于对reqOptions进行转换，也可以在函数里给数据添加一些公共的参数
   * httpConfig.resTransforms : [(Response,ReqOptions)=>Response]  转换响应的转换函数数组，用于对 response 进行转换；
   * httpConfig.headers  : Object    默认的请求头对象
   * httpConfig.mainData  : boolean    当请求成功时，是否返回经过 mainDataGet 处理过的数据；
   * httpConfig.mainDataGet  : function    如果 mainData 设置为 true，当请求成功时，会返回被 mainDataGet 处理过的数据；
   * httpConfig.successPrompt : boolean    是否启用全局的成功提示；
   * httpConfig.failPrompt  : boolean    是启用用全局的失败提示;
   * httpConfig.showLoading  : boolean    是否启用加载状态指示；默认值为 true
   * httpConfig.loadText  : string   加载的提示文本
   * @returns AxiosPromise    请求的 AxiosPromise 对象
   *
   *
   * //mark: 新加
   * dependent : boolean   设置请求是否依赖 dependentPro
   * dependentPro : Promise 请求的依赖项，当请求有依赖时，请求会 等到 dependentPro 解决之后触发
   * dependResultHandle : (result,reqOptions)=> HandleResult : ReqOptions || boolean || null || undefined    依赖结果处理器，当请求有依赖时，在 依赖解决之后 请求解决之前 调用该处理器；
   *
   * 注意：
   * - 当 HandleResult 为 false 时，会取消请求；
   * - 当 HandleResult 为 非假值时， 会使用 HandleResult 进行请求；
   * - 当 HandleResult 为 除 false 之外的假值时，会使用 原来的 reqOptions 进行请求；
   *
   */
  constructor ({baseURL,method = "get",reqTransforms = [],resTransforms = [],headers,mainData,mainDataGet,successPrompt,failPrompt,showLoading = true,loadText,dependent = false,dependentPro,dependResultHandle}) {
    this.baseURL = baseURL ;
    this.method = method ;
    this.reqTransforms = reqTransforms ;
    this.resTransforms = resTransforms ;
    this.mainDataGet = mainDataGet ;
    this.successPrompt = successPrompt ;
    this.failPrompt = failPrompt ;
    this.mainData = mainData ;
    this.headers = headers ;
    this.showLoading = showLoading ;
    this.loadText = loadText ;


    //mark: 新加
    this.dependent = dependent ;
    this.dependentPro = dependentPro ;
    this.dependResultHandle = dependResultHandle ;

  }



  set headers(newValue){

    if (newValue) {
      Object.keys(newValue).forEach(function (headerKey) {
        Object.assign(axios.defaults.headers[headerKey],newValue[headerKey]) ;
      })
    }

  }




  set mainDataGet (newValue) {
    this._mainDataGet = newValue ;
  }

  get mainDataGet () {
    if (!this._mainDataGet) {
      this._mainDataGet = function (responseData) {
        return responseData ;
      } ;
    }

    return this._mainDataGet ;
  }



  set baseURL (newValue) {
    axios.defaults.baseURL = newValue
  }


  set authorization (newValue) {
    if (newValue) {
      axios.defaults.headers.common['Authorization'] = JSON.stringify(newValue)
    }
  }


  set contentType (newValue) {
    if (newValue) {
      axios.defaults.headers.post['Content-Type'] = newValue
    }
  }









  /**
   * 发送请求
   * @param reqOptions : Object  请求的选项对象，
   *
   * reqOptions 中可配置的字段如下：
   *
   * reqOptions.urlPath : string    url路径
   * reqOptions.method  : string    请求方式
   * reqOptions.data  : Object    请求的数据，这些数据将被放入请求体中
   * reqOptions.params  : Object    请求的参数，这些参数将会被序列化放入请求的URL后面
   * reqOptions.headers  : Object    请求头对象
   * reqOptions.successPrompt : boolean    是否启用全局的成功提示；
   * reqOptions.failPrompt  : boolean    是启用用全局的失败提示;
   * reqOptions.mainData  : boolean    当请求成功时，是否返回经过 mainDataGet 处理过的数据；
   * reqOptions.showLoading  : boolean    是否启用加载状态指示；
   * reqOptions.loadText  : string   加载的提示文本
   * @returns AxiosPromise    请求的 AxiosPromise 对象
   *
   */
  request(reqOptions){
    let {dependent = this.dependent} = reqOptions ;

    if (dependent) {
      return this.dependentPro.then((dependentResult)=> {
        let depReqOptions = this.dependResultHandle && this.dependResultHandle(dependentResult,reqOptions) ;

        if (depReqOptions == false ){
          return Promise.reject("请求被依赖阻止！")
        }else {
          depReqOptions = depReqOptions || reqOptions ;
          return this._request(depReqOptions)
        }

      });
    }else {
      return this._request(reqOptions)
    }

  }


  _request(reqOptions){

    reqOptions = this.reqTransforms.reduce(function (options,transform) {
      let newOptions = transform(options);
      return newOptions ;
    },reqOptions);

    let {urlPath,method = this.method,params,data,headers,successPrompt = this.successPrompt,failPrompt = this.failPrompt,mainData = this.mainData,showLoading = this.showLoading , loadText = this.loadText} = reqOptions ;

    let reqConfig = {
      url:urlPath,
      method:method
    };


    if (data){
      reqConfig.data = data;
    }

    if (params) {
      reqConfig.params = params;
    }

    if (headers){
      reqConfig.headers = headers;
    }


    let showLoad = showLoading && shareInst.app ;
    // console.log(urlPath);
    // console.log(urlPath.indexOf('getregdepartmentlist'));
    // console.log(urlPath.indexOf('getlatestregdepartment'));
    // console.log(urlPath.indexOf('getlatestregdoctor'));
    if (showLoad && (urlPath.indexOf('getregdepartmentlist') === -1 || urlPath.indexOf('getlatestregdepartment') === -1 || urlPath.indexOf('getlatestregdoctor') === -1)) {
      // console.log("loadinglalllalallala");
      //显示加载指示器
      shareInst.app.$vux.loading.show(loadText);
    }



    let axiosPromise = axios(reqConfig);

    axiosPromise = axiosPromise.then((response)=> {

      response = this.resTransforms.reduce(function (res,transform) {
        let newRes = transform(res,reqOptions);
        return newRes ;
      },response);

      let respData = response.data;


      if(respData.result){
        if (successPrompt && respData.msg ){

          Toast(respData.msg);
        }
      }

      if (mainData){
        if (!respData.result) {
          throw response
        }
        return this.mainDataGet(respData);
      }else {
        return respData;
      }

    }).catch(function (error) {

      console.log("--失败--",reqOptions,error)

      let respData =  ( error && error.data ) ;
      // msg = msg || error.message;
      if(respData&&(respData.result==false||respData.result==true)){
        let msg = respData.msg;

        if ( failPrompt && msg ){
          Toast(msg);
        }
      }else{
        let msg = "网络开小差啦!!!"

        if ( failPrompt && msg ){
          Toast(msg);
        }
      }



      let throwData = error.response || error ;

      throw throwData;

    }).finally(function () {
      if (showLoad && (urlPath.indexOf('getregdepartmentlist') === -1 || urlPath.indexOf('getlatestregdepartment') === -1 || urlPath.indexOf('getlatestregdoctor') === -1)){
        //关闭加载指示器
        shareInst.app.$vux.loading.hide();
      }
    });



    return axiosPromise

  }


  /**
   * 发送get请求
   * @param getOptions : Object   get请求的选项对象;
   *
   *
   * getOptions 中可配置的字段如下：
   *
   * getOptions.urlPath : string    url路径
   * getOptions.params  : Object    请求的参数，这些参数将会被序列化放入请求的URL后面
   * reqOptions.headers  : Object    请求头对象
   * reqOptions.successPrompt : boolean    是否启用全局的成功提示；
   * reqOptions.failPrompt  : boolean    是启用用全局的失败提示;
   * reqOptions.mainData  : boolean    当请求成功时，是否返回经过 mainDataGet 处理过的数据；
   * reqOptions.showLoading  : boolean    是否启用加载状态指示；
   * reqOptions.loadText  : string   加载的提示文本
   * @returns AxiosPromise    请求的 AxiosPromise 对象
   *
   */
  get(getOptions){
    getOptions.method = "get" ;
    return this.request(getOptions);
  }



  /**
   * 发送post请求
   * @param postOptions
   *
   * postOptions 中可配置的字段如下：
   *
   * postOptions.urlPath : string    url路径
   * postOptions.data  : Object    请求的数据，这些数据将被放入请求体中
   * postOptions.params  : Object    请求的参数，这些参数将会被序列化放入请求的URL后面
   * postOptions.contentType  : string    请求头的'Content-Type'字段的值
   * postOptions.headers  : Object    请求头对象
   * postOptions.successPrompt : boolean    是否启用全局的成功提示；
   * postOptions.failPrompt  : boolean    是启用用全局的失败提示;
   * postOptions.mainData  : boolean    当请求成功时，是否返回经过 mainDataGet 处理过的数据；
   * reqOptions.showLoading  : boolean    是否启用加载状态指示；
   * reqOptions.loadText  : string   加载的提示文本
   * @returns AxiosPromise    请求的 AxiosPromise 对象
   *
   */
  post(postOptions){
    let {contentType,...reqOptions} = postOptions;

    if (contentType) {
      reqOptions.headers = {...reqOptions.headers,'Content-Type':contentType} ;
    }

    reqOptions.method = "post" ;

    return this.request(reqOptions);
  }

  uploadFile(postOptions){
    return axios.post(postOptions.urlPath,postOptions.data,{
      headers:{
        'Content-Type': 'multipart/form-data'
      }
    })
  }



}



export default HttpRequest ;
