<template lang="pug">
  section.msgs(ref="msgs")
    messages-dialog-window(v-if="stateDialogWindow")
    .wrap-msgs(v-else)
      .add-dialog(
                  @click="showFriends"
                  @mouseover="showTooltip = true"
                  @mouseleave="showTooltip = false"
                  )
        transition(name="fade")
          .add-dialog__tooltip(
                              v-if="showTooltip"
                              ) {{ textTooltip }}
        .add-dialog__plus(
                          :class="[stateRotate ? 'rotate-plus' : null]"
                          ) +
      input.msgs-header(type="text" ref="header")
      .spinner.spinner--msgs(v-if="spinnerLastMsgs")
      .msgs-friends(v-if="stateRotate")
        .msgs-friend-wrap(v-if="friend.friends")
          .msgs-friend(
                     v-for="item in friend.friends.friends"
                     @click="setFriend({_id: item._id, name: item.name, lastName: item.lastName, image: item.image})"
                     )
            .msgs-friend-wrap-img
              img.msgs-friend__img(:src="item.image")
            p.msgs-friend__name {{ item.name | capitalize}} {{ item.lastName | capitalize}}
        .note(v-else)
          p для того, чтобы начать общаться добавьте друзей
      .msgs-last-msgs(v-else)
        p.margin-top10
        .msgs-msg-row(
                      v-for="item in lastMsgs"
                      @click="setFriend({_id: item._id, name: item.name, lastName: item.lastName, image: item.image, counterUnreadMsgs: item.counterUnreadMsgs})"
                      )
          .msgs-row-wrap-image
            .msgs-row-wrap-image__counter {{ item.counterUnreadMsgs && item.counterUnreadMsgs > 0 ? item.counterUnreadMsgs : null }}
            img.msgs-msg-row__image(:src="item.image")
          .msgs-row-wrap-content
            p.msgs-row-wrap-content__name {{ item.name | capitalize }} {{ item.lastName | capitalize }}
            p.msgs-row-wrap-content__message {{ item.message }}
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import MessagesDialogWindow from './MessagesDialogWindow'
export default {
  components: {
    MessagesDialogWindow
  },
  data() {
    return {
      showTooltip: false
    }
  },
  computed: {
    ...mapState('messages', [ 'lastMsgs', 'stateDialogWindow', 'stateRotate', 'friend', 'spinnerLastMsgs' ]),
    textTooltip() {
      return !this.stateRotate ? 'Начать беседу' : 'Отмена'
    }
  },
  watch: {
    stateDialogWindow: function(newVal) {
      if(!newVal) {
        this.$store.commit('messages/clearDialogWindow')
        this.$nextTick(() => this.widthHeader())
      }
    }
  },
  created() {
    !this.lastMsgs.length ? this.$store.dispatch('messages/lastMsgs') : null
  },
  mounted() {
    this.widthHeader()
    window.addEventListener('resize', this.widthHeader)
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.widthHeader)
  },
  methods: {
    widthHeader() {
      this.$refs.header ? this.$refs.header.style.width = `${this.$refs.msgs.offsetWidth}px` : null
    },
    setFriend(friend) {
      this.$store.commit('messages/changeStateRotate', false)
      this.$store.commit('messages/setFriend', friend)
      this.$store.dispatch('messages/friendMsgs')
      this.$store.commit('messages/changeStateDialogWindow', true)
      friend.counterUnreadMsgs ? this.$store.commit('home/changeCounterUnreadMsgs', friend.counterUnreadMsgs): null
    },
    showFriends() {
      this.$store.commit('messages/changeStateRotate', !this.stateRotate)
      if(this.friend.friends) {
        if(this.friend.friends.length < 1) {
          this.stateRotate ? this.$store.dispatch('messages/setFriends') : null
        }
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.wrap-msgs
  position relative
.wrap-msgs:before
  content ''
  width 100%
  height 10px
  background $light
  position fixed
  top 60px
  z-index 10
.spinner--msgs
  top 200px
.msgs-friends
  padding-top 48px
.msgs-header
  z-index 10
  background $light-blue
  height 44px
  padding-left 12px
  position fixed
  color $dark-blue
.msgs-friend-wrap-img
  width 40px
  height 40px
  margin-right 20px
.msgs-friend:hover
  transition .1s
  background-color $light-grey
.msgs-friend
  transition .1s
  cursor pointer
  background-color $light-blue
  align-items center
  display flex
  margin 10px 0
  padding 10px
  &__img
    border-radius 50%
    width 100%
.msgs-header-select-friend
  transition .1s
  font-size 2rem
  width 34px
  height 34px
  text-align center
  display inline-block
  +sm()
    font-size 2rem
.msgs-header-wrap-select-friend
  cursor pointer
  position relative
.fade-enter-active, .fade-leave-active
  transition opacity .3s
.fade-enter, .fade-leave-to
  opacity 0
.rotate-plus
  transition .1s
  display inline-block
  transform rotate(45deg)
  +sm()
    width 34px
.msgs-last-msgs
  padding-top 48px
.msgs-row-wrap-image
  position relative
  width 40px
  height 40px
  margin-right 20px
  &__counter
    position absolute
    background #6b88ac
    font-family lobster
    width 25px
    display inline-block
    text-align center
    font-size 0.8rem
    bottom -4px
    right -8px
    border-radius 10px
    color $light
.msgs-row-wrap-content
  &__name
    color $text
    margin-bottom 6px
  &__message
    font-style italic

.msgs-msg-row:hover
  transition .1s
  background-color $light-grey
.margin-top10
  margin-top 10px
.msgs-msg-row
  border-radius 2px
  transition .1s
  cursor pointer
  margin-bottom 10px
  display flex
  align-items center
  padding 10px
  background $light-blue
  &__content
    border 1px solid red
  &__image
    width 100%
    height auto
    border-radius 50%
.add-dialog
  position absolute
  top 0
  right 0
  z-index 11
  height 44px
  width 44px
  text-align center
  line-height 44px
  font-size 2rem
  background #bac4d2
  cursor pointer
  &__plus
    display inline-block
    width 20px
    height 20px
    line-height 20px
    color $light
    transition .1s
  &__tooltip
    pointer-events none
    cursor default
    height 30px
    line-height 30px
    font-size .9rem
    position absolute
    padding 0 8px
    color $light
    background-color rgba(6,15,27,0.8)
    right -13px
    bottom 0
    border-radius 3px
    white-space nowrap
    bottom -37px
    right 0
    +sm()
      font-size .8rem
    &::before
      content '' 
      position absolute
      right 16px
      top -10px
      border 5px solid transparent
      border-bottom 5px solid rgba(6,15,27,0.8)
.note
  margin-top 10px
  width 100%
  background $light-blue
  padding 20px
  text-align center
</style>
