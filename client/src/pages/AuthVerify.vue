<template lang="pug">
  .wrapper-verify
    .wrapper-verify-title(v-if="verifyError")
      p The verification key did not match
      p Most likely you copied it wrong.
    .wrapper-verify-title(v-else)
      p A letter with a secret key will arrive in your mail within a few minutes.
      p For successful registration, enter the key in the field
    .wrapper-verify-body
      input.input-verify(type="text" v-model="token")
      button.button-verify(@click.prevent="checkToken") Confirm
</template>

<script>
import {mapState} from 'vuex'
export default {
  data() {
    return {
      token: ''
    }
  },
  computed: {
    ...mapState('auth', [ 'email', 'verifyError' ])
  },
  methods: {
    checkToken() {
      this.$store.dispatch('auth/verifyEmail', {token: this.token, email: this.email})
    }
  }
}
</script>

<style lang="stylus">
.wrapper-verify
  p
    line-height 1.3
    margin-bottom 25px
.wrapper-verify-body
  justify-content space-between
  margin 32px 0
  display flex
  flex-direction column
  +sm()
    flex-direction row
.input-verify, .button-verify
  background $dodgerblue
  color $dark-blue
  padding 15px
  width 100%
  margin-bottom 30px
  +sm()
    margin-bottom 0
    width 50%
.button-verify:hover
  transition .2s
  background $light-green
.button-verify
  font-weight bold
  transition .2s
  background $green
  +sm()
    width 40%
.wrapper-verify-title p
  color $blue
.wrapper-verify-title
  +sm()
    height 85px
    margin-bottom 74px
</style>
