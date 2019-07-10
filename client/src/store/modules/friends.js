import axios from 'axios'
import {API_URL, headers} from '../../utils'
import {socket} from '../socket'
import { handlerError } from '../../utils/handlerErrors'

export default {
  namespaced: true,
  state: {
    friends: [],
    humans: [],
    whoAddingMe: [],
    limitHumans: 50,
    limitFriends: 50,
    spinnerHumans: true,
    spinnerFriends: true,
    stateSearchFriends: false,
    stateSearchHumans: false,
    activeTab: 'FriendsFriends',
    filteredFriends: [],
    filteredHumans: []
  },
  getters: {
    queryTitle: state => {
      let whoAddingMe = state.whoAddingMe.length
      function declOfNum(number, titles) {  
        let cases = [2, 0, 1, 1, 1, 2]  
        return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ] 
      }
      let  request = declOfNum(whoAddingMe, ['new request', 'new requests', 'new requests'])
      return `You have ${whoAddingMe} ${request} in friends`
    },
    friendsTitle: state => {
      if(!state.spinnerFriends) {
        if(state.whoAddingMe.length) {
          return state.friends.length ? 'My friends' : 'You have no friends yet'
        } else {
          return state.friends.length ? '' : 'You have no friends yet'
        }
      }
    },
    friendsLength: state => state.friends.length,
    showFriends: state => state.activeTab === 'FriendsFriends' && state.stateSearchFriends === false ? state.friends : state.filteredFriends,
    showHumans: state => state.activeTab === 'FriendsHumans' && state.stateSearchHumans === false ? state.humans : state.filteredHumans,
    noMatchesFriends: state => state.stateSearchFriends && state.filteredFriends <= 0 && !state.spinnerFriends ? 'matches were found' : null,
    noMatchesHumans: state => state.stateSearchHumans && state.filteredHumans <= 0 && !state.spinnerHumans ? 'matches were found' : null
  },
  mutations: {
    changeActiveTab(state, payload) {
      state.activeTab = payload
    },
    setFriends(state, payload) {
      if(payload) {
        if(payload.addingMe) {
          state.whoAddingMe = []
          payload.addingMe.forEach(el => {
            state.whoAddingMe.push(el)
          })
        }
        if(payload.friends) {
          state.friends = []
          payload.friends.forEach(el => {
            state.friends.push(el)
          })
        }
      }
        state.spinnerFriends = false
    },
    getHumans(state, payload) {
      payload.forEach((el) => {
        el.btnText = 'add to friends'
        el.friendQuery = false
        state.humans.push(el)
      })
      state.spinnerHumans = false
    },
    disableBtn(state, payload) {
      if(!state.stateSearchHumans) {
        state.humans.forEach(el => el._id === payload ? (el.btnText = 'request sent', el.friendQuery = true ) : null)
      } else {
        state.filteredHumans.forEach(el => el._id === payload ? (el.btnText = 'request sent', el.friendQuery = true ) : null)
      }
    },
    fromWhoAddingMeToFriends(state, payload) {
      let friend
      state.whoAddingMe.forEach((el, idx, arr) => el._id === payload ? friend = arr.splice(el, 1): null)
      state.friends.push(friend[0])
    },
    deleteFriend(state, payload) {
      state.friends.splice(payload, 1)
    },
    rejectionFriendship(state, payload) {
      state.whoAddingMe.forEach((el, idx, arr) => el._id === payload ? arr.splice(el, 1): null)
    },
    setFilteredFriends(state, payload) {
      state.spinnerFriends = false
      state.filteredFriends = payload
    },
    setFilteredHumans(state, payload) {
      payload.forEach(el => {
        el.btnText = 'add to friends'
        el.friendQuery = false
        state.filteredHumans.push(el)
      })
      state.spinnerHumans = false
    },
    clearState(state) {
      state.friends = [],
      state.humans = [],
      state.whoAddingMe = [],
      state.limitHumans = 50,
      state.limitFriends = 50,
      state.spinnerHumans = true,
      state.spinnerFriends = true,
      state.stateSearchFriends = false,
      state.stateSearchHumans = false,
      state.activeTab = 'FriendsFriends',
      state.filteredFriends = [],
      state.filteredHumans = []
    },
    stateUserOnline(state, payload) {
      state.whoAddingMe.forEach(user => user._id === payload ? user.online = true : null)
      state.humans.forEach(user => user._id === payload ? user.online = true : null)
      state.friends.forEach(user => user._id === payload ? user.online = true : null)
    },
    stateUserOffline(state, payload) {
      state.whoAddingMe.forEach(user => user._id === payload ? user.online = false : null)
      state.humans.forEach(user => user._id === payload ? user.online = false : null)
      state.friends.forEach(user => user._id === payload ? user.online = false : null)
    }
  },
  actions: {
    getFriends({commit, state}) {
      axios.post(`${API_URL}/friends/friends`, {id: localStorage.id, limit: state.limitFriends}, headers())
        .then(payload => setTimeout(() => commit('setFriends', payload.data), 700))
        .catch(error => handlerError(error))
    },
    getHumans({commit, state}) {
      axios.post(`${API_URL}/friends/humans`, {id: localStorage.id, limit: state.limitHumans}, headers())
        .then(payload => setTimeout(() => commit('getHumans', payload.data), 700))
        .catch(error => handlerError(error))
    },
    offerToFriendship({commit},payload) {
      socket.emit('offerToFriendship', {from: localStorage.id, to: payload})
      commit('disableBtn', payload)
      axios.post(`${API_URL}/friends/offerToFriendship`, {id: localStorage.id, humanId: payload}, headers())
        .catch(error => handlerError(error))
    },
    addFriend({commit}, payload) {
      commit('fromWhoAddingMeToFriends', payload)
      commit('home/decCounter', null, {root: true})
      axios.post(`${API_URL}/friends/addFriend`, {id: localStorage.id, friendId: payload}, headers())
        .catch(error => handlerError(error))
    },
    searchFriends({commit, state}, payload) {
      if(payload.length > 0) {
        state.filteredFriends = []
        state.stateSearchFriends = true
        state.spinnerFriends = true
        axios.post(`${API_URL}/friends/filterFriends`, {id: localStorage.id, value: payload}, headers())
          .then(payload => setTimeout(() => commit('setFilteredFriends', payload.data), 700))
          .catch(error => handlerError(error))
      } else {
        state.stateSearchFriends = false
      }
    },
    searchHumans({commit, state}, payload) {
      if(payload.length > 0) {
        state.filteredHumans = []
        state.stateSearchHumans = true
        state.spinnerHumans = true
        axios.post(`${API_URL}/friends/filterHumans`, {id: localStorage.id, value: payload}, headers())
        .then(payload => setTimeout(() => commit('setFilteredHumans', payload.data), 700))
        .catch(error => handlerError(error))
      } else {
        state.stateSearchHumans = false
      }
    },
    deleteFriend({commit}, payload) {
      commit('deleteFriend', payload.idx)
      axios.post(`${API_URL}/friends/deleteFriend`, {id: localStorage.id, friendId: payload.id}, headers())
        .catch(error => handlerError(error))
    },
    rejectionFriendship({commit}, payload) {
      commit('rejectionFriendship', payload)
      commit('home/decCounter', null, {root: true})
      axios.post(`${API_URL}/friends/rejectionFriendship`, {id: localStorage.id, humanId: payload}, headers())
        .catch(error => handlerError(error))
    }
  }
}