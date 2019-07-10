<template lang="pug">
  .wrap-user(v-show="stateLoadingAvatar")
    modal(
          name="msgPopup"
          adaptive=true
          width="90%"
          :maxWidth="600"
          :minHeight="350"
          )
      popup-msg(
                :user = "user"
                @closePopup="closeMsgPopup"
                @sendMsg ="sendMsg"
                )
    modal.modal-msg-sent(
                        name="msgSent"
                        :width="250"
                        :height="45"
                        )
      p.modal-msg-sent__title сообщение отправлено
    .user-top-block
      .user-left-block
        .user-wrap-image
          img.user__image(:src="user.image" @load="loadImg")
      .user-wrap-info
        p {{user.name  | capitalize}} {{user.lastName | capitalize}}
    .wrap-user-btn
      button.user__btn(
                      :disabled = "disable"
                      :class="disable ? 'disable': null"
                      @click="handleClick") {{ user.btnText }}
      span.spinner-btn(:class= "showSpinnerBtn ? 'spinner' : null")
</template>

<script>
import {mapState} from 'vuex'
import PopupMsg from './PopupMsg'
export default {
  components: {
    PopupMsg
  },
  data() {
    return {
      showSpinnerBtn: false,
      disable: false,
      stateLoadingAvatar: false
    }
  },
  computed: {
    ...mapState('user', [ 'user' ])
  },
  created() {
    this.$store.dispatch('user/getUserInfo', this.$route.params.id)   
  },
  methods: {
    clearTextBtn(e, str) {
      e.target.innerHTML = str
      setTimeout(() => {
        e.target.innerHTML = ''
        this.showSpinnerBtn = true
        this.disable = true
      }, 800)
    },
    setTextBtn(e) {
      setTimeout(() => {
      e.target.innerHTML = 'написать сообщение'
      this.showSpinnerBtn = false
      this.disable = false
      }, 2000)
    },
    handleClick(e) {
      if(!this.user.stateFriendship) {
        if(!this.user.stateAdding && !this.user.stateAddingMe) {
          this.$store.dispatch('friends/offerToFriendship', this.user.id)
          this.$store.commit('user/changeStateAdding', true)
          this.clearTextBtn(e, 'запрос отправлен')
          this.setTextBtn(e)
        } else if(this.user.stateAddingMe) {
          this.$store.commit('user/changeStateAddingMe', false)
          this.$store.commit('user/changeStateFriendship', true)
          this.clearTextBtn(e, 'добавление успешно')
          this.setTextBtn(e)
          this.$store.commit('friends/addFriend', this.user.id)
        } else {
          this.openMsgPopup()
        }
      } else {
        this.openMsgPopup()
      }
    },
    closeMsgPopup() {
      this.$modal.hide('msgPopup')
    },
    loadImg() {
      this.stateLoadingAvatar = true
    },
    openMsgPopup() {
      this.$modal.show('msgPopup')
    },
    sendMsg(val) {
      this.$store.dispatch('messages/sendMsg', {message: val})
      this.$modal.hide('msgPopup')
      this.$modal.show('msgSent')
      setTimeout(() => {
        this.$modal.hide('msgSent')
      }, 1300)
    }
  }
}
</script>

<style lang="stylus" scoped>
.wrap-user
  margin-bottom 30px
.spinner-btn
  width 20px
  height 20px
  top 11px
.disable
  background-color $dodgerblue !important
  color $dark-blue !important
  cursor default
.wrap-user-btn
  display inline-block
  position relative
.user-top-block
  display flex
.user
  &__image
    width 100%
  &__btn
    background-color $dodgerblue
    position relative
    color $dark-blue
    border-radius 2px
    padding 10px
    margin-top 10px
    transition .3s
    height 35px
    width 230px
    max-width 230px
    &:hover
      background-color $blue
      transition .3s
      color $light    
.user-wrap-image
  padding 10px
  width 230px
  margin-right 10px
  background-color $light-blue
  overflow hidden
.user-wrap-info
  padding 10px
  width 100%
  background-color $light-blue
  display none
  +xs()
    display block
  +sm()
    width calc(100% - 240px)
.v--modal-overlay[data-modal="msgSent"]
  background transparent
.modal-msg-sent
  &__title
    background rgba(0, 0, 0, 0.8) !important
    color $light
    line-height 45px
    text-align center
</style>
