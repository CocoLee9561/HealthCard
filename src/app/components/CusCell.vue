<template>

  <cell class="own-cell" :title="title" :value="value" :is-link="isLink">
    <slot slot="title" name="title"></slot>
    <span v-if="!value" class="vux-cell-placeholder">{{placeHolder}}</span>
    <slot></slot>
  </cell>

</template>
<script>

  export default {
    props:{
      placeHolder:{
        default:''
      },
      title:{
        default:''
      },
      value:{
        default:''
      },
      isLink:{
        default:true
      }
    },
    computed: {
    },
    created() {

    },
    data() {
      return {}
    },
    methods: {
    }
  }
</script>
<style scoped lang="scss">
  .place-holder{
    color: $placeHolderColor;
  }
</style>
