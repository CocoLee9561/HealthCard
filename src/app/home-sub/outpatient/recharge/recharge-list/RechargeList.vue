<template>
  <div class="page">
    <view-box>
      <x-header slot="header">充值记录</x-header>
      <div>
        <div v-if="rechargeList.length>0" class="wraper animated fadeIn" @scroll="onScroll($event)">
          <div v-for="(item,index) in rechargeList" :key="index" class="line-bottom" style="background:#fff;padding: 10px 16px;"
               @click="result(item)">
            <div class="arrow-right" style="float: right;height: 45px;"></div>
            <div class="records_item">
              <span class="status" :class="{'error':item.bsState==1}">{{item.bsState == 1 ? "充值成功" : "充值失败"}}</span>
              <span class="money">￥{{item.bsAmount}}</span>
            </div>
            <div class="records_item">
              <span style="color:#999;">{{item.bsLastTime}}</span>
            </div>
          </div>
        </div>
        <div v-if="rechargeList.length==0">
          <div class="vux-center" style="height:500px">
            <div style="text-align:center;">
              <img src="@icon/icon_deal.png" width="50%" alt>
              <div style="color:#999999">无充值记录</div>
            </div>
          </div>
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    computed: {
      ...mapState({
        rechargeList: state => state.rechargeList,
        hospitalInfo: state => state.hospital.current,
      }),
      selectedCard: function () {
        return this.$store.state.selectedCards[this.$routeData.funKey];
      },
      funKey:function(){
        return this.$routeData.funKey
      },
    },
    created() {
      this.getrechargelist();
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
      ...mapActions(["getRechargeList"]),
      result(item) {
        shareInst.client.push({
          path: '/rechargeDetail',
          query: {
            orderno: item.bsOrderNo,
            pkreghospital: this.hospitalInfo.pkregHospitalId
          }
        })
      },
      getrechargelist() {
        let params = {
          medicalnum: this.selectedCard.cardno,
          pkreghospital: this.hospitalInfo.pkregHospitalId
        }
        Object.assign(params, this.query)
        this.getRechargeList(params).then((res) => {
          if (res.rechargeList == null || this.rechargeList.length == 0) {
            this.next = false
          } else {
            this.next = true
          }
        });
      },
      onScroll(event) {
        let offsetHeight = event.currentTarget.offsetHeight,
          scrollHeight = event.target.scrollHeight,
          scrollTop = event.target.scrollTop,
          scrollBottom = offsetHeight + scrollTop
        if (scrollBottom === scrollHeight || scrollBottom === scrollHeight + 2) {
          if (this.next == false) return
          this.page += 1
          this.getrechargelist()
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .records_item{
    .status{
      margin-right: 10px;

    }
    .error{

    }
    .money{

    }
  }
</style>
