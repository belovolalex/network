import axios from 'axios'
import {API_URL, headers} from '../../utils'
import { handlerError } from '../../utils/handlerErrors'

export default {
  namespaced: true,
  state: {
    user: {
      name: '',
      lastName: '',
      image: '',
      id: '',
      stateAdding: false,
      stateAddingMe: false,
      stateFriendship: false,
      btnText: '',
      online: false
    }
  },
  mutations: {
    setUserInfo(state, payload) {
      let user = state.user
      user.name = payload.user.name
      user.lastName = payload.user.lastName
      user.online = payload.user.online
      user.image = payload.user.image
      user.id = payload.user._id
      user.stateAdding = payload.stateAdding
      user.stateAddingMe = payload.stateAddingMe
      user.stateFriendship = payload.stateFriendship
      if(!payload.stateFriendship) {
        if(payload.stateAddingMe) {
          state.user.btnText = 'подтвердить'
        } else if(payload.stateAdding) {
          state.user.btnText = 'написать сообщение'
        } else if (!payload.stateAddingMe && !payload.stateAdding) {
          state.user.btnText = 'добавить в друзья'
        }
      } else {
        state.user.btnText = 'написать сообщение'
      }
    },
    changeStateAdding(state, val) {
      state.user.stateAdding = val
    },
    changeStateAddingMe(state, val) {
      state.user.stateAddingMe = val
    },
    changeStateFriendship(state, val) {
      state.user.stateFriendship = val
    },
    clearUserInfo(state) {
      state.user.name = ''
      state.user.lastName = ''
      state.user.image = ''
      state.user.id = ''
      state.stateAdding = false
      state.stateAddingMe = false
    }
  },
  actions: {
    getUserInfo({commit}, payload) {
      commit('clearUserInfo')
      axios.post(`${API_URL}/user/human`, {id: localStorage.id, humanId: payload}, headers())
        .then(payload => {
          commit('setUserInfo', payload.data)
          commit('messages/setFriend', payload.data.user, {root:true})
        })
        .catch(error => handlerError(error))
    }
  }
}