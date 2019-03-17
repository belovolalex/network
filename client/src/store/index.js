import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


import auth from './modules/auth'
import menu from './modules/menu'
import home from './modules/home'
import friends from './modules/friends'
import user from './modules/user'
import messages from './modules/messages'


export const store = new Vuex.Store({
  modules: {
    auth,
    menu,
    home,
    friends,
    user,
    messages,
  },
  actions: {
    clearStore({commit}) {
      commit('friends/clearState')
      commit('home/clearUser')
      commit('messages/clearFriend')
    }
  }
})