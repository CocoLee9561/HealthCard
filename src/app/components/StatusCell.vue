<template>
  <group :gutter="0" class="status-group">
    <cell :class="{success:status=='success',error:status=='error',tip:status=='tip'}"
          class="status-cell" :title="title" :is-link="isLink" :primary="primary" :inline-desc="inlineDesc" :is-loading="isLoading"
          :value-align="valueAlign" :border-intent="borderIntent" :arrow-direction="arrowDirection" :disabled="disabled" :align-items="alignItems">
      <span v-if="showIcon" slot="icon" class="status-cell-icon">
        <img v-if="status=='error'||code==2" src="@icon/status/icon_wrong.png">
        <img v-else-if="status=='prompt'" src="@icon/status/icon_prompt.png">
        <img v-else-if="status=='hint'||code==1" src="@icon/status/icon_hint.png">
        <img v-else-if="status=='success'||code==0" src="@icon/status/icon_pass.png">
      </span>

      <slot slot="title" name="title"></slot>
      <slot slot="after-title" name="after-title"></slot>
      <slot slot="child" name="child"></slot>
      <slot slot="inline-desc" name="inline-desc"></slot>
      <div>
        <slot name="value"></slot>
        <slot></slot>
      </div>
    </cell>
  </group>
</template>
<script>

  export default {
    computed: {},
    props:{
      code:{
        default:''
      },
      showIcon:{
        default:true
      },
      status:{
        default:''
      },
      title:'',
      isLink:{
        default:false
      },
      primary:{
        default:'title'
      },
      inlineDesc:'',
      isLoading:{
        default:false
      },
      valueAlign:{
        default:'right'
      },
      borderIntent:{
        default:true
      },
      arrowDirection:'',
      disabled:{
        default:false
      },
      alignItems:{
        default:'center'
      }
    },
    created() {

    },
    data() {
      return {}
    },
    methods: {}
  }
</script>
<style lang="scss">
  .status-group{
    .status-cell {
      padding: 10px 16px;
      .weui-cell__hd{
        .status-cell-icon {
          img {
            width: 17px;
            height: 17px;
            vertical-align: middle;
            margin-right: 5px;
          }
        }
      }
      .vux-cell-bd{
        font-weight: 600;
      }

    }
    .success{
      .weui-cell__ft{
        font-weight: 600;
        color: #12ce8a;
      }
    }
    .error{
      .weui-cell__ft {
        font-weight: 600;
        color: #ff4949;
      }
    }
    .tip{
      .weui-cell__ft {
        color: $fontColor;
        font-weight: 600;
      }
    }
  }
</style>
