<template>
<div class="page">
  <view-box>
    <x-header slot="header">医生登录</x-header>
    <div>
      <group label-width="80px">
        <x-input title="用户名" v-model="form.mobile" placeholder="请输入用户名"></x-input>
        <x-input title="密码" v-model="form.pwd" type="password" placeholder="请输入密码"></x-input>
      </group>
      <div class="btn-box">
        <x-button class="own-btn" @click.native="doctorLogin">登录</x-button>
        <x-button class="own-btn" @click.native="toResetPwd">重置密码</x-button>
      </div>
    </div>
  </view-box>
</div>
</template>

<script>
import {mapActions,mapState} from "vuex";
export default {
  computed: {
    ...mapState({

    })
  },
  mounted () {
    
  },
  data(){
    return{
      form:{
        mobile:'',
        pwd:''
      }
    }
  },
  methods:{
    ...mapActions(['reqDoctorLogin']),
    doctorLogin(){
      this.reqDoctorLogin(this.form).then((res)=>{
        // shareInst.client.push({
        //   path:'/myInquiry'
        // })
        shareInst.client.go(-1)
      })
    },
    toResetPwd(){
      shareInst.client.push({
        path:'/doctorResetPwd'
      })
    }
  }
}
</script>

<style lang="scss" scoped>

  .btn-box{
    padding:30px 16px;
  }

</style>
