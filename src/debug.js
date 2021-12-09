
// 是否允许调试模式开启
if (process.env.debug.allow) {




  /**
   * 给 window 对象 添加计算属性 byDebug ，用于存储共享的数据 ，当访问 byDebug 时，如果 byDebug 不存在，则会取创建
   */
  Object.defineProperty(window, 'byDebug', {
    get: function () {
      if (!this._byDebug) {
        this._byDebug = {};
      }
      return this._byDebug;
    }
  });



  /**
   * 远程调试
   */
  if (process.env.debug.weinre.compileStart) {
    let weinreDomain = process.env.weinreDomain;
    let weinreTarget = document.createElement("script");
    let scriptSrc = `http://${weinreDomain}/target/target-script-min.js#anonymous`;
    weinreTarget.setAttribute("src", scriptSrc);
    document.body.appendChild(weinreTarget)

  }

  if (process.env.debug.weinre.manualStart) {

    byDebug.weinreStart = function (weinreDomain) {
      weinreDomain = weinreDomain || process.env.weinreDomain;
      let weinreTarget = document.createElement("script");
      let scriptSrc = `http://${weinreDomain}/target/target-script-min.js#anonymous`;
      weinreTarget.setAttribute("src", scriptSrc);
      document.body.appendChild(weinreTarget)

    }


  }


  /**
   * vConsole调试
   */
  let vcCompileStart = process.env.debug.vConsole.compileStart ;
  let vcManualStart = process.env.debug.vConsole.manualStart

  if (vcCompileStart ||vcManualStart ) {

    import( /* webpackChunkName: "vconsole" */ 'vconsole').then(function (VConsole) {

      if (vcCompileStart){
        byDebug.vConsole = new VConsole();
      }

      if (vcManualStart){
        byDebug.VConsole = VConsole ;
        byDebug.vConsoleStart = function (option) {
          byDebug.vConsole = new byDebug.VConsole(option);
        }
      }

    });


  }


  /**
   * wechat 调试模式
   */
  if (process.env.debug.wechat) {
    byDebug.wechat = true;
  }


}


