<template >
  <alert v-bind="$attrs" v-if="$router.navInfo.type != 'back'" v-on="$listeners">
    <slot></slot>
  </alert>
</template>

<script>

  import {Alert} from 'vux'

  export default {
    name: "ByAlert",
    components:{Alert}
  }
</script>

<style scoped>

</style>
