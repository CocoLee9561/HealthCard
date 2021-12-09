<template>
  <div class="empty_page">
    <div class="empty_icon">
      <img src="@icon/information@2x.png">
      <div>{{message}}</div>
    </div>
    <div class="empty-content">
      <slot></slot>
    </div>
  </div>
</template>
<script>

  export default {
    computed: {
    },
    created() {

    },
    props:{
      message:{
        default:'暂无内容'
      }
    },
    data() {
      return {}
    },
    methods: {
    }
  }
</script>
<style scoped lang="scss">
  .empty_page{
    height: 100%;
    width: 100%;
    color: $subtitle-color;
    flex-direction: column;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    position: absolute;
    top:0;
    pointer-events: none;
    & > .empty_icon{
      margin-top: -30px;
      text-align: center;
      img{
        width: 100px;
      }
    }
    .empty-content{
      pointer-events: auto;
    }
  }
</style>
