<template lang="pug">
  section.auth
    .wrapper-auth
      .auth-content
        .auth-header
          span.auth-header__item(
                                :class="[activeTab === 'SignIn' ? 'active-tab': false]"
                                @click="changeTab('SignIn')"
                                ) вход
          span.auth-header__item(
                                :class="[activeTab === 'SignUp' ? 'active-tab': false]"
                                @click="changeTab('SignUp')"
                                ) регистрация
        component(:is="activeTab")
        .wrap-error
          p.error {{error}}
</template>

<script>

import {mapState} from 'vuex'
import SignIn from './AuthSignIn'
import SignUp from './AuthSignUp'
export default {
  components: {
    SignIn,
    SignUp
  },
  computed: {
    ...mapState('auth', [ 'activeTab', 'verify', 'error'])
  },
  methods: {
    changeTab(payload) {
      !this.verify ? this.$store.commit('auth/changeActiveTab', payload) : false
    }
  }
}
</script>
<style lang="stylus" scoped>
.auth
  display table
  min-height 100vh
  height 100%
  margin 0 auto
  width 100%
  max-width 600px
.wrapper-auth
  display table-cell
  vertical-align middle
.auth-header
  width 100%
  display flex
  margin-bottom 50px
  &__item:first-child
    border-right 1px solid transparent
    border-radius 3px 0 0 3px
  &__item:last-child
    border-left 1px solid transparent
    border-radius 0 3px 3px 0
  &__item
    padding 12px
    cursor pointer
    width 50%
    color $blue
    background transparent
    transition .2s
  &__item:hover
    background $dodgerblue
    color $dark-blue
.auth-content
  background #e9eaec
  border 1px solid #a0bada
  border-radius 3px
  margin 10px
  box-shadow 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)
  overflow-x hidden
  padding 30px 10px
  +xs()
    padding 30px
.active-tab
  color $dark-blue
  background $dodgerblue
.wrap-error
  position relative
.error
  width 100%
  text-align center
  bottom -10px
  position absolute
  left 50%
  transform translateX(-50%)
</style>
