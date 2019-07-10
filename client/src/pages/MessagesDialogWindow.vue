<template lang="pug">
  section.dialog-window(ref="dialog-window")
    .dialog-header(ref="dialog-header")
      .dialog-header-wrap-img
        img.dialog-header__img(:src="friend.image")
      p {{ friend.name | capitalize }} {{ friend.lastName | capitalize}}
    .spinner(v-if="spinnerFriendMsgs")
    .dialog-messages(v-else)
      p.dialog-messages__note(v-if="getStateFirstMsgs") you no longer have messages
      .dialog-wrap-message(v-for="(item, idx) in friendMsgs")
        p.dialog-message__day(v-if="item.showDate") {{item.date}}
        p(v-if="item.showName").dialog-message__username {{ item.sender.name | capitalize }}
          span.dialog-message__time {{ item.time }}
        pre.dialog__message(
                            :class="[item.stateRead ? 'readMsg' : '', item.readMsg ? 'readMsg' : '']") {{ item.message }}
    .dialog-footer(ref="dialog-footer")
      form.dialog-form(
                      @keypress.enter.prevent="submitMsg"
                      )
        textarea.dialog-form__message(
                                      rows="2"
                                      v-model="message"
                                      )
      span.icon-send.icon-send-message(@click="submitMsg")
</template>

<script>
import {mapState, mapGetters} from 'vuex'
export default {
  data() {
    return {
      message: '',
      counter: 1
    }
  },
  computed: {
    ...mapGetters('messages', [ 'friendMsgs', 'getStateFirstMsgs' ]),
    ...mapState('messages', [ 'friend', 'spinnerFriendMsgs', 'msgsSettings', 'statePrevMsgs', 'lastMsgs' ])
  },
  watch: {
    getStateFirstMsgs(val) {
      if(val) {
        this.$nextTick(() => {
          document.body.scrollTop = document.documentElement.scrollTop = 10
          this.$store.commit('messages/changeStatePrevMsgs', false)
        })
      }
    },
    friendMsgs: function(val) {
      if(val.length) {
        setTimeout(() => {
          let idMsgs = []
          val.forEach(el => {
            if(el.sender._id !== localStorage.id && el.stateRead === false) {
              idMsgs.push(el._id)
              el.readMsg = true
            } else {
              idMsgs = []
            }
          })

          this.lastMsgs.forEach(el => el._id === this.friend.id ? el.counterUnreadMsgs = 0 : null)
          
          if(idMsgs.length) {
            this.$store.dispatch('messages/updateStateReadMsgs', idMsgs)
            idMsgs = []
          }
          this.$forceUpdate()
        },600)
        if(!this.statePrevMsgs) {
          this.scrollToEnd()
        } else {
          this.$nextTick(() => {
            document.body.scrollTop = document.documentElement.scrollTop = 10
            this.$store.commit('messages/changeStatePrevMsgs', false)
          })
        }
      }
    }
  },
  mounted() {
    this.scroll()
    this.setWidthWindow()
    window.addEventListener('resize', this.setWidthWindow)
  },
  beforeDestroy: function () {
    this.$store.commit('messages/clearDialogWindow')
    document.body.scrollTop = document.documentElement.scrollTop = 0
    window.removeEventListener('resize', this.setWidthWindow)
  },
  methods: {
    submitMsg(e) {
      if(!e.shiftKey) {
        if(this.message.length > 0) {
          this.$store.commit('messages/addToFriendMsgs', {message: this.message})
          this.$store.dispatch('messages/sendMsg', {message: this.message})
        }
        this.message = ''
        this.scrollToEnd()
      } else {
        e.target.value +="\n"
        this.scrollToEnd()
      }
    },
    setWidthWindow() {
      let widthWindow = `${this.$refs['dialog-window'].offsetWidth - 2}px`
      this.$refs['dialog-header'].style.width = widthWindow
      this.$refs['dialog-footer'].style.width = widthWindow
    },
    scrollToEnd() {
      let windowMessages = this.$refs['dialog-window']
      this.$nextTick(() => {
        windowMessages ? window.scroll(0, windowMessages.scrollHeight) : null
      })
    },
    scroll() {
      window.onscroll = () => {
        let scrolled = window.pageYOffset || document.documentElement.scrollTop
        if(scrolled < 5 && this.msgsSettings.skip == this.counter && !this.getStateFirstMsgs) {
          setTimeout(() => {
            this.$store.commit('messages/changeStatePrevMsgs', true)
            this.$store.dispatch('messages/friendMsgs')
            this.counter += 1
          }, 400)
        }
      }
    }
  }
}
</script>

<style lang="stylus">
.dialog-window
  min-height "calc(100vh - %s - 20px)" % $height-header
  height 100%
  position relative
  border-right 1px solid $grey
  border-left 1px solid $grey
  overflow hidden
.dialog-header
  border 1px solid $grey
  background $light
  position fixed
  height 56px
  line-height 56px
  text-align center
  border-left none
  border-right none
  display flex
  align-items center
  justify-content center
  &:before
    left -1px
    position absolute
    width calc(100% + 2px)
    content ''
    height 10px
    background $light
    top -11px
  &__img
    border-radius 50%
    width 100%
.dialog-header-wrap-img
  width 30px
  height 35px
  margin-right 10px
.dialog-footer
  border-top 1px solid $grey
  border 1px solid $grey
  background $light
  position fixed
  bottom 10px
  height 72px
  width 100%
  padding 10px
  padding-top 12px
  display flex
  align-items center
  border-left none
  border-right none
  &:after
    position absolute
    width calc(100% + 2px)
    content ''
    height 10px
    background $light
    bottom -11px
    left -1px
.dialog-form
  width 100%
  &__message
    width 100%
    border none
    background-color $light-blue
    border-radius 2px
    resize none
    outline none
    padding 10px
    color $text
    overflow hidden
.icon-send-message
  color $blue
  cursor pointer
  font-size 24px
  padding-left 10px
.dialog-wrap-message
  padding 0 10px
  border-radius 2px
.dialog-messages
  padding-top 68px
  padding-bottom 106px
  &__note
    text-align center
    padding-top 5px
.dialog
  &__message
    transition 2s
    color $dark-blue
    background $light-blue
    padding 5px
.dialog-message
  &__day
    margin-top 10px
    text-align center
  &__username
    margin-top 10px
    margin-bottom 5px
    color $blue
    font-weight bold
  &__time
    font-weight normal
    margin-left 5px
    font-size .8rem
    margin-right 5px
    font-family lobster
    color $blue
.unreadMsg  
  background $light-blue
.readMsg
  transition .3s
  background transparent !important
</style>
