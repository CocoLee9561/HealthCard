<template>
  <div class="page">
    <view-box>
      <x-header slot="header">评论详情</x-header>
      <div>
        <div class="doctor-info-bar doctor-review">
          <img :src="doctorInfo.doctorphoto">
          <div class="doctor-info">
            <strong>{{ doctorInfo.doctorname }}</strong><span class="doctor-info-jobtitle">{{ doctorInfo.doctorrank
            }}</span>
            <div class="doctor-info-text">{{doctorInfo.departmentname}}</div>
            <div class="doctor-info-text">{{doctorInfo.hospitalname}}</div>
          </div>
        </div>
        <div class="info-plan">
          <div>
            <div>
              <span class="info-title">姓名 </span>
              <span>{{reviewItem.realname}}</span>
            </div>
            <div>
              <span class="info-title">时间 </span>
              <span>{{reviewItem.reviewtime}}</span>
            </div>
          </div>
        </div>
        <group class="review-disease-gruoup">
          <cell>
            <span slot="title" class="review-disease-title">所患疾病</span>
            <span class="review-disease-title review-disease-titlecton">{{reviewItem.disease}}</span>
          </cell>
          <div class="review-content">
            {{reviewItem.content}}
          </div>
        </group>
        <group class="review-disease-gruoup">
          <cell title="服务态度">
            <!--<rater star="☻" v-model="reviewItem.uservicevaluation"></rater>-->
            <span class="review-star">
              <!--<img src="../../../../common/assets/icon/smile-green-small@2x.png" width="20"/>-->
              <!--<img src="../../../../common/assets/icon/smile-green-small@2x.png" width="20"/>-->
              <!--<img src="../../../../common/assets/icon/smile-gray-small@2x.png" width="20"/>-->
              <!--<img src="../../../../common/assets/icon/smile-gray-small@2x.png" width="20"/>-->
              <!--<img src="../../../../common/assets/icon/smile-gray-small@2x.png" width="20"/>-->
              <span v-for="index in 5">
                <img v-if="reviewItem.uservicevaluation>=index" src="@icon/smile-green-small@2x.png" width="20"/>
                <img src="@icon/smile-gray-small@2x.png" v-else width="20"/>
              </span>
            </span>
          </cell>
          <cell title="治疗效果">
            <!--<rater v-model="reviewItem.utreatmentevaluation"></rater>-->
            <span class="review-star">
              <!--<img src="../../../../common/assets/icon/good-green-small@2x.png" width="20"/>-->
              <!--<img src="../../../../common/assets/icon/good-green-small@2x.png" width="20"/>-->
              <!--<img src="../../../../common/assets/icon/good-green-small@2x.png" width="20"/>-->
              <!--<img src="../../../../common/assets/icon/good-gray-small@2x.png" width="20"/>-->
              <!--<img src="../../../../common/assets/icon/good-gray-small@2x.png" width="20"/>-->
              <span v-for="index in 5">
                  <img v-if="reviewItem.utreatmentevaluation>=index" src="@icon/good-green-small@2x.png" width="20"/>
                  <img v-else src="@icon/good-gray-small@2x.png" width="20"/>
                </span>
            </span>
          </cell>

        </group>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import {Rater} from 'vux'

  export default {
    components: {
      Rater
    },
    computed: {
      ...mapState(["reviewDetail", "reviewItem", "doctorInfo"]),
    },
    created() {

    },
    data() {
      return {}
    },
    methods: {
      ...mapActions([""]),
    }
  }
</script>
<style scoped>
  .info-plan {
    padding: 0 16px 16px;
    background: #fff;
    font-size: 14px;
  }

  .info-plan > div {
    background: #F3F6FC;
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
    width:70px;
    display: inline-block;
  }

  .review-disease-titlecton {
    color: #666;
    display: inline-block;
    /*width:17rem;*/
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 14rem;
    vertical-align: middle;
  }

  .review-content {
    padding: 5px 16px 16px;
    color: #333;
    min-height: 5rem;
    word-break: break-all;
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
