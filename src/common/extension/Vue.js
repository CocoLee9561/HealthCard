import Vue from 'vue';

/**
 * 全局注册多个组件
 * @param componentOptions  : {componentName:string,component:VueComponent} 注册组件的配置对象，属性是组件的名字，值是需要注册的组件
 */
Vue.regComponents = function (componentOptions) {

  if (componentOptions) {
    Object.keys(componentOptions).forEach((compName) => {
      this.component(compName, componentOptions[compName]);
    });
  }

}


/**
 * 全局应用多个插件
 * @param plugins  : Array<VuePlugin | [VuePlugin,options]>  插件数组
 */
Vue.usePlugins = function (plugins) {

  if (Array.isArray(plugins)) {

    plugins.forEach(function (pluginOptions) {

      let plugin = pluginOptions;
      let options = null;
      if (Array.isArray(pluginOptions) && !pluginOptions.install) {
        plugin = pluginOptions[0];
        options = pluginOptions[1];
      }

      this.use(plugin, options);
    }, Vue);


  } else {
    throw "usePlugins 只能接收数组类型的参数";
  }
}


/**
 * 全局注册多个混入
 * @param mixins  : Array<Mixin> 混入数组
 */
Vue.regMixins = function (mixins) {
  if (Array.isArray(mixins)) {

    mixins.forEach(function (mixin) {
      this.mixin(mixin);
    }, Vue);

  } else {
    throw "regMixins 只能接收数组类型的参数";
  }
}






//混合：开始


//vnode相关的混合
let vnodeMixin = {
  computed:{
    $allSlots:function () {
      return Object.values(this.$slots).reduce(function (all,slot) {
        return all.concat(slot) ;
      },[]);
    }
  }
};




Vue.regMixins([vnodeMixin]);
//混合：结束
