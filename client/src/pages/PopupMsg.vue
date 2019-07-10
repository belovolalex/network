<template lang="pug">
  .wrap-popup-msg
    .popup-msg-header
      span.popup-msg-header__title New message
      span.popup-msg-header__close(@click="closePopup") x
    .popup-msg-body
      .popup-msg-info
        .popup-msg-wrap-img
          img.popup-msg__img(:src="user.image")
        p.popup-msg-wrap-name {{ user.name | capitalize }} {{ user.lastName | capitalize }}
      textarea.popup-msg-textarea(v-model="msgValue")
    button.popup-msg-btn(@click="sendMsg") Send
</template>

<script>
export default {
  props: ['user'],
  data() {
    return {
      msgValue : ''
    }
  },
  methods: {
    sendMsg() {
      this.msgValue.length > 0 ? this.$emit('sendMsg', this.msgValue) : null
    },
    closePopup() {
      this.$emit('closePopup')
    }
  }
}
</script>

<style lang="stylus">
.popup-msg-header
  justify-content space-between
  background-color $blue
  line-height 60px
  display flex
  height 60px
  &__title
    padding-left 20px
    color $light
  &__close
    padding 0 20px
    cursor pointer
    color $light
.popup-msg-body
  margin 30px
.popup-msg-textarea
  border 1px solid $dodgerblue
  border-radius 2px
  color $dark-blue
  transition .3s
  padding 15px
  height 110px
  resize none
  width 100%
  &:focus
    border 1px solid $blue
    outline none !important
    transition .3s
.popup-msg-btn
  background $dodgerblue
  margin-right 30px
  padding 10px 20px
  border-radius 2px
  transition .3s
  float right
  color $dark-blue
  &:hover
    color $light
    background $blue
    transition .3s
.popup-msg-info
  display flex
  margin-bottom 20px
  align-items center
.popup-msg-wrap-img
  width 25px
  height 25px
  margin-right 10px
.popup-msg
  &__img
    border-radius 2px
    width 100%
</style>
