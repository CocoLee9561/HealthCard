<template>
  <div class="page">
    <view-box>
      <x-header slot="header">评论</x-header>
      <div @scroll="onScroll($event)" class="wraper">
        <!--<div class="doctor-info-bar">
          <img :src="doctorInfo.doctorphoto">
          <div class="doctor-info">
            <strong>{{ doctorInfo.doctorname }}</strong><span class="doctor-info-jobtitle">{{ doctorInfo.doctorrank }}</span>
            <div class="doctor-info-text">{{doctorInfo.departmentname}}</div>
            <div class="doctor-info-text">{{doctorInfo.hospitalname}}</div>
          </div>
        </div>-->
        <div class="doctor-info-bar doctor-review">
          <img v-if="doctorInfo.doctorphoto" :src="doctorInfo.doctorphoto">
          <img v-else src="@icon/my/ic_avatar@2x.png">
          <div class="doctor-info">
            <strong>{{ doctorInfo.doctorname }}</strong>
            <div class="doctor-info-text1"><span class="doctor-info-job">{{doctorInfo.doctorrank}}</span>
              <span>{{doctorInfo.departmentname}}</span></div>
            <div class="doctor-info-text1">{{doctorInfo.hospitalname}}</div>
          </div>
        </div>
        <div class="doctor_remake_content">
          <div style="display:flex;justify-content:flex-start;overflow:auto;">
            <div class="doctor_info_header_item">
              <div class="header-scope-bar">
                <span>服务态度</span>
                <span class="scope-text ">{{ score.servicevalper}}</span>

              </div>

              <span class="review-star">
                <span v-for="index in 5">
                  <img v-if="reviewDetail.servicevaluation>=index" src="@icon/smile-green-small@2x.png" width="20"/>
                  <img v-else src="@icon/smile-gray-small@2x.png" width="20"/>
                </span>
              </span>
            </div>
            <div class="doctor_info_header_item">
              <div class="header-scope-bar">
                <span>治疗效果</span>
                <span class="scope-text">{{ score.treatmentevalper}}</span>
              </div>
              <span class="review-star">
                <span v-for="index in 5">
                  <img v-if="reviewDetail.treatmentevaluation>=index" src="@icon/good-green-small@2x.png" width="20"/>
                  <img v-else src="@icon/good-gray-small@2x.png" width="20"/>
                </span>
              </span>
            </div>
          </div>
        </div>

        <div class="review-list-wrap" v-if="reviewList.length>0">
          <div v-for="(item,index) in reviewList" :key="index" @click="goDetail(item)" class="review-list-group">
            <div class="doctor-review-star-bar">
              <img v-if="item.headshoturl" :src="item.headshoturl" alt="" slot="icon" width="30" class="review-list-headshoturl">
              <span slot="title">
                <span class="realname">{{item.realname.length>0?item.realname.substring(0,1):item.realname}}**</span>
                <span class="disease">{{item.disease}}</span>
              </span>
              <span class="review-list-rater review-star">
                <span v-for="index in 5">
                  <img v-if="item.userevaluation>=index" src="@icon/stars-yellow.png" width="14"/>
                  <img v-else src="@icon/stars-gray.png" width="14"/>
                </span>
              </span>

            </div>
            <div class="doctor-info-review-item-content">
              {{item.content}}
            </div>
            <div class="doctor-info-review-item-time">{{item.reviewtime}}</div>
          </div>

        </div>
        <div v-else class="vux-center" style="height: 200px;color: #333;">
          暂无评论信息
        </div>
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
      ...mapState({
        hospitalInfo: state => state.hospital.current,
        departmentInfo: state => state.selectedDepartment,
        doctorInfo: state => state.doctorInfo,
        reviewList: state => state.reviewList,
        reviewDetail: state => state.reviewDetail
      }),
      isUse: function () {
        return this.$routeData.isUse
      },
      countofreview: function () {
        return this.$routeData.countofreview
      },
      doctorId: function () {
        return this.$routeData.doctorId
      }
    },
    created() {
      this.regreviewlist()
    },
    data() {
      return {
        next: true,
        query: {
          page: 1,
          rows: 10
        },
        score: {
          servicevalper: 0,
          treatmentevalper: 0
        }
      }
    },
    methods: {
      ...mapActions(["regReviewList"]),
      regreviewlist() {
        this.regReviewList({
          doctorid: this.doctorId,
          isuse: this.isUse,
          page: this.query.page,
          rows: this.query.rows
        }).then((res) => {
          if (JSON.stringify(res) !== '{}') {
            if(res.appraislist.length==0){
              this.next=false
            }
            this.score.treatmentevalper = res.treatmentevalper||0;
            this.score.servicevalper = res.servicevalper||0;
//            this.attitudeScore = Array.apply(null, Array(5)).map((item, i) => {
//              if (i < parseInt(res.servicevaluation)) {
//                return 1;
//              } else {
//                return 0;
//              }
//            })
//            this.effectScore = Array.apply(null, Array(5)).map((item, i) => {
//              if (i <= parseInt(res.treatmentevaluation)) {
//                return 1;
//              } else {
//                return 0
//              }
//            })
          }else{
            this.next=false
          }

        })
      },
      onScroll() {
        let offsetHeight = event.currentTarget.offsetHeight,
          scrollHeight = event.target.scrollHeight,
          scrollTop = event.target.scrollTop,
          scrollBottom = offsetHeight + scrollTop
        if (scrollBottom === scrollHeight || scrollBottom === scrollHeight + 2) {
          if (!this.next) return;
          this.query.page += 1

          this.regreviewlist()
        }
      },
      goDetail(item) {

        try {
          this.$store.commit('updateReviewItem', item);
        } catch (error) {
          console.log(error)
        }
        shareInst.client.push({
          path: '/reviewDetail'
        })
      }
    }
  }
</script>
<style scoped>
  .doctor_remake_content {
    background: #fff;
  }

  .doctor_info_header_item {
    /*display: flex;*/
    justify-content: space-around;
    width: 50%;
    border-right: 1px solid #eee;
    height: 85px;
  }

  .doctor_info_overflow {
    max-height: 95px;
    overflow: auto;
  }

  .img-view {
    height: 1.125rem;
    width: 1.125rem;
    float: left;
    margin-right: 5px;
    margin-top: 3px;
  }

  .img-view img {
    width: 100%;
    height: 100%;
  }

  .disease {
    margin-left: 5px;
    color: #BBC9DF;
    font-size: 0.875rem;
    width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: break-word;
    display: inline-block;
    vertical-align: middle;
  }

  .doctor-review-list-item {
    background: #fff;
    margin-top: 10px;
    display: flow-root;
  }

  .doctor-review-list-item:active {
    background: #f5f5f5;
  }

  .doctor-review-star-bar {
    padding: 10px 16px 5px;

  }

  .head-icon {
    width: 20px;
    height: 20px;
    border-radius: 10px;
    float: left;
    vertical-align: middle;
  }

  .star {
    float: right;
    vertical-align: middle;
  }

  .star img {
    width: 16px;
    height: 16px;
  }

  .doctor-info-review-item-content {
    text-align: left;
    padding: 0px 16px;
    font-size: 14px;
    word-break: break-all;
  }

  .doctor-info-review-item-time {
    padding: 10px 16px;
    font-size: 12px;
    color: #ccc;
    text-align: right;
  }

  .scope-text {
    font-size: 15px;
    color: #0fd586;
    float: right;
  }

  .star-bar {
    width: 100%;
  }

  .review-star {
    margin-left: 14px;
  }

  .header-scope-bar {
    padding: 15px 16px 5px 16px;
  }

  .doctor-review {
    background: #fff;
    color: #333;
    border-bottom: 1px solid #F4F4F4;
    height: 6.5rem;
    padding: 16px;
  }

  .doctor-review .doctor-info-text1 {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
  }

  .realname {
    margin-left: 10px;
    color: #333;
    font-size: 0.875rem;
  }

  .review-list-wrap {
    margin-top: 20px;
  }

  .review-list-group {
    background: #fff;
    border-bottom: 2px solid #F4F4F4;
  }

  .review-list-headshoturl {
    border-radius: 50%;
    vertical-align: middle;
  }

  .review-list-rater {
    float: right;
  }
  .review-star span{
    padding:2px;
  }
</style>
