<template lang="pug">
  component(:is="currentContent")
</template>

<script>
import Auth from '../pages/Auth'
import Error from '../pages/Error'
export default {
  components: {
    Auth,
    Error
  },
  computed: {
    currentContent() {
      return (this.$route.name)
    }
  }
}
</script>

<style>

</style>
