<template>
    <view-box>
      <router-view></router-view>
      <tabbar v-model="selected" slot="bottom" class="my-tab">
        <tabbar-item :link="{name:'Home'}">
          <img slot="icon-active" src="@icon/ic_family_sel@2x.png" >
          <img slot="icon" src="@icon/ic_family_nor@2x.png" >
          <span slot="label">首页</span>
        </tabbar-item>
        <tabbar-item :link="{name:'Message'}">
          <img slot="icon-active" src="@icon/ic_msg_sel@2x.png" >
          <img slot="icon" src="@icon/ic_msg_nor@2x.png" >
          <span slot="label">消息</span>
        </tabbar-item>
        <tabbar-item :link="{name:'My'}">
          <img slot="icon" src="@icon/ic_information_nor@2x.png" >
          <img slot="icon-active" src="@icon/ic_information_sel@2x.png" >
          <span slot="label">我的</span>
        </tabbar-item>
      </tabbar>
    </view-box>
</template>

<script>
  import { Tabbar, TabbarItem } from 'vux'
  // import tool from '@common/libs/tool'

  export default {
    name: "Entry",
    data(){
      return{
        selected:''
      }
    },
    watch:{

    },
    created(){
      // tool.hPush({name:'/index'},this)
      switch (this.$route.name){
        case 'Home':
          this.selected=0;
          break;
        case 'Message':
          this.selected=1;
          break;
        case 'My':
          this.selected=2;
          break;
      }
    },
    components: {
      Tabbar,
      TabbarItem
    }
  }
</script>

<style lang="scss">
	/*.weui-tabbar__icon{width:50px!important;height:50px!important;}
	.weui-tabbar__item{padding: 10px 0 0 ;}*/
	.weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon,
	.weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon > i,
	 .weui-tabbar__item.weui-bar__item_on .weui-tabbar__label{
    color: $mainColor !important;
	 }
</style>
