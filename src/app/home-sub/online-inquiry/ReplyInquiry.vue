<template>
<div class="page">
  <view-box>
    <x-header slot="header">在线咨询</x-header>
    <div class="page-content">
      <div class="list" id="list">
        <div class="item" v-for="(item,index) in replyInquiryList" :key="index" :class="{'me':((isDoctor&&item.type==1)||(!isDoctor&&item.type==0))}">
          <div class="header">
            <img v-if="item.type==0&&item.headshoturl" :src="item.headshoturl">
            <img v-else-if="item.type==1&&item.docPic" :src="item.docPic">
            <img v-else src="@icon/user-head.png">
            <div v-if="item.type==0&&false">{{item.nickName}}</div>
            <div v-if="item.type==1&&false">{{item.docName}}</div>
          </div>
          <div class="msg-content">
            <div class="time">{{formatDate(item.createTime)}}</div>
            <div class="msg">{{item.cont}}</div>
            <div class="pic-list" v-if="item.pics&&item.pics.length>0">
              <img class="pic-item" :src="img.picpath" v-for="(img,i) in item.pics" :key="i" @click="onImgClick(item,i)">
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-bar line-top">
        <div class="input-box">
          <input v-model="msg" />
        </div>
        <div class="send-btn" @click="sendMsg">发送</div>
      </div>
    </div>
    <div v-transfer-dom>
      <previewer :list="picList" ref="previewer"></previewer>
    </div>
  </view-box>
</div>
</template>

<script>
import {mapActions,mapState} from "vuex";
import { dateFormat,Previewer } from 'vux'
export default {
  computed: {
    ...mapState({
      replyInquiryList:state=>state.replyInquiryList
    })
  },
  components: {
    Previewer
  },
  data(){
    return {
      isDoctor:shareData.isDoctor,
      id:'',
      msg:'',
      picList:[],
      options: {
        getThumbBoundsFn (index) {
          // find thumbnail element
          let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
          // get window scroll Y
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
          // optionally get horizontal scroll
          // get position of element relative to viewport
          let rect = thumbnail.getBoundingClientRect()
          // w = width
          return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
          // Good guide on how to get element coordinates:
          // http://javascript.info/tutorial/coordinates
        }
      }
    }
  },
  created () {
    this.id = this.$routeData.id
    this.loadList()
  },
  methods:{
    ...mapActions(['reqDListBytId','reqDoctorReply','reqThreadAsk']),
    formatDate(date){
      return dateFormat(new Date(date),'YYYY-MM-DD HH:mm:ss')
    },
    onImgClick(item,index){
      let pics = item.pics;
      let picList = [];
      pics.forEach(val => {
        picList.push({
          src:val.picpath,
          msrc:val.picpath
        })
      });
      this.picList = picList
      this.$nextTick(()=>{
        this.$refs.previewer.show(index)
      })
    },
    loadList(){
      this.msg='';
      this.reqDListBytId({tid:this.id}).then((res)=>{
        this.$nextTick(() => {
            var container = this.$el.querySelector("#list");
            container.scrollTop = container.scrollHeight;
        });
      })
    },
    sendMsg(){
      if(this.isDoctor){
        this.reqDoctorReply({
          cont:this.msg,
          tid:this.id
        }).then((res)=>{
          this.loadList()
        })
      }else{
        let hid = '';
        if(this.replyInquiryList.length>0){
          hid = this.replyInquiryList[0].hid
        }
        this.reqThreadAsk({
          cont:this.msg,
          hid: hid,
          tid:this.id,
          pics:[]
        }).then((res)=>{
          this.loadList()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .page{
    font-size: 15px;
  }
  .list{
    overflow: auto;
    .item{
      display: flex;
      padding: 10px 16px;
      .header{
        width: 45px;
        height: 45px;
        margin-right: 16px;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .msg-content{
        background: white;
        border-radius: 10px;
        padding: 10px 16px;
        flex: 1;
        margin-right: 30px;
        .time{
          color: #999;
        }
      }
    }
    .item.me{
      flex-direction: row-reverse;
      .header{
        margin-right: 0;
        margin-left: 16px;
      }
      .msg-content{
        margin-right: 0;
        margin-left: 30px;
        background: #D1EEFE;
      }
    }
  }
  .pic-list{
    display:flex;
    flex-warp:warp;
    margin-top:10px;
    .pic-item{
      width:50px;
      height:50px;
      margin-right:10px;
      margin-bottom:10px;
    }
  }
  .page-content{
    display:flex;
    flex-direction:column;
    height:100%;
    .list{
      flex:1;
    }
    .bottom-bar{
      display:flex;
      padding:0 16px;
      box-sizing:border-box;
      background:white;
      line-height:1.7;
      height:48px;
      align-items: center;
      background:white;
      font-size:14px;
      .input-box{
        flex:1;
        margin-right:16px;
        input{
          box-sizing: border-box;
          border-radius:4px;
          height:2.5em;
          border:1px solid #f4f4f4;
          color:#333;
          display:block;
          outline:0;
          padding:0 0;
          text-decoration:none;
          width:100%;
          padding:0px 10px;
          background: #f6f6f6;
        }
        input:focus{
          border:1px solid #f4f4f4;
        }
      }
      .send-btn{
        background:$main-color;
        color:white;
        padding:2px 5px;
        font-size:12px;
        border-radius:3px;
        &:active{
          opacity:0.6;
        }
      }
    }
  }
</style>
