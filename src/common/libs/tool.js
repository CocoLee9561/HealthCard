

import { Base64 } from 'js-base64';
export default {

    isWechat:()=>{
        return /micromessenger/i.test(navigator.userAgent);
    },

    // 将url中的参数转成对象
    urlSearch:function(){
        var name='',value='',param={};
        var str=location.href; //取得整个地址栏
        var num=str.indexOf("?")
        str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]
        var arr=str.split("&"); //各个参数放到数组里
        for(var i=0;i < arr.length;i++){
            num=arr[i].indexOf("=");
            if(num>0){
                name=arr[i].substring(0,num);
                value= decodeURI(arr[i].substr(num+1));
                param[name]=value;
            }
        }
        return param;
    },

    // 注意，content 必须是{name:'',data:{}}这种形式
    hPush:(content,Vm)=>{

        let timeStamp = new Date().getTime();
        if(content.data){
            content.data.timeStamp = timeStamp;
        }else{
            let data = {};
            data.timeStamp = timeStamp;
            content.data = data;
        }

        if(ap.isAlipay){

            // ap.pushWindow({
            //     url: `${window.location.href.split('#')[0]}#`+content.name,
            //     data: content.data || ''
            // });
          Vm.$router.push({
            path:content.name,
            query:content.data || ''
          })
        }else{

            Vm.$router.push({
                path:content.name,
                query:content.data || ''
            })
        }
    },
    hReplace:(content,Vm)=>{
        if(ap.isAlipay){
            ap.redirectTo({
                url: Vm.publicUrl+content.name,
                data: content.data
            });
        }else{
            Vm.$router.replace({
                path:content.name,
                query:content.data || ''
            })
        }
    },
    // idx 为负数
    hPop:(idx)=>{

        if(ap && ap.isAlipay){
          ap.popTo(idx);
        }else{
            history.go(idx);
        }
    },
    // 获取传递的参数
    hParam:()=>{
        return this.urlSearch();
    },
    /**
     * session 保存数据
     * ,,,,,
     *
     */
    setDataWithSession:(key,value,callback)=>{
        if(value === undefined || value === null){
            return;
        }else{
            if(ap.isAlipay){
              ap.setSessionData(key,value);
              callback();
            }else{

                if(typeof value == 'string'){
                    sessionStorage.setItem(key,value)
                }else{
                    let val = JSON.stringify(values);
                    sessionStorage.setItem(key,val);
                }
                callback();
            }
        }

    },
    /**
     * base64编码
     * @param str
     * @returns {*}
     */
    base64(str){
      return Base64.encode(str);
    },

    setStoreData(state,key,data){
      if(ap.isAlipay){
        ap.setSessionData({
          data:{
            key:data
          }
        });
      }else{
        sessionStorage.setItem(key,JSON.stringify(data));
      }
      localStorage.setItem(key,JSON.stringify(data));
      state[key] = data;
    },
    /**
     * 时间格式化
     * @param date
     * @param fmt
     * @returns {string}
     */
    dateFormat(date,fmt='yyyy-MM-dd') {
      var o = {
        "M+" : date.getMonth()+1,                 //月份
        "d+" : date.getDate(),                    //日
        "h+" : date.getHours(),                   //小时
        "m+" : date.getMinutes(),                 //分
        "s+" : date.getSeconds(),                 //秒
        "q+" : Math.floor((date.getMonth()+3)/3), //季度
        "S"  : date.getMilliseconds()             //毫秒
      };
      if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
      }
      for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
      }
      return fmt;
    }
}
