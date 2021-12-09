<template>
  <div class="page">
    <view-box>
      <x-header slot="header">智能导诊</x-header>
      <div style="margin-top: 15px">
        <div class="question-box" v-for="item in questionList">
          <div>
            <div class="question-name">{{item.name}}</div>
          </div>
          <div class="btn-box" :class="{'btn-result':item.result}">
            <x-button mini @click.native="clickOk()" :disabled="item.result=='yes'||item.result=='no'" :class="{'result-selected':item.result=='yes'}" class="question-btn btn-ok">是</x-button>
            <x-button mini @click.native="clickCancel()" :disabled="item.result=='yes'||item.result=='no'" :class="{'result-selected':item.result=='no'}" class="question-btn btn-cancel">否</x-button>
          </div>
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions,mapMutations} from 'vuex'

  export default {
    computed: {
      ...mapState(["questionList","currQuestion"]),
    },
    created() {

    },
    data() {
      return {}
    },
    methods: {
      ...mapActions([""]),
      ...mapMutations(["questionOk","questionCancel"]),
      clickOk(){
        if(this.currQuestion.yes.type==1){
          this.$store.commit('questionOk')
        }else if(this.currQuestion.yes.type==0){
          this.$store.commit('updateRecommendDepartments',this.currQuestion.yes.keshilist)
          shareInst.client.push({
            path:'/recommentDepartment'
          })
        }
      },
      clickCancel(){
        if(this.currQuestion.no.type==1){
          this.$store.commit('questionCancel')
        }else if(this.currQuestion.no.type==0){
          this.$store.commit('updateRecommendDepartments',this.currQuestion.no.keshilist)
          shareInst.client.push({
            path:'/recommentDepartment'
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .question-box{
    box-sizing: border-box;
    padding: 5px 16px;
    position: relative;
    display: block;
    overflow: hidden;
  }
  .question-name:after{
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border: 8px solid transparent;
    border-right-color: #E9E9E9;
    top: 0px;
    right: 100%;
    margin-top: 9px;
    z-index: 0;
  }
  .question-name:before{
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border: 7px solid transparent;
    border-right-color: white;
    top: 10px;
    left: 0;
    margin-left: -13px;
    z-index: 1;
  }
  .question-name{
    color: #353535;
    position: relative;
    display: inline-block;
    padding: 8px 10px;
    border:1px solid #E9E9E9;
    background: white;
    border-radius: 5px;
    max-width: 80%;
    box-sizing: border-box;
  }
  .btn-box{
    float: right;
  }
  .question-btn{

  }
  .btn-ok{
    color: white;
    background: $mainColor;
  }
  .btn-cancel{
    /*background: #4C6BAE;*/
    background: white;
  }
  .btn-result{

  }
  .btn-result .question-btn{
    background: transparent;
  }
  .question-btn:disabled:after{
    border: 0px;
  }
  .btn-result .question-btn{
    color: rgba(0, 0, 0, 0.3);
  }
  .btn-result .result-selected{
    color: $mainColor;
  }
</style>
