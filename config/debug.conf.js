

var weinreOptions  = {
  httpPort:8900,    //设置Weinre使用的端口号， 默认是8080
  boundHost:"0.0.0.0",    // [hostname | ip address | -all-] : 默认是'localhost'， 这个参数是为了限制可以访问Weinre Server的设备， 设置为-all-或者指定ip， 那么任何设备都可以访问Weinre Server。
  verbose:true,     // [true | false] : 如果想看到更多的关于Weinre运行情况的输出， 那么可以设置这个选项为true， 默认为false；
  debug:true,   // [true | false] : 这个选项与--verbose类似， 会输出更多的信息。默认为false。
  readTimeout:120,   // [seconds] : Server发送信息到Target/Client的超时时间， 默认为5s。
  deathTimeout:360  //  [seconds] : 默认为3倍的readTimeout， 如果页面超过这个时间都没有任何响应， 那么就会断开连接。
};









function weinreOptionsHandle(options){

  options = options || {};

  options.httpPort = options.httpPort || 8080 ;  //设置Weinre使用的端口号， 默认是8080
  options.boundHost = options.boundHost || 'localhost' ;   // [hostname | ip address | -all-] : 默认是'localhost'， 这个参数是为了限制可以访问Weinre Server的设备， 设置为-all-或者指定ip， 那么任何设备都可以访问Weinre Server。
  options.verbose = options.verbose ? true : false ;   // [true | false] : 如果想看到更多的关于Weinre运行情况的输出， 那么可以设置这个选项为true， 默认为false；
  options.debug = options.debug ? true : false ;   // [true | false] : 这个选项与--verbose类似， 会输出更多的信息。默认为false。
  options.readTimeout = options.readTimeout || 5 ;   // [seconds] : Server发送信息到Target/Client的超时时间， 默认为5s。
  options.deathTimeout = options.deathTimeout || options.readTimeout * 3 ;  //  [seconds] : 默认为3倍的readTimeout， 如果页面超过这个时间都没有任何响应， 那么就会断开连接。

  return options;
}




module.exports = weinreOptionsHandle(weinreOptions);


