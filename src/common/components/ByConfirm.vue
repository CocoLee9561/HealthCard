<template >
  <confirm v-bind="$attrs" v-if="$router.navInfo.type != 'back'" v-on="$listeners">
    <slot></slot>
  </confirm>
</template>

<script>

  import {Confirm} from 'vux'

  export default {
    name: "ByConfirm",
    components:{Confirm}
  }
</script>

<style scoped>

</style>
