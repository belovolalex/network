<template lang="pug">
  component(:is="currentContent")
</template>

<script>
import Auth from '../components/Auth'
import Error from '../components/Error'
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
