<template>
  <div class="page">
    <view-box>
      <x-header slot="header">医院简介</x-header>
      <div style="height: 164px;width: 100%;">
        <img :src="hospitalInfo.bsPhoto" width="100%" height="100%"/>
      </div>
      <group gutter="0">
        <cell>
        <span slot="title">{{ hospitalInfo.bsHospitalName }}
        <span class="hos-rank">{{hospitalInfo.bsLevel}}</span>
        </span>

        </cell>
        <cell is-link @click.native="toNavigation" :title="hospitalInfo.bsAddress">
          <img class="cell-icon" slot="icon" src="@icon/icon_map.png"/>
        </cell>
        <cell @click.native="callPhone">
          <span slot="title" style="color: #0af;">{{ hospitalInfo.bsTelephone }}</span>
          <img class="cell-icon" slot="icon" src="@icon/cal.png"/>
        </cell>
      </group>
      <div v-if="hospitalInfo.bsHospitalIntro" id="hospitalIntro">

      </div>
    </view-box>
  </div>
</template>

<script>
  import {MessageBox} from 'mint-ui';
  import {mapState, mapActions} from 'vuex'

  //  Vue.component(Header.name, Header);
  export default {
    computed: {
      ...mapState({
        hospitalInfo: state => state.hospitalInfo
      })
    },
    data() {
      return {
//        hospitalInfo:{
//          bsHospitalName:'滁州市第一人民医院(北区)',
//          bsLevel:'三甲',
//          bsAddress:'滁州市鼓楼街忠佑巷12号',
//          bsTelephone:'0550-5330000',
//          bsHospitalIntro:'<p>\r\n    <br/>\r\n</p>\r\n<p>\r\n    <span style=\"color: rgb(51, 51, 51); font-family: arial, 宋体, sans-serif; font-size: 14px; text-indent: 28px; background-color: rgb(255, 255, 255);\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>重庆市江津区中心医院本部（新区）位于重庆市江津区鼎山街道办事处江州大道725号、东门分院位于重庆市江津区几江镇大同路69号，是一所三级综合医院，是重庆市医保定点医院，重庆医药高等专科学校非直管附属医院，先后荣获“全国卫生系统先进集体”、“全国精神文明建设工作先进单位”、“全国百佳百姓放心示范医院”、“全国百佳百姓满意医院”、“国家公共机构节能示范单位”、“重庆市最佳文明单位”、“重庆市卫生系统先进集体”、“重庆市职工职业道德建设先进单位”等荣誉称号。</strong></span><span style=\"color: rgb(112, 48, 160);\"></span>\r\n</p>\r\n<hr/>\r\n<p>\r\n    是的发送到是的撒大时代\r\n</p>\r\n<p>\r\n    地址<img width=\"530\" height=\"340\" src=\"http://api.map.baidu.com/staticimage?center=106.265598,29.295884&zoom=13&width=530&height=340&markers=106.265598,29.295884\"/>\r\n</p>\r\n<p>\r\n    <br/>\r\n</p>'
//        },
        hospitalCode: ''
      }
    },
    created() {
//      this.getHospitalInfo();
    },
    components: {
      MessageBox
    },
    mounted() {
      this.getHospitalInfo();
//      document.getElementById("hospitalIntro").innerHTML = this.hospitalInfo.bsHospitalIntro;
    },
    methods: {
      ...mapActions(["queryRegHospAndDepts"]),
      /** 打电话 **/
      callPhone() {
        let self = this
        this.$vux.confirm.show({
          title: '是否拨打医院电话咨询？',
          content: '电话:' + this.hospitalInfo.bsTelephone,
          confirmText:'立即拨打',
          cancelText:'暂不拨打',
          onConfirm () {
            window.location.href = 'tel:' + self.hospitalInfo.bsTelephone;
          }
        })
      },
      toNavigation(){
        shareInst.client.push({
          path:'/Navigation'
        })
      },
      getHospitalInfo() {

        this.queryRegHospAndDepts().then((response) => {
          if (this.hospitalInfo.bsHospitalIntro.length > 0) {
            document.getElementById("hospitalIntro").innerHTML = response.bsHospitalIntro;
          }
        })

      }
    }
  }

</script>
<style scoped>
  #hospitalIntro {
    padding: 10px 15px;
    height: auto;
    margin-top: 20px;
    width: 100%;
    box-sizing: border-box;
    background: #fff;
  }

  .hos-rank {
    margin-left: 10px;
    font-size: 0.7rem;
    background-color: #FBC22B;
    border-radius: 4px;
    color: white;
    padding: 2px 4px;
  }
  .cell-icon{
    width: 1.2em;
    margin-right: 5px;
    vertical-align: middle;
  }
</style>
