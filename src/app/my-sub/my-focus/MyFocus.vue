<template>
  <div class="page">
    <view-box>
      <x-header slot="header">我的关注</x-header>
      <div class="my-focus" v-if="collectionList.length>0">
        <div class="doctor-info-bar" v-for="item in collectionList" @click="toDoctorInfo(item)">
          <img :src="item.doctorphoto">
          <div class="doctor-info">
            <strong>{{ item.doctorname }}</strong><span class="doctor-info-jobtitle">{{ item.doctorrank }}</span>
            <div class="doctor-info-text">{{item.departmentname}}</div>
            <div class="doctor-info-text">{{item.hospitalname}}</div>
          </div>
        </div>
      </div>
      <div v-else class="vux-center empty-page">暂无关注</div>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    computed: {
      ...mapState(["collectionList"]),
    },
    created() {
      this.loadCollectionList()
    },
    data() {
      return {
        query: {
          page: 1,
          rows: 10
        },
        next: true
      }
    },
    methods: {
      ...mapActions(["getCollectionList"]),
      onScroll(event) {
        let offsetHeight = event.currentTarget.offsetHeight,
          scrollHeight = event.target.scrollHeight,
          scrollTop = event.target.scrollTop,
          scrollBottom = offsetHeight + scrollTop
        if (scrollBottom === scrollHeight || scrollBottom === scrollHeight + 2) {
          if (this.next == false) return
          this.data.page += 1
          this.loadCollectionList()
        }
      },
      loadCollectionList() {

        this.getCollectionList(this.query).then((res) => {
          if (res.status == 0) {
            if (res.data.length == 0) return this.next = false
          }
        })
      },
      toDoctorInfo(item) {
        shareInst.client.push({
          path: '/doctorInfo',
          query: {
            bookType: item.regtype,
            doctorId: item.doctorid,
            departmentId: item.departmentid,
            regtype: item.regtype,
            routeName: 'myFouce',
            isFirstPatient: 0,
            funKey: item.regtype==0?'YYGH':'DRGH'
          }
        })
      }
    }
  }
</script>
<style>
  .my-focus .doctor-info-bar {
    border-bottom: 1px solid #DADADA;
    line-height: 1.8;
    height: 100px;
    background: #fff;
    padding: 10px;
    color: #333;
  }

  .doctor-info-bar img {
    position: relative;
    top: 5px;
  }
</style>
