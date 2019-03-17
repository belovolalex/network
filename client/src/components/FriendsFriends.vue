<template lang="pug">
  .friends-body
    friends-query
    friends
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import FriendsQuery from './FriendsFriendsQuery'
import Friends from './FriendsFriendsFriends'
export default {
  components: {
    FriendsQuery,
    Friends
  },
  created() {
    this.$store.dispatch('friends/getFriends')
  }
}
</script>

<style lang="stylus">
.friends-body
  position relative
</style>
