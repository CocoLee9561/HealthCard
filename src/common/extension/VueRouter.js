import VueRouter from 'vue-router'


/**
 * 把JSON字符串化的路由信息转换成路由对象，用于解析通过路由参数传过来的路由信息
 * 说明：
 * 因为路由参数对象只能有一层属性，即属性值只能是普通对象，当属性值是对象类型时，在返回时会有问题；所以，如果属性值需要是对象类型，则可以先把对象类型转为JSON字符串；当解析该JSON字符串，可用该方法解析
 *
 * @param routeStr
 * @returns {*}
 */
VueRouter.prototype.routeStringToObject = function (routeStr) {
  let {parsed, result} = JSON.safelyParse(routeStr);

  let routeObj = parsed ? result : {path: result};

  return routeObj;
}


/**
 * 把路由对象转换成完整的URL字符串
 * @param route : string | Route对象    路由
 * @returns string    : 完成的URL字符串
 */
VueRouter.prototype.routeToURLStr = function (route) {
  let routeRes = this.resolve(route);
  let routeStr = routeRes.href;

  let currentUrl = location.href;
  let hashNum = currentUrl.indexOf("#");
  currentUrl = currentUrl.substring(0, hashNum);

  let urlStr = currentUrl + routeStr;

  return urlStr;
}


/**
 * 解析路由参数中与路由相关的参数值（如：to、from、back）
 * @param routeParamValue : 非对象类型  路由参数中与路由相关的参数值
 * @returns {*}
 */
VueRouter.prototype.parseRouteParamValueOfRoute = function (routeParamValue) {
  let parseResult = routeParamValue;

  if (typeof routeParamValue == "object" || typeof routeParamValue == "function") {
    throw "路由中不能传递对象类型的参数，如果你需要传，可以用 JSON.stringify 将对象转换成字符串！"
  } else {
    parseResult = this.routeStringToObject(routeParamValue);
  }

  return parseResult;
}


/**
 * 解析路由参数中值为JSON字符串的参数值
 * @param routeParamValue : 非对象类型  路由参数中值为JSON字符串的参数值
 * @returns any
 */
VueRouter.prototype.parseObjectParamValueOfRoute = function (ObjectParamValue) {
  let parseResult = ObjectParamValue;

  if (typeof ObjectParamValue == "object" || typeof ObjectParamValue == "function") {
    throw "路由中不能传递对象类型的参数，如果你需要传，可以用 JSON.stringify 将对象转换成字符串！"
  } else {
    parseResult = JSON.safelyParse(ObjectParamValue).result;
  }

  return parseResult;
}






/**
 * 导航类型标识符常量
 */
const navTypeMap = {
  back: "back",    // 后退
  forward: "forward",   // 前进
  push: "push",    // 推入
  replace: "replace",   // 替换
  load: "load"  //加载
};



//通过store传递路由数据：开始


/**
 * 给 VueRouter 实例 添加计算属性
 */
Object.defineProperties(VueRouter.prototype, {
  /*
  * routeDataMapKey ，用于存取访问所有路由数据的key ，当访问 routeDataMapKey 时，如果 routeDataMapKey 不存在，则会取创建
  * */
  routeDataMapKey: {
    get: function () {
      if (!this._routeDataMapKey) {
        this._routeDataMapKey = "routeDataMap";
      }
      return this._routeDataMapKey;
    },
    set: function (newValue) {
      this._routeDataMapKey = newValue;
    }
  },

  /*
  * lastDataKeyKey ，用于存取访问lastDataKey的key ，当访问 lastDataKeyKey 时，如果 lastDataKeyKey 不存在，则会取创建
  * */
  lastDataKeyKey: {
    get: function () {
      if (!this._lastDataKeyKey) {
        this._lastDataKeyKey = "routeLastDataKey";
      }
      return this._lastDataKeyKey;
    },
    set: function (newValue) {
      this._lastDataKeyKey = newValue;
    }
  },


  /*
* lastDataKey ，用于存取最后一次的 routeDataKey
* */
  lastDataKey: {
    get: function () {
      let lastDataKey = localStorage.getItem(this.lastDataKeyKey);
      return lastDataKey;
    },
    set: function (newValue) {
      localStorage.setItem(this.lastDataKeyKey, newValue);
    }
  },


  /*
  * defaultToKey ，用于存取默认的 toKey
  * */
  defaultToKey: {
    get: function () {
      if (!this._defaultToKey) {
        this._defaultToKey = "any";
      }
      return this._defaultToKey;
    },
    set: function (newValue) {
      this._defaultToKey = newValue;
    }
  },

  /*
  * defaultFromKey ，用于存取默认的 fromKey
  * */
  defaultFromKey: {
    get: function () {
      if (!this._defaultFromKey) {
        this._defaultFromKey = "any";
      }
      return this._defaultFromKey;
    },
    set: function (newValue) {
      this._defaultFromKey = newValue;
    }
  },




  //导航信息：开始

  /**
   * 获取导航信息
   * navInfo.type : string   描述本次导航的类型， 该属性可能的值由 navTypeMap 常量定义
   * navInfo.arguments : Arguments || Array   描述本次导航的参数
   */

  navInfo:{
    get: function () {
      if (!this._navInfo) {
        this._navInfo = {
          type:navTypeMap.load
        } ;
      }
      return this._navInfo;
    }

  },



  //导航信息：结束



});





//导航信息：开始

/**
 * 设置导航信息
 * @param navType : string | number    导航的类型，当导航类型为非字符串时，会自动处理为要应的字符串
 * @param argList :  Arguments | Array  导航的参数
 *
 */
VueRouter.prototype.setNavInfo = function (navType,argList) {

  let argArr = argList ? [...argList] : [] ;

  let _navInfo = {
    type:navType,
    arguments:argArr
  };


  let navTypeType = typeof navType ;


  if (!navType){
    _navInfo.type = navTypeMap.load ;
  }else if (navTypeType == "number") {

    if (navType < 0) {
      _navInfo.type = navTypeMap.back ;
    }else if (navType > 0) {
      _navInfo.type = navTypeMap.forward ;
    }

    _navInfo.arguments = [navType] ;
  }

  this._navInfo = _navInfo ;
}




let {go:oriGo,push:oriPush,replace:oriReplace} = VueRouter.prototype ;

VueRouter.prototype.go = function(stepNum) {

  this.setNavInfo(stepNum)

  oriGo.apply(this,arguments);
}


VueRouter.prototype.push = function () {

  this.setNavInfo(navTypeMap.push,arguments);

  oriPush.apply(this,arguments);
}



VueRouter.prototype.replace = function () {

  this.setNavInfo(navTypeMap.replace,arguments);

  oriReplace.apply(this,arguments);
}



//导航信息：结束









/**
 * 保存路由数据
 *
 * @param key : string    路由数据保存时的键名
 * @param routeData     路由数据
 *
 *
 * 注意：
 * 如果需要使用 Vuex 来存储路由数据，则需要设置 setRouteDataMutation ；
 * this.setRouteDataMutation : string   Vuex的 store 的 用于设置 routeData 的 mutation ;
 */
VueRouter.prototype.setRouteData = function (key, routeData) {
  let appStore = this.app && this.app.$store;

  if (appStore && this.setRouteDataMutation) {
    let payload = {key: key, data: routeData};
    appStore.commit(this.setRouteDataMutation, payload);

  } else {

    let routeDataMap = localStorage.getParsedItem(this.routeDataMapKey) || {};
    routeDataMap[key] = routeData;
    localStorage.setAnyItem(this.routeDataMapKey, routeDataMap);
  }

  this.lastDataKey = key;

}


/**
 * 获取路由数据
 * @param dataKey  路由数据的key
 * @returns any
 *
 * 注意：
 * 如果需要通过 Vuex 来存获取路由数据，则需要设置 getRouteDataFromStore ；
 * this.getRouteDataFromStore : (store,dataKey)=>RouteData   用于从Vuex的 store 中获取 相应 routeDataKey 的 routeData ;
 */
VueRouter.prototype.getRouteData = function (dataKey) {

  let routeDataKey = dataKey || this.lastDataKey;
  if (!routeDataKey) {
    return null;
  }

  let appStore = this.app && this.app.$store;
  let routeData = null;

  if (appStore && this.getRouteDataFromStore) {
    routeData = this.getRouteDataFromStore(appStore, routeDataKey);
  } else {

    let routeDataMap = localStorage.getParsedItem(this.routeDataMapKey) || {};
    routeData = routeDataMap[routeDataKey];
  }

  return routeData;
}






/**
 * 根据 fromKey 和 toKey 生成 routeDataKey ; 格式为 fromKey-toKey
 * @param fromKey : string    可选；默认为 this.defaultFromKey ；
 * @param toKey : string    可选；默认为 this.defaultToKey ；
 * @return string   routeDataKey
 */
VueRouter.prototype.createRouteDataKey = function (fromKey,toKey){
  let finaFromKey = fromKey || this.defaultFromKey ;
  let finaToKey = toKey || this.defaultToKey ;
  return finaFromKey + "-" + finaToKey;
};










/**
 * 在导航前配置与 routeData 相关的东西
 * @param to : Location | number | "back" | "forward"   要导航的目标位置；
 * @param routeData ? : any   需要存储的路由数据
 * @param from ? : Route | string   用于生成 routeDataKey ；默认值：router.currentRoute；
 * @return Location | number  当 to 是  number | "back" | "forward" 时，返回特效的 this.go()方法的 number 类型的数字，
 *
 * 注意：
 * - 当 to 是  number | "back" | "forward" 时，返回 null，并且会自动触发导航，其它情况，会返回解析后的目标位置对象；
 *
 * - 目标路由通过 查询参数 query.dataKey 来拿到routeDataKey ; routeDataKey = fromKey-toKey
 *
 *    - 当 from 是 对象或者 路径时，fromKey 是解析后的路径
 *    - 当 from 是 非路径字符串（根据字符串中是否包含 `/` 来判断 ）时，fromKey 就是 from
 *    - 其它情况 fromKey 就是 this.defaultFromKey
 *
 *    - 当 to 是 number 类型 或者是 "back" 或 "forward" 时，toKey 是 this.defaultToKey ;
 *    - 其它情况，toKey 是 解析后的路径
 *
 */
VueRouter.prototype.configForRouteData = function (to, routeData, from) {


  //处理 to

  let toLocation = to;

  switch (to) {

    case "back" : {
      toLocation = -1;
      break;
    }

    case "forward" : {
      toLocation = 1;
      break;
    }

  }


  let toKey = null;
  let mergedRouteData = routeData;
  let toLocationType = typeof toLocation;


  if (toLocationType == "object") { // 其它情况，toKey 是 解析后的路径
    let {routeData:toRouteData,...toWithoutRouteData} = toLocation;

    if (toRouteData) {
      mergedRouteData = {...toRouteData,...routeData};
    }


    let routeRes = this.resolve(toWithoutRouteData);
    toLocation = routeRes.location;
    toKey = routeRes.route.path;
  }





  let routeDataKey = toLocation && toLocation.query && toLocation.query.dataKey ;

  //优先使用 to 中带有 dataKey ，如果 to 中没有 dataKey ，则需要手动拼接
  if  (!routeDataKey){


    // 处理 from
    let fromRoute = from || this.currentRoute;   // fromRoute 的默认值是 this.currentRoute
    let fromKey = null;


    let fromRouteType = typeof fromRoute;
    let fromIsObj = fromRouteType === "object";
    let fromIsStr = fromRouteType === "string";

    let fromIsPath = false;
    let fromIsKey = false;

    if (fromIsStr) {
      if (fromRoute.indexOf("/") == -1) {
        fromIsKey = true;
      } else {
        fromIsPath = true;
      }
    }


    if (fromIsObj) {
      fromRoute = {...fromRoute};
    }


    if (fromIsObj || fromIsPath) {    // 当 fromRoute 是 对象或者 路径时，fromKey 是解析后的路径
      let fromRes = this.resolve(fromRoute);
      fromKey = fromRes.route.path;
    } else if (fromIsKey) {   // 当 fromRoute 是 非路径字符串时，fromKey 就是 fromRoute
      fromKey = fromRoute;
    }  // 其它情况，fromKey 是 由 this.createRouteDataKey 方法的默认值决定，在 createRouteDataKey 方法中 fromKey 的默认值就是 this.defaultFromKey;





    routeDataKey = this.createRouteDataKey(fromKey,toKey);


    if (toLocationType == "object"){
      let  query = toLocation.query || {} ;
      query.dataKey = routeDataKey;
      toLocation.query = query ;
    }

  }



  //设置 routeData
  if (mergedRouteData !== undefined) {
    this.setRouteData(routeDataKey, mergedRouteData);
  }




  return toLocation;
}











//通过store传递路由数据：结束


/**
 * 把路由位置 location 转成通过 routeData 传送数据的路由位置 location 对象；
 * @param location
 * @return location
 *
 * 注意：
 * - 该方法会自动根据路由位置层级自动生成 dataKey 来存储路由位置的参数；
 * - 如果您需要自定义路由位置的 dataKey ，只需要在路由位置的查询参数 `location.query` 中增加 dataKey 字段  `location.query.dataKey`
 *
 */
VueRouter.prototype.parseLocationForUseRouteData = function (location,locationProps,from) {
  if (typeof location != "object") {
    return location ;
  }

  let query = location.query ;

  if (typeof query != "object" ){
    return location ;
  }


  if (query.isFlat) {
    return location ;
  }



  let {dataKey,...routeData} = query ;

  if (locationProps){

    Object.keys(routeData).forEach((prop)=> {

      if (locationProps.includes(prop))  {
        let nextLocation = routeData[prop];
        let parsedLocation = this.parseLocationForUseRouteData(nextLocation,locationProps,location) ;
        routeData[prop] = parsedLocation ;
      }

    });

  }


  location.query = {};
  let parsedLocat = null;

  if (dataKey) {
    this.setRouteData(dataKey,routeData);
    location.query.dataKey = dataKey ;
    parsedLocat = location ;
  }else {
    parsedLocat = this.configForRouteData(location,routeData,from);
  }

  return parsedLocat ;
}









/**
 *
 * @param to : Location | number | "back" | "forward"   要导航的目标位置；
 * @param routeData ? : any   需要存储的路由数据
 * @param from ? : Route | string   用于生成 routeDataKey ；默认值：router.currentRoute；
 * @param onComplete ? : function
 * @param onAbort ? : function
 *
 * 注意：
 * - 当 to 是  number | "back" | "forward" 时，返回 null，并且会自动触发导航，其它情况，会返回解析后的目标位置对象；
 *
 * - 目标路由通过 查询参数 query.dataKey 来拿到 routeDataKey = fromKey-toKey
 *
 *    - 当 from 是 对象或者 路径时，fromKey 是解析后的路径
 *    - 当 from 是 非路径字符串（根据字符串中是否包含 `/` 来判断 ）时，fromKey 就是 from
 *    - 其它情况 fromKey 就是 "any"
 *
 *    - 当 to 是 number 类型 或者是 "back" 或 "forward" 时，toKey 是 "any" ;
 *    - 其它情况，toKey 是 解析后的路径
 *
 */
VueRouter.prototype.pushWithData = function (to, routeData, from, onComplete, onAbort) {

  let toLocation = this.configForRouteData(to, routeData, from);
  let toLocationType = typeof toLocation;

  if (toLocationType == "number") {
    this.go(toLocation);
  }else {
    this.push(toLocation, onComplete, onAbort);
  }

}


/**
 *
 * @param to : Location | number | "back" | "forward"   要导航的目标位置；
 * @param routeData ? : any   需要存储的路由数据
 * @param from ? : Route | string   用于生成 routeDataKey ；默认值：router.currentRoute；
 * @param onComplete ? : function
 * @param onAbort ? : function
 *
 * 注意：
 * - 当 to 是  number | "back" | "forward" 时，返回 null，并且会自动触发导航，其它情况，会返回解析后的目标位置对象；
 *
 * - 目标路由通过 查询参数 query.dataKey 来拿到 routeDataKey = fromKey-toKey
 *
 *    - 当 from 是 对象或者 路径时，fromKey 是解析后的路径
 *    - 当 from 是 非路径字符串（根据字符串中是否包含 `/` 来判断 ）时，fromKey 就是 from
 *    - 其它情况 fromKey 就是 "any"
 *
 *    - 当 to 是 number 类型 或者是 "back" 或 "forward" 时，toKey 是 "any" ;
 *    - 其它情况，toKey 是 解析后的路径
 *
 */
VueRouter.prototype.replaceWithData = function (to, routeData, from, onComplete, onAbort) {


  let toLocation = this.configForRouteData(to, routeData, from);
  let toLocationType = typeof toLocation;

  if (toLocationType == "number") {
    this.go(toLocation);
  }else {
    this.replace(toLocation, onComplete, onAbort);
  }

}





VueRouter.prototype.goWithData = function (n, routeData, from) {
  let toLocation = this.configForRouteData(n, routeData, from);
  this.go(toLocation);
}


VueRouter.prototype.backWithData = function (routeData, from) {
  let toLocation = this.configForRouteData(-1, routeData, from);
  this.go(toLocation);
}


VueRouter.prototype.forwardWithData = function (routeData, from) {
  let toLocation = this.configForRouteData(1, routeData, from);
  this.go(toLocation);
}



