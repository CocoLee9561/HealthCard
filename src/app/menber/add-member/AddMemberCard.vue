<template>
  <div class="page">
    <view-box>
      <x-header slot="header">绑定住院信息</x-header>
      <div>
        <group :gutter="0">
            <x-input :show-clear="false" type="text" :title="cardName"
                       @on-change="cardNoInputChange"
                       :placeholder="'请输入'+cardName" v-model="cardno">
            </x-input>
            <x-input :show-clear="false" type="text" title="姓名" label-width="4em"
                       @on-change="nameInputChange"
                       placeholder="请输入姓名" v-model="realname">
            </x-input>
            <x-input :show-clear="false" type="text" title="身份证"
                       @on-change="cardNumberInputChange"
                       placeholder="请输入身份证" v-model="cid">
            </x-input>
            <x-input :show-clear="false" type="text" title="手机号" label-width="4em"
                       @on-change="phoneValid"
                       placeholder="请输入手机号" v-model="phone">
            </x-input>
        </group>
        <!-- <div class="tip-text">
            <span class="tip-title">温馨提示</span>
            <span>输入的【姓名】和【手机号】必须和住院登记处预留的个人信息完全一致，才能绑定成功。</span>
        </div> -->
        <div class="hint-text" v-html="hintText">
              
        </div>
        <div style="width: 100%;box-sizing: border-box;padding: 20px;">
            <x-button type="primary" size="large" @click.native="addMemberCard()"
                    class="own-btn">确认绑定
            </x-button>
        </div>
      </div>
    </view-box>
</div>
</template>

<script>
import { mapState,mapActions } from 'vuex'
export default {
    computed: {
        ...mapState({
            hospitalInfo: state => state.hospital.current,
            hintText:state=>state.hintText,
        }),
        funKey:function(){
            return this.$routeData.funKey
        },
        cardType:function(){
            let cardType = this.$routeData.cardType
            if(!cardType){
              cardType=5
            }
            return cardType
        },
        cardName:function(){
            let cardName = this.$routeData.cardName
            if(!cardName){
              cardName='住院号'
            }
            return cardName
        },
        canAddMemberCard(){
            let canAdd = false
            if(this.cid.length!=15&&this.cid.length!=18){
                canAdd=true
            }
            if(!this.realname){
                canAdd = true
            }
            if(!this.cardno){
                canAdd = true
            }
            return canAdd
        }
    },
    mounted() {
        
    },
    created() {
      this.loadHintText({//成年人
        hospitalcode:this.hospitalInfo.hospitalcode,
        funcode:this.funKey,
        type: 2,
      }).then((res)=>{
      })
    },
    data() {
      return {
          relation:'',
          realname:'',
          cid:'',
          cardno:'',
          hospitalcode:'',
          hospitalname:'',
          busi:'',
          phone:''
      }
    },
    methods: {
      ...mapActions(["saverelativeext","loadHintText"]),
      addMemberCard(){
        let params = {
            relation:this.relation,
            realname:this.realname,
            cid:this.cid,
            cardtype:this.cardType,
            cardno:this.cardno,
            hospitalcode:this.hospitalInfo.hospitalcode,
            hospitalname:this.hospitalInfo.hospitalname,
            busi:this.funKey,
            mobile:this.phone
        }
        this.saverelativeext(params).then((res)=>{
            this.$store.commit("selectMember", {
                riid:res.riid,
                realname:res.realname,
                cid:res.cid
            });
            this.$store.commit('updateCardIsNewPage', true);
            this.$store.commit('selectCard',{
                funKey:this.funKey,
                card:{
                    cardno:res.cardno,
                    cardtype:res.cardtype,
                    cardname:this.cardName,
                    riid:res.riid
                }
            })
            this.toNext()
        })
      },
      toNext(){
          let nextRoute = this.$routeData.to;
            if(nextRoute){
            if(typeof(nextRoute)=='number'){
              if(this.isChangePatient==1){
                sessionStorage.setItem('updateChangePatient',0)
                shareInst.client.replaceWithData(nextRoute-1)
              }else{
                sessionStorage.setItem('updateChangePatient',0)
                shareInst.client.replaceWithData(nextRoute)
              }
            }else{
              sessionStorage.setItem('updateChangePatient',0)
              this.$store.commit('updateTabSelected',0)
              shareInst.client.replace(nextRoute)
            }
          }else{
            shareInst.client.back();
          }
      },
      phoneValid(){
        this.$nextTick((res)=>{
          if(this.phone.length>11){
            this.phone = this.phone.substring(0,11);
          }
          this.phone=this.phone.replace(/[^\d]/g,'')
        })
      },
      cardNoInputChange(){
        this.$nextTick(()=>{
            if(this.cardno.length>20){
              this.cardno = this.cardno.substring(0,20)
            }
            this.cardno=this.cardno.replace(/[^0-9a-zA-Z]/g,"");
        })
      },
      nameInputChange() {
        this.$nextTick(() => {
          if (this.realname.length > 20) {
            this.realname = this.realname.substring(0, 20)
          }
          this.realname = this.realname.replace(/[^\u4E00-\u9FA5a-zA-Z]/g, '')
        })
      },
      cardNumberInputChange() {
        this.$nextTick(() => {
            if (this.cid.length > 18) {
              this.cid = this.cid.substring(0, 18);
            }
            this.cid = this.cid.replace(/[^(^\d{15})|(^\d{18})|(^\d{17}(\d|X|x)$)]/, '')
        })
      },
    }
}
</script>

<style lang="scss" scoped>
.hint-text{
    padding: 16px 16px;
    font-size: 14px;
  }
    .tip-text{
        font-size: 14px;
        padding: 10px 16px;
        color: #999;
        .tip-title{
            color: $main-color;
        }
    }
</style>