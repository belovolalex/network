<template lang="pug">
  .layout
    header-comp
    section.wrap-layout-content
      .container
        .layout-content
          .wrap-menu-mobile
            menu-mobile
          .sidebar
            menu-desktop
          .main-content
            component(:is="currentContent")

</template>

<script>
import Messages from '../pages/Messages'
import Home from '../pages/Home'
import Friends from '../pages/Friends'
import HeaderComp from '../pages/HeaderComp'
import MenuDesktop from '../pages/MenuDesktop'
import MenuMobile from '../pages/MenuMobile'
import User from '../pages/User'
export default {
  components: {
    HeaderComp,
    MenuDesktop,
    MenuMobile,
    Home,
    Messages,
    Friends,
    User
  },
  computed: {
    currentContent() {
      return (this.$route.name)
    }
  }
}
</script>

<style lang="stylus">
  .wrap-layout-content
    padding-top $height-header
  .layout-content
    display flex
    flex-direction column
    +sm()
      flex-direction row
  .wrap-menu-mobile
    +sm()
      display none
  .sidebar
    display none
    +sm()
      display block
      padding-top 10px
      width 200px
      min-height "calc(100vh - %s)" % $height-header
      height 100%
      position fixed
  .main-content
    padding-top 10px
    min-height "calc(100vh - %s)" % $height-header
    height 100%
    font-size 0.9rem
    width 100%
    +sm()
      width calc(100% - 210px)
      margin-left 210px
</style>
