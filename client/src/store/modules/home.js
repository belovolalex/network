import axios from 'axios'
import router from '../../router'
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
      counterWhoAddingMe: 0,
      counterUnreadMsgs: 0
    }
  },
  mutations: {
    setUserInfo(state, payload) {
      let user = state.user
      user.name = payload.user.name
      user.lastName = payload.user.lastName
      user.image = payload.user.image
      user.id = payload.user._id
      user.counterWhoAddingMe = payload.whoAddingMeLength
      user.counterUnreadMsgs = payload.unreadMsgsLength
    },
    clearUser(state) {
      let user = state.user
      user.name = ''
      user.lastName = ''
      user.image = ''
      user.id = ''
      user.counterWhoAddingMe = 0
      user.counterUnreadMsgs = 0
    },
    decCounter(state) {
      state.user.counterWhoAddingMe > 0 ? state.user.counterWhoAddingMe -- : null
    },
    incCounter(state) {
      state.user.counterWhoAddingMe ++
    },
    changeCounterUnreadMsgs(state, payload) {
      state.user.counterUnreadMsgs -= payload
    },
    incCounterMsg(state) {
      state.user.counterUnreadMsgs += 1
    }
  },
  actions: {
    userInfo({commit}) {
      axios.post(`${API_URL}/user/home`, {id: localStorage.id}, headers())
        .then(payload => commit('setUserInfo', payload.data))
        .catch(() => {
          commit('auth/clearStorage', null, {root:true})
          router.push('/auth')
        })
      },
    changeAvatar({commit}, payload) {
      const config = { headers: {'Content-Type': 'multipart/form-data', 'Authorization' : localStorage.token} }
      axios.post(`${API_URL}/aploadAvatar`, payload, config)
        .catch(error => handlerError(error))
    }
  }
}