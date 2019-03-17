<template lang="pug">
.wrap-friends
  p.wrap-friends__title {{ friendsTitle }}
  p {{ noMatchesFriends }}
  router-link.wrap-friend(v-for="(item, idx) in showFriends" :to="`/user/${item._id}`")
    .friends-friend
      .friend-icon(@click.prevent="settings(idx)")
        span.friend-icon__point
        span.friend-icon__point
        span.friend-icon__point
      .friend-settings(
                      @click.prevent
                      v-if="showSettings === idx"
                      v-on-clickaway="settings"
                      )
        transition(name="fade")
          span.friend-delete-friend(@click="deleteFriend(item._id, idx)") убрать из друзей
      .friend-wrap-image
        .friend-status(:class="item.online ? 'online' : null")
        img.friend__image(:src="item.image")
      .friend-wrap-info
        .friend-wrap-info__name {{ item.name | capitalize }} {{ item.lastName | capitalize }}
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
import { mapState, mapGetters } from 'vuex'
export default {
  mixins: [ clickaway ],
  data() {
    return {
      showSettings: null
    }
  },
  computed: {
    ...mapGetters( 'friends', [ 'friendsTitle', 'showFriends', 'noMatchesFriends' ] )
  },
  methods: {
    settings(index) {
      this.showSettings === index ? this.showSettings = null : this.showSettings = index
    },
    deleteFriend(id, idx) {
      this.$store.dispatch('friends/deleteFriend', {id: id, idx: idx})
    }
  }
}
</script>

<style lang="stylus" scoped>
.wrap-friends
  &__title
    margin-bottom 10px
.friends-friend
  background $light-blue
  margin-bottom 20px
  align-items center
  position relative
  transition .3s
  padding 10px
  display flex
  cursor pointer
  &:hover
    background $light-grey
    transition .3s
.friend
  &__image
    width 100%
    border-radius 2px  
.friend-wrap-image
  position relative
  margin-right 5px
  flex-shrink 0
  height 105px
  width 105px
  +size500()
    height 70px
    width 70px
.friend-status
  position absolute
  border-radius 2px
  height 10px
  width 10px
  bottom 0
  right 0
.online
  background $online
.friend-icon
  position absolute
  cursor pointer
  height 14px
  width 23px
  right 10px
  top 7px
  &__point
    border-radius 50%
    position absolute
    background $blue
    height 5px
    width 5px
    top 4px
    &:first-child
      right 9px
    &:last-child
      right 0px
.friend-settings
  background-color $light
  border 1px solid $blue
  border-radius 2px
  position absolute
  padding 4px 0
  color $light
  width 140px
  right 11px
  z-index 10
  top 25px
  &:after, &:before
    content ''
    border solid transparent
    position absolute
    margin-left -12px
    top -10px
  &:after
    border-bottom-color $light
    border-width 4px
    top -8px
    right 5px
  &:before
   border-bottom-color #285488
   border-width 5px
   right 4px
.friend-wrap-info
  width 100%
  &__name
    font-size 1.1rem
    color $blue
    text-align center
.friend-delete-friend
  text-align center
  transition 0.2s
  cursor pointer
  padding 4px 0
  display block
  color $blue
  &:hover
    background-color $blue
    color $light
    transition 0.2s
.fade-enter-active, .fade-leave-active
  transition opacity .1s
.fade-enter, .fade-leave-to
  opacity 0
</style>
