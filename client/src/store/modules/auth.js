import axios from 'axios'
import router from '../../router'
import {API_URL} from '../../utils'
import {socket} from '../socket'

export default {
  namespaced: true,
  state: {
    activeTab: 'SignIn',
    error: '',
    name: '',
    email: '',
    verify: false,
    verifyError: false,
    styleGoToSignIn: false
  },
  mutations: {
    changeActiveTab(state, payload){
      state.activeTab = payload
      state.error = ''
    },
    signUp(state, payload) {
      state.email = payload.data.email
      payload.status === 201 ? state.verify = true : false
    },
    signIn(state, payload) {
      localStorage.name = payload.name.charAt(0).toUpperCase() + payload.name.slice(1)
      localStorage.id = payload.id
      localStorage.token = payload.token
      localStorage.user = true
      router.push('/')
    },
    clearStorage() {

      socket.emit('logout')

      localStorage.removeItem('name')
      localStorage.removeItem('id')
      localStorage.removeItem('token')
      localStorage.user = false
    },
    verifyEmail(state, payload) {
      if(payload.status === 200) {
        state.styleGoToSignIn = true
        state.activeTab = 'SignIn'
      }
    },
    setError(state, payload) {
      state.error = payload.data.message
    },
    verifyError(state) {
      state.verifyError = true
    },
    clearError(state) {
      state.error = ''
    }
  },
  actions: {
    signIn({commit}, payload) {
      axios.post(`${API_URL}/auth/login`, payload)
        .then(payload => commit('signIn', payload.data))
        .catch(error => commit('setError', error.response))
    },
    signUp({commit}, payload) {
      axios.post(`${API_URL}/auth/register`, payload)
        .then(payload => commit('signUp', payload))
        .catch(error => commit('setError', error.response))
      },
    verifyEmail({commit}, payload) {
      axios.post(`${API_URL}/verifyEmail`, payload)
        .then(payload => commit('verifyEmail', payload))
        .catch(error => commit('verifyError', error.response))
    }
  }
}