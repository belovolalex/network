<template lang="pug">
  .friends-humans
    p {{ noMatchesHumans }}
    .spinner(v-if="spinnerHumans")
    .friends-humans-wrap(v-else ref="humansWrap")
      router-link.friends-human(v-for="item in showHumans" :to="`/user/${item._id}`")
        .friends-human-wrap-image
          img.friends-human__image(:src="item.image")
        .friends-human__name {{ item.name | capitalize}}
        .friends-human__name {{ item.lastName | capitalize}}
        button.friends-human__btn(
                                  @click.prevent="!item.friendQuery ? offerToFriendship(item._id) : null"
                                  :class="item.friendQuery ? 'disable-btn' : null"
                                  ) {{item.btnText}}
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters( 'friends', [ 'showHumans', 'noMatchesHumans' ] ),
    ...mapState('friends', [ 'spinnerHumans' ] )
  },
  created() {
    !this.showHumans.length ? this.$store.dispatch('friends/getHumans') : null
  },
  methods: {
    offerToFriendship(id) {
      this.$store.dispatch('friends/offerToFriendship', id)
    }
  }
}
</script>

<style lang="stylus" scoped>
.friends-humans-wrap
  justify-content flex-start
  flex-wrap wrap
  display flex
  margin -5px
.friends-human-wrap-image
  display inline-block
  position relative
.friends-human
  border 1px solid $dodgerblue
  box-sizing border-box
  border-radius 2px
  position relative
  transition .4s
  padding 10px
  color $blue
  margin 5px
  margin-bottom 10px
  width calc(50% - 10px)
  &:hover
    border 1px solid $blue
    transition .4s
  +xs()
    width calc(33.3% - 10px)
  +md()
    width calc(25% - 10px)
  &__btn
    background-color $dodgerblue  
    color $dark-blue
    border-radius 2px
    padding 10px
    margin-top 10px
    transition .3s
    width 100%
    &:hover
      background-color $blue
      transition .3s
      color $light
    +sm()
      padding 10px
img
  border-radius 2px
  width 100%
.friends-humans
  padding-bottom 30px
  position relative
.spinner
  top 200px
.disable-btn
  background $light-dodgerblue
  transition .2s
  cursor default
  &:hover
    background $light-dodgerblue
    color $dark-blue
</style>
