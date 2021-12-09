/**
 * 把功能模块 funModules 中配置的所有 路由位置 转换成通过 routeData 传送数据的路由位置 location 对象；该方法会更改原 funModules 对象，并返回更改后的原 funModules 对象
 *
 * @param funModules   功能模块配置对象
 * @param locationProps : Array<string>    所有路由位置对象的属性名数组
 * @param router : VueRouter    VueRouter 的路由实例；
 * @return funModules  返回更改后的原 funModules 对象
 *
 *
 * 注意：
 * - 该方法会自动根据路由位置层级自动生成 dataKey 来存储路由位置的参数；
 * - 如果您需要自定义路由位置的 dataKey ，只需要在路由位置的查询参数 `location.query` 中增加 dataKey 字段  `location.query.dataKey`
 * - 该方法会更改原 funModules 对象，并返回更改后的原 funModules 对象
 *
 *
 */
export function parseFunModules(funModules,locationProps,router){

  Object.keys(funModules).forEach(function (funKey) {
    let funMod = funModules[funKey];

    locationProps.forEach(function (locatProp) {
      let location = funMod && funMod[locatProp] ;
      if (location){
        location = router.parseLocationForUseRouteData(location,funKey,locationProps);
        funMod[locatProp] = location ;
      }
    })


  });

  return funModules ;
}




/**
 * 解析查询参数字符串为对象
 * @param queryStr : string     查询参数，前端可以带 ?
 * @return Object
 */
export function parseQueryStr(queryStr) {
  let purityQueryStr = queryStr.replace(/^\?/,"");
  let keyValueList = purityQueryStr.split("&");

  return keyValueList.reduce(function (queryObj,keyValueStr) {

    let keyValueArr = keyValueStr.split("=") ;

    if (keyValueArr.length) {
      queryObj[keyValueArr[0]] = keyValueArr[1] ;
    }

    return queryObj ;
  },{});
}

export function IdentityCodeValid(code) {
  // var code='411303199110125538';
  var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
  var tip = "";
  var pass= true;

  if(!code)
  {
    tip = "身份证号格式错误";
    pass = false;
  }
  if(code.length != 15 && code.length != 18)
  {
    tip = "身份证号格式错误";
    pass = false;
  }
  if(code.length == 18 || code.length == 15)
  {
    var reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
    if(reg.test(code) === false)
    {
      tip = "身份证号格式错误";
      pass = false;
    }
  }


  else if(!city[code.substr(0,2)]){
    tip = "地址编码错误";
    pass = false;
  }
  else{
    //18位身份证需要验证最后一位校验位
    if(code.length == 18){
      code = code.split('');
      //∑(ai×Wi)(mod 11)
      //加权因子
      var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
      //校验位
      var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
      var sum = 0;
      var ai = 0;
      var wi = 0;
      for (var i = 0; i < 17; i++)
      {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
      var last = parity[sum % 11];
      if(parity[sum % 11] != code[17]){
        tip = "校验位错误";
        pass =false;
      }
    }
  }
  return pass;
}
