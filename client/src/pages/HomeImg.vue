<template lang="pug">
  .home-top-block-wrap-img(
                        @mouseover="editAvatar = !editAvatar"
                        @mouseout="editAvatar = !editAvatar"
                        :style="[this.showBtnUpload ? {cursor: 'move'} : '']"
                        )
    .wrap-croppa
      croppa(
            :disable-drag-to-move="disableMove"
            :disableScrollToZoom="disableZoom"
            v-model="myCroppa"
            :width="210"
            :height="210"
            :quality="1"
            :file-size-limit="350000"
            initial-size="cover"
            :zoom-speed="9"
            :initial-image="user.image"
            :show-remove-button="false"
            :prevent-white-space="true"
            @file-size-exceed="onFileSizeExceed"
            @file-type-mismatch="onFileTypeMismatch"
            @new-image="addImg"
            @file-choose="fileChoose"
            )
    .home-top-block-edit-img(:class="[editAvatar ? 'show-edit' : '']")
      span.home-top-block-edit-img__control(@click="changeAvatar") change
      span.home-top-block-edit-img__control(
                                            @click="uploadAvatar"
                                            :style="[ showBtnUpload ? '' : {display: 'none'}]"
                                            ) download
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      showBtnUpload: false,
      disableZoom: true,
      myCroppa: {},
      editAvatar: false,
      selectedFile: null,
      nameImg: '',
      disableControl: false,
      disableMove: false,
    }
  },
  computed: {
    ...mapState('home', [ 'user' ])
  },
  methods: {
    onFileSelected(event) {
      this.selectedFile = event.target.files[0]
    },
    fileChoose() {
      this.disableControl = true
      this.nameImg = this.myCroppa.getChosenFile().name
    },
    uploadAvatar() {
      this.disableZoom = true
      this.disableMove = true
      this.showBtnUpload = false
      this.disableControl = false

      this.myCroppa.generateBlob( blob => {
        var fd = new FormData()
        fd.append('avatar', blob, this.nameImg)
        fd.append('id', localStorage.id)
        this.$store.dispatch('home/changeAvatar', fd)
      })
    },
    changeAvatar() {
      this.disableMove = false
      this.disableZoom = false
      this.myCroppa.chooseFile()
    },
    onFileSizeExceed() {
      alert('Размер файла не должен привышать 300кб')
    },
    onFileTypeMismatch () {
      alert('Тип файла должен быть jpeg или png')
    },
    addImg() {
      this.showBtnUpload = true
    }
  }
}
</script>
<style lang="stylus">
.home-top-block-wrap-img:after
  position absolute
  content ''
  bottom 0
  left 0
  height 10px
  background-color $light-blue
  width 100%
  z-index 10
.home-top-block-wrap-img
  position relative
  padding 10px
  width 230px
  margin-right 10px
  background-color $light-blue
  overflow hidden
  margin-bottom 10px
  +size500()
    margin-bottom 0
.home-top-block-edit-img
  opacity 0
  cursor default
  transition .3s
  position absolute
  width 210px
  height 40px
  background-color rgba(6, 15, 27, 0.68)
  color white
  left 10px
  display flex
  justify-content space-between
  bottom 12px
  +sm()
    bottom 10px
  &__control
    display block
    text-align center
    line-height 40px
    height 40px
    cursor pointer
    width 50%
    transition .2s
    color $light
  &__control:hover
    background-color rgba(6, 15, 27, 0.68)
    transition .2s
.show-edit
  opacity 1
  transition .3s
</style>
