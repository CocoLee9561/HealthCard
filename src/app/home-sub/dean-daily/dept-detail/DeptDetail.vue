<template>
  <div class="page">
    <view-box :body-padding-bottom="isShowNavBar?'100px':'54px'" body-padding-top="0">
      <div slot="header">
        <x-header >科室详情</x-header>
        <choose-date-bar @on-change="dateChange" @on-choose-date="onChooseDate" v-model="date"></choose-date-bar>
      </div>
      <group>
        <x-table class="my-table" :cell-bordered="false" :content-bordered="true">
          <thead>
            <tr class="header-bar">
              <th class="text-left">科室</th>
              <th class="th-sr">
                收入<img src="@icon/sort.png"/>
              </th>
              <th>药占比</th>
              <th>材料占比</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 20">
              <td class="text-left">消化内科</td>
              <td>￥38239.05</td>
              <td>47.3%</td>
              <td>12.1%</td>
            </tr>
          </tbody>
        </x-table>
      </group>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import {XTable} from 'vux'
  import ChooseDateBar from '../../../components/ChooseDateBar'
  import Group from "../../../../../node_modules/vux/src/components/group/index.vue";
  export default {
    computed: {
      ...mapState([]),
    },
    created() {

    },
    components:{
      Group,
      ChooseDateBar,XTable
    },
    data() {
      return {
        date:'',
        isShowNavBar:shareInst.client.showWebNavBar,
      }
    },
    methods: {
      ...mapActions([""]),
      dateChange(date){
        console.log(date)
      },
      onChooseDate(date){
        shareInst.client.push({
          path:'/chooseDate',
          query:{
            date:this.date
          }
        })
      }
    }
  }
</script>
<style scoped>
  .my-table:after{
    border-top: 0px;
  }
  .header-bar{

  }
  .my-table th{
    color: #999999;
    font-size: 16px;
    padding: 0px 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .my-table td{
    font-size: 16px;
    white-space: nowrap;
    color: #333333;
    padding: 0px 10px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .my-table td:after{
    transform: scaleY(0.5);
  }
  .my-table td:before{
    transform: scaleY(0.5);
  }
  .text-left{
   text-align: left;
  }
  .th-sr:active{
    background: #DEDEDE;
  }
  .th-sr img{
    height: 1em;
    vertical-align: middle;
    margin-left: 5px;
    margin-top: -3px;
  }
  tr{
    width: 100%;
  }
</style>
