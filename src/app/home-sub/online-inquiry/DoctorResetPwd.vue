<template>
<div class="page">
  <view-box>
    <x-header slot="header">重置密码</x-header>
    <div>
      <group label-width="80px">
        <x-input title="用户名" v-model="form.mobile" placeholder="请输入用户名"></x-input>
        <x-input title="原密码" v-model="form.pwd2" type="password" placeholder="请输入原密码"></x-input>
        <x-input title="新密码" v-model="form.pwd" type="password" placeholder="请输入新密码"></x-input>
      </group>
      <div class="btn-box">
        <x-button class="own-btn" @click.native="doctorReset">确认</x-button>
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
        pwd2:'',
        pwd:''
      }
    }
  },
  methods:{
    ...mapActions(['reqDoctorResetPwd']),
    doctorReset(){
      this.reqDoctorResetPwd(this.form).then((res)=>{
        // shareInst.client.push({
        //   path:'/myInquiry'
        // })
        shareInst.client.go(-1)
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
