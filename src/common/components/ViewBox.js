
import {ViewBox} from 'vux'
import {configSameVnodeContext} from '@tools/VNode' ;


/**
 * 该组件定制了 Vux 的 ViewBox 组件，使其能根据 client.showWebNavBar 和  自身是否有 header 插槽来动态决定 Vux的ViewBox的 body-padding-top 是否需要设置为 0 ；这样便不用每次使用都要单独定制了
 *
 * 注意：
 * 如果把该组件定义成函数式组件，则会出现：当把该组件嵌套使用时，内层 ViewBox 不能正常分发插槽的情况；
 */
export default {
  name:"ByViewBox",
  render:function (createElement) {

    let slots = this.$slots ;



    let header = slots.header || [] ;
    let bottom = slots.bottom || []  ;
    let defaultSlot = slots.default || [] ;

    let props = {
      ...this.$attrs
    };

    // if (!(shareInst.client.showWebNavBar && slots.header)) {
    //   props.bodyPaddingTop = "0" ;
    // }
    props.bodyPaddingTop = "0" ;
    props.bodyPaddingBottom = "0" ;


    let viewBoxVN = createElement(ViewBox,{props:props},[...header,...defaultSlot,...bottom]);
    viewBoxVN = configSameVnodeContext(viewBoxVN,this.$vnode);
    if(viewBoxVN.data.class){
      viewBoxVN.data.class=viewBoxVN.data.class+' cus-page';
    }else{
      viewBoxVN.data.class='cus-page';
    }
    return viewBoxVN;

  }

}
