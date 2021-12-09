<template>
  <div class="page">
    <view-box>
      <x-header slot="header">在线问诊</x-header>
      <popup-tab v-model="currTab" :tabList="['区域筛选','科室筛选']" v-if="false">
        <div slot="content">
          <div v-show="currTab==1">
            <group :gutter="0">
              <cell title="全部地区" @click.native="changeArea({})">
                  <span v-if="JSON.stringify(currArea) == '{}'">
                    <img width="20px" src="@icon/ic_select@2x.png"/>
                  </span>
              </cell>
              <cell v-for="(item,index) in areaList" :key="index" @click.native="changeArea(item)">
                <span slot="title">{{item.realname}}</span>
                <span v-if="currArea.id==item.id">
                    <img width="20px" src="@icon/ic_select@2x.png"/>
                  </span>
              </cell>
            </group>
          </div>
          <div v-show="currTab==2">
            <group :gutter="0">
              <!--<radio :options="['全部就诊人','张小可','王薇','李楠安']"></radio>-->
              <cell title="全部科室" @click.native="changeDepartment({})">
                  <span v-if="JSON.stringify(currDepartment) == '{}'">
                    <img width="20px" src="@icon/ic_select@2x.png"/>
                  </span>
              </cell>
              <cell v-for="(item,index) in departmentList" :key="index" @click.native="changeDepartment(item)">
                <span slot="title">{{item.cardtype}}</span>
                <span v-if="currDepartment.id==item.id">
                    <img width="20px" src="@icon/ic_select@2x.png"/>
                  </span>
              </cell>
            </group>
          </div>
        </div>
      </popup-tab>
      <div class="inquiry-list-contain" v-if="inquiryDoctorList.length>0">
        <div v-for="(item,index) in inquiryDoctorList" class="inquiry-item line-bottom" :key="index">
            <div class="left-icon">
              <img :src="item.docPic" v-if="item.docPic">
              <img src="@icon/user-head.png" v-else>
              <div v-if="false" class="inquiry-flag">咨询中</div>
            </div>
            <div class="right-info">
              <div><span class="name">{{item.docName}}</span><span class="title">{{item.dept}}{{item.docZc}}</span></div>
              <div class="hospital">{{item.hosName}}</div>
              <div class="shanchang">擅长：{{item.docShanchang}}</div>
              <div class="btn" @click="toDoctor(item)">图文问诊</div>
            </div>
        </div>
      </div>
      <div v-else style="margin-top: 50px;">
        <div class="vux-center" style="height: 250px;">
        <div style="text-align: center;">
          <img src="@icon/no_card.png" style="width: 50%;" alt>
          <div style="color: #303030;margin-top: 10px;">暂无医生列表</div>
        </div>
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions, mapMutations} from 'vuex'
  import {Radio } from 'vux'
  import PopupTab from '../../components/PopupTab'
  export default {
    computed: {
      ...mapState(["areaList","departmentList",'inquiryDoctorList','inquiryDoctorInfo']),

    },
    watch:{

    },
    components:{
      Radio,PopupTab
    },
    created() {
      this.reqDoctorList({
        // hid:'12345',
        // ticket:'5b19d2e0a2cf01ce30148f21de08a099',
        // uid:'10042296'
      })
    },
    data() {
      return {
        currTab:'',
        currArea:{},
        currDepartment:{},
        funKey:'ZXWZ',
      }
    },
    methods: {
      ...mapActions(['reqDoctorList','setInquiryDoctorInfo']),
      ...mapMutations([]),
      changeArea(item){
        this.currArea=item
        this.currTab=''
        // this.valiCardList();
      },
      changeDepartment(item){
        this.currDepartment=item
        this.currTab=''
        // this.valiCardList();
      },
      toDoctor(item){
        this.setInquiryDoctorInfo(item)
        shareInst.client.push({
          path:'/inquiryDoctor'
        })
      }

    }
  }
</script>
<style scoped lang="scss">
  .inquiry-list-contain{
    // margin-top: 46px;
    font-size: 15px;;
    .inquiry-item{
      display: flex;
      background: white;
      padding: 10px 16px;
      // align-items: center;
      .left-icon{
        width: 60px;
        text-align: center;
        margin-right: 16px;
        img{
          width: 100%;
        }
        .inquiry-flag{
          color: green;
          border: 1px solid green;
          border-radius: 3px;
          font-size: 13px;
        }
      }
      .right-info{
        flex: 1;
        .name{
          color: #333;
          font-size: 16px;
        }
        .title{
          margin-left: 10px;
          color: #666;
        }
        .hospital{
          color: #666;
          font-size: 13px;
        }
        .shanchang{
          color: #666;
          font-size: 13px;
        }
        .btn{
          text-align: center;
          background: $main-color;
          color: white;
          line-height:30px;
          border-radius: 3px;
          margin-top: 5px;
          &:active{
            opacity: 0.6;
          }
        }
      }
    }
  }
  @keyframes popupIn {
    from {opacity: 0.3}
    to {opacity: 1}
  }
</style>
