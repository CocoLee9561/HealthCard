

Object.defineProperties(String.prototype,{

  /**
   * 是否是URL
   */
  isURL:{
    get: function () {
      return /^\w+:\/\/\S+/.test(this);
    }
  },


  /**
   * 是否不包任何非空字符
   */
  noChars:{
    get: function () {
      return !(/\S+/.test(this));
    }
  },


  /**
   * 首字母大写
   */
  capFirstLetter:{
    get: function () {

      let capFirstStr = this ;

      let matcheds = this.match(/\w/);

      if (matcheds){
        let firstLetter = matcheds[0];
        let index = matcheds.index;

        let capLetter = firstLetter.toUpperCase();
        let frontStr = this.substring(0,index);
        let backStr = this.substring(index+1);
        capFirstStr = frontStr + capLetter + backStr ;
      }

      return capFirstStr ;
    }
  }


});
