<template>

  <div class="page">
    <view-box>
      <x-header slot="header"   >{{title}}</x-header>
      <template v-if="memberList.length>0">

        <!--提示-->
        <!--<group gutter="0">
          <cell class="member-tip" :title="prompt">
           <img slot="icon" src="@icon/icon-member-tip.png"/>
          </cell>
        </group>-->
        <tip-text-bar>{{prompt}}</tip-text-bar>
        <div class="member-list">
          <div class="member-item" v-for="(member, index) in memberList" :key="index" @click="selectMember(member)" v-if="showMember(member)">
            <div class="member-header-box">
              <img class="member-head-img" slot="icon" v-if="member.gender=='男'"
                   src="@icon/member/icon_member_boy.png">
              <img class="member-head-img" slot="icon" v-else-if="member.gender=='女'"
                   src="@icon/member/icon_member_girl.png">
              <img class="member-head-img" slot="icon" v-else
                   src="@icon/member/icon_member_boy.png">
            </div>
            <div class="member-info">
              <div class="member-top line-bottom-dashed">
                <div class="member-name">{{member.realname}}</div>
                <div class="member-relation" v-bind:class="{'myself':member.relation=='本人'}">
                  {{member.relation}}
                </div>
              </div>
              <div class="member-bottom">
                <div class="member-intro">
                  {{member.birthday}}
                  <span v-if="member.age">{{member.age}}岁</span>
                </div>
                <div class="member-intro">
                  {{member.mobile}}
                </div>
<!--                <div class="member-intro" v-if="member.guardianname">
                  <span class="title">监护人</span>
                  <span class="value">{{member.guardianname}}</span>
                </div>-->
              </div>
            </div>
          </div>
        </div>
      </template>
      <div class="btn-div" v-if="showAddMember()">
          <x-button type="default"  class="add-member-btn" @click.native="addMember"  ><i class="own-add-btn "></i> 添加就诊人</x-button>
        </div>
      <div class="btn-div" v-if="showAddMember()">
        <x-button type="default"  class="add-member-btn" @click.native="addYiyouMember"  ><i class="own-add-btn "></i> 已有健康卡</x-button>
      </div>
    </view-box>
  </div>
</template>
<script>

  import {funModules} from '@constant.js'
  import {mapState, mapActions} from 'vuex'
  import { Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
  export function getUrlKey (name) {
    console.log("init window.location.href:",window.location.href)
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(window.location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
  }
  export default {
    components: {
      Swipeout,
      SwipeoutItem,
      SwipeoutButton
    },
    computed: {
      ...mapState(["memberList", "changePatient","memberType"]),

      title: function () {
        let routeData = this.$routeData;
        let title = routeData.title || funModules[routeData.funKey].name;
        return title;
      },
      showBack: function () {
        return !this.$routeData.hideBack;
      },
      funKey:function(){
        return this.$routeData.funKey
      },
      leftOptions:function(){
        return {
          showBack:this.showBack,
          preventGoBack:true
        };
      },
      prompt: function () {
        return this.$routeData.prompt;
      },
      jumppage:function(){//1  新页面
        return this.$routeData.jumppage
      },
      cardType:function(){
        return this.$routeData.cardType
      },
      cardName:function(){
        return this.$routeData.cardName
      }
    },
    data(){
      let healthCode = getUrlKey("healthCode");
      console.log("healthCode:"+healthCode);
      return{
        healthCode:healthCode,
        isChangePatient:sessionStorage.getItem('updateChangePatient')
      }
    },

    created: function () {
      if(this.healthCode != null){
        console.log('healthCode11'+this.healthCode);
        //如果是从健康卡跳转过来的,则在后台接口中获取用户基本信息并建档
        let params = {
            guardiancerttype: 'kuayiyuan',
            guardianname: this.healthCode
          }
        this.saveRelative(params).then((res) => {
          this.$vux.toast.show({type: 'text', text: '添加就诊人成功'})
          if(this.hospitalInfo.clientId&&this.hospitalInfo.clientId.substring(0,1)=='S'){
            this.getAlreadyCard({
              riid:res.riid,
              hospitalcode:'18456',
              name:res.realname,
              cid:res.cid||res.guardiancardno,
              mobile:res.mobile,
              busi:this.funKey
            }).then((_res)=>{
              console.log(_res);
              this.selectMember(res);
            })
          }
        })
      }
      this.reqMemberList();
    },

    methods: {
      ...mapActions(["reqMemberList","deleteRelativeInfo"]),
      showAddMember(){
        if(!this.memberType||this.memberType=='other'){
          return true;
        }
        let isShow = true
        this.memberList.forEach((item)=>{
           if(item.relation=='本人'){
             isShow = false
           }
        })
        return isShow;
      },
      showMember(member){
        if(!this.memberType){
          return true;
        }else if(this.memberType=='self'&&member.relation=='本人'){
          return true;
        }else if(this.memberType=='other'&&member.relation!='本人'){
          return true;
        }else{
          return false;
        }
      },
      selectMember: function (member) {
        this.$store.commit('updateTabSelected',0)
        let nextRoute = this.$routeData.to;
        if(this.isChangePatient==1&&(nextRoute.name=='SelectCardPage'||nextRoute.path=='/SelectCardPage')){
          this.$store.commit("selectTempMember", member);
        }else{
          this.$store.commit("selectMember", member);
        }
        this.$store.commit('updateCardIsNewPage', true);
        shareInst.client.push(nextRoute)
      },
      toAddMemberCard(to,res){
        let _to = this.$store.state.route.data[to.query.dataKey];
        if(_to.to&&(_to.to.name=='SelectCardPage'||_to.to.path=='/selectCardPage')){
          this.toAddMemberCard(_to.to,res);
        }else{
          shareInst.client.push({
            path:'/addMemberCard',
            query:{
              funKey:_to.funKey,
              cardType:res.cardType,
              cardName:res.cardName,
              to:JSON.stringify(_to.to),
            }
          });
        }
      },
      addMember: function () {
        self.location.href='https://health.tengmed.com/open/getUserCode?apiVersion=2&redirect_uri=http%3A%2F%2Fweixin.ysxfybj.com%2Fwebapp2.0%2F%23%2FaddMember%3Fto%3D-1%26funKey%3DGRZX';
        // self.location.href='https://health.tengmed.com/open/getUserCode?apiVersion=2&redirect_uri=http://weixin.ysxfybj.com/webapp2.0/#/addMember?to=-1&funKey=GRZX';
       /* let nextRoute = this.$routeData.to;
        if(this.jumppage&&this.jumppage==1){
          this.toAddMemberCard(nextRoute,{cardType:this.cardType,cardName:this.cardName})
          return;
        }
        shareInst.client.push({
          name: "AddMember",
          query:{
            to:this.funKey=='GRZX'?-1:JSON.stringify(nextRoute),
            funKey:this.funKey,
            memberType:this.memberType
          }
        });*/
      },
      addYiyouMember: function () {
        self.location.href='https://health.tengmed.com/open/getHealthCardList?redirect_uri=http%3A%2F%2Fweixin.ysxfybj.com%2Fwebapp2.0%2F%23%2FmemberList%3FdataKey%3DJZRGL-%252FmemberList&hospitalId=34319';
        // self.location.href='https://health.tengmed.com/open/getUserCode?apiVersion=2&redirect_uri=http://weixin.ysxfybj.com/webapp2.0/#/addMember?to=-1&funKey=GRZX';
       /* let nextRoute = this.$routeData.to;
        if(this.jumppage&&this.jumppage==1){
          this.toAddMemberCard(nextRoute,{cardType:this.cardType,cardName:this.cardName})
          return;
        }
        shareInst.client.push({
          name: "AddMember",
          query:{
            to:this.funKey=='GRZX'?-1:JSON.stringify(nextRoute),
            funKey:this.funKey,
            memberType:this.memberType
          }
        });*/
      },
      deleteFamily(item) {
        let self=this
        this.$vux.confirm.show({
          title:'删除就诊人',
          content: '你确定要删除此就诊人吗？',
          confirmText:'删除',
          cancelText:'取消',
          onCancel () {
          },
          onConfirm () {
            self.deleterelativeinfo(item);
          }
        })
      },
      deleterelativeinfo(item) {
        this.deleteRelativeInfo({
          riid: item.riid,
        }).then((res) => {
          this.$vux.toast.text('删除就诊人成功')
          this.reqMemberList();
        })
      },
      backHandle:function () {

        let back = this.$routeData.back ;
        if (back  == null){
          shareInst.client.back();
        }else {
          shareInst.client.pushWithData(back);
        }

      },

      editFamily(item) {
        this.$store.commit('selectMember', item)
        shareInst.client.push({path: '/editMember'})
      }
    }
  }
</script>

<style lang="scss" scoped>

  .member-list{
    .member-item{
      margin: 16px;
      background: white;
      position: relative;
      overflow: hidden;
      box-shadow: 1px 1px 1px #ccc;
      border:1px solid #eee;
      display: flex;
      box-sizing: border-box;
      padding: 10px 16px;
      .member-header-box{
        margin-top: 15px;
        .member-head-img{
          width: 50px;
          height: 50px;
          vertical-align: middle;
        }
      }
      .member-info{
        margin-left: 10px;
        flex:1;
        .member-top{
          width: 100%;
          padding: 6px 0px 10px;

          color: $fontColor;

          .member-name{
            /*margin-left: 10px;*/
          }
          .member-relation{
            position: absolute;
            right: 16px;
            top: 10px;
            color: $subtitle-color;
          }
          .member-relation.myself{
            color: $mainColor;
          }
        }
        .member-bottom{
          padding: 6px 0px;
          font-size: 14px;
          .member-intro{
            line-height: 1.78;
            color: $valueColor;
            .title{
              width: 4rem;
              display: inline-block;
            }
            .value{
              color: $fontColor;
            }
          }
        }
      }
    }
    .member-item:active{
      box-shadow: 0 0 0;
      transition-duration: 100ms;
    }
    .member-item:first-child{
      margin-top: 0;
    }
  }

  .add-member-btn{
    margin-top: 15px;
    background: transparent;
    border: 1px solid $mainColor;
    border-style: dashed;
    color: $mainColor;
    box-shadow: none;
    padding:0 10px;
  }
  .btn-img {
    width: 16px;
    height: 16px;
    margin-right: 6px;
  }
  .add-member-btn:after{
    border:0px;
    border-style: dashed;
  }

  .head-img {
    vertical-align: middle;
    width: 36px;
    height: 36px;
    margin-right: 10px;
  }

  .contact {
    font-size: 10px;
    color: #666;
    background: #d9d9d9;
    border-radius: 2px;
    padding: 0px 3px;
    vertical-align: middle;
  }
  .contact.contact-myself{
    background: $mainColor;
    color: #fff;
  }
  .contact.on {
    color: #fff;
    background: $mainColor;
  }

  .btn-img {
    vertical-align: middle;
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }

  .member-empty {
    width: 100%;
    margin-top: 130px;
    text-align: center;
    color: #999;
    font-size: 16px;
  }

  .member-empty img {
    width: 120px;
    height: auto;
  }

  .my-name {
    font-size: 16px;
    color: $fontColor;
  }

  .my-unauth {
    color: #ccc;
    font-size: 12px;
  }

  .my-unauth img {
    width: 25px;
  }

  .btn-div {
    margin: 30px 16px 30px;
  }

  .member-tips {
    margin: 0 16px;
    color: #999;
    font-size: 0.85rem;
    line-height: 22px;
  }

  .member-list-div {
    /*background: #fff;*/
  }
  .member-tip{
    color: #343434;
  }
  .member-tip img{
    margin-right: 5px;
    width: 18px;
    position: relative;
    top: 3px;
  }
</style>


