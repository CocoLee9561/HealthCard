<template>
  <div class="page">
    <view-box>
      <x-header>在线建卡</x-header>
      <div>
        <group>
          <cell>
            <span slot="title">姓名</span>
            <span>{{curMember.realname}}</span>
          </cell>
          <cell>
            <span slot="title">证件类型</span>
            <span>{{getCertifiType(curMember.isadult==1?curMember.certifitype:curMember.guardiancerttype)}}</span>
          </cell>
          <cell>
            <span slot="title">证件号</span>
            <span>{{curMember.isadult==1?curMember.cid:curMember.guardiancardno}}</span>
          </cell>
          <cell>
            <span slot="title">医院</span>
            <span>{{hospitalInfo.hospitalname}}</span>
          </cell>
        </group>
        <group v-if="false">
          <cell>
            <span slot="title">卡类型</span>
            <span>{{cardType}}</span>
          </cell>
        </group>
		<div class="build-record-tip-text">
			<div>1、身份证最后一位若为X，请输入大写X。</div>
			<div>2、请核对填写信息，确认信息无误。</div>
			<div>3、在自助机微信支付宝取卡功能绑定身份证。</div>
		</div>
        <div style="padding: 20px;">
          <x-button @click.native="onlinebuildrecord" class="own-btn">确定</x-button>
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    computed: {
      ...mapState({
        hospitalInfo: state => state.hospital.current,
        selectedMember:state=>state.selectedMember,
        tempSelectedMember:state=>state.tempSelectedMember
      }),
      cardType:function(){
        return this.$routeData.cardType
      },
      funKey:function(){
        return this.$routeData.funKey
      }
    },
    created() {
      if(this.isChangePatient==1){
        this.curMember=this.tempSelectedMember
      }else{
        this.curMember=this.selectedMember
      }
    },
    data() {
      return {
        isChangePatient:sessionStorage.getItem('updateChangePatient'),
        curMember:{},

      }
    },
    methods: {
      ...mapActions(["onLineBuildRecord"]),
      onlinebuildrecord(){
        this.onLineBuildRecord({
          riid:this.curMember.riid,
          hospitalcode:this.hospitalInfo.hospitalcode,
          name:this.curMember.realname,
          cid:this.curMember.cid||this.curMember.guardiancardno,
          mobile:this.curMember.mobile,
          busi:this.funKey
        }).then((res)=>{
          if(!res.result){
            this.$vux.alert.show({
              title: '提示',
              content:res.msg||'在线建卡失败',
              onShow () {

              },
              onHide () {

              }
            })
            // this.$vux.toast.text(res.msg||'在线建卡失败');
            return;
          }
          if(res.data.onlinestatus==0){
            this.$vux.alert.show({
              title:'在线建卡成功',
              content:'已成功创建并绑定'+(this.cardType||'卡'),
              showCancelButton:false,
              onShow () {
              },
              onHide () {
                shareInst.client.go(-2);
              }
            })
          }else if(res.data.onlinestatus==1){
            this.$vux.alert.show({
              title:'在线建卡失败',
              content:'在线建卡失败，请到医院窗口咨询建卡',
              showCancelButton:false,
              onShow () {
              },
              onHide () {
                shareInst.client.back();
              }
            })
          }else if(res.data.onlinestatus==2){
            this.$vux.alert.show({
              title:'在线建卡失败',
              content:'您已绑定此就诊卡',
              showCancelButton:false,
              onShow () {
              },
              onHide () {
                shareInst.client.go(-2);
              }
            })
          }
        })
      },
      getCertifiType:function(type){
        if(type==1){
          return '中国大陆居民身份证';
        }else if(type==2){
          return '港澳居民通行证';
        }else if(type==3){
          return '台湾居民身份证';
        }else if(type==4){
          return '外国护照';
        }
      }
    }
  }
</script>
<style lang="scss">
	.build-record-tip-text{
		color:#F36366;
		padding:10px 16px;
		font-size:14px;
		line-height:1.8;
	}
</style>
