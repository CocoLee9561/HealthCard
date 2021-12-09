<template>
  <group :gutter="0">
  <cell class="patient" is-link @click.native="changeHandle($event)">
    <span class="key" slot="title">{{selectedMember.realname}}<span class="num">{{card.cardno}}</span> </span> <span
    class="value">更改就诊人</span>
  </cell>
  </group>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: "ChangeMember",
    props:{
      funKey:{
        type:String,
        required:true
      },
      to:{
        type:Object,
        required:true
      },
    },
    computed:{
      ...mapState(["selectedMember","selectedCards"]),
      card:function () {
        return this.selectedCards[this.funKey] || {};
      }

    },
    created(){
      sessionStorage.setItem('updateChangePatient',0)
    },
    methods:{
      changeHandle:function () {
        sessionStorage.setItem('updateChangePatient',1)
        console.log("更改就诊人转换到：",JSON.stringify(this.to));
        shareInst.client.pushWithData(this.to);
      }
    },
  }
</script>

<style lang="scss" scoped>


  $highlightBg: #ffffff;
  $itemTextMainColor: #4b6baf;
  $itemTextMinorColor: #999999;



  .cell {
    border-style: none;

    span {
      margin: 0;
    }
  }




  .patient {
    /*height: 44px;*/
    background-color: $highlightBg;

    font-weight: normal;
    font-stretch: normal;

    .key {
      color: $mainColor;

      .num {
        margin-left: 1px;
      }
    }

    .value {
      color: $itemTextMinorColor;
    }

  }

</style>
