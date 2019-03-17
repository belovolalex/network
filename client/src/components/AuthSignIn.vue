<template lang="pug">
  form.wrap-sign-in
    .sign-in-congratulations(v-if="styleGoToSignIn")
      p Поздравляем с успешной регистрацией!
      p Для входа на сайт введите email и пароль
    .row(
        :class="[styleGoToSignIn ? 'direction-row': '']"
        )
      .row-item(
               :class="[styleGoToSignIn ? 'small-widht': '']"
               )
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
      .row-item(
               :class="[styleGoToSignIn ? 'small-widht': '']"
               )
        label.label(
                    for="password"
                    :class="[labelPassword ? false : 'hide-label']"
                    ) Пароль
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
              v-validate ="'required'"
              @focus="hideLabel('labelPassword')"
              @blur="showLabel('labelPassword', user.password)"
              v-model="user.password"
              @input="inputPassword($event)"
              ref="password"
              )
    button.btn(@click.prevent="submitForm") войти
</template>

<script>
import {mapState} from 'vuex'
export default {
  computed: {
    ...mapState('auth', [ 'styleGoToSignIn' ])
  },
  data() {
    return {
      lightEye: false,
      showEye: false,
      labelEmail: true,
      labelPassword: true,
      typeEmail: 'password',
      user: {
        email: '',
        password: ''
      }
  }
},
  methods: {
    showPassword() {
      this.typeEmail === 'password' ? this.typeEmail = 'text' : this.typeEmail = 'password'
      this.lightEye = !this.lightEye
      this.$refs.password.focus()
    },
    inputPassword(event) {
      event.target.value.length > 0 ? this.showEye = true : this.showEye = false
    },
    inputEmail(event) {
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
            this.$store.dispatch('auth/signIn', this.user)
          }
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
.wrap-sign-in
  margin-bottom 30px
.sign-in-congratulations
  margin-bottom 30px
  p
    line-height 1.6
    color $blue
.direction-row
  +sm()
    flex-direction row !important
    justify-content space-between
.small-widht
  +sm()
    width 49% !important
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
.row-item
  position relative
  width 100%
  margin-bottom 38px

input
  transition .4s
  background-color transparent
  font-size 1rem
  padding 12px
  width 100%
  border-radius 3px
  border 1px solid $dodgerblue
  color $blue
  font-size 1rem
  &:focus
    border 1px solid $blue
    transition .4s
.btn
  width 100%
  border-radius 3px
  padding 12px
  border 1px solid $dodgerblue
  font-size 1rem
  color $blue
  transition .2s
  background transparent
  &:hover
    transition .2s
    background-color $dodgerblue
    border 1px solid $dodgerblue
    color $dark-blue
</style>
