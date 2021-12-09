/**
 * 生成派发事件的js字符串代码
 * @param eventName : string   事件的各字
 * @param data : any   要传送的数据
 * @return {string}
 */
function createDispatchEventJSStr (eventName, data) {

  return `
      var webviewEvent = new Event("${eventName}", {
        "bubbles": true
      });
      webviewEvent.data = ${JSON.stringify(data)};
      window.dispatchEvent(webviewEvent);
      `;
}






/**
 * 往所有webview中派发事件
 * @param {Object} eventName
 * @param {Object} data
 */
export function webviewEventBroadcast(eventName, data) {

  console.log("----webviewEventBroadcast",eventName, data);

  var evalJSStr = createDispatchEventJSStr(eventName, data);

  var allWVOs = plus.webview.all();
  allWVOs.forEach(function(wvo) {
    console.log("----WebviewID:" + wvo.id);
    wvo.evalJS(evalJSStr);
  });

}










/**
 * 在当前Webview分发事件系列
 * @param series : string    事件系列名字
 * @param name : string     事件名字
 * @param data : any   分发事件的附加数据
 */
export function dispenseEventSeries(series,name,data) {
  switch (series){
    case "Broadcast" :{
      webviewEventBroadcast(name,data);
      break;
    }

    case "ClientEvent" :{
      shareInst.client.dispatchClientEvent(name,data);
      break;
    }

  }

}






/**
 * 在 LaunchWebview 中分发事件系列
 * @param series : string    事件系列名字
 * @param name : string     事件名字
 * @param data : any   分发事件的附加数据
 */
export function dispenseEventSeriesInLaunch(series,name,data) {
  var lanchWVO = plus.webview.getLaunchWebview();
  var evalJSStr = 'dispenseEventSeries("' + series + '" , "' + name + '"' + JSON.stringify(data) + ')';
  lanchWVO.evalJS(evalJSStr);
}

