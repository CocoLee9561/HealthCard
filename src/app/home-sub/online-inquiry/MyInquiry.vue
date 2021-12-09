<template>
<div class="page">
  <view-box>
    <x-header slot="header">我的咨询</x-header>
    <div class="page-content" v-if="false">
      <tab class="own-tab" v-model="currTab" >
        <tab-item @on-item-click="onItemClick">全部</tab-item>
        <tab-item @on-item-click="onItemClick">待回复</tab-item>
        <tab-item @on-item-click="onItemClick">已回复</tab-item>
        <tab-item @on-item-click="onItemClick">已完结</tab-item>
      </tab>
      <swiper v-model="currTab" :show-dots="false">
        <swiper-item v-for="(item, index) in 4" :key="index">
          <div class="inquiry-list">
            <div class="inquiry-item">
              <div class="order-id">订单号：123456789</div>
              <div><span class="left-title">咨询医生：</span><span class="name">张三</span><span class="title">职业医师</span><span class="keshi">外科</span></div>
              <div><span class="left-title">咨询人：</span><span class="name">李四</span><span class="red-text">男 42岁</span></div>
              <div class="text-info">张医生，昨天您开了药，现在不发热了，还要不要吃这个药。</div>
              <div class="time-line">
                <div class="status">已完结</div>
                <div class="time">回复 2019-10-14 10：30：00</div>
              </div>
            </div>

          </div>
        </swiper-item>
      </swiper>
    </div>
	
    <div class="inquiry-list">
      <div class="inquiry-item line-bottom" v-for="(item,index) in myInquiryList" :key="index" @click="toReplyInquiry(item)">
		<div class="header-icon">
			<img v-if="isDoctor" :src="item.headshoturl"/>
			<img v-else :src="item.docPic">
		</div>
		<div class="inquiry-item-info">
		  <div class="name">
			<span v-if="isDoctor">{{item.nickName}}</span>
			<span v-else>{{item.docName}}</span>
		  </div>
		  <div>{{item.cont}}</div>
		  <div class="time-line">
			<div class="time">{{formatDate(item.createTime)}}</div>
		  </div>
		</div>
      </div>
    </div>
  </view-box>
</div>
</template>

<script>
import { Tab, TabItem,Swiper, SwiperItem } from 'vux'
import {mapActions,mapState} from "vuex";
import { dateFormat } from 'vux'
export default {
  computed: {
    ...mapState({
      myInquiryList:state=>state.myInquiryList
    })
  },
  components: {
    Tab,
    TabItem,Swiper, SwiperItem
  },
  data(){
    return {
	  isDoctor:shareData.isDoctor,
      currTab:0,
      isDoctor:shareData.isDoctor,
    }
  },
  created () {
    if(this.isDoctor){
      this.reqDList({})
    }else{
      this.reqHzList({
        // hid:'12345'
      });
    }
  },
  methods:{
    ...mapActions(['reqDList','reqHzList']),
    onItemClick(index){

    },
    toReplyInquiry(item){
      shareInst.client.push({
        path:'/replyInquiry',
        query:{
          id:item.id
        }
      })
    },
    formatDate(date){
      return dateFormat(new Date(date),'YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style lang="scss" scoped>

  .page-content{
    display: flex;
    height: 100%;
    flex-direction: column;
    font-size: 15px;
    /deep/ .vux-slider{
      flex: 1;
      .vux-swiper{
        height: 100% !important;
      }
    }
  }
  .inquiry-list{
    font-size:15px;
    .inquiry-item{
      background: white;
      padding: 10px 16px;
	  display:flex;
	  color:#666;
	  .header-icon{
		width:60px;
		height:60px;
		margin-right:16px;
		img{
			width:100%;
			height:100%;
		}
	  }
	  .inquiry-item-info{
		flex:1;
		
		.nick-name{
			font-size:17px;
			color:#333;
		}
	  }
	  
      .order-id{
        color: #999;
      }
      .left-title{
        color: #333;
      }
      .name{
        color: #666;
        margin-right: 5px;
      }
      .title{
        color: #666;
        margin-right: 5px;
      }
      .keshi{
        color: #666;
      }
      .red-text{
        color: red;
      }
      .text-info{
        color: #666;
        font-size: 13px;
      }
      .time-line{
        display: flex;
        margin-top: 5px;
        font-size:13px;
        .status{
          background: $main-color;
          color: white;
          border-radius: 3px;
          padding: 0 5px;
        }
        .time{
          flex: 1;
          text-align: right;
          color: #999;
        }
      }
    }
  }
</style>
