<template lang="pug">
section.header
  .container
    .header-content
      router-link.logo(to="/") Friend
      span.login(
                @click="settings"
                :style="[hideHover ? {background: '#477dbd'} : null]"
                ) {{ userName}}
        span(:class="[showSettings ? 'icon-arrow_up' : 'icon-arrow_down']")
        transition(name="fade")
          .user-settings(
                         v-if="showSettings"
                         v-on-clickaway="settings"
                         @mouseover="hideHover = !hideHover"
                         @mouseout="hideHover = !hideHover"
                         )
            span.logOut(@click="logOut") logout
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
export default {
  mixins: [ clickaway ],
  data() {
    return {
      showSettings: false,
      hideHover: false
    }
  },
  computed: {
    userName() {
      return localStorage.getItem('name')
    }
  },
  methods: {
    settings() {
      this.showSettings = !this.showSettings 
    },
    logOut() {
      this.$store.commit('auth/clearStorage')
      this.$store.dispatch('clearStore')
      this.$router.push('/auth')
    },
  }
}
</script>

<style lang="stylus">
.logo
  display none
  +sm()
    font-size 1.4rem
    display block
    transition .2s
    padding 0 10px
    font-family 'lobster'
    color $light
    height $height-header
    line-height $height-header
.login
  position relative
  padding 0 10px
  cursor pointer
  transition 0.2s
  color $light
  font-size .8rem
  font-weight bold
  display flex
  line-height $height-header
  height $height-header
  &:hover
    +sm()
      transition 0.2s
      background-color $hover-blue
  .icon-arrow_up, .icon-arrow_down
    margin-left 4px
    height 100%
    line-height $height-header
    color $light
.header
  z-index 100
  height $height-header
  background-color $blue
  position fixed
  width 100%
.header-content
  display flex
  align-items center
  justify-content flex-end
  position relative
  +sm()
    justify-content space-between
.user-settings:after,
.user-settings:before
   content ''
   border solid transparent
   position absolute
   margin-left -12px
   top -10px
.user-settings:before
   right 4px
   border-bottom-color #285488
   border-width 5px
.user-settings:after
   border-bottom-color $light
   border-width 4px
   top -8px
   right 5px
.user-settings
  font-weight normal
  font-size 1rem
  right 0
  z-index 10
  color $light
  position absolute
  padding 4px 0
  width 110px
  background-color $light
  border 1px solid $blue
  top $height-header + 5px
  border-radius 2px
.logOut
  padding 2px 0
  padding-left 10px
  transition .2s
  color $blue
  cursor pointer
  display block
  line-height normal
  &:hover
    background-color $blue
    color $light
    transition .2s
.fade-enter-active, .fade-leave-active
  transition opacity .1s
.fade-enter, .fade-leave-to
  opacity 0
</style>
