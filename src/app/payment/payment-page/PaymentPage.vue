<template>
  <div>

  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    computed: {
      ...mapState([]),
    },
    mounted() {
      shareInst.client.continuePay()
    },
    created() {

    },
    data() {
      return {}
    },
    methods: {
      ...mapActions([""]),
    }
  }
</script>
<style>

</style>
