<template lang="pug">
  section.friends
    .wrap-friends(ref="wrapFriends")
      .wrap-friends-header(ref="header")
        .friends-header
          .friends-header__title(@click="changeTab('FriendsFriends')") Мои друзья
            span.friends__length {{ friendsLength > 0 ? friendsLength : ''}}
          .friends-header__title.friends-header__title--search(@click="changeTab('FriendsHumans')") Поиск друзей
        .wrap-friends-search
          .friends-search__icon-search.icon-search
          label.friends-search__label(
                                      :class="[activeInput ? 'active-input' : null, showLabel ? null : 'hide-label']"
                                      for="inp"
                                      ) начните вводить имя друга
          transition(name="fade")
            input.friends-search(
                                id="inp"
                                @focus="activeInput = true"
                                @blur="activeInput = false"
                                v-model="search"
                                @input="handleInput"
                                v-debounce:700ms="searchFriends"
                                )
      component(:is="activeTab")
      
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import FriendsFriends from './FriendsFriends'
import FriendsHumans from './FriendsHumans'
export default {
  components: {
    FriendsFriends,
    FriendsHumans
  },
  data() {
    return {
      search: '',
      activeInput: false,
      showLabel: true
    }
  },
  computed: {
    ...mapState('friends', [ 'activeTab' ]),
    ...mapGetters('friends', [ 'friendsLength' ])
  },
  mounted() {
    this.widthHeader()
    window.addEventListener('resize', this.widthHeader)
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.widthHeader)
  },
  methods: {
    changeTab(tab) {
      this.search = ''
      this.$store.commit('friends/changeActiveTab', tab)
    },
    widthHeader() {
      let wrapFriends = `${this.$refs['wrapFriends'].offsetWidth}px`
      this.$refs['header'].style.width = wrapFriends
    },
    handleInput() {
      event.target.value.length ? this.showLabel = false : this.showLabel = true
    },
    searchFriends(value) {
      if(this.activeTab === 'FriendsFriends') {
        this.$store.dispatch('friends/searchFriends', value)
      }
      if(this.activeTab === 'FriendsHumans') {
        this.$store.dispatch('friends/searchHumans', value)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.friends
  padding-bottom 30px
  &__length
    font-family 'lobster'
    margin-left 10px
    color $dodgerblue
.wrap-friends
  margin-top 105px
.wrap-friends-search
  position relative
.friends-search
  background $light-blue
  border-radius 2px
  padding-left 10px
  line-height 36px
  width 100%
  height 36px
  color $blue
  padding-left 40px
  &__label
    transition .2s
    cursor text
    position absolute
    color $blue
    top 10px
    left 41px
  &__icon-search
    position absolute
    top 10px
    left 17px
    color $blue
.wrap-friends-header
  position fixed
  top 60px
  z-index 10
  background $light
  padding-top 10px
.friends-header
  border-bottom 2px solid $blue
  justify-content space-between
  background-color $light-blue
  margin-bottom 10px
  align-items center
  display flex
  height 40px
  &__title
    background transparent
    border-radius 2px
    line-height 27px
    cursor pointer
    padding 0 10px
    margin 0 6px
    height 27px
    color $blue
    &--search
      background $dodgerblue
      color $dark-blue
      transition .2s
      &:hover
        background $blue
        transition .2s
        color $light
.active-input
  transition .2s
  color $dodgerblue
.hide-label
  transition .2s
  opacity 0
</style>
