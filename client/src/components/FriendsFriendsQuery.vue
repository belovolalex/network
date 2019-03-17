<template lang="pug">
.wrap-queries
  .spinner(v-if="spinnerFriends")
  .queries(v-if="whoAddingMe.length")
    p.queries__title {{ queryTitle }}
    router-link.queries-wrap-friend(v-for="item in whoAddingMe" :to="`/user/${item._id}`")
      .queries-friend
        .queries-wrap-image
          .queries-friend-status(:class="item.online ? 'online' : null")
          img.queries-friend__image(:src="item.image")
        .queries-wrap-info
          .queries-wrap-info__title {{ item.name | capitalize }} {{ item.lastName | capitalize }}
          .queries-wrap-info-btns
            button.queries-wrap-info__btn(@click.prevent="addFriend(item._id)") Подтвердить
            button.queries-wrap-info__btn(@click.prevent="rejectionFriendship(item._id)") Отменить
</template>

<script>
import {mapState, mapGetters} from 'vuex'
export default {
  computed: {
    ...mapState('friends', [ 'whoAddingMe', 'spinnerFriends' ]),
    ...mapGetters('friends', [ 'queryTitle' ])
  },
  methods: {
    addFriend(id) {
      this.$store.dispatch('friends/addFriend', id)
    },
    rejectionFriendship(id) {
      this.$store.dispatch('friends/rejectionFriendship', id)
    }
  }
}
</script>

<style lang="stylus" scoped>
.queries
  margin-bottom 20px
  &__title
    margin-bottom 10px
.queries-friend
  background $light-blue
  align-items center
  margin-bottom 20px
  display flex
  padding 10px
  padding-right 5px
  transition .3s
  &__image
    border-radius 2px
    width 100%
  &:hover
    background $light-grey
    transition .3s
.queries-wrap-image
  position relative
  margin-right 5px
  flex-shrink 0
  height 105px
  width 105px
  +size500()
    height 70px
    width 70px
.queries-friend-status
  position absolute
  border-radius 2px
  height 10px
  width 10px
  bottom 0
  right 0
.online
  background $online
.queries-wrap-info
  justify-content space-between
  flex-direction column
  align-items center
  display flex
  width 100%
  +size500()
    flex-direction row
  &__title
    text-align center
    font-size 1.1rem
    color $blue
    +size500()
      width 40%
  &__btn
    background $dodgerblue
    border-radius 2px
    color $dark-blue
    transition .3s
    padding 10px
    margin 5px
    width auto
    +size500()
      width 50%
    &:hover
      background $blue
      transition .3s
      color $light
.queries-wrap-info-btns
  flex-direction column
  display flex
  width 100%
  +size500()
    flex-direction row
    width 60%
.spinner
  top 200px
</style>
