<template>
  <view-box class="layer-home-content" :showCopyright="hospitalInfo.hospitalcode=='53486'?false:true" body-padding-bottom="0">
    <x-header slot="header" :title="hospitalInfo.hospitalname||'首页'" :left-options="{showBack:false}"></x-header>
    <!-- 头部 banner 和 挂号 交费 部分-->
    <div class="header-banner" :style="{'padding-bottom':(topHeight+10)+'px'}">
      <swiper :aspect-ratio="200/750" class="banner" :show-desc-mask="false" :show-dots="homePageList.length>1?true:false" auto :loop="true" dots-position="right">
        <swiper-item v-for="(item,index) in homePageList" :key="index" @click.native="toLinkPage(item)">
          <img :src="item.bspicurl" style="width: 100%;height: inherit">
        </swiper-item>
      </swiper>
      <div class="card-content-selection" v-if="funList.top && funList.top.length>0">
        <ul>
          <li :class="(index%2)==0?'banner-card-logo-odd':'banner-card-logo-even'" :style="{height:topHeight+'px'}" v-for="(pageItemTopList,index) in funList.top" @click="toFun(pageItemTopList)">
            <span class="title">{{pageItemTopList.bsFunctionName || pageItemTopList.name}}</span>
            <span class="subTitle">
              <div>{{pageItemTopList.bsFunctionDesc && pageItemTopList.bsFunctionDesc.split("-")[0]}}</div>
              <div>{{pageItemTopList.bsFunctionDesc && pageItemTopList.bsFunctionDesc.split("-")[1]}}</div>
            </span>
            <span class="icon" :style="{backgroundImage:'url(' + pageItemTopList.bsFunctionImg + ')'}"></span>
          </li>
        </ul>
      </div>
      <div class="select-hospital" @click="toPageSelectHospital()" v-if="allHospital.length>1">
        <img class="icon" src="@icon/hospitalname@3x.png"/>{{hospitalInfo.hospitalname||'切换医院'}}<img src="@icon/hospitalname_drop@3x.png" class="icon1"/>
      </div>
    </div>
    <!-- 头部 banner 和 挂号 交费 部分 end-->

    <!--中间主体菜单部分-->
    <div class="card-item" v-for="(pageItemList,index) in funList" v-if="index!='top' && index!='gdfw'">
      <grid :cols="4" class="home-hospital-grid">
        <div class="title">{{pageMenuText[index]}}</div>
        <template v-for="funItem in pageItemList">
          <grid-item v-if="funItem.bsEnableState == 1" @click.native="toFun(funItem)">
            <img v-if="!funItem.bsFunctionImg" slot="icon" :src="funItem.icon"/>
            <img v-else slot="icon" :src="funItem.bsFunctionImg"/>
            <span slot="label">{{funItem.bsFunctionName || funItem.name}}</span>
          </grid-item>
          <grid-item class="disabled" v-else>
            <img v-if="funItem.iconNor" slot="icon" :src="funItem.iconNor"/>
            <img v-else slot="icon" src="@icon/homeicon_office_nor@2x.png"/>
            <span slot="label" style="color: #bbb">{{funItem.bsFunctionName || funItem.name}}</span>
          </grid-item>
        </template>
      </grid>
    </div>
    <!--中间主体菜单部分 end-->

    <!-- 更多服务 -->
    <div class="card-item" v-if="funList && funList.gdfw && funList.gdfw.length>0">
      <grid :cols="4" class="home-hospital-grid">
        <div class="title">更多服务</div>
        <template>
          <ul class="service">
            <!--对应 icon 在 class中以背景图方式提前定义-->
            <li v-for="funItemMore in funList.gdfw" @click="toFun(funItemMore)">
              <i v-if="!funItemMore.bsFunctionImg" :class="funItemMore.iconClass"></i>
              <i v-if="funItemMore.bsFunctionImg"><img :src="funItemMore.bsFunctionImg"></i>
              <span class="subtitle">{{funItemMore.bsFunctionName}}</span>
            </li>
          </ul>
        </template>
      </grid>
    </div>
    <!-- 更多服务 -->

    <!--<router-link to="/Message" >测试页面</router-link>-->
  </view-box>
</template>
<script>
  import {mapState, mapActions, mapMutations} from 'vuex'
  import {Swiper, SwiperItem} from 'vux'

  export default {
    components: {
      Swiper, SwiperItem
    },
    data() {
      return {
        //后台返回英文标识转成具体文字显示
        pageMenuText: {
          ynfw: '院内服务',
          grzx: '个人中心',
          gdfw: '更多服务'
        },
      }
    },
    computed: {
      ...mapState({
        funList: state => state.funList.btns || {},
        hospitalInfo: state => state.hospital.current,
        allHospital: state => state.hospital.all,
        homePageList: state => state.funList.banner,
        stayMember: state => state.stayMember,
        outpatientMember: state => state.outpatientMember,
        outpatientCard: state => state.outpatientCard,
        stayCard: state => state.stayCard,
        cacheClientId: state => state._clientId,
      }),
      currentClientId: function () {
        return shareData.clientId
      },
      needReqHospation: function () {
        let noEquId = this.currentClientId != this.cacheClientId
        let hospitalInfo = this.hospitalInfo
        let isEmpHosInfo = !(hospitalInfo && hospitalInfo.id)
        return noEquId || isEmpHosInfo
      },
      screenDevice() {
        return {
          width: shareInst.store.state.screenWidth,
          height: shareInst.store.state.screenHeight,
        }
      },
      topHeight() {
        let topHeight = 90
        if (this.funList.top) {
          this.funList.top.forEach((res) => {
            if (res.bsFunctionDesc && res.bsFunctionDesc.split('-').length > 1) {
              topHeight = 110
            }
          })
        }
        return topHeight
      }
    },
    mounted() {
      let self = this
      self.resizeDeviceSize()
      window.onresize = function () {
        self.resizeDeviceSize()
      }
    },
    created: function () {
      console.log('--gby--Home创建:clientId:', shareData.clientId, this.needReqHospation)
      this.$store.commit('updateTabSelected', 0)
      if (true) {
        console.log('--gby--获取医院列表')
        this.reqAllHospital().then((res) => {
          if (res.length > 0) {
            this.reqFunList2()
          }
        })
      } else {
        this.reqFunList2()
      }
      
    },
    methods: {
      ...mapActions(['reqFunList2', 'getHomePageList', 'reqAllHospital', 'outpatientHint','setMemberType','isHasMember']),
      ...mapMutations(['currentHospital']),
      toFun(funItem) {
        try {
          if (funItem['develop']) {
            this.alertDevelopM()
          } else {
            this.$store.commit('updateTabSelected', 0)
            this.$store.commit('updateSmartDirection', 'front')
            this.$store.commit('updateSmartSex', 'man')
			this.setMemberType(funItem.memberType)
            // 跳转到 配置的 指定路径中去
            if (!funItem.bsFunctionCode) {
              if (!funItem.commission) {
                this.alertDevelopM()
              } else {
                window.location.href = funItem.commission
              }
            } else {
              if (funItem.bsFunctionCode == 'YYDH') {
                let geogPosInfo = {
                  latitude: this.hospitalInfo.warp,
                  longitude: this.hospitalInfo.weft,
                  name: this.hospitalInfo.hospitalname,
                  address: this.hospitalInfo.address,
                  to: funItem.to
                };
                shareInst.client.hosNavigation(geogPosInfo);
              } else {
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
                    if(res.relativesize==0){
                      if(res.jumppage&&res.jumppage==1){
                        this.toAddMemberCard(to,res);
                      }else{
                        this.toAddMember(to);
                      }
                    }else{
                      to.query.jumppage=res.jumppage
                      to.query.cardType=res.cardType
                      to.query.cardName=res.cardName
                      shareInst.client.push(to);
                    }
                  })
                }else{
                  shareInst.client.push(funItem.to);
                }
              }
            }
          }
        } catch (e) {
          this.alertDevelopM()
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
      alertDevelopM() {
        this.$vux.toast.show({
          type: 'text',
          text: '功能暂未启用',
          position: 'default',
          width: '200px'
        })
      },
      resizeDeviceSize() {
        shareInst.store.state.screenHeight = document.documentElement.clientHeight
        shareInst.store.state.screenWidth = document.documentElement.clientWidth
        console.log("当前设备的宽度", shareInst.store.state.screenWidth)
      },
      toPageSelectHospital() {
        this.$router.push({
          path: '/chooseHospital', query: {
            routeName: 'ChooseHospital'
          }
        })
      },
      toLinkPage(item) {
        if (item.bsjumpurl) {
          window.location.href = item.bsjumpurl
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .layer-home-content{
    font-size: 14px;
  }

  .disabled {
    filter: grayscale(1);
  }

  .home-swipe.mint-swipe {
    height: 12.5rem;
  }

  .home-choose-hospital {
    padding: 5px 16px;
  }

  .home-choose-hospital > span img {
    width: 1.3rem;
    vertical-align: sub;
    margin-right: 6px;
  }

  .home-choose-hospital a {
    float: right;
    color: #666;
  }

  .home-hospital-grid .weui-grid {
    background: #fff;
  }

  .layer-home-content {
    .banner {
      margin-top: 1px;

      img {
        width: 100%;
        max-width: 100%;
      }
    }

    .header-banner {
      position: relative;
      /*height: 220px;*/
      background: $main-back-color;

      .banner {
        height: auto;
        /*height: 110px;*/
      }

      .select-hospital {
        position: absolute;
        top: 14px;
        left: 16px;
        box-sizing: border-box;
        background: rgba(51, 51, 51, 0.3);
        padding: 2px 8px 2px 8px;
        border-radius: 50px;
        color: $main-back-color;

        .icon, .icon1 {
          width: 14px;
          height: 14px;
          vertical-align: middle;
          margin-top: -3px;
          margin-right: 3px;
        }

        .icon1 {
          width: 7px !important;
          height: 5px !important;
          margin-left: 5px;
        }

        a {
          color: $main-back-color;
        }
      }
    }

    /*头部 两个 tab 样式*/
    .card-content-selection {
      width: 100%;
      position: absolute;
      margin-top: 10px;
      z-index: 99;
      left: 50%;
      transform: translate(-50%);

      ul {
        li {
          position: relative;
          float: left;
          height: 110px;
          margin-left: 10px;
          margin-bottom: 5px;
          color: $main-back-color;
          width: calc((100% / 2 - 15px));

          span {
            display: inherit;
          }

          .title {
            margin-left: 16px;
            @include onelineEllipsis
          }

          .title {
            font-weight: bold;
            margin-top: 18px;
          }

          .subTitle {
            margin: 10px 16px 0 16px;

            div {
              @include onelineBr;
              @include onelineEllipsis
            }
          }
        }
      }
    }

    .card-item {
      margin-bottom: 10px;

      &:last-child {
        margin-bottom: 0;
      }

      .weui-grid {
        padding-top: 0;
      }

      /*更多服务*/
      .service {
        width: 100%;
        position: relative;
        text-align: center;
        display: inline-block;
        height: 100%;
        @include clearfix();
        box-sizing: border-box;

        li {
          position: relative;
          border: 1px $line-color solid;
          border-radius: 50px;
          height: 30px;
          float: left;
          margin-left: 10px;
          text-align: center;
          margin-bottom: 12px;
          color: $valueColor;
          box-sizing: border-box;
          width: calc(100% / 3 - 14px);
        }

        i {
          position: absolute;
          width: 15px;
          height: 15px;
          left: 10px;
          top: 5px;
        }

        i img {
          width: 15px;
          height: 15px;
        }

        .subtitle {
          width: 4.2em;
          display: inline-block;
          margin-top: 3px;
          margin-left: 20px;
          @include onelineEllipsis;
        }
      }

      .home-hospital-grid {
        background: $main-back-color;

        .title {
          color: $subtitle-color;
          margin: 10px 0 10px 20px;
        }
      }
    }

    /*重置 vux 部分样式*/
    .weui-grid:before {
      border-right: none;
    }

    .weui-grids:before {
      border-top: none;
    }

    .weui-grid:after {
      border-bottom: none;
    }

    .weui-grids:after {
      border-left: none !important;
    }

    .weui-grid__icon {
      width: 35px;
      height: 35px;
    }

    .weui-grid__icon + .weui-grid__label {
      margin-top: 10px;
    }

    .vux-slider > .vux-indicator, .vux-slider .vux-indicator-right {
      bottom: 2px !important;
    }
  }

@mixin cardlogo() {
  position: absolute;
  width: 35px;
  height: 35px;
  top: 10px;
  right: 10px;
  background-size: 100%;
}

/**预约挂号*/
.banner-card-logo-odd {
  .icon {
    @include cardlogo;
    // background-image: url("../../common/assets/icon/home/icon_home_yuyue.png");
  }

  background-image: -webkit-linear-gradient(45deg, rgba(102, 156, 255, 0.9) 0%, rgba(105, 197, 255, 0.9) 100%);
  box-shadow: 0 10px 20px 0 rgba(200, 223, 255, 1);
}

/**门诊交费*/
.banner-card-logo-even {
  .icon {
    @include cardlogo;
    // background-image: url("../../common/assets/icon/home/icon_home_jiaofei.png");
  }

  background-image: -webkit-linear-gradient(45deg, rgba(255, 130, 86, 0.9) 0%, rgba(255, 180, 107, 0.9) 100%);
  box-shadow: 0 10px 20px 0 rgba(228, 212, 195, 1);
}
</style>
