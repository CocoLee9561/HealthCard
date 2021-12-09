[优秀代码的原则]: https://www.jianshu.com/p/3ca70788cba0
[前端工程]: https://github.com/fouber/blog/issues/10



目录
=========

- 一、项目结构的核心思想
- 二、项目目录结构
- 三、资源路径编译规则
- 四、index.html
- 五、build目录 和 config目录
- 六、public目录
- 七、static 目录
- 八、src目录结构
- 九、间接访问
- 十、目录的分类
- 十一、新概念的定义
- 十二、Vuex的拆分方案
   - 1. 分散式Vuex的拆分规则
   - 2. 相关工具函数的实现
- 十三、vue-router的拆分方案
- 十四、组件的vue-router和Vuex的配置对象的安放位置
   - 方案1：集中在vue文件
   - 方案2：分散到单独的JS文件
   - 方案3：分散到单独的JS文件，然后再汇总导出
   - 方案4：汇总到单独的JS文件
- 十五、组件的分类
- 十六、组件结构规范
   - 1. 容器组件结构规范
   - 2. 展示组件结构规范




前言
=======
本规范是我依照 **关注点分离** 的思想，针对 vue 项目制定的规范，如果您在使用当中发现不当 或 需要完善的地方，您都可以通过以下方式联系我，期待与您的交流：

- 邮箱：guobinyong@qq.com
- QQ：guobinyong@qq.com
- 微信：keyanzhe


内容
==========




# 一、项目结构的核心思想
因为代码的相关性主要与业务功能有关，而与文件类型的关系不大，所以，为了便于 编写、查阅、理解 代码，项目结构遵循以下核心宗指（宗指属于思想）：
- 以业务功能为单位组织项目结构；
- 以低耦合度为目标划分模块职责和逻辑；

**优点：**
- 业务功能模块的相关代码都集中在一块，方便移动和删除；
- 实现了关注点分离，方便开发、调试、维护、编写、查阅、理解代码；


*相关文章:《[前端工程][]》*


# 二、项目目录结构
本项目规范的根级目录与Vue脚手架的 webpack 模板的根级目录一致，只是 `src/` 下的目录结构与 webpack 模板不一样；因为 `src/` 下的目录结构遵从本规范 `项目结构的核心思想` ；

```
.
├── build/                      # webpack 配置文件；
│   └── ...
├── config/                     # 与项目构建相关的常用的配置选项；
│   ├── index.js                # 主配置文件
│   ├── dev.env.js              # 开发环境变量
│   ├── prod.env.js             # 生产环境变量
│   └── test.env.js             # 测试环境变量
│
├── src/
│   ├── main.js                 # webpack 的入口文件；
│   ├── common/                 # 存放项目共用的资源，如：常用的图片、图标，共用的组件、模块、样式，常量文件等等；
│   │   ├── assets/             # 存放项目共用的代码以外的资源，如：图片、图标、视频 等；
│   │   ├── components/         # 存放项目共用的组件，如：封装的导航条、选项卡等等； 备注：这里的存放的组件应该都是展示组件；
│   │   ├── network/            # 存放项目的网络模块，如：接口；
│   │   ├── compatible/         # 存放项目的兼容模块，如：适合App和微信各种接口的模块；
│   │   ├── extension/          # 存放已有类的扩展模块，如：对 Array 类型进行扩展的模块；
│   │   ├── constant.js         # 存放js的常量；
│   │   ├── constant.scss       # 存放scss的常量；
│   │   └── ...
│   └── app/                    # 存放项目业务代码；
│       ├── App.vue             # app 的根组件；
│       └── ...
│
├── static/                     # 纯静态资源，该目录下的文件不会被webpack处理，该目录会被拷贝到输出目录下；
├── test/                       # 测试
│   ├── unit/                   # 单元测试
│   │   ├── specs/              # test spec files
│   │   ├── eslintrc            # 专为单元测试配置的eslint配置文件
│   │   ├── index.js            # 测试编译的入口文件
│   │   ├── jest.conf.js        # Jest的配置文件
│   │   └── karma.conf.js       # Karma的配置文件
│   │   └── setup.js            # 在Jest之前运行的启动文件；
│   └── e2e/                    # e2e 测试
│       ├── specs/              # test spec files
│       ├── custom-assertions/  # 自定义的断言
│       ├── runner.js           # test runner 脚本
│       └── nightwatch.conf.js  # test runner 的配置文件
├── .babelrc                    # babel 的配置文件
├── .editorconfig               # 编辑器的配置文件；可配置如缩进、空格、制表类似的参数；
├── .eslintrc.js                # eslint 的配置文件
├── .eslintignore               # eslint 的忽略规则
├── .gitignore                  # git的忽略配置文件
├── .postcssrc.js               # postcss 的配置文件
├── index.html                  # HTML模板
├── package.json                # npm包配置文件，里面定义了项目的npm脚本，依赖包等信息
└── README.md
```





# 三、资源路径编译规则
默认情况下，vue-loader 使用 css-loader 和 Vue 模版编译器自动处理样式和模版文件。在编译过程中，所有的资源路径例如 `<img src="...">` 、`background: url(...)` 和 `@import` 会作为模块依赖。

路径的编译规则如下：
- 如果路径是绝对路径，会原样保留；
- 如果路径以 . 开头，将会被看作相对的模块依赖，并按照你的本地文件系统上的目录结构进行解析；
- 如果路径以 ~ 开头，其后的部分将会被看作模块依赖。这意味着你可以用该特性来引用一个 node 依赖中的资源： `<img src="~some-npm-package/foo.png">`；
- 如果路径以 @ 开头，也会被看作模块依赖。如果你的 webpack 配置中给 @ 配置了 alias，这就很有用了。所有 vue-cli 创建的项目都默认配置了将 @ 指向 `/src`；



# 四、index.html
在webpack构建项目期间，webpack插件 `html-webpack-plugin` 会将 `/index.html` 处理后并拷贝到输出目录中，并把 webpack 的构建输出资源（如：输出的js、css文件，等等）链接自动插入到该 html 文件。此外，Vue CLI还会自动注入资源提示（preload/prefetch）清单/图标链接（当使用PWA插件时）；


# 五、build目录 和 config目录
- build 目录下存放的是 webpack 的配置文件；
- config 目录下存放的是与项目构建相关的常用的配置选项、变量；

通常情况下，除非要配置 webpack 的 loader 或者 插件，否则，你应该优先尝试更改 config 目录下的文件；



# 六、public目录
项目的 public 目录由 `webpackConfig.output.publicPath` 参数决定；在用 vue 脚手架创建的基于 webpack 模板 的项目中，`webpackConfig.output.publicPath` 的默认配置是 `/` ；

要引用 public 目录下的资源，需要通过以下方式（为了方便描述，设 public 目录的路径是 `publicPath`）：
 - 在 `publicPath/index.html` 文件中引用 public 中的资源时，需要在链接前加上 `<%= webpackConfig.output.publicPath %>`；
    **示例:**
    ```
    <link  rel = "快捷方式图标"  href = "<％= webpackConfig.output.publicPath％>favicon.ico " >
    ```
 - 在 JavaScript 中，需要通过 `process.env.BASE_URL` 引用 public 中的资源；
    **示例:**
    1. 先将 `process.env.BASE_URL` 传递给组件;
       ```
       data () {
         return {
           baseUrl: process.env.BASE_URL
         }
       }
       ```
    2. 然后，在模板中引用：
       ```
       <img :src="`${baseUrl}my-image.png`">
       ```



# 七、static 目录
- static 虽然目录可以添加任何资源，如：图片、代码 等等，但是不建议把这些资源添加到 static static 目录适合存放以下内容：
   - 与 webpack 不兼容的库；
   - 您需要在构建输出中使用具有特定名称的文件；
   - 你有成千上万的图像，需要动态引用它们的路径；
- `static/` 目录的资源不会被webpack处理，它们会被拷贝到输出目录下；
- 要引用 `static/` 目录下的资源，可以使用 `publicPath/static/...` ；




# 八、src目录结构
根据项目结构的核心思想，src的目录结构将以业务功能划分，具体如下 :
```
src/
├── main.js                 # webpack 的入口文件；
├── common/                 # 存放项目共用的资源，如：常用的图片、图标，共用的组件、模块、样式，常量文件等等；
│   ├── assets/             # 存放项目共用的代码以外的资源，如：图片、图标、视频 等；
│   ├── components/         # 存放项目共用的组件，如：封装的导航条、选项卡等等； 备注：这里的存放的组件应该都是展示组件；
│   ├── network/            # 存放项目的网络模块，如：接口；
│   ├── compatible/         # 存放项目的兼容模块，如：适合App和微信各种接口的模块；
│   ├── extension/          # 存放已有类的扩展模块，如：对 Array 类型进行扩展的模块；
│   ├── constant.js         # 存放js的常量；
│   ├── constant.scss       # 存放scss的常量；
│   └── ...
└── app/                    # 存放项目业务代码；
```

**注意:**
- 项目的业务代码应该从 `src/app/` 目录开始；
- `src/common/` 的子目录中，在深度上的层级结构应该是尽量扁平的，不应该有很深的层级结构；如果 `src/common/` 中的目录树 与 `src/app/` 中的目录树在深度上有十分相似的层级结构，则就表示你应该重新考虑 `src/common/` 中的资源是否是真的需要被共享的资源，被共享的资源的目录层级结构应该是尽可能扁平的；对于不必共享的资源，应该放在 `src/app/` 下相应的目录结构中；



# 九、间接访问
要间接地访问 常用 或者 易变更 的 目录 或 模块 ；
间接扡访问方式有很多，如：
- 通过常量或变量；
- 通过 webpack 的配置字段 `resolve.alias` ；

**示例:**
假设我们会经常访问对于 `src/common/assets/` 目录，或者在将来，可能会更改 `src/common/assets/` 目录的位置；
则我们可以如下间接地访问 `src/common/assets/` 目录：
1. 在 webpack 的配置字段 `resolve.alias` 中给 `src/common/assets/` 目录设置别名：
   ```
   webpackConfig.resolve.alias = {
      'c-assets': resolve('src/common/assets'),
    }
   ```
2. 通过上面设置的别名 `'c-assets/...'` 访问 `src/common/assets/` 目录：

**优点:**
这样做有以下好处：
- 访问目录更方便；
- 当目录位置变更时，只需要更改一处（别名的值 或者 变量的值），就可以使所有的访问指向正确地的地址；
- 不易出错，因为通过变量或者别名缩短了路径的长度；







# 十、目录的分类
目录的作用就是组织文件的，为了充分实现 `项目结构的核心思想` ，我把目录分为以下几类：
- 组件目录 : 以组件为单位划分的、用于组织单个组件相关文件的目录；
- 容器目录 : 用于组织某类东西的目录；

**示例:**
假设有以下目录：
```
components/         # 存放项目共用的组件，如：封装的导航条、选项卡、轮播图等等；
├── navbar/         # 导航条组件的目录；
├── tabbar/         # 选项卡组件的目录；
├── swiper/         # 轮播图组件的目录；
└── ...
```

其中，目录 `navbar/` 、 `tabbar/` 、 `swiper/` 中分别盛放的是 导航条、选项卡、轮播图 组件，它它们都是为单个组件专门分配的目录，所以，这些目录都是 组件目录 ；   而目录 `components/` 下面盛放了很多组件，所以它不是专门为单个组件而分配的目录，它是用于盛放某类（组件）东西的，所以它是 容器目录 ；








# 十一、新概念的定义
为了方便描述，我定义了以下概念：
> **假设：** 有 A 和 B 2个模块，且，在A模块中使用了B模块；
> **则:** 称 A模块 为 B模块 的 **使用者**，B模块 为 A模块 的 **提供者**；



# 十二、Vuex的拆分方案
在 Vuex 中，每个应用程序一般只有一个 store ，而 state、mutations、actions、getters 等等 的配置是在创建store的地方，这也使得 mutations、actions 的逻辑集中在一个位置，虽然 Vuex 提供了 modules 用以支持模块化，但它不适用于如下场景：在子模块中创建全局的 state ！ 所以，Vuex的拆分方案中，modules 并没有起致有效的作用；为了解决这个问题，我研究出了如下拆分方案：


## 1. 分散式Vuex的拆分规则
1. 在 提供者 中导出 存储着与提供者相关的 store 配置对象 的数组：
   ```
   //B的storeConfigs,是数组形式，里面是Vuex中正常的store的配置对象
   let bStoreConfigs = [
       {
           modules:{},
           state:{},
           mutations:{},
           actions:{},
           getters:{},
           plugins:[],
           strict:false
       }
   ]

   //导出 B 的 store 配置数组
   export {bStoreConfigs}
   ```

2. 在 使用者 中导入 提供者 的 store 配置数组，并拼接到 使用者 的 store 配置数组的后面，然后导出拼接后的 store 配置数组：
   ```
   // 导入B的 store 配置数组
   import {bStoreConfigs} from './B.js'

   // 定义 A 的 store 的配置数组，并拼接 B 的 store 配置数组
   let aStoreConfigs = [
       {
           modules:{},
           state:{},
           mutations:{},
           actions:{},
           getters:{},
           plugins:[],
           strict:false
       },
       // 拼接 B 的 store 配置数组
       ...bStoreConfigs
   ]

   //导出 拼接后的 的 store 配置数组
   export {aStoreConfigs}
   ```

3. 在创建 store 的地方，导入 App 根组件的 store 配置数组，然后用工具函数 `mergeStoreConfigs` 把 根组件的 store 配置数组合并成正常的 store 配置对象，最后用该对象创建 store：
   ```
   // 导入根组件的 store 配置数组
   import {appStoreConfigs} from './App.js'

   // 用工具函数 `mergeStoreConfigs` 把 根组件的 store 配置数组合并成正常的 store 配置对象；
   let storeOptions = mergeStoreConfigs(appStoreConfigs);

   // 创建 store
   const store = new Vuex.Store(storeOptions);
   ```




## 2. 相关工具函数的实现
-  把store的配置数组中所有的配置对象合并成一个store配置对象
**mergeStoreConfigs(storeConfigs)**
```
/**
 * 把 store 配置数组中所有的配置对象合并成一个store配置对象
 * @param storeConfigs : Array<StoreOptions>  store 的配置数组
 * @returns StoreOptions    store选项对象
 *
 */
function mergeStoreConfigs(storeConfigs) {
  if (!(storeConfigs instanceof Array)) {
    throw new Error(`storeConfigs必须是数组类型，但您传的是：${storeConfigs}`);
  }

  let storeOptions = storeConfigs.reduce(function (merged, config) {

    Object.keys(config).forEach(function (key) {
      let configPropValue = config[key];
      let mergedPropValue = merged[key];
      let newPropValue = null;

      // 注意：有些case有 break，有些没有；这样写可能不太好理解，但比用 if else 节省了好几行代码，从而提高了性能
      switch (key) {
        case "plugins": {
          newPropValue = [...mergedPropValue, ...configPropValue];
          break;
        }
        case "initState": {
          newPropValue = mergedPropValue || configPropValue;
          break;
        }
        case "strict": {
          newPropValue = mergedPropValue || configPropValue;
          break;
        }
        case "modules": {

          if (mergedPropValue) {

            Object.keys(configPropValue).forEach(function (configModulesKey) {

              let mergedModule = mergedPropValue[configModulesKey];

              if (mergedModule) {
                let configModule = configPropValue[configModulesKey];

                //递归调用自己来合并modules中的同名 StoreOptions
                let moduleStoreOptions = mergeStoreConfigs([mergedModule, configModule]);
                configPropValue[configModulesKey] = moduleStoreOptions;

                try {
                  delete mergedPropValue[configModulesKey];
                } catch (e) {

                }

              }

            });

          }


          // 注意：此处没有 break ;
        }
        case "state": {
          if (typeof configPropValue == "function") {
            configPropValue = configPropValue();
          }
          // 注意：此处没有 break ;
        }
        default: {
          newPropValue = {...mergedPropValue, ...configPropValue}
        }

      }

      merged[key] = newPropValue;

    });


    return merged;

  }, {});


  return storeOptions;

}
```



- 用初始 state 配置 store的选项对象
**configStoreOptionsWhitInitState(storeOptions,initState)**
```
/**
 * 用初始 state 配置 store的选项对象
 * @param storeOptions : StoreOptions   store的选项对象
 * @param initState : State    初始state
 * @returns StoreOptions    返回带有初始 state 的选项对象
 *
 *
 * 说明：
 * 由于模块 modules 中的 state 会覆盖全局的 state ，所以，通过把初始 state 传给全局的 state 的方式不能达到给模块设置初始值的目的；
 * 此方法就是为解决这个问题而来的；
 *
 * 注意：
 * 如果某些模块 module 不想用入参 initState 中的 state 作为初始值，只用 module 本身设置的 state 作为初始值，则可以在该模块的 storeOptions 对象中增加一个布尔类型的选项 initState ，其值为 true ，即可；
 * initState 选项表示：是否用该 storeOptions 中配置的 state 作为初始的 state
 *
 * 示例：
 * {
 *   modules:{},
 *   state:{},
 *   mutations:{},
 *   actions:{},
 *   getters:{},
 *   plugins:[],
 *   strict:false,
 *   initState:true
 * }
 *
 */
function configStoreOptionsWhitInitState(storeOptions,initState) {
  let modules = storeOptions.modules;

  if (initState){

    if (modules){

      Object.keys(modules).forEach(function (key) {

        let subStoreOptions = modules[key];
        let subInitState = initState[key];

        subStoreOptions = configStoreOptionsWhitInitState(subStoreOptions,subInitState);


        modules[key] = subStoreOptions;

        try{
          delete initState[key];
        }catch (e) {

        }

      });

      storeOptions.modules = modules;

    }


    let configState = storeOptions.state;
    if (storeOptions.initState){
      storeOptions.state = {...initState, ...configState};
    }else {
      storeOptions.state = {...configState,...initState};
    }


  }



  return storeOptions;
}
```


- 综合mergeStoreConfigs和configStoreOptionsWhitInitState
**mergeStoreConfigsWhitInitState(storeConfigs,initState)**
```
/**
 * 把 store 配置数组中所有的配置对象合并成一个带有初始 statestore配置对象
 * @param storeConfigs : Array<StoreOptions>  store 的配置数组
 * @param initState : State    初始state
 * @returns StoreOptions    返回带有初始 state 的选项对象
 */
function mergeStoreConfigsWhitInitState (storeConfigs,initState) {
  let storeOptions = mergeStoreConfigs(storeConfigs);
  storeOptions = configStoreOptionsWhitInitState(storeOptions,initState);
  return storeOptions;
}
```





# 十三、vue-router的拆分方案
vue-router 是将路由规则集中在一个位置，这使它们与布局组件分离。以下是 vue-router 的核心思想（以下称为 `集中式路由思想` ）：
- 路由集中在一个地方；
- 布局和页面嵌套是通过路由的配置对象的嵌套而来的；
- 布局和页面组件是完全纯粹的，它们是路由的一部分；

这与早期版本 ReactRouter 的思想是一样的，但是它与我们的 `项目结构的核心思想` 相违背；

根据 `项目结构的核心思想` ，我们的路由的核心思想（以下称为 `分散式路由思想` ）应该是：
- 路由分散在组件中；组件负责它自已的 `<router-view>` 的路由配置；即：组件负责它自身的路由配置；
- 路由的嵌套是通过组件的嵌套而来的；
- 布局由组件负责，路由是组件的一部分；

这个思想与新版本的 ReactRouter (react-router-dom) 的思想是一致的；


显然，若要对当前 vue-router 实现 `分散式路由思想` ，则需要对路由配置进行拆分；为此，并且兼顾了表意明确，我定制了如下拆分规则：

**分散式vue-router的拆分规则**
1. 在 提供者 中导出 提供者的子路由配置数组：
   ```
   export let bChildRoutes = [
       { path:bSubPath1, component:BSubComponent },
       { path:bSubPath2, component:BSubComponent2 },
       { path:bSubPath3, component:BSubComponentN }
   ];
   ```

2. 在 使用者 中导入 提供者 的子路由配置数组，并根据如下情况配置 使用者 的子路由配置数组：
   - 如果使用者是**组件目录**的配置文件 或 组件的配置文件，则将提供者的子路由作为使用者的子路由的子路由配置数组进行配置；
      ```
      import {B,bChildRoutes} from './B.js';

      export let aChildRoutes = [
          { path:bPath, component:B, children:bChildRoutes },
          { path:aSubPath1, component:ASubComponent1 },
          { path:aSubPath2, component:ASubComponent2 },
          { path:aSubPath3, component:ASubComponentN }
      ];
      ```

   - 如果使用者是**容器目录**的配置文件，则将提供者的子路由作为使用者的子路由配置数组中的元素进行配置；
      ```
      import {B,bChildRoutes} from './B.js';

      export let aChildRoutes = [
          { path:aSubPath1, component:ASubComponent1 },
          { path:aSubPath2, component:ASubComponent2 },
          { path:aSubPath3, component:ASubComponentN },
          ...bChildRoutes
      ];
      ```

3. 在创建 router 的地方，导入 App 根组件的子路由配置数组，并将其作为 router 配置对象中的 `routes` 字段的值来创建 router 实例：
   ```
   // 导入根组件的子路由配置数组
   import {appChildRoutes} from './App.js'

   // 创建 router
   const router = new VueRouter({
    routes:appChildRoutes
   });
   ```









# 十四、组件的vue-router和Vuex的配置对象的安放位置
通过上面的拆分方案，vue-router 和 Vuex 的配置对象都可以分散到各个组件的目录中，但是，这些配置对象具体是写在组件的vue文件中还是写在单独的js文件中，这一点还未确定；关于这点，有以下几个方案，但各有优缺点，具体如下：

**注意：** 本规范采用方案4:汇总到单独的JS文件


## 方案1：集中在vue文件
这种方案是把组件的 vue-router 和 Vuex 的配置对象都写在vue文件中；

**优点：**
- 在导入组件时，只需要写一个导入语句，但可以分别导入组件、vue-router、Vuex 的各个配置对象：
- 不需要额外创建文件；

**缺点：**
- vue文件的内容臃肿；
- 不能通过 Vue 的 ESlint 检查；
   vue 的ESLint 检查太严格，不过可以禁用Vue的ESLint来解决这个问题；
- 不能用于异步加载组件的情景；
   当使用异步加载组件场景中，由于 vue-router 和 Vuex 的配置对象不能及时提供，会导致一些问题；

## 方案2：分散到单独的JS文件
这种方案是把组件的 vue-router 和 Vuex 的配置对象分别写在单独的JS文件中；

**优点：**
- 避免了vue文件的内容臃肿；
- 能通过 Vue 的 ESlint 检查；
- 能用于异步加载组件的情景；


**缺点：**
- 在导入组件时，需要写3个导入语句用来分别导入组件、vue-router、Vuex 的配置对象；
- 需要额外创建2个js文件（vue-router的配置文件、Vuex的配置文件）；


## 方案3：分散到单独的JS文件，然后再汇总导出
这种方案是把组件的 vue-router 和 Vuex 的配置对象分别写在单独的JS文件中；

**优点：**
- 避免了vue文件的内容臃肿；
- 能通过 Vue 的 ESlint 检查；
- 能用于异步加载组件的情景；
- 在导入组件时，需要写1个或者2个(异步组件场景中需要分别导入配置对象 和 组件)导入语句就可以导入组件、vue-router、Vuex 的配置对象；
- 合理 webpack 的配置字段 `resolve.mainFiles` 和 `resolve.extensions` ，可以使导入更方便；


**缺点：**
- 需要额外创建3个js文件（vue-router的配置文件、Vuex的配置文件、汇总导出的文件）；


## 方案4：汇总到单独的JS文件
这种方案是把组件的 vue-router 和 Vuex 的配置对象写在一个单独的JS文件中；

**优点：**
- 避免了vue文件的内容臃肿；
- 能通过 Vue 的 ESlint 检查；
- 能用于异步加载组件的情景；
- 在导入组件时，需要写1个或者2个(异步组件场景中需要分别导入配置对象 和 组件)导入语句就可以导入组件、vue-router、Vuex 的配置对象；
- 合理 webpack 的配置字段 `resolve.mainFiles` 和 `resolve.extensions` ，可以使导入更方便；


**缺点：**
- 需要额外创建1个js文件；







# 十五、组件的分类
为了允分体现《[优秀代码的原则][]》，应该把项目的业务逻辑抽离出来，所以，业务逻辑与UI应该是分离开的、松耦合的；为此，借鉴 `ReactRedux` 的组件分离思想，把组件分为2类： **容器组件** 和 **展示组件** ；

- 展示组件 : 只负责展示UI，不负责业务逻辑，任何与业务相关的数据、回调都通过组件接口（如：props、event、slot等等）传递；
- 容器组件 : 只负责业务逻辑，不负责UI，任何与UI相关的展示、逻辑都通过 展示组件 来完成；

容器组件 和 展示组件 的区别如下：

|组件类别     | 展示组件                        |           	容器组件                |
|----       |-----                           |----------------                    |
|作用        | 展示UI(如:布局、样式)             |	处理业务逻辑(如:数据获取)            |
|直接使用Vuex |	否                              |	是                                |
|数据来源     | 组件接口（如：props、slot等等）    |	Vuex                             |
|数据修改     |	发送event                      |	向 Vuex 派发action 或 提交mutation  |





# 十六、组件结构规范
- 根据组件的分离思想，把组件分为：容器组件 和 展示组件；
- 组件的 主vue模块、主js模块 和 主样式模块 均用组件的名字作为文件名；
- 使用 `组件的vue-router和Vuex的配置对象的安放位置/方案4：汇总到单独的JS文件` 来组织组件的 vue-router 和 Vuex 的配置对象，把组件的 vue-router 和 Vuex 的配置对象写到 `config.js` 文件中；
- 对于经常需要导出的东西，需要按照统一的格式规范命名导出的名字，目前已有如下导出格式规范：
   - `<组件名>ChildRoutes` ：组件的子路由配置数组； 类型：Array<Route>；
   - `<组件名>StoreConfigs` ：组件的 store 配置数组； 类型：Array<StoreOptions>；


## 1. 容器组件结构规范
- 以容器组件为单位，为每个容器组件创建以组件名为名的独立目录，容器组件目录的层级结构 要与 容器组件 的组件层级结构对应；
- 容器组件目录下有以下几个目录：
   ```
   container/      : 容器组件的组件目录；
   ├── assets/       : 容器组件所特有的除代码以外的资源的容器目录；
   ├── component/      : 容器组件所特有的展示组件的容器目录；
   ├── Container.vue   : 容器组件的vue模块；
   ├── config.js       : 容器组件vue-router和Vuex的配置模块；
   ├── <容器目录1>       : 用于放置某类东西的容器目录；
   ├── <容器目录2>       : 用于放置某类东西的容器目录；
   :
   :
   ├── <容器目录N>       : 用于放置某类东西的容器目录；
   :
   :
   ├── subContainer1/   : 子容器组件1的组件目录；
   ├── subContainer2/   : 子容器组件2的组件目录；
   :
   :
   └── subContainerN/   : 子容器组件N的组件目录；
   ```
- 容器组件的 config.js 模块中定义并导出（如果有的话）以下内容：
   - `<组件名>ChildRoutes` ：组件的子路由配置数组； 类型：Array<Route>；
   - `<组件名>StoreConfigs` ：组件的 store 配置数组； 类型：Array<StoreOptions>；
- 容器组件所有特有的展示组件需要放在该容器组件的子目录 `component` 中；



## 2. 展示组件结构规范
- 展示组件的 config.js 模块定义并导出（如果有的话）以下内容：
   - `<组件名>ChildRoutes` ：组件的子路由配置数组； 类型：Array<Route>；
- 如果展示组件的逻辑或结构比较复杂，则展示组件也可以有自己独立的目录；
- 如果展示组件有自己的独立目录，则展示组件的目录结构应该如下：
   ```
   performer/          : 展示组件的组件目录；
   ├── assets/         : 展示组件所特有的除代码以外的资源的容器目录；
   ├── Performer.vue   : 展示组件的vue模块；
   ├── config.js       : 展示组件vue-router的配置模块；
   ├── <容器目录1>       : 用于放置某类东西的容器目录；
   ├── <容器目录2>       : 用于放置某类东西的容器目录；
   :
   :
   ├── <容器目录N>       : 用于放置某类东西的容器目录；
   :
   :
   ├── subPerformer1   : 子展示组件1的模块 或 组件目录；
   ├── subPerformer2   : 子展示组件2的模块 或 组件目录；
   :
   :
   └── subPerformerN   : 子展示组件N的模块 或 组件目录；
   ```
- 展示组件的 config.js 模块中不应该定义以下内容：
   - `<组件名>StoreConfigs` ：组件的 store 配置数组； 类型：Array<StoreOptions>；
