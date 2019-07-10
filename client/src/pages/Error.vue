<template lang="pug">
  .page-not-found
    p.page-not-found__title Page not found
    router-link.page-not-found__to-main(to="/") To main page
</template>

<script>
export default {

}
</script>

<style lang="stylus">
.page-not-found
  flex-direction column
  display flex
  background $blue
  height 100vh
  width 100%
  align-items center
  justify-content center
  &__title, &__to-main
    color $light
    font-size 2.5rem
    font-family 'lobster'
  &__to-main
    margin-top 20px
    font-size 1rem
</style>
