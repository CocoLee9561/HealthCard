
/*
* 使用属性描述来定义属性，为了解决给 Object.prototype 添加属性会在Vue中报错的问题，需要将属性设置为不可枚举的；
* */
import {qbrCode} from "../constant";

let propertyDescriptors = {



  /**
   * 找出对象中符合测试函数的属性名
   * @param testFun:(propValue,propkey,index)=> boolean  ; 测试条件函数
   */
  findKey:{
    enumerable:false,
    value:function(testFun){

      let propKey = Object.keys(this).find((key,index)=> {
        let propValue = this[key];
        return testFun(propValue,key,index);
      });

      return propKey;
    }
  },






  /**
   * 找出对象中符合测试函数的属性信息
   * @param testFun:(propValue,propkey,index)=> boolean  ; 测试条件函数
   * @return PropertyInfo : {key:string,value:any}
   */
  findProperty:{
    enumerable:false,
    value:function(testFun){

      let prop = Object.entries(this).find((entry,index)=> {
        return testFun(entry[1],entry[0],index);
      });


      let propInfo = {
        key:null,
        value:null
      };

      if (prop){
        propInfo.key = prop[0] ;
        propInfo.value = prop[1] ;
      }

      return propInfo ;
    }
  },


  /**
   * 检验该对象自身是否是扁平的，即：该对象的所有的直接属性的属性值都是非对象类型；
   */
  isFlat:{
    enumerable:false,
    get:function(){
      let noFlat = Object.values(this).some(function (propValue) {
        let propType = typeof propValue ;
        return propType == "object" || propType == "function" ;
      });

      return !noFlat ;
    }
  }




};




Object.defineProperties(Object.prototype,propertyDescriptors);
