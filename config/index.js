'use strict'
// Template version: 1.2.4
// see http://vuejs-templates.github.io/webpack for documentation.


const path = require('path')

module.exports = {
  PWA:false,  //是否给项目配置渐进式网络应用程序的功能
  debug:{
    allow:false , //是否允许调试，如果为值 false，则以下的设置均无效

    weinre:{
      compileStart:false,     // 是否需要在编译时启动 weinre 调试
      manualStart:false      // 是否需要在运行时手动启动 weinre 调试
    },    //  weinre 调试的配置项

    wechat:false,     // 是否需要开启 微信的 调试模式

    vConsole:{
      compileStart:false,     // 是否需要在编译时启动 vConsole 调试
      manualStart:false      // 是否需要在运行时手动启动 vConsole 调试
    },    //  vConsole 调试的配置项


  },
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      "/blb1":{
        // target: "http://127.0.0.1:8089/",
        target: "http://qw18451.abc.heartyong.com/",
        // pathRewrite: {"^/blb1" : ""}
      }
    },
    disableHostCheck: true,

    // Various Dev Server settings
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    port: 8081, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    // mark: 禁用了 ESlint
    useEslint: false,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,

  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    // devtool: '#source-map',
    devtool: 'eval-source-map',

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
