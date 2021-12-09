<template>
  <div>
    <group gutter="0">
      <cell class="change-patient"  is-link @click.native="changeMember">
        <span slot="title"><span class="change-patient-name">{{realname}}</span>  <span class="change-patient-card-no">{{cardno}}</span></span>
        <span class="change-patient-text">更换就诊人</span>
      </cell>
    </group>
  </div>
</template>
<script>

  export default {
    name:'ChangePatient',
    props:{
      realname:'',
      cardno:'',
      to:{}
    },
    computed: {
    },
    created() {
      sessionStorage.setItem('updateChangePatient',0)
    },
    data() {
      return {

      }
    },
    methods: {
      changeMember:function(){
        sessionStorage.setItem('updateChangePatient',1)
        shareInst.client.push(this.to);
      }
    }
  }
</script>
<style scoped lang="scss">
  .change-patient{
    padding: 10px 16px;
    .change-patient-name{
      color:$mainColor;
      font-weight: 600;
    }
    .change-patient-card-no{
      color: $fontColor;
    }
    .change-patient-text{
      color: $subtitle-color;
    }
  }
</style>
