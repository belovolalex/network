<template lang="pug">
  .menu-mobile
    router-link.menu-el(
                    v-for="(item, idx) in list"
                    :key="idx"
                    :to="item.url"
                    @click.native="clickToLink(item.url)"
                    )
      span.menu-el__icon(:class="item.icon")
      span.menu-el__mob-counter(v-if="item.url === '/friends' && user.counterWhoAddingMe > 0") {{ user.counterWhoAddingMe }}
      span.menu-el__mob-counter(v-if="item.url === '/messages' && user.counterUnreadMsgs > 0") {{ user.counterUnreadMsgs }}
</template>

<script>
import {mapState} from 'vuex'
export default {
  computed: {
    ...mapState('menu', [ 'list' ]),
    ...mapState('home', [ 'user' ])
  },
  methods: {
    clickToLink(url) {
      if(url === '/friends') {
        this.$store.commit('friends/changeActiveTab', 'FriendsFriends')
      }
      if(url === '/messages') {
        this.$store.commit('messages/changeStateDialogWindow', false)
        this.$store.commit('messages/changeStateRotate', false)
      }
      
    }
  }
}
</script>

<style lang="stylus">
.menu-mobile
  position fixed
  z-index 999
  display flex
  flex-direction row
  transition 0.1s
  top 0
  +sm()
    display none
  .menu-el
    position relative
    display flex
    align-items center
    justify-content center
    height $height-header
    width 50px
    padding 5px
    &:hover
      background-color $blue
      transition 0.1s
    +xs()
      width $height-header
    &__icon
      color white !important
      opacity 0.7
      margin 0 7px
    &__mob-counter
      opacity .7
      background white
      font-size .6rem
      width 16px
      height 16px
      border-radius 50%
      text-align center
      line-height 16px
      position absolute
      right 0
      top 50%
      transform translateY(-50%)
      color $blue
  span.menu-el__icon.icon-bubbles2
    font-size 0.8rem
</style>
