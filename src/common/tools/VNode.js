/**
 * 获取虚拟节点的文本内容
 * @param vNode : VNode   虚拟节点
 * @param separator : string    子节点文本内容的分隔符；默认值： `,`
 * @return string     vNode 的文本内容
 */

export function getVNodeTextContent(vNode,separator) {
  let textContent = null;

  let elm = vNode.elm

  let vNodeChildren = vNode.children ;
  let compOptionsChildren = vNode.componentOptions && vNode.componentOptions.children ;
  let children = vNodeChildren || compOptionsChildren ;

  if (elm){
    textContent = elm.innerText ;
  }else if (children) {

    let textContentList = children.map(function (childVNode) {
      return getVNodeTextContent(childVNode," ");
    });

    textContent = textContentList.join(separator);
  } else {
    textContent = vNode.text ;
  }


  return textContent ;
}






/**
 * 获取虚拟节点 及其 子节点中的第一个 click事件处理器 或 to 或 link
 * @param vNode
 * @return function
 */
export function getVNodeClickHandle (vNode){

  let click = null;

  let componentOptions = vNode.componentOptions ;

  if (componentOptions) {
    click = componentOptions.listeners && componentOptions.listeners.click ;

    if (!click) {
      click = componentOptions.propsData && componentOptions.propsData.to ;
    }

    if (!click) {
      click = componentOptions.propsData && componentOptions.propsData.link ;
    }

  }

  if (!click) {
    let vnData = vNode.data ;
    click = vnData && vnData.on && vnData.on.click ;
  }




  if (!click && vNode.children){
    vNode.children.find(function (childVNode) {
      click = getVNodeClickHandle(childVNode);
      return click ? true : false ;
    });
  }

  return click ;
}


/**
 * 从 虚拟节点 上解析出 ButtonOptions
 * @param vNode : VNode 虚拟节点
 * @return ButtonOptions
 *
 *
 * ButtonOptions 类型的定义是 :
 * ButtonOptions = {text:string,click:function}
 */
export function parseButtonOptionsFromVNode(vNode){
  let text = getVNodeTextContent(vNode," ");
  let click = getVNodeClickHandle(vNode) ;

  return {
    text:text,
    click:click
  };
}





/**
 * 从 虚拟节点列表 上解析出 ButtonOptions 列表
 * @param vNodeList : Array<VNode> 虚拟节点列表
 * @return Array<ButtonOptions>
 *
 *
 * ButtonOptions 类型的定义是 :
 * ButtonOptions = {text:string,click:function}
 */
export function parseButtonOptionsListFromVNodeList(vNodeList){
  return vNodeList.map(function (vNode) {
    return parseButtonOptionsFromVNode(vNode);
  });
}






//克隆结点：开始






/**
 * 通过创建新节点的方式 克隆 vnode
 * @param vnode : VNode
 * @param createElement : function     创建元素的函数
 * @param options ? : Object   可选的其它参数
 * @param options.data ? : Object     可选；一个包含模板相关属性的数据对象；这样，您可以在 template 中使用这些属性。可选参数。
 * @param options.children ? : Array<VNode>     可选；子节点 (VNodes)数组
 * @param options.deepClone ? : boolean    可选； 是否进行深度克隆
 * @return VNode    返回克隆的节点
 */
export function cloneVNodeUseCreate (vnode,createElement,options = {}) {
  let {data,children,deepClone} = options ;

  let {tag,children:vnChildren,componentOptions,data:vnData} = vnode ;

  let finalTag = tag ;
  let oriChildren = vnChildren ;

  if (componentOptions) {
    let {propsData,listeners,tag:comTag,children:comChildren} = componentOptions ;

    let {on,props,...pureVnData} = vnData ;
    let mergedProps = {...props,...propsData} ;
    let mergedOn = {...on,...listeners} ;

    vnData = {...pureVnData,props:mergedProps,on:mergedOn};

    oriChildren = comChildren || vnChildren ;

    finalTag = comTag ;
  }


  let finalData = data || vnData ;


  let finalChildren = children ;


  if (!finalChildren && oriChildren){

    if (deepClone) {
      finalChildren = oriChildren.map( function(childVN){
        return cloneVNode(childVN,createElement,{deepClone:deepClone}) ;
      });
    }else {
      finalChildren = oriChildren ;
    }

  }




  const newVN = createElement(finalTag, finalData, finalChildren);



  const clonedVN = {...vnode};

  let ignoreKeys = ["isComment","text","componentOptions"];

  Object.keys(newVN).reduce(function (cloned,vnKey) {
    let vnValue = newVN[vnKey];

    if (!(vnValue == null || ignoreKeys.includes(vnKey) )) {
      cloned[vnKey] = vnValue ;
    }

    return cloned

  },clonedVN);





  return clonedVN;
}








/**
 * 通过创建新节点的方式克隆一组虚拟节点 vnode
 * @param vnodes : Array<VNode>     虚拟节点数组
 * @param createElement : function     创建元素的函数
 * @param options ? : Object   可选的其它参数
 * @param options.data ? : Object     可选；一个包含模板相关属性的数据对象；这样，您可以在 template 中使用这些属性。可选参数。
 * @param options.children ? : Array<VNode>     可选；子节点 (VNodes)数组
 * @param options.deepClone ? : boolean    可选； 是否进行深度克隆
 * @return VNode    返回克隆的节点
 */
export function cloneVNodesUseCreate (vnodes,createElement,options) {

  let newVNodes = [] ;

  if (vnodes) {
    newVNodes = vnodes.map(function (vn) {
      return cloneVNode(vn,createElement,options);
    });
  }

  return newVNodes ;

}











/**
 * 配置目标节点的上下文使之与源节点的上下文相同
 * @param targetVN : VNode    目标节点
 * @param sourceVN : VNode    源节点
 * @return VNode    修改后的目标节点
 */
export function configSameVnodeContext(targetVN,sourceVN){

  let relatedKeys = ["ns","fnContext","context"];

  relatedKeys.forEach(function (key) {
    targetVN[key] = sourceVN[key] ;
  });

  return targetVN;
}





/**
 * 通过复制的方法克隆节点
 * @param vnode : VNode   被克隆的节点
 * @param options : Object    选项对象
 * @opetions.equivalentVNode : VNode    提供等效上下文的节点
 * @opetions.deepClone : boolean    是否要进行深度克隆
 *
 * @return VNode
 */
export function cloneVNodeUseCopy(vnode,options = {}){
  let {equivalentVNode,deepClone} = options ;

  let clonedVN = {...vnode} ;

  if (equivalentVNode) {
    clonedVN = configSameVnodeContext(clonedVN,equivalentVNode);
  }


  if (deepClone) {

    let vnChildren = vnode.children ;

    if  (vnChildren) {
      clonedVN.children = vnChildren.map(function (childVN) {
        return cloneVNodeUseCopy(childVN,{deepClone:deepClone});
      });
    }


    let comChildren = vnode.componentOptions && vnode.componentOptions.children ;

    if (comChildren) {
      clonedVN.componentOptions.children = comChildren.map(function (childVN) {
        return cloneVNodeUseCopy(childVN,{deepClone:deepClone});
      });
    }


  }


  return clonedVN ;


}


/**
 * 通过复制的方法克隆一组节点
 * @param options : Object    选项对象
 * @opetions.equivalentVNode : VNode    提供等效上下文的节点
 * @opetions.deepClone : boolean    是否要进行深度克隆
 *
 * @return Array<VNode>
 */
export function cloneVNodesUseCopy(vnodes,options) {

  let clonedVnodes = [];

  if (vnodes) {
    clonedVnodes = vnodes.map(function (vn) {
      return cloneVNodeUseCopy(vn,options);
    });
  }

  return clonedVnodes;
}



//克隆结点：结束
