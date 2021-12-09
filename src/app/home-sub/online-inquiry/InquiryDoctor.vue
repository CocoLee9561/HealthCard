<template>
<div class="page">
    <view-box>
      <x-header slot="header">咨询医生</x-header>
      <div class="doctor-info">
        <div class="left-icon">
          <img :src="inquiryDoctorInfo.docPic">
          <div v-if="false" class="follow-btn">+关注</div>
        </div>
        <div class="right-info">
          <div><span class="name">{{inquiryDoctorInfo.docName}}</span><span class="title">{{inquiryDoctorInfo.docZc}}</span></div>
          <div class="text"><span class="hosp">{{inquiryDoctorInfo.hosName}}</span><span>{{inquiryDoctorInfo.dept}}</span></div>
          <div v-if="false" class="text">从业<strong>19</strong>年</div>
          <div v-if="false" class="text">咨询量：<span class="red-text">---</span>满意度：<span class="red-text">100%</span></div>
        </div>
      </div>
      <div class="input-plan">
        <h3 class="shanchang-title">医生简介</h3>
        <div class="shanchang">{{inquiryDoctorInfo.docJieshao}}</div>
        <x-textarea class="text-area" :max="500" v-model="msg" placeholder="请详细输入您的病情情况（最少10字）"></x-textarea>
      </div>
      <div class="photo-plan">
        <h4>添加图片</h4>
        <div class="desc">上传相关图片（检查单、病历、药品等），检查资料只有您和当前的医生可见。</div>
        <div class="photo-list">
          <div v-for="(item,index) in fileList" :key="index" class="photo-item">
            <img :src="item">
          </div>
          <div class="tack-photo-btn">
            <input class="iptsc" @change='chooseImg' v-if="showBtn" type="file" accept='image/*' :multiple="false" name="file[]" id="file" />
            <img src="@icon/tack-photo.png">
          </div>
        </div>
      </div>
      <div class="btn-box">
        <x-button class="own-btn" @click.native="toSend">提交</x-button>
      </div>
    </view-box>
</div>
</template>

<script>
import { XTextarea } from 'vux'
import {mapState, mapActions, mapMutations} from 'vuex'
export default {
  computed: {
    ...mapState(['inquiryDoctorInfo']),

  },
  watch:{

  },
  components:{
    XTextarea
  },
  created() {
  },
  data() {
    return {
      msg:'',
      fileList:[],
      maxSize: 10240000 / 2,
      maxCount: 9,
      filesArr: [],
      showBtn:true
    }
  },
  methods: {
    ...mapActions(['reqThreadAsk','uploadFile']),
    ...mapMutations([]),
    chooseImg(e){
      this.showBtn=false
			let files = e.target.files;
      // 如果没有选中文件，直接返回
      if (files.length === 0) {
        return;
      }
      if (this.fileList.length + files.length > this.maxCount) {
        this.$vux.toast.text('最多只能上传' + this.maxCount + '张图片！');
        return;
      }
      let file;
      let form = new FormData();
      for (let i = 0; i < files.length; i++) {
        this.$vux.loading.show({
          text: '文件上传中'
        })
        file = files[i];
        this.fileList.push(this.createObjectURL(file))
				form.append('file', file, file.name);
        this.uploadFile(form).then((res)=>{
          this.filesArr.push({picpath:res.msg});
          this.$vux.loading.hide()
          this.$nextTick(()=>{
            this.showBtn = true
          })
        })
        // var reader = new FileReader()
        // reader.readAsDataURL(file)
        // reader.onload = function(e) {
        //   let coverImg = this.result
        //   this.filesArr.push(coverImg);
        // }
      }
    },
    createObjectURL(blob){
        if (window.URL){
            return window.URL.createObjectURL(blob);
        } else if (window.webkitURL){
            return window.webkitURL.createObjectURL(blob);
        } else {
            return null;
        }
    },
    toSend(){
      if(!this.msg){
        this.$vux.toast.text('请输入您的病情情况！')
        return;
      }
      if(this.msg.length<10){
        this.$vux.toast.text('病情情况至少十个字！')
        return;
      }
      this.reqThreadAsk({
        cont:this.msg,
        hid: this.inquiryDoctorInfo.hid,
        docId: this.inquiryDoctorInfo.docId,
        tid: 0,
        pics:this.filesArr
      }).then((res)=>{
        shareInst.client.replace({
          path:'/replyInquiry',
          query:{
            id:res
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .page{
    font-size: 15px;
  }
  .doctor-info{
    display: flex;
    padding: 10px 16px;
    background: white;
    // align-items: center;
    .left-icon{
      width: 60px;
      margin-right: 16px;
      text-align: center;
      img{
        width: 100%;
      }
      .follow-btn{
        background: $main-color;
        color: white;
        &:active{
          opacity: 0.6;
        }
      }
    }
    .right-info{
      flex: 1;
      .name{
        font-size: 16px;
        color: #333;
      }
      .title{
        margin-left: 10px;
        color: #666;
      }
      .text{
        color: #666;
        .hosp{
          margin-right: 5px;
        }
        strong{
          font-size: 16px;
          color: #333;
        }
        .red-text{
          color: red;
          margin-right: 10px;
        }
      }
    }
  }
  .input-plan{
    background: white;
    margin-top: 10px;
    padding: 10px 16px;
    .shanchang-title{
      color: #333;
      font-size: 16px;
    }
    .shanchang{
      color: #666;
    }
    /deep/ .weui-cell:before{
      border: none;
    }
    .text-area{
      margin-top: 10px;
      border: 1px solid #d9d9d9;
      border-radius: 5px;
    }
  }
  .photo-plan{
    background: white;
    margin-top: 10px;
    padding: 10px 16px;
    h4{
      font-size: 16px;
      color: #333;
    }
    .desc{
      color: #999;
    }
    .photo-list{
      margin-top: 10px;
      display: flex;
      flex-wrap:wrap;
      .tack-photo-btn{
        width: 60px;
        height: 60px;
        margin-bottom:10px;
        position:relative;
        display:inline-block;
        overflow:hidden;
        input{
          position:absolute;
          left:0;
          right:0;
          top:0;
          height:200px;
          width:200px;
          opacity:0;
        }
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .btn-box{
    margin: 30px 16px;
  }
  .photo-item{
    width:60px;
    height:60px;
    margin-right:10px;
    margin-bottom:10px;
    img{
      width:100%;
      height:100%;
    }
  }
</style>
