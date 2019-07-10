import axios from 'axios'
import {API_URL, headers} from '../../utils'
import {socket} from '../socket'
import { handlerError } from '../../utils/handlerErrors'
export default {
  namespaced: true,
  state: {
    spinnerFriendMsgs: true,
    spinnerLastMsgs: false,
    stateDialogWindow: false,
    statePrevMsgs: false,
    stateFirstMsgs: false,
    stateRotate: false,
    lastMsgs: [],
    friends: [],
    limitFriends: 50,
    friend: {
      image: '',
      id: '',
      name: '',
      lastName: '',
      msgs: [],
      friends: []
    },
    msgsSettings: {
      limit: 30,
      skip: 0
    },
    months: 'january,february,march,april,may,june,july,august,september,october,november,december'.split(',')
  },
  getters: {
    getStateFirstMsgs: state => state.stateFirstMsgs && state.msgsSettings.skip > 1 ? true : false,
    friendMsgs: state => {
      let data = state.friend.msgs.map((el, idx, arr) => {
        if(arr[idx-1]) {
          if(arr[idx].date === arr[idx-1].date) {
            el.showDate = false
          } else {
            el.showDate = true
          }
        } else {
          el.showDate = true
        }
        if(arr[idx-1]) {
          if(arr[idx].sender._id === arr[idx-1].sender._id && el.showDate === false){
            el.showName = false          
          } else {
            el.showName = true
          }
        } else {
          el.showName = true
        }
          return el
        })
        return data
    }
  },
  mutations: {
    setLastMsgs(state, payload) {
      state.spinnerLastMsgs = false
      payload.msgs.forEach(el => {
        let user
        el.user1._id !== localStorage.id ? user = el.user1 : user = el.user2 
        let counterUnreadMsgs
        payload.unreadMsgs.some(item => item._id === user._id ? counterUnreadMsgs = item.countUnreadMsgs : null)
        state.lastMsgs.push({
          _id: user._id,
          message: el.message.message,
          name: user.name,
          lastName: user.lastName,
          image: user.image,
          counterUnreadMsgs: counterUnreadMsgs
        })
      })
    },
    changeStateDialogWindow(state, payload) {
      state.stateDialogWindow = payload
    },
    changeStateRotate(state, payload) {
      state.stateRotate = payload
    },
    changeStatePrevMsgs(state, payload) {
      state.statePrevMsgs = payload
    },
    clearDialogWindow(state) {
      state.friend = {
        id: '',
        name: '',
        lastName: '',
        msgs: [],
        friends: []
      }
      state.msgsSettings.skip = 0
      state.statePrevMsgs = false
      state.stateFirstMsgs = false
      state.stateDialogWindow = false
    },
    setFriend(state, payload) {
      let friend = state.friend
      friend.id = payload._id
      friend.name = payload.name
      friend.image = payload.image
      friend.lastName = payload.lastName
      state.lastMsgs.some(el => {
        if(el._id === payload._id) {
          el.counterUnreadMsgs = 0
        }
      })
    },
    setFriendMsgs(state, payload) {
      state.spinnerFriendMsgs = false
      if(payload.length) {
        payload.forEach(el => {
          let d = new Date(el.created)
          let minutes = d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes()
          let date = `${d.getDate()} ${state.months[d.getMonth()]}`
          el.date = date
          el.time = `${d.getHours()}:${minutes}`
          state.friend.msgs.unshift(el)
        })
      } else {
        state.stateFirstMsgs = true
      }
    },
    setFriends(state, payload) {
      state.spinnerLastMsgs = false
      state.friend.friends = payload
    },
    addToFriendMsgs(state, payload) {
      let d = new Date()
      let name = payload.hasOwnProperty('sender') ? payload.sender.name : localStorage.name
      let minutes = d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes()
      state.friend.msgs.push({
        stateRead: false,
        message: payload.message,
        sender: {
          _id: localStorage.id,
          name: name
        },
        created: d,
        date: `${d.getDate()} ${state.months[d.getMonth()]}`,
        time: `${d.getHours()}:${minutes}`
      })
    },
    addToLastMsgs(state, payload) {
      state.lastMsgs.forEach(el => el._id === state.friend.id ? el.message = payload.message : null)
      let checkExistenceLastMsg = state.lastMsgs.some( el => el._id === state.friend.id )
      if(!checkExistenceLastMsg) {
        state.lastMsgs.push({
          _id: state.friend.id,
          message: payload.message,
          name: state.friend.name,
          lastName: state.friend.lastName,
          image: state.friend.image
        })
      }
    },
    clearFriend(state) {
      state.stateDialogWindow = false
      state.lastMsgs = []
      state.friends = []
      state.limitFriends = 50,
      state.friend.id = ''
      state.friend.name = ''
      state.friend.lastName = ''
      state.friend.msgs = []
      state.friend.friends = []
    }
  },
  actions: {
    lastMsgs({commit, state}) {
      state.spinnerLastMsgs = true
      axios.post(`${API_URL}/ms/lastMsgs`, {sender: localStorage.id}, headers())
        .then(payload => setTimeout(() => commit('setLastMsgs', payload.data), 500))
        .catch(error => handlerError(error))
    },

    friendMsgs({commit, state}) {
      state.spinnerFriendMsgs = true
      axios.post(`${API_URL}/ms/friendMsgs`, { sender: localStorage.id, recipient: state.friend.id,
                                             skip: state.msgsSettings.skip, limit: state.msgsSettings.limit },
                                             headers())
        .then(payload => {
          state.msgsSettings.skip +=1
          setTimeout(() => {
            commit('setFriendMsgs', payload.data)
          },500)
        })
        .catch(error => handlerError(error))
    },

    sendMsg({commit, state}, payload) {
      commit('addToLastMsgs', payload)
      let message = {
        from: localStorage.id,
        to: state.friend.id,
        message: payload.message
      }
      axios.post(`${API_URL}/ms`, message, headers())
        .then(payload => socket.emit('msg', payload.data))
        .catch(error => handlerError(error))
    },

    setFriends({commit, state}) {
      state.spinnerLastMsgs = true
      axios.post(`${API_URL}/friends/friends`, {id: localStorage.id, limit: state.limitFriends}, headers())
        .then(payload => setTimeout(() => commit('setFriends', payload.data), 700))
        .catch(error => handlerError(error))
    },
      
    updateStateReadMsgs({state}, payload) {
      socket.emit('markReadMsgs', {from: localStorage.id, to: state.friend.id, arrMsgs: payload})
      axios.post(`${API_URL}/ms/changeStateReadMsgs`, {arrMsgsId: payload}, headers())
        .catch(error => handlerError(error))
    }
  }
}