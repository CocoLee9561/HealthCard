


/**
 * 计算元素相对指定的祖先节点 parentNode 的偏移量
 * @param parentNode : Element  祖先节点
 * @return {top:number,left:number}  top : 垂直方向的偏移量；leftL: 水平方向的偏移量；
 */
Element.prototype.distanceToParent = function (parentNode){
    var top = this.scrollTop ;
    var left = this.scrollLeft ;

    var nextNode = this.parentNode ;

    while (!parentNode.isSameNode(nextNode)) {
        top += nextNode.scrollTop ;
        left += nextNode.scrollLeft ;
        nextNode = nextNode.parentNode ;
    }
    
    return {top:top,left:left};
}