<template>
  <div class="page">
    <view-box>
      <x-header slot="header">就医点评</x-header>
      <div>
        <div>
          <div class="doctor-info-bar doctor-review">
            <img :src="reviewDoctorInfo.doctorphoto">
            <div class="doctor-info">
              <strong>{{ reviewDoctorInfo.doctorname }}</strong><span
              class="doctor-info-jobtitle">{{ reviewDoctorInfo.doctorrank }}</span>
              <div class="doctor-info-text">{{reviewDoctorInfo.departmentname}}</div>
              <div class="doctor-info-text">{{reviewDoctorInfo.hospitalname}}</div>
            </div>
          </div>
        </div>
        <div class="info-plan">
          <div>
            <div>
              <span class="info-title">姓名 </span>
              <span>{{reviewDoctorInfo.realname}}</span>
            </div>
            <div>
              <span class="info-title">时间 </span>
              <span>{{reviewDoctorInfo.regdate}} {{reviewDoctorInfo.regtime}}</span>
            </div>
          </div>
        </div>
        <group>
          <x-input title="所患疾病" :max="20" placeholder="请在此填写疾病名称或症状表现"
                   text-align="right" v-model="disease"></x-input>
          <!--<cell>
            <img slot="icon" src="@icon/tip.png">
            <span slot="title">如未确诊疾病，可填写症状表现</span>
          </cell>-->
          <x-textarea v-model='reviewContent' show-counter :max='200' class="review-textarea" :height="100"
                      placeholder="可在此描述本次就医的体验"></x-textarea>
        </group>
        <group>
          <cell title="服务态度">
            <!--<rater star="☻" v-model="attitude"></rater>-->
            <span class="review-star" v-model="attitude">
              <span v-for="index in 5" @click="attitude=index">
                <img v-if="attitude>=index" src="@icon/smile-green-small@2x.png" width="20"/>
                <img src="@icon/smile-gray-small@2x.png" v-else width="20"/>
              </span>
              <!--<img src="@icon/smile-green-small@2x.png" width="20"/>-->
              <!--<img src="../../../../common/assets/icon/smile-green-small@2x.png" width="20"/>-->
              <!--<img src="../../../../common/assets/icon/smile-gray-small@2x.png" width="20"/>-->
              <!--<img src="../../../../common/assets/icon/smile-gray-small@2x.png" width="20"/>-->
              <!--<img src="../../../../common/assets/icon/smile-gray-small@2x.png" width="20"/>-->
            </span>
          </cell>
          <cell title="治疗效果">
            <!--<rater v-model="effect"></rater>-->
            <span class="review-star" v-model="effect">
              <span v-for="index in 5" @click="effect=index">
                <img v-if="effect>=index" src="@icon/good-green-small@2x.png" width="20"/>
                <img src="@icon/good-gray-small@2x.png" v-else width="20"/>
              </span>
              <!--<img src="../../../../common/assets/icon/good-green-small@2x.png" width="20"/>-->
              <!--<img src="../../../../common/assets/icon/good-green-small@2x.png" width="20"/>-->
              <!--<img src="../../../../common/assets/icon/good-green-small@2x.png" width="20"/>-->
              <!--<img src="../../../../common/assets/icon/good-gray-small@2x.png" width="20"/>-->
              <!--<img src="../../../../common/assets/icon/good-gray-small@2x.png" width="20"/>-->
            </span>
          </cell>
          <!--<x-textarea v-model='reviewContent' show-counter :max='200' class="review-textarea" :height="100" placeholder="可在此补充描述本次就医的体验"> </x-textarea>-->
        </group>
        <div class="btn-box">
          <x-button @click.native="reviewAction" type="primary" class="own-btn">提交点评</x-button>
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import {Rater, XTextarea} from 'vux'

  export default {
    components: {
      Rater, XTextarea
    },
    computed: {
      ...mapState(["reviewDoctorInfo"]),
    },
    created() {

    },
    data() {
      return {
        disease: '',
        reviewContent: '',
        attitude: 0,
        effect: 0,
      }
    },
    methods: {
      ...mapActions(["review"]),
      reviewAction() {
        this.review({
          reghistoryid: this.reviewDoctorInfo.reghistoryid,
          disease: this.disease,
          isanonymous: '0',
          servicevaluation: this.attitude,
          treatmentevaluation: this.effect,
          content: this.reviewContent,
        }).then((res) => {
          this.$vux.alert.show({
            title: '点评成功',
            content: '感谢您的点评！',
            onHide() {
              shareInst.client.back()
            }
          })
        })
      },
    }
  }
</script>
<style lang="scss" scoped>
  .review-textarea {
    margin: 10px 15px;
    border: 1px solid #eee;
    border-radius: 4px;
  }
  .review-textarea:before{
    left: 0;
    border:0px;
  }

  .btn-box {
    padding: 20px;
  }

  .info-plan {
    padding: 0 16px 16px;
    background: #fff;
    font-size: 14px;
  }

  .info-plan > div {
    background: $planBgColor;
    padding: 10px;
    border-radius: 3px;
  }

  .info-title {
    color: #bbb;
    margin-right: 10px;
  }

  .content-text {
    padding: 15px 15px 30px 15px;
    font-size: 14px;
    color: #333;
  }

  .doctor-review {
    background: #fff;
    color: #333;
    border-bottom: 1px solid #FFFFFF;
    height: 6.2rem;
    padding: 16px 16px 5px 16px;
  }

  .doctor-review .doctor-info-text1 {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
  }

  .review-disease-title {
    color: #999999;
    font-size: 15px;
  }

  .review-disease-titlecton {
    color: #666;
  }

  .review-content {
    padding: 5px 16px 16px;
    color: #333;
    min-height: 5rem;
  }

  .review-disease-gruoup .weui-cell {
    border-bottom: 1px solid #F4F4F4;
  }

  .review-disease-gruoup .weui-cell:before {
    border-top: 1px solid #fff;
  }
  .review-star span{
    padding:2px;
  }
</style>
