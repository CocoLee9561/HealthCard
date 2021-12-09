<template>
  <div class="page">
    <view-box>
      <x-header slot="header" :left-options="{showBack:false}">个人中心</x-header>
      <div class="my-user-bar">
        <div class="my-header">
          <img :src="userInfo.bsPicUrl">
        </div>
        <div class="my-info">
          <strong class="my-name" v-bind:class="{'user-mobuile-center':!userInfo.bsNickName}">
            {{userInfo.bsNickName||userInfo.bsMobile}}
          </strong>
          <div class="user-mobile" v-if="userInfo.bsNickName">
            {{userInfo.bsMobile}}
          </div>
          <!--<div class="my-auth-bar my-unauth">-->
            <!--<img style="vertical-align: middle;"   src="@icon/ic_prove_nor.png">-->
            <!--<span>未实名认证</span>-->
          <!--</div>-->
        </div>
        <i class="my-user-bar-arrow" ></i>
      </div>
      <group>
        <cell class="cell-bar" v-for="(item,index) in personalList" :title="item.name" :key="index" :link="item.route">
          <img slot="icon" :src="item.icon" width="24px" height="24px">
        </cell>
      </group>
      <!--<group>
        <cell class="cell-bar" is-link title="我的挂号" link="/myRegister">
          <img slot="icon" src="../../../common/assets/icon/my/ic_mynumber@2x.png" width="24px" height="24px">
        </cell>
        <cell class="cell-bar" is-link title="我的关注" link="/myFocus">
          <img slot="icon" src="../../../common/assets/icon/my/ic_myfocus@2x.png" width="24px" height="24px">
        </cell>
        <cell class="cell-bar" is-link title="我的收藏" link="/">
          <img slot="icon" src="../../../common/assets/icon/my/ic_myfav@2x.png" width="24px" height="24px">
        </cell>
        <cell class="cell-bar" is-link title="家庭成员" :link='{path:"/memberList",query:{
            funKey:"GRZX",
            title:"个人中心",
            hideBack:true,
            prompt:"选中要编辑的就诊人",
            to:JSON.stringify({
            name:"EditMember",
            query:{
              funKey:"GRZX",
              title:"编辑就诊人",
            }
          })

        }}'>
          <img slot="icon" src="../../../common/assets/icon/my/ic_myfamily@2x.png" width="24px" height="24px">
        </cell>
      </group>
      <group>
        <cell class="cell-bar" is-link title="我有话说" link="/mySpeak">
          <img slot="icon" src="../../../common/assets/icon/my/ic_user_feedback@2x.png" width="24px" height="24px">
        </cell>
        <cell class="cell-bar" is-link title="关于我们" link="/aboutUs">
          <img slot="icon" src="../../../common/assets/icon/my/ic_user_About-Us@2x.png" width="24px" height="24px">
        </cell>
        <cell class="cell-bar" is-link title="设置" link="/">
          <img slot="icon" src="../../../common/assets/icon/my/ic_user_setting@2x.png" width="24px" height="24px">
        </cell>
      </group>-->


      <!--<group>-->
        <!--<cell class="cell-bar" is-link>-->
          <!--<span slot="icon"><img width="24px" height="24px" src="@icon/my/system-log-out.png"/></span>-->
          <!--<span slot="title" style="color: red;">退出登录</span>-->
        <!--</cell>-->
      <!--</group>-->

      <div style="padding: 20px;" v-if="isApp()">
        <x-button type="warn" style="margin-top: 30px;" @click.native="logOut">退出登录</x-button>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {mapState,mapActions} from 'vuex'
  import {osName} from '@constant.js'
  import Cell from "../../../../node_modules/vux/src/components/cell/index.vue";
  export default {
    components: {
      Cell

    },
    computed: {
      ...mapState({
        userInfo:state => state.user.userInfo,
        personalList:state=>state.personalList
      })
    },
    mounted(){
//      console.log(this.$route.path)
//      debugger;
    },
    created(){
      this.$store.commit('updateTabSelected',0)
      this.getPersonalCenterList({})
      this.getUserInfo({});
    },
    methods:{
      ...mapActions(['getPersonalCenterList','getUserInfo','logout']),
      isApp(){
        return osName.alipay!=shareInst.client.osName&&osName.weChat!=shareInst.client.osName
      },
      logOut(){
        let self=this
        this.$vux.confirm.show({
          title:'退出登录',
          content:'是否退出当前账户？',
          confirmText:'退出',
          cancelText:'取消',
          onCancel () {},
          onConfirm () {
            self.logout({});
          }
        })
      }
    }
    // data(){
    //   return{
    //     // userInfo:JSON.parse(localStorage.getItem("userInfo"))
    //   }
    // }
  }
</script>
<style lang="scss" scoped>

  .my-user-bar{
    margin-top: 10px;
    background: #fff;
    padding:16px;
    overflow: hidden;
    position: relative;
    clear: both;
    box-sizing: border-box;
  }
  .my-user-bar:active{
   background: #F5F5F5;
  }
  .my-user-bar .my-header{
    float: left;
  }
   .my-user-bar .my-header img{
    width:60px;
    height:60px;
  }
  .my-user-bar .my-info{
    float: left;
    margin-left:15px;
  }
  .my-user-bar .my-info .my-auth-bar{
    margin-top: 5px;
    font-size: 13px;
  }
  .my-user-bar .my-info .my-auth-bar span{
  }
  .my-user-bar .my-info .my-auth-bar.my-unauth{
    color: #ccc;
    font-size:12px;
  }
  .my-user-bar .my-info .my-auth-bar.my-unauth img{
  	width:25px;
  }
  .my-user-bar .my-info .my-name{
    color: #2F2F2F;
    font-size: 18px;
  }

	.mint-cell-title img{
		margin-right: 10px!important;
		width:22px;
		height:22px;
	}

  .mint-cell:after{

  }
  .my-user-bar .my-user-bar-arrow:after{
    border: solid 2px #c8c8cd;
    border-bottom-width: 0;
    border-left-width: 0;
    content: " ";
    top:50%;
    right: 16px;
    position: absolute;
    width: 8px;
    height: 8px;
    -webkit-transform: translateY(-50%) rotate(45deg);
    transform: translateY(-50%) rotate(45deg);
  }
  .cell-bar img{
    display:block;
    margin-right:10px;
  }
  .user-mobile{
    color: #CDCDCD;
    margin-top:5px;
    font-size:14px;
  }
  .user-mobuile-center{
    line-height: 60px;
  }
</style>
