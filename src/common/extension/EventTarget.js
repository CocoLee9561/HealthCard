if (!window.EventTarget) {
  /*
  * 目前发现在Ios8的浏览器中是没有 EventTarget 类型的，Node 类型直接继承 Object ；
  * */
  window.EventTarget = Object;
}


/*
* 使用属性描述来定义属性，为了解决给 Object.prototype 添加属性会在Vue中报错的问题，需要将属性设置为不可枚举的；
* */
let propertyDescriptors = {
  /**
   * 兼容方法：为事件添加事件处理器
   * @param event : string 必需。描述事件名称的字符串。注意： 不要使用 "on" 前缀。例如，使用 "click" 来取代 "onclick"。
   * @param handler : function  必需。描述了事件触发后执行的函数。
   * @param useCapture : boolean 可选。布尔值，指定事件是否 在捕获或冒泡阶段执行。
   */
  byAddEventListener: {
    enumerable: false,
    value: function (event, handler, useCapture) {
      if (this.addEventListener) {
        this.addEventListener(event, handler, useCapture);
      } else if (this.attachEvent) {
        this.attachEvent("on" + event, handler);
      } else {
        this["on" + event] = handler;
      }
    }
  },

  /**
   * 兼容方法：移除事件处理器
   * @param event : string 必须。要移除的事件名称。注意： 不要使用 "on" 前缀。例如，使用 "click" 来取代 "onclick"。
   * @param handler : function  必须。指定要移除的函数。
   * @param useCapture : boolean 可选。布尔值，指定移除事件句柄的阶段。
   */
  byRemoveEventListener: {
    enumerable: false,
    value: function (event, handler, useCapture) {
      if (this.removeEventListener) {
        this.removeEventListener(event, handler, useCapture);
      } else if (this.attachEvent) {
        this.detachEvent("on" + event, handler);
      } else {
        this["on" + event] = null;
      }
    }
  },



  /**
   * 兼容方法：为多个事件添加事件处理器
   * @param eventList : Array<string> 必需。事件名称数组。注意： 不要使用 "on" 前缀。例如，使用 "click" 来取代 "onclick"。
   * @param handler : function  必需。描述了事件触发后执行的函数。
   * @param useCapture : boolean 可选。布尔值，指定事件是否 在捕获或冒泡阶段执行。
   */
  byAddListenerForMultipleEvent: {
    enumerable: false,
    value: function (eventList, handler, useCapture) {
      eventList.forEach((event)=>{
        this.byAddEventListener(event,handler,useCapture);
      });
    }
  },



  /**
   * 兼容方法：移除事件处理器
   * @param eventList : Array<string> 必需。需要移除的事件名称数组。注意： 不要使用 "on" 前缀。例如，使用 "click" 来取代 "onclick"。
   * @param handler : function  必须。指定要移除的函数。
   * @param useCapture : boolean 可选。布尔值，指定移除事件句柄的阶段。
   */
  byRemoveListenerForMultipleEvent: {
    enumerable: false,
    value: function (eventList, handler, useCapture) {
      eventList.forEach((event)=>{
        this.byRemoveEventListener(event,handler,useCapture);
      });
    }
  },





  /**
   * 兼容方法：为单个事件添加多个事件处理器
   * @param event : string 必需。描述事件名称的字符串。注意： 不要使用 "on" 前缀。例如，使用 "click" 来取代 "onclick"。
   * @param handlerList : Array<function>  必需。需要添加的事件处理器数组。
   * @param useCapture : boolean 可选。布尔值，指定事件是否 在捕获或冒泡阶段执行。
   */
  byAddMultipleListenerForEvent: {
    enumerable: false,
    value: function (event, handlerList, useCapture) {
      handlerList.forEach((handler)=>{
        this.byAddEventListener(event,handler,useCapture);
      });
    }
  },



  /**
   * 兼容方法：移除事件处理器
   * @param event : string 必须。要移除的事件名称。注意： 不要使用 "on" 前缀。例如，使用 "click" 来取代 "onclick"。
   * @param handlerList : Array<function>  必需。需要移除的事件处理器数组。
   * @param useCapture : boolean 可选。布尔值，指定移除事件句柄的阶段。
   */
  byRemoveMultipleListenerForEvent: {
    enumerable: false,
    value: function (event, handlerList, useCapture) {
      handlerList.forEach((handler)=>{
        this.byRemoveEventListener(event,handler,useCapture);
      });
    }
  },




};


Object.defineProperties(EventTarget.prototype, propertyDescriptors);
