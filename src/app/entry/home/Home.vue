<template>

  <view-box body-padding-bottom="0">

    <x-header slot="header" :title="hospitalInfo.hospitalname||'首页'" :left-options="{showBack:false}">
      <router-link slot="right" v-if="allHospital.length>1" :to="{path:'/chooseHospital?routeName=ChooseHospital'}">切换医院</router-link>
    </x-header>
    <!--<mt-swipe :show-indicators="true" class="home-swipe">-->
		  <!--<mt-swipe-item><img class="banner" src="@icon/pic.png"/></mt-swipe-item>-->
		  <!--<mt-swipe-item><img class="banner" src="@icon/pic.png"/></mt-swipe-item>-->
		  <!--<mt-swipe-item><img class="banner" src="@icon/pic.png"/></mt-swipe-item>-->
		<!--</mt-swipe>-->
    <swiper :show-desc-mask="false" :show-dots="homePageList&&homePageList.length>1" dots-position="center" :auto="true" :loop="true" :aspect-ratio="200/750">
      <swiper-item v-for="(item,index) in homePageList" :key="index">
        <img :src="item.bspicurl" style="width: 100%;">
      </swiper-item>
      <swiper-item v-if="homePageList.length<=0">
        <img src="@icon/banner.jpg" style="width: 100%;">
      </swiper-item>
    </swiper>
		<!--<div class="home-choose-hospital">-->
			<!--<span><img slot="icon" src="../../../common/assets/icon/home/homeicon_hospital_nor@2x.png"/>{{hospitalInfo.hospitalname}}</span>-->
			<!--<router-link :to="{path:'/chooseHospital?routeName=ChooseHospital'}">切换医院</router-link>-->
		<!--</div>-->

 <!-- <grid :cols="3" class="home-hospital-grid">


      <template v-for="funItem in funList">

       <grid-item v-if="funItem.bsEnableState == 1" @click.native="toFun(funItem)">
          <img v-if="funItem.icon" slot="icon" :src="funItem.icon"/>
          <img v-else slot="icon" src="@icon/homeicon_office@2x.png"/>
          <span slot="label" >{{funItem.bsFunctionName || funItem.name}}</span>
        </grid-item>

        <grid-item class="disabled"  v-else>
          <img v-if="funItem.iconNor" slot="icon" :src="funItem.iconNor"/>
          <img v-else slot="icon" src="@icon/homeicon_office_nor@2x.png"/>
          <span slot="label" style="color: #bbb" >{{funItem.bsFunctionName || funItem.name}}</span>
        </grid-item>
      </template>

    </grid> -->
    <!-- <div class="function-list">
      <div class="line-bottom function-title">快速办理</div>
      <div class="function-item-list">
        <div class="function-item line-right">
          <div class="function-icon">
            <img src="@icon/homeicon_registered@2x.png">
          </div>
          <div class="function-name">预约挂号</div>
        </div>
        <div class="function-item">
          <div class="function-item line-bottom">
            <div class="function-icon">
              <img src="@icon/homeicon_registered@2x.png">
            </div>
            <div class="function-name">预约挂号</div>
          </div>
          <div class="function-item">
            <div class="function-item line-right">
              <div class="function-icon">
                <img src="@icon/homeicon_registered@2x.png">
              </div>
              <div class="function-name">预约挂号</div>
            </div>
            <div class="function-item">
              <div class="function-icon">
                <img src="@icon/homeicon_registered@2x.png">
              </div>
              <div class="function-name">预约挂号</div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="function-list" v-for="(item,index) in funList" :key="index">
      <div class="line-bottom function-title">{{item.title}}</div>
      <fun-item :funcList="item.functionList" v-if="item.type==1||item.type==2" @clickItem="funcItemClick">

      </fun-item>
      <div v-else-if="item.type==3" class="function-item-list" >
        <div v-for="(fitem,index) in item.functionList" :key="index" @click="funcItemClick(fitem)" class="function-item" :class="{'flex':item.functionList.length<4,'line-right':item.functionList.length>4?(index+1)%4!=0:index!=item.functionList.length-1,'_line-top':item.functionList.length>4&&(index)<parseInt((item.functionList.length+1)/4)*4}">
          <div class="function-icon">
            <img :src="fitem.icon">
          </div>
          <div class="function-name">{{fitem.name}}</div>
        </div>
      </div>
      <div v-else class="function-item-list">
        <div v-for="(fitem,index) in item.functionList" :key="index" @click="funcItemClick(fitem)" class="function-item item-row" :class="{'flex':item.functionList.length<4,'line-right':index!=item.functionList.length-1}">
          <div class="function-icon">
            <img :src="fitem.icon">
          </div>
          <div class="function-name">{{fitem.name}}</div>
        </div>
      </div>
    </div>
  </view-box>

</template>




<script>



  import { mapState,mapActions,mapMutations } from 'vuex'
  import {Swiper,SwiperItem} from 'vux'
  import FunItem from '@app/components/FunItem.vue' 
  export default {
  	components:{
      Swiper,SwiperItem,FunItem
    },
    created:function () {
      this.$store.commit('updateTabSelected',0)
      if(JSON.stringify(this.hospitalInfo) == '{}'||this.$routeData.isDebug||this.$routeData.isDebug=='true'){
        this.reqAllHospital().then((res)=>{
          if(res.length>0){
            let hosp = res[0]
            this.currentHospital(hosp);
            this.outpatientHint();
            // this.reqFunList();
            this.getHomePageList({});
            this.regHomeFuncList({})
          }
        })
      }else{
        // this.reqFunList();
        this.getHomePageList({});
        this.outpatientHint();
        this.regHomeFuncList({})
      }
    },
    computed:mapState({
      funList:state=>state.funList,
      hospitalInfo:state=>state.hospital.current,
      allHospital:state=>state.hospital.all,
      homePageList:state=>state.homePageList,
      stayMember:state=>state.stayMember,
      outpatientMember:state=>state.outpatientMember,
      outpatientCard:state=>state.outpatientCard,
      stayCard:state=>state.stayCard
    }),
    data(){
  	  return{
        imgs:[
          {
            url:'javascript:',
            img:'https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg'
          },
          {
            url:'javascript:',
            img:'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw1k2wj20p00goq7n.jpg'
          }
        ]
      }
    },
    methods:{
      ...mapActions(["reqFunList","getHomePageList","reqAllHospital","outpatientHint","regHomeFuncList"]),
      ...mapMutations(["currentHospital"]),
      funcItemClick(funItem){
        this.$store.commit('updateTabSelected',0)
        this.$store.commit('updateSmartDirection','front');
        this.$store.commit('updateSmartSex','man')
        if(funItem.enabled=="1"){
          this.$vux.toast.text('功能暂未启用');
        }else if(funItem.jump){
          window.location.href=funItem.jump
        }else{
          shareInst.client.push(funItem.to);
        }
      },
      toFun(funItem){
        this.$store.commit('updateTabSelected',0)
        this.$store.commit('updateSmartDirection','front');
        this.$store.commit('updateSmartSex','man')
//        if(funItem.bsFunctionCode=='ZYYJJ'){
//          if(!this.stayMember[this.hospitalInfo.hospitalcode]){
//            shareInst.client.push(funItem.to);
//          }else{
//            this.$store.commit('selectMember',this.stayMember[this.hospitalInfo.hospitalcode]);
//            this.$store.commit('selectCard',{
//              funKey:'ZYYJJ',
//              card:this.stayCard[this.hospitalInfo.hospitalcode]
//            });
//            shareInst.client.push({
//              name:"HospitalizationDeposit",
//              query:{
//                funKey:"ZYYJJ",
//                routeName:'deposit'
//              }
//            })
//          }
//        }else if(funItem.bsFunctionCode=='MZJF'){
//          if(!this.outpatientMember[this.hospitalInfo.hospitalcode]){
//            shareInst.client.push(funItem.to);
//          }else{
//            this.$store.commit('selectMember',this.outpatientMember[this.hospitalInfo.hospitalcode]);
//            this.$store.commit('selectCard',{
//              funKey:'MZJF',
//              card:this.outpatientCard[this.hospitalInfo.hospitalcode]
//            });
//            shareInst.client.push({
//              name:"OutpatientList",
//              query:{
//                funKey:"MZJF"
//              }
//            })
//          }
//        }else{
//          shareInst.client.push(funItem.to);
//        }
        shareInst.client.push(funItem.to);
      }
    }
  }
</script>



<style lang="scss" >

  .banner {
    display: block;
    width: 100%;
    height: 200px;

  }


  .disabled {
    filter: grayscale(1);
  }

	.home-swipe.mint-swipe{height:12.5rem;}
	.home-choose-hospital {padding:5px 16px;}
	.home-choose-hospital >span img{
		width: 1.3rem;
    vertical-align: sub;
    margin-right: 6px;
  }
	.home-choose-hospital a{float:right;color:#666;}
	.home-hospital-grid .weui-grid{background: #fff;}


  .function-list{
    background: #fff;
    margin-bottom: 5px;
    .function-title{
      padding: 10px 20px;
      &::before{
        content: " ";
        border-left: 3px solid #4BBBFF;
        left: 5px;
        position: absolute;
        top: 50%;
        height: 1.2rem;
        transform: translateY(-50%);
      }
    }
  }

  .function-item-list{
    display: flex;
    flex-wrap: wrap;
    font-size: 14px;
    .function-item{
      width: 25%;
      text-align: center;
      padding: 10px 0;
      position: relative;
      &.flex{
        flex: 1;
      }
      &.item-row{
        display: flex;
        justify-content: center;
        align-items: center;
        .function-icon{
          margin: 5px 10px;
        }
      }
      &:active{
        background: #f4f4f4;
      }
      .function-icon{
        width: 36px;
        height: 36px;
        margin: 0 auto 5px;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  ._line-top::before{
    content: " ";
    border-bottom: 1px solid #D9D9D9;
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;
    transform-origin: 100% 0;
    transform: scaleY(0.5);
  }
</style>
