<template lang="pug">
  #app
    component(:is="layout")
</template>

<script>
import DefaultLayout from './layouts/DefaultLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('home', [ 'user' ]),
    layout() {
      return (this.$route.meta.layout || 'DefaultLayout')
    }
  },
  components: {
    DefaultLayout,
    AuthLayout,
  }
}
</script>

<style lang="stylus">
body
  overflow-y scroll !important
  margin 0
</style>
