<template lang="pug">
  section.home(v-if="user.image")
    .home-top-block
      home-img
      .home-top-block-wrap-info
        .home-top-block-wrap-info-overlay
          p section in development
        p.home-top-block-info__name {{ user.name | capitalize }} {{ user.lastName | capitalize}}
        p.home-top-block-info__status change status
        p.home-top-block-info__birthday Birthday: 
          span.home-top-block-info__change-birthday change
        p.home-top-block-info__city City:
          span.home-top-block-info__change-city change
</template>

<script>
import HomeImg from './HomeImg'
import {mapState} from 'vuex'
export default {
  components: {
    HomeImg
  },
  computed: {
    ...mapState('home', [ 'user' ])
  }
}
</script>

<style lang="stylus">
.home
  margin-bottom 10px
.home-top-block
  display flex
  justify-content space-between
  flex-direction column
  +size500()
    height 230px
    flex-direction row
  &__img
    width 100%
    cursor pointer
.home-top-block-wrap-info
  position relative
  padding 12px
  width 100%
  background-color $light-blue
  +size500()
    width calc(100% - 240px)
.home-top-block-wrap-info-overlay
  position absolute
  top 10px
  bottom 10px
  right 10px
  left 10px
  background-color rgba(71, 125, 189, 0.52)
  display flex
  justify-content center
  align-items center
  p
    color #e1e5eb
    font-size 1.2rem
.home-top-block-info
  &__change-birthday, &__change-city
    color $grey
    font-size .9rem
  &__name, &__birthday, &__city
    transition .2s
    font-size 1rem
  &__birthday:hover, &__city:hover
    transition .2s
    background-color $light-grey
  &__birthday, &__city
    transition .2s
    padding 4px 0
    margin-top 20px
    cursor pointer
  &__status:hover
    transition .2s
    color #8391a7
  &__status
    font-size .9rem
    transition .2s
    color $grey
    cursor pointer
</style>
