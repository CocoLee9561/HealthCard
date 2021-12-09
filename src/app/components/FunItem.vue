<template>
  <div class="func-list" :class="direction" v-if="funcList.length>0">
    <div class="function-item" :class="{'line-right':direction=='row','line-bottom':direction=='column'}" @click="funcItemClick(funcList[0])">
        <div class="function-icon">
        <img :src="funcList[0].icon">
        </div>
        <div class="function-name">{{funcList[0].name}}</div>
    </div>
    <fun-item v-if="funcList.length>2" class="function-item" :funcList="nextFuncList()" :direction="totalDirection()" @clickItem="funcItemClick"></fun-item>
    <div v-else class="function-item" @click="funcItemClick(funcList[1])">
      <div class="function-icon">
        <img :src="funcList[1].icon">
        </div>
        <div class="function-name">{{funcList[1].name}}</div>
    </div>
  </div>
</template>
<script>
import { debug } from 'util';


  export default {
    name:'FunItem',
    props:{
      funcList:{
        default:[]
      },
      direction:{
        default:'row'
      }
    },
    computed: {

    },
    created() {

    },
    data() {
      return {}
    },
    methods: {
      funcItemClick(item){
        this.$emit('clickItem', item);
      },
      totalDirection(){
        return this.direction=='row'?'column':'row'
      },
      nextFuncList(){
        var list = [];
        for(var i=1;i<this.funcList.length;i++){
          list.push(this.funcList[i]);
        }
        return list;
      }
    }
  }
</script>
<style scoped lang="scss">

    .func-list{
      background: white;
      display: flex;
      font-size: 14px;
      .function-item{
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        box-sizing: border-box;
        .function-icon{
          width: 60px;
          height: 60px;
          vertical-align: middle;
          img{
            width: 100%;
            height: 100%;
          }
        }
        & > .function-item{
          
          .function-icon{
            width: 36px;
            height: 36px;
          }
        }
      }
    }
    .func-list.column{
      flex-direction: column;
      &>.function-item:not(.func-list){
        flex-direction: row;
        justify-content: flex-start;
        padding: 16px 16px;
        .function-icon{
          margin-right: 10px;
        }
      }
    }
    .func-list.row{
      flex-direction: row;
      &>.function-item:not(.func-list){
        flex-direction: column;
        padding: 5px;
        .function-icon{
          margin-bottom: 10px;
        }
      }
    }
    .func-list{
      .func-list{
        &>.function-item:not(.func-list){
          .function-icon{
            margin-bottom: 3px;
          }
        }
      }
    }
    .function-item:not(.func-list):active{
      background: #f4f4f4;
    }
</style>