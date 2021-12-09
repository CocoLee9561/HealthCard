<template>
  <div class="page">
    <view-box body-padding-bottom="90px" body-padding-top="0">
      <div slot="header">
        <x-header>智能导诊</x-header>
        <tab class="own-tab full-tab" v-model="selected">
          <tab-item>身体部位</tab-item>
          <tab-item>列表</tab-item>
        </tab>
      </div>
      <div v-show="selected==0" class="body-plan">
        <div class="sex-box">
          <checker v-model="sex" @on-change="sexChange" default-item-class="smart-default" radio-required selected-item-class="smart-selected">
            <checker-item value="man" class="smart-male">
              <img src="@icon/guidance/smart_male.png">
            </checker-item>
            <checker-item value="woman" class="smart-female">
              <img src="@icon/guidance/smart_female.png">
            </checker-item>
          </checker>
          <!--<my-switch defaultText="男生" activeText="女生" @changeSwitch="sexChange" activeValue="woman" defaultValue="man" v-model="sex"></my-switch>-->
        </div>
        <div class="rotate-box" @click="smartRotate()">
          <div>
            <img src="@icon/guidance/smart_rota.png">
            <span>转身</span>
          </div>
        </div>
        <transition name="body" mode="out-in" @after-enter="reloadBody()">
          <div class="body-box" v-if="sex=='man'&&direction=='front'" key="man_front">
            <img usemap="#planetmap" border = "0" id="man_front" class="body" src="@icon/guidance/man_front.png">
            <!--<img class="part man-header" v-show="part==1"  src="@icon/guidance/man_header.png">-->
            <!--<img class="part man-neck"  v-show="part==2" src="@icon/guidance/man_neck.png"/>-->
            <!--<img class="part man-arm" v-show="part==3" src="@icon/guidance/man_arm.png"/>-->
            <!--<img class="part man-chest" v-show="part==4" src="@icon/guidance/man_chest.png"/>-->
            <!--<img class="part man-abdomen" v-show="part==5" src="@icon/guidance/man_abdomen.png"/>-->
            <!--<img class="part man-hand" v-show="part==6" src="@icon/guidance/man_hand.png"/>-->
            <!--<img class="part man-genitals" v-show="part==7" src="@icon/guidance/man_genitals.png"/>-->
            <!--<img class="part man-leg" v-show="part==8" src="@icon/guidance/man_leg.png"/>-->
            <!--<img class="part man-foot" v-show="part==9" src="@icon/guidance/man_foot.png"/>-->
          </div>
          <div class="body-box" v-if="sex=='woman'&&direction=='front'" key="woman_front">
            <img usemap="#planetmap" border = "0" id="woman_front" class="body" src="@icon/guidance/woman_front.png">
          </div>
          <div class="body-box" v-if="sex=='man'&&direction=='back'" key="man_back">
            <img usemap="#planetmap" border = "0" id="man_back" class="body" src="@icon/guidance/man_back.png">
          </div>
          <div class="body-box" v-if="sex=='woman'&&direction=='back'" key="woman_back">
            <img usemap="#planetmap" border = "0" id="woman_back" class="body" src="@icon/guidance/woman_back.png">
          </div>
        </transition>
        <map name="planetmap">
          <area v-for="item in body" :shape="item.shape" :coords="item.coords" @click="partClick(item)" @mouseup="onBlur">
        </map>
      </div>
      <div v-show="selected==1">
        <group class="zh" :gutter="0">
          <cell is-link @click.native="partListClick(item)" v-for="(item,index) in guidanceBodyList" :key="index">
            <span slot="title">{{item.name}}</span>
          </cell>
        </group>
      </div>
      <!--<vue-qr text="123" :size="200" :margin="0"></vue-qr>-->
      <popup :popup-style="{zIndex:701}" v-model="leftMenuVisible"  height="100%" position="right" @on-hide="part=0" width="250px">
        <div style="background: #fff;width: 100%;height: 100%">
          <div class="left-menu-header">{{currParts.name}}</div>
          <group :gutter="0">
            <cell class="part-item" :class="{'stripe':index%2==0}" v-for="(item,index) in currParts.zhengZhuanglist" :title="item.name" :key="index" @click.native="selectPart(item)" is-link></cell>
          </group>
        </div>
      </popup>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import VueQr from 'vue-qr'
  import {InlineXSwitch,Popup,Checker, CheckerItem,Tab, TabItem} from 'vux'
  import MySwitch from '../../../components/MySwitch'
  export default {
    computed: {
      ...mapState({
        guidanceBody:state=>state.guidanceBody,
        direction:state=>state.smartDirection,
        guidanceBodyList:state=>state.guidanceBodyList
      }),
      selected:{
        get:function(){
          return this.$store.state.tabSelected||0
        },
        set:function(val){
          this.$store.commit('updateTabSelected',val)
        }
      },
      sex:{
        get:function(){
          return this.$store.state.smartSex||'man'
        },
        set:function(val){
          this.$store.commit('updateSmartSex',val)
        }
      },
    },
    components:{
      VueQr,InlineXSwitch,MySwitch,Popup,Checker, CheckerItem,Tab, TabItem
    },
    mounted(){
      this.reloadBody()
    },
    watch:{
      selected:function(val){
        if(val==0){
          this.reloadBody()
        }
      },
      sex:function(val){
//        this.reloadBody();
      },
      direction:function(val){
//        this.reloadBody();
      }
    },
    created() {
      this.loadGuidance({sex:this.sex=='woman'?1:0})
    },
    data() {
      return {
        part: 0,
        body:[],
        parts:{},
        currParts:{},
        leftMenuVisible:false,
        defaultBody:{
          'man_front':[
            {
              shape:'poly',
              coords:'269,164,251,145,241,115,229,83,236,79,233,43,247,10,286,0,329,19,327,76,336,80,327,113,315,142,293,164',
              partId:1,
              sex:'man',
              direction:'front',
              highlight:'man-header',
              top:0,
              name:'头部'
            },
            {
              shape:'poly',
              coords:'250,146,265,163,299,166,315,142,317,158,354,179,206,179,247,157',
              partId:2,
              sex:'man',
              direction:'front',
              highlight:'man-neck',
              top:100,
              name:'颈部'
            },
            {
              shape:'poly',
              coords:'193,212,371,212,360,311,286,304,208,320',
              partId:4,
              sex:'man',
              direction:'front',
              highlight:'man-chest',
              top:165,
              name:'胸部'
            },
            {
              shape:'poly',
              coords:'167,196,140,224,37,451,56,461,98,428,181,287',
              partId:3,
              sex:'man',
              direction:'front',
              highlight:'man-arm',
              top:150,
              name:'上肢'
            },
            {
              shape:'poly',
              coords:'393,196,426,229,533,452,513,469,452,409,387,289',
              partId:3,
              sex:'man',
              direction:'front',
              highlight:'man-arm',
              top:150,
              name:'上肢'
            },
            {
              shape:'poly',
              coords:'208,340,281,313,350,329,357,349,354,454,211,448,208,358',
              partId:5,
              sex:'man',
              direction:'front',
              highlight:'man-abdomen',
              top:235,
              name:'腹部'
            },
            {
              shape:'poly',
              coords:'11,566,8,533,22,484,26,467,53,467,58,494,53,524,52,552,37,554,32,521,23,569',
              partId:6,
              sex:'man',
              direction:'front',
              highlight:'man-hand',
              top:385,
              name:'四肢'
            },
            {
              shape:'poly',
              coords:'515,469,537,463,557,515,560,573,540,573,533,513,530,555,516,555,513,519,507,500',
              partId:6,
              sex:'man',
              direction:'front',
              highlight:'man-hand',
              top:385,
              name:'四肢'
            },
            {
              shape:'poly',
              coords:'205,476,369,478,372,510,297,570,272,573,193,512',
              partId:7,
              sex:'man',
              direction:'front',
              highlight:'man-genitals',
              top:355,
              name:'生殖器'
            },
            {
              shape:'poly',
              coords:'277,575,241,720,239,771,226,821,224,902,185,902,191,837,172,776,179,713,173,641,187,515',
              partId:8,
              sex:'man',
              direction:'front',
              highlight:'man-leg',
              top:395,
              name:'下肢'
            },
            {
              shape:'poly',
              coords:'290,576,332,731,330,780,341,819,345,890,380,890,380,840,396,761,389,708,395,614,378.506',
              partId:8,
              sex:'man',
              direction:'front',
              highlight:'man-leg',
              top:395,
              name:'下肢'
            },
            {
              shape:'poly',
              coords:'226,905,229,930,220,947,221,969,214,1007,158,992,182,930,185,902',
              partId:9,
              sex:'man',
              direction:'front',
              highlight:'man-foot',
              top:730,
              name:'四肢'
            },
            {
              shape:'poly',
              coords:'341,902,342,932,348,953,350,1007,408,990,390,950,381,902',
              partId:9,
              sex:'man',
              direction:'front',
              highlight:'man-foot',
              top:730,
              name:'四肢'
            },
          ],
          'woman_front':[
            {
              shape:'poly',
              coords:'156,152,177,163,198,153,229,119,233,64,227,51,214,35,211,15,197,1,151,3,137,20,141,34,112,76,121,121',
              partId:1,
              sex:'woman',
              direction:'front',
              highlight:'man-header',
              top:0,
              name:'头部'
            },
            {
              shape:'poly',
              coords:'156,155,175,165,199,157,200,173,215,180,137,186,155,173',
              partId:2,
              sex:'woman',
              direction:'front',
              highlight:'woman-neck',
              top:100,
              name:'颈部'
            },
            {
              shape:'poly',
              coords:'113,221,240,221,252,270,245,320,111,320,101,277103,260',
              partId:4,
              sex:'woman',
              direction:'front',
              highlight:'woman-chest',
              top:165,
              name:'胸部'
            },
            {
              shape:'poly',
              coords:'94,197,75,223,75,290,45,403,38,454,55,459,80,401,104,314,95,267',
              partId:3,
              sex:'woman',
              direction:'front',
              highlight:'woman-arm',
              top:150,
              name:'上肢'
            },
            {
              shape:'poly',
              coords:'252,192,276,211,280,292,308,400,316,452,298,460,274,397,250,311,257,258',
              partId:3,
              sex:'woman',
              direction:'front',
              highlight:'woman-arm',
              top:150,
              name:'上肢'
            },
            {
              shape:'poly',
              coords:'113,310,241,330,240,393,249,412,107,412,117,389',
              partId:5,
              sex:'woman',
              direction:'front',
              highlight:'woman-abdomen',
              top:235,
              name:'腹部'
            },
            {
              shape:'poly',
              coords:'0,525,20,479,38,459,55,464,53,482,37,514,13,528',
              partId:6,
              sex:'woman',
              direction:'front',
              highlight:'woman-hand',
              top:385,
              name:'四肢'
            },
            {
              shape:'poly',
              coords:'317,457,333,477,352,522,339,524,315,510,300,478,299,463',
              partId:6,
              sex:'woman',
              direction:'front',
              highlight:'woman-hand',
              top:385,
              name:'四肢'
            },
            {
              shape:'poly',
              coords:'101,429,254,429,263,456,178,530,92,456',
              partId:7,
              sex:'woman',
              direction:'front',
              highlight:'woman-genitals',
              top:355,
              name:'生殖器'
            },
            {
              shape:'poly',
              coords:'87,478,82,514,85,541,117,677,109,728,113,789,141,891,165,891,172,788,167,717,173,678,177,539',
              partId:8,
              sex:'woman',
              direction:'front',
              highlight:'woman-leg',
              top:395,
              name:'下肢'
            },
            {
              shape:'poly',
              coords:'269,478,272,514,269,539,239,670,238,697,246,755,244,775,214,894,189,889,181,776,189,718,187,694,183,672,178,542',
              partId:8,
              sex:'woman',
              direction:'front',
              highlight:'woman-leg',
              top:395,
              name:'下肢'
            },
            {
              shape:'poly',
              coords:'142,893,164,893,171,909,169,936,178,971,188,931,187,908,189,892,213,893,211,905,219,944,223,980,213,995,137,995,133,981,136,948,143,905',
              partId:9,
              sex:'woman',
              direction:'front',
              highlight:'woman-foot',
              top:730,
              name:'四肢'
            }
          ],
          'man_back':[
            {
              shape:'poly',
              coords:'245,125,324,125,330,111,339,90,332,69,337,29,324,11,288,0,247,11,236,33,237,67,230,86,239,109',
              partId:1,
              sex:'man',
              direction:'back',
              highlight:'man-header',
              top:0,
              name:'头部'
            },
            {
              shape:'poly',
              coords:'248,134,322,134,323,163,352,182,212,182,244,165',
              partId:2,
              sex:'man',
              direction:'back',
              highlight:'man-neck',
              top:100,
              name:'颈部'
            },
            {
              shape:'poly',
              coords:'187,205,371,205,380,271,366,332,363,458,202,458,200,327,190,265',
              partId:4,
              sex:'man',
              direction:'back',
              highlight:'man-back',
              top:165,
              name:'背部'
            },
            {
              shape:'poly',
              coords:'174,199,146,215,132,236,54,389,27,460,50,474,105,427,175,299,164,258',
              partId:3,
              sex:'man',
              direction:'back',
              highlight:'man-arm',
              top:150,
              name:'上肢'
            },
            {
              shape:'poly',
              coords:'393,199,425,217,521,392,540,460,516,476,461,431,452,407,393,301,390,256',
              partId:3,
              sex:'man',
              direction:'back',
              highlight:'man-arm',
              top:150,
              name:'上肢'
            },
            {
              shape:'poly',
              coords:'199,475,368,475,387,570,293,574,288,556,277,556,270,577,181,561',
              partId:5,
              sex:'man',
              direction:'back',
              highlight:'man-hips',
              top:235,
              name:'臀部'
            },
            {
              shape:'poly',
              coords:'4,591,0,560,0,531,22,470,49,480,56,506,53,548,40,547,39,523,24,539,26,574',
              partId:6,
              sex:'man',
              direction:'back',
              highlight:'man-hand',
              top:385,
              name:'四肢'
            },
            {
              shape:'poly',
              coords:'563,591,567,560,567,544,545,464,518,480,511,503,512,547,526,547,530,525,542,539,541,574',
              partId:6,
              sex:'man',
              direction:'back',
              highlight:'man-hand',
              top:385,
              name:'四肢'
            },
            {
              shape:'poly',
              coords:'180,565,272,583,264,642,237,735,234,824,220,881,217,916,184,913,178,864,164,811,177,723,175,605',
              partId:8,
              sex:'man',
              direction:'back',
              highlight:'man-leg',
              top:395,
              name:'下肢'
            },
            {
              shape:'poly',
              coords:'384,560,294,583,327,724,331,803,351,909,384,912,387,879,403,814,393,732,392,614',
              partId:8,
              sex:'man',
              direction:'back',
              highlight:'man-leg',
              top:395,
              name:'下肢'
            },
            {
              shape:'poly',
              coords:'169,939,169,961,178,995,197,1005,216,1003,222,990,219,965,227,954,227,931,217,927',
              partId:9,
              sex:'man',
              direction:'back',
              highlight:'man-foot',
              top:730,
              name:'四肢'
            },
            {
              shape:'poly',
              coords:'398,938,398,961,390,996,373,1006,353,1003,345,990,349,968,341,955,342,931,350,923',
              partId:9,
              sex:'man',
              direction:'back',
              highlight:'man-foot',
              top:730,
              name:'四肢'
            },
          ],
          'woman_back':[
            {
              shape:'poly',
              coords:'151,146,155,141,174,137,196,139,198,147,212,134,227,87,226,62,218,40,212,31,203,24,203,9,195,1,167,0,152,4,145,14,144,23,127,34,121,58,121,82,118,87,123,107,139,134,144,142',
              partId:1,
              sex:'woman',
              direction:'back',
              highlight:'woman-header',
              top:0,
              name:'头部'
            },
            {
              shape:'poly',
              coords:'154,144,197,144,198,163,217,178,129,179,153,163',
              partId:2,
              sex:'woman',
              direction:'back',
              highlight:'woman-neck',
              top:100,
              name:'颈部'
            },
            {
              shape:'poly',
              coords:'107,201,239,201,246,269,247,324,238,373,250,407,108,407,118,374,104,321,106,272',
              partId:4,
              sex:'woman',
              direction:'back',
              highlight:'woman-back',
              top:165,
              name:'背部'
            },
            {
              shape:'poly',
              coords:'90,194,69,214,67,235,70,290,51,378,45,404,40,468,57,469,81,400,104,327,95,269',
              partId:3,
              sex:'woman',
              direction:'back',
              highlight:'woman-arm',
              top:150,
              name:'上肢'
            },
            {
              shape:'poly',
              coords:'250,187,283,208,281,291,301,380,307,413,311,466,295,470,269,397,248,329,253,263',
              partId:3,
              sex:'woman',
              direction:'back',
              highlight:'woman-arm',
              top:150,
              name:'上肢'
            },
            {
              shape:'poly',
              coords:'95,426,259,424,273,475,275,508,272,539,181,541,176,529,169,543,83,539,79,506,82,472',
              partId:5,
              sex:'woman',
              direction:'back',
              highlight:'woman-hips',
              top:235,
              name:'臀部'
            },
            {
              shape:'poly',
              coords:'41,472,39,478,22,493,1,541,11,544,38,529,53,495,55,475',
              partId:6,
              sex:'woman',
              direction:'back',
              highlight:'woman-hand',
              top:385,
              name:'四肢'
            },
            {
              shape:'poly',
              coords:'310,470,313,478,331,493,353,537,339,544,315,530,299,496,296,478',
              partId:6,
              sex:'woman',
              direction:'back',
              highlight:'woman-hand',
              top:385,
              name:'四肢'
            },
            {
              shape:'poly',
              coords:'88,552,174,550,171,689,165,721,173,774,173,810,165,897,140,898,110,777,111,741,121,693,108,641,95,597',
              partId:8,
              sex:'woman',
              direction:'back',
              highlight:'woman-leg',
              top:395,
              name:'下肢'
            },
            {
              shape:'poly',
              coords:'266,551,182,552,184,686,192,719,182,770,184,810,192,895,216,895,240,800,247,757,245,733,237,700,243,652,256,619',
              partId:8,
              sex:'woman',
              direction:'back',
              highlight:'woman-leg',
              top:395,
              name:'下肢'
            },
            {
              shape:'poly',
              coords:'142,901,144,907,131,988,138,999,156,1005,170,1005,178,998,182,1002,190,1007,205,1006,221,994,226,986,213,909,215,900,193,899,192,906,186,912,186,940,178,994,170,947,170,916,163,906,163,898',
              partId:9,
              sex:'woman',
              direction:'back',
              highlight:'woman-foot',
              top:730,
              name:'四肢'
            }
          ]
        },
      }
    },
    methods: {
      ...mapActions(["loadGuidance"]),
      onBlur(){
        this.part=0
      },
      smartRotate(){
        let _direction=this.direction=='front'?'back':'front';
        this.$store.commit('updateSmartDirection',_direction);
//        this.reloadBody()
      },
      reloadBody(){
        this.$nextTick(()=>{
          let self=this
          let imgs = document.querySelectorAll('img');
          let _count = imgs.length;
          let count = 0;
          Array.from(imgs).forEach((item)=>{
            let img = new Image()
            img.onload = ()=>{
              count++;
              if(count==_count){
                self.loadBody(this.sex+'_'+this.direction)
              }
            }
            img.src=item.getAttribute('src')
          })

        })
      },
      loadBody(imgId){
        this.part=0
        this.body=[]
        this.getImgSize(imgId).then((size)=>{
          let _body=this.defaultBody[imgId]
          if(!_body){
            return;
          }
          _body.forEach((val,index)=>{
            let _val=Object.assign({},val)
            let coords=_val.coords.split(',');
            coords.forEach((c,i)=>{
              coords[i]=c*size.ratio
            })
            _val.coords=coords.join(',')
            this.body.push(_val);
//            this.resetImage(size,_val.highlight,_val.top)
          })
        }).catch((a)=>{

        })
      },
      sexChange(sex){
//        this.reloadBody()
        this.$store.commit('updateSmartDirection','front');
        this.loadGuidance({sex:this.sex=='woman'?1:0})
      },
      resetImage(size,imageClass,top){
        let image = document.getElementsByClassName(imageClass);
        var img = new Image()
        img.src = image[0].src
        img.onload = function () {
          image[0].setAttribute('width',img.width*size.ratio);
          image[0].setAttribute('height',img.height*size.ratio);
          image[0].style.setProperty('top',top*size.ratio+'px');
        }
      },
      getImgSize(imgId) {
        let p = new Promise((resolve, reject)=>{
          let size = {}
          var image = document.getElementById(imgId);
          if(!image){
            reject('')
          }else{
            // 创建对象
            var img = new Image()
            // 改变图片的src
            img.src = image.src
            // 加载完成执行
            img.onload = function () {
              size.imgWidth=image.width
              size.imgHeight=image.height
              size.realWidth = img.width
              size.realHeight = img.height
              size.ratio=size.imgWidth/size.realWidth
              resolve(size)
            }
          }
        })
        return p;
      },
      partClick(item){
        let _body = this.guidanceBody[item.name]
        if(_body){
          this.currParts=_body
          this.leftMenuVisible=true
          this.part=item.partId
        }
      },
      partListClick(item){
        this.currParts=item
        this.leftMenuVisible=true
      },
      selectPart(item){
        if(item.type==1){
          this.$store.commit('updateQuestionList',item.wenti)
          shareInst.client.push({
            path:'/questionGuidance'
          })
        }else if(item.type==0){
          this.$store.commit('updateRecommendDepartments',item.keshilist)
          shareInst.client.push({
            path:'/recommentDepartment'
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .body{
    height: 100%;
    -webkit-tap-highlight-color:rgba(0,0,0,0);
    user-select: none;
    /*pointer-events: none;*/
  }
  .body-plan{
    width: 100%;
    height: 100%;
    padding-top: 10%;
    box-sizing: border-box;
  }
  .body-box{
    text-align: center;
    position: relative;
    height: 95%;
  }
  .part {
    pointer-events:none;
    position: absolute;
    left: 50%;
    transform: translate(-50%);
  }

  .man-neck {
    top: 100px;
  }

  .man-arm {
    top: 150px;
  }

  .man-chest {
    top: 165px;
  }

  .man-abdomen {
    top: 235px;
  }

  .man-hand {
    top: 385px;
  }

  .man-genitals {
    top: 355px;
  }

  .man-leg {
    top: 395px;
  }

  .man-foot {
    top: 730px;
  }

  .left-menu-header{
    height: 70px;
    line-height: 70px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: $mainColor;
  }
  .left-menu-item{
    line-height: 46px;
    padding-left: 20px;
    border-bottom: 1px solid #f1f1f1;
  }
  .left-menu-item:active{
    background: #f5f5f5;
  }
  .smart-default{
    background: white;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    text-align: center;
    border: 2px solid white;
    line-height: 2rem;
  }
  .smart-default img{
    vertical-align: middle;
    width: 1.5rem;
    height: 1.5rem;
  }
  .smart-selected.smart-male{
    border: 2px solid #93B4FC;
  }
  .smart-selected.smart-female{
    border: 2px solid #FE8DB5;
  }
  .sex-box{
    z-index: 100;
    position: absolute;
    width: 100%;
  }
  .smart-female{
    position: absolute;
    right: 30px;
  }
  .smart-male{
    position: absolute;
    left: 30px;
  }
  .rotate-box{
    z-index: 100;
    background: white;
    position: absolute;
    bottom: 40px;
    right: 0px;
    border-bottom-left-radius: 18px;
    border-top-left-radius: 18px;
    color: $mainColor;
    padding: 4px 8px;
    user-select: none;
  }
  .rotate-box span{
    vertical-align: middle;
  }
  .rotate-box img{
    width: 1.5rem;
    vertical-align: middle;
  }
  .rotate-box:active{
    background: #EEEEEE;
  }
  .vux-tab-ink-bar{
    width: 50% !important;
  }
  .part-item{
    height: 40px;
  }
  .part-item.stripe{
    background: #F4F4F4;
  }
  .part-item:before{
    border-top: 0px !important;
  }
  .body-enter-active, .body-leave-active {
    transition: opacity 400ms
  }
  .body-enter, .body-leave-to{
    opacity: 0;
  }
</style>
