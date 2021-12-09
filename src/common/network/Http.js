
import { baseURL,loadindTexts } from '@constant.js'

import qs from 'qs'

import HttpRequest from './HttpRequest' ;




/**
 * 添加公共参数的转换器
 * @param reqOptions : ReqOptions
 * @returns ReqOptions
 */
function addPublicDataTransform(reqOptions) {
  let {params,data} = reqOptions ;
let user = JSON.parse(localStorage.getItem("userInfo"))
  //  公共参数
  let publicData = {

    // uid:user.uid||'',
    // ticket:user.token||''
    uid:shareInst.store.state.user.uid,
    ticket:shareInst.store.state.user.token,
    _:new Date().getTime()
    // uid:'10042089',
    // ticket:'9ba314cb417a78b4c73e7af3b7f864cf'
  };

  if (params) {
    params = {...publicData,...params} ;
    reqOptions.params = params ;
  }


  if (data) {
    data = {...publicData,...data} ;
    reqOptions.data = data ;
  }

  return reqOptions ;
}








/**
 * 添加登录路由转换器
 * @param response : Response
 * @param reqOptions : ReqOptions
 * @returns Response
 */
function loginRouteTransform(response,reqOptions) {

  if(response.data.status=='10001'){
    if(isDoctor){
      shareInst.router.push({
        path:'/doctorLogin',
        query: { redirect:true }
      });
    }else{
      shareInst.router.push({
        name:'LogIn',
        query: { redirect:true }
      });
    }
  }

  return response ;
}





let query = qs.parse(location.search,{ignoreQueryPrefix:true});
let isDoctor = query.isDoctor == 'true'
let clientId = query.clientId
// let clientId = 'S-411300-14930'
// let clientId = 'P-440300-001'
// let clientId = 'S-230100-52953'
// let clientId = 'S-110000-53422' //良乡
// let clientId = 'S-410700-53442'
// let clientId = 'S-341100-53485'
// let clientId = 'P-341100-000'   //滁州
// let clientId = 'S-511800-53584' //天全
// let clientId = 'P-440300-000'   //演示医院
// let clientId = 'S-410300-53540' //尹川
// let clientId = 'S-120000-53653' //生态城
// let clientId = 'S-430300-53399' //天门妇幼

shareData.clientId = clientId;
shareData.isDoctor = isDoctor



//创建 http 头 配置
function creatHeaders() {

  let initAuth = {
    client_id: clientId, // 请求
    requesttype: shareInst.client.requestType, // 请求
    requestversion: '1.2',
    token: ''
  };


  return {
    common:{
      Authorization:JSON.stringify(initAuth)
    },
    post:{
      'Content-Type':'application/x-www-form-urlencoded'
    }
  };

}



const httpConfig = {
  baseURL:baseURL,
  method:"get",
  reqTransforms:[addPublicDataTransform],
  resTransforms:[loginRouteTransform],
  headers:creatHeaders(),
  mainData:true,
  mainDataGet:function (responseData) {
    return responseData.data ;
  },
  successPrompt:false,
  failPrompt:true,
  showLoading:true,
  loadText:loadindTexts.request,
  dependent:true
};

const http = new HttpRequest(httpConfig) ;



function resetHttpHeaders () {
  http.headers = creatHeaders();

  //派发 httpChange 事件
  let httpChange = new Event("httpChange",{"bubbles":true}) ;
  window.dispatchEvent(httpChange);

}



http.dependentPro = new Promise(function (resolve, reject) {

  shareInst.clientReady.then(function () {
    resetHttpHeaders();
    resolve(http);
  });

});




window.shareInst._http = http;

/**
 * 给 window.shareInst 对象 添加计算属性 http ，用以获取全局的 http
 */
Object.defineProperty(window.shareInst, 'http', {
  get: function () {
    return this._http;
  }
});

export default http
