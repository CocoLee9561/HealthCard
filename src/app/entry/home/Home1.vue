<template>

  <view-box body-padding-bottom="0">

    <x-header slot="header" :title="hospitalInfo.hospitalname||'首页'" :left-options="{showBack:false}">
      <router-link slot="right" v-if="allHospital.length>1" :to="{path:'/chooseHospital?routeName=ChooseHospital'}">切换医院</router-link>
    </x-header>

    <swiper :show-desc-mask="false" :show-dots="funcList.banner&&funcList.banner.length>1" dots-position="right" :auto="true" :loop="true" :aspect-ratio="200/750">
      <swiper-item v-for="(item,index) in funcList.banner" :key="index">
        <img :src="item.url" style="width: 100%;">
        <p class="vux-swiper-desc" v-if="item.title">{{item.title}}</p>
      </swiper-item>
      <swiper-item v-if="funcList.banner.length<=0">
        <img src="@icon/banner.jpg" style="width: 100%;">
      </swiper-item>
    </swiper>

    <div class="fun-group-list" v-for="(item,index) in funcList.menus" :key="index">
        <div class="fun-group-title"><img class="fun-group-icon" :src="item.menuicon">{{item.menutitle}}</div>
        <div class="fun-list">
            <div class="fun-item" v-for="(fun,i) in item.menubtns" :key="i"  @click="funcItemClick(fun)">
                <div class="fun-icon"><img :src="fun.icon"></div>
                <div>{{fun.name}}</div>
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
      let type = this.$route.meta.type;
      if(JSON.stringify(this.hospitalInfo) == '{}'||this.$routeData.isDebug||this.$routeData.isDebug=='true'){
        this.reqAllHospital().then((res)=>{
          if(res.length>0){
            let hosp = res[0]
            this.currentHospital(hosp);
            this.outpatientHint();
            // this.reqFunList();
            // this.getHomePageList({});
            // this.regHomeFuncList({})
            this.getFuncList(type)
          }
        })
      }else{
        // this.reqFunList();
        // this.getHomePageList({});
        this.outpatientHint();
        // this.regHomeFuncList({})
        this.getFuncList(type)
      }
    },
    computed:mapState({
      funcList:state=>state.funcList,
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

      }
    },
    methods:{
      ...mapActions(["reqFunList","getHomePageList","reqAllHospital","outpatientHint","regHomeFuncList","getFuncList","setMemberType","isHasMember"]),
      ...mapMutations(["currentHospital"]),
      funcItemClick(funItem){
        this.$store.commit('updateTabSelected',0)
        this.$store.commit('updateSmartDirection','front');
        this.$store.commit('updateSmartSex','man')
        this.setMemberType(funItem.memberType)
        console.log(funItem.memberType)
        console.log("1111111")
        if(funItem.enabled=="1"){
          this.$vux.toast.text('功能暂未启用');
        }else if(funItem.jump){
          window.location.href=funItem.jump
        }else{
          console.log("222222")
          console.log(funItem)
          let to = funItem.to
          let isbenren = '';
          if(funItem.memberType&&funItem.memberType=='self'){
            isbenren=0;
          }else if(funItem.memberType&&funItem.memberType=='other'){
            isbenren=1;
          }
          if(to.name=='MemberList'||to.path=='/memberList'){
            this.isHasMember({
              funcode:funItem.bsFunctionCode,
              isbenren:isbenren,
              hcode:this.hospitalInfo.hospitalcode
            }).then((res)=>{
              console.log("3333333")
              console.log(res)
              // if(res.relativesize==0){
              //   if(res.jumppage&&res.jumppage==1){
              //     this.toAddMemberCard(to,res);
              //   }else{
              //     this.toAddMember(to);
              //   }
              // }else{
                to.query.jumppage=res.jumppage
                to.query.cardType=res.cardType
                to.query.cardName=res.cardName
                shareInst.client.push(to);
              // }
            })
          }else{
            shareInst.client.push(funItem.to);
          }
        }
      },
      toAddMember(to){
        let _to = this.$store.state.route.data[to.query.dataKey];
        shareInst.client.push({
          path:'/addMember',
          query:{
            funKey:_to.funKey,
            to:JSON.stringify(_to.to),
          }
        });
      },
      toAddMemberCard(to,res){
        let _to = this.$store.state.route.data[to.query.dataKey];
        if(_to.to&&(_to.to.name=='SelectCardPage'||_to.to.path=='/selectCardPage')){
          this.toAddMemberCard(_to.to,res);
        }else{
          shareInst.client.push({
            path:'/addMemberCard',
            query:{
              funKey:_to.funKey,
              cardType:res.cardType,
              cardName:res.cardName,
              to:JSON.stringify(_to.to),
            }
          });
        }
      },
      toFun(funItem){
        this.$store.commit('updateTabSelected',0)
        this.$store.commit('updateSmartDirection','front');
        this.$store.commit('updateSmartSex','man')
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



  .vux-swiper-desc{
    position:absolute;
    bottom: 0px;
    width: 100%;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.7) 100%);
    color: white;
    padding: 10px 0 5px 10px;
    font-size: 14px;
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

.fun-group-list{
    font-size: 14px;
    background: white;
    margin-bottom: 16px;
    box-shadow: 0px 3px 3px rgba(0,0,0,0.1);
    .fun-group-title{
        padding: 16px 16px 5px;
        .fun-group-icon{
            width: 18px;
            height: 18px;
            vertical-align: middle;
            margin-top: -3px;
            margin-right:5px;
        }
    }

    .fun-list{
        display: flex;
        flex-wrap: wrap;
        .fun-item{
            width: 25%;
            text-align: center;
            padding: 10px 0;
            box-sizing: border-box;
            .fun-icon{
                width: 28px;
                height: 28px;
                margin: 0 auto;
                margin-bottom: 5px;
                img{
                    width: 100%;
                    height: 100%;
                }
            }

            &:active{
                background: #f4f4f4;
            }

        }
    }
}
</style>
