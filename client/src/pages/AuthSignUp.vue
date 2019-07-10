<template lang="pug">
  .wrap-form-sign-up
    transition(name="fade" mode="out-in")
      form(v-if="!verify" key="singUpForm")
        .row
          .row-item
            label.label(
                        for="firstName"
                        :class="[labelName ? false : 'hide-label']"
                        ) First name
              span.label-star *
            span.error(v-if="errors.has('name')") {{ errors.first('name') }}
            input(
                  v-validate ="'required|alpha'"
                  name="name"
                  type="text"
                  id="firstName"
                  @focus="hideLabel('labelName')"
                  @blur="showLabel('labelName', user.name)"
                  v-model="user.name"
                  )
          .row-item
            label.label(
                  for="lastName"
                  :class="[labelLastName ? false : 'hide-label']"
                  ) Last name
              span.label-star *
            span.error(v-if="errors.has('lastName')") {{ errors.first('lastName') }}
            input(
                  v-validate ="'required|alpha'"
                  name="lastName"
                  type="text"
                  id="lastName"
                  @focus="hideLabel('labelLastName')"
                  @blur="showLabel('labelLastName', user.lastName)"
                  v-model="user.lastName"
                  )
        .row
          .row-item
            label.label(
                  for="email"
                  :class="[labelEmail ? false : 'hide-label']"
                  ) E-mail
              span.label-star *
            span.error(v-if="errors.has('email')") {{ errors.first('email') }}
            input(
                  @input="inputEmail($event)"
                  name="email"
                  v-validate.disable ="'required|email'"
                  type="text"
                  id="email"
                  @focus="hideLabel('labelEmail')"
                  @blur="showLabel('labelEmail', user.email)"
                  v-model="user.email"
                  )
          .row-item
            label.label(
                  for="password"
                  :class="[labelPassword ? false : 'hide-label']"
                  ) Password
              span.label-star *
            .icon-eye(
                      @click="showPassword"
                      :class="[showEye ? 'show-eye' : false, lightEye ? 'active-eye' : false]"
                      )
            span.error(v-if="errors.has('password')") {{ errors.first('password') }}
            input(
                  :type = "typeEmail"
                  id="password"
                  name="password"
                  v-validate.disable ="'required|min:6'"
                  @focus="hideLabel('labelPassword')"
                  @blur="showLabel('labelPassword', user.password)"
                  v-model="user.password"
                  @input="inputPassword($event)"
                  ref="password"
                  )
        button.btn(@click.prevent="submitForm") To register
      form.form-verify(v-else key="verifyForm")
        auth-verify
</template>

<script>
import {mapState} from 'vuex'
import AuthVerify from './AuthVerify'
export default {
  components: {
    AuthVerify  
  },
  data() {
    return {
      lightEye: false,
      showEye: false,
      labelName: true,
      labelLastName: true,
      labelEmail: true,
      labelPassword: true,
      typeEmail: 'password',
      user: {
        name: '',
        lastName: '',
        email: '',
        password: ''
      }
    }
  },
  computed: {
    ...mapState('auth', ['verify'])
  },
  methods: {
    showPassword() {
      this.typeEmail === 'password' ? this.typeEmail = 'text' : this.typeEmail = 'password' 
      this.lightEye = !this.lightEye
      this.$refs.password.focus()
    },
    inputPassword(event) {
      event.target.value.length > 0 ? this.showEye = true : this.showEye = false
      this.$validator.validate('password').then(() => {
        this.errors.items.forEach(el => {
          if(el.field === 'password') {
            if(event.target.value.length > 0) {
              el.msg = ''
            }
          }
        })
      })
    },
    inputEmail(event) {
      this.$store.commit('auth/clearError')
      this.$validator.validate('email').then(() => {
        this.errors.items.forEach(el => {
          if(el.field === 'email'){
            if(event.target.value.length > 0) {
              el.msg = ''
            }
          }
        })
      })
    },
    hideLabel(payload) {
      this.$data[payload] = false
    },
    showLabel(label, field) {
      field.length < 1 ? this.$data[label] = true : false
    },
    submitForm() {
      this.$validator.validateAll()
        .then(() => {
          if (!this.errors.any()) {
            this.$store.dispatch('auth/signUp', this.user)
          }
        })
    },
    clearFields() {
      this.user = {
        name: '',
        lastName: '',
        email: '',
        password: ''
      }
      this.showEye = false
      this.labelName = true
      this.labelLastName = true
      this.labelEmail = true
      this.labelPassword = true
    }
  }
}
</script>

<style lang="stylus" scoped>
.name
  font-weight bold
.wrap-form-sign-up
  margin-bottom 30px
.active-eye
  color $dark-blue !important
  transition .2s
.show-eye
  transition .2s
  display block !important
  color $blue
.icon-eye
  display none
  top 50%
  position absolute
  right 5px
  padding 5px
  transform translateY(-50%)
  cursor pointer
  font-size 1.3rem
.error
  position absolute
  top -20px
  color $blue
  font-size .8rem
.hide-label
  transition .1s
  opacity 0
.label-star
  margin-left 2px
  color $dark-blue
  font-size 1.4rem
.label
  cursor text
  position absolute
  top 50%
  transform translateY(-50%)
  left 12px
  color $blue
  pointer-events none
.row
  display flex
  justify-content space-between
  flex-direction column
  +sm()
    flex-direction row
.row-item
  position relative
  width 100%
  margin-bottom 38px
  +sm()
    width 49%

input:focus
  border 1px solid $blue
  transition .4s
input
  transition .4s
  font-size 1rem
  color $blue
  padding 12px
  width 100%
  background-color transparent
  border 1px solid $dodgerblue
  border-radius 3px
.btn:hover
  transition .2s
  background-color $dodgerblue
  border 1px solid $dodgerblue
  color $dark-blue
.btn
  border-radius 3px
  bottom 30px
  transition .2s
  width 100%
  padding 12px
  background-color transparent
  color $blue
  font-size 1rem
  border 1px solid $dodgerblue
.auth-error
  color $dark-blue
  transform translateX(-50%)
  position absolute
  bottom 92px
  left 50%
  font-weight bold
  text-align center
.fade-enter-active, .fade-leave-active
  transition opacity .1s
.fade-enter, .fade-leave-to
  opacity 0
</style>
