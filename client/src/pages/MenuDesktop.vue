<template lang="pug">
  .menu-desktop
    router-link.menu-el(
                    v-for="(item, idx) in list"
                    :key="idx"
                    :to="item.url"
                    @click.native="clickToLink(item.url)"
                    )
      span.menu-el__icon(:class="item.icon")
      span.menu-el__title {{ item.title }}
      span.menu-el__counter(v-if="item.url === '/friends' && user.counterWhoAddingMe > 0") {{ user.counterWhoAddingMe }}
      span.menu-el__counter(v-if="item.url === '/messages' && user.counterUnreadMsgs > 0") {{ user.counterUnreadMsgs }}
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
.menu-desktop
  display none
  +sm()
    display flex
    flex-direction column
    transition 0.1s
.menu-el:hover
  background-color $light-blue
  transition 0.1s
.menu-el
  border-radius 2px
  max-width 200px
  padding 5px
  &__title
    padding 2px
  &__icon
    opacity 0.7
    margin 0 7px
  &__counter
    border-radius 10px
    background $light-grey
    font-family lobster
    width 30px
    display inline-block
    text-align center
    font-size .8rem
    color $blue
span.menu-el__icon.icon-bubbles2
  font-size 0.8rem
</style>
