<template>
  <div id="copyright" class="copyright" :class="{bottom:isBottom}">
    Copyright©2015-2018深圳市巨鼎医疗设备有限公司
  </div>
</template>
<script>

  export default {
    computed: {},
    provide(){
      return {
        resetCopyright: this.resetCopyright
      }
    },
    mounted(){
      this.resetCopyright()

      let parent = document.getElementById('copyright').parentNode
      parent.addEventListener('resize',()=>{
        console.log('resize')
        this.resetCopyright()
      })
    },
    created() {

    },
    data() {
      return {
        isBottom:false
      }
    },
    methods: {
      resetCopyright(){
        this.$nextTick((res)=>{
//          let node = document.getElementById('copyright');
//          let parent = document.getElementById('copyright').parentNode
//          let offsetHeight = parent.offsetHeight;
//          let scrollHeight = parent.scrollHeight;
//
//          let bottom = node.offsetTop+node.offsetHeight;
//          if(offsetHeight>bottom){
//            this.isBottom=true
//          }else{
//            this.isBottom=false
//          }
//          this.isBottom=!this.parentCanScoll();
        })
      },
      parentCanScoll(){
        let node = document.getElementById('copyright');
        let parent = document.getElementById('copyright').parentNode
        let nodeHeight = node.offsetHeight
        let offsetHeight = parent.offsetHeight;
        let scrollHeight = parent.scrollHeight;
        if(this.isBottom){
          scrollHeight+=nodeHeight
        }
        return offsetHeight<scrollHeight
      }
    }
  }
</script>
<style lang="scss" scoped>
  .copyright {
    color: #BBBBBB;
    text-align: center;
    padding: 10px 16px;
    width: 100%;
    font-size: 12px;
    box-sizing: border-box;
  }

  .bottom {
    /*position: absolute;*/
    /*bottom: 0px;*/
  }
</style>
