import {store} from './index'
import io from 'socket.io-client'

// const socket = io('http://localhost:3000')
const socket = io()

socket.on('connect', () => {
  socket.emit('setStatusOnline', localStorage.id)
  socket.on('setStatusOnline', payload => {
    store.commit('friends/stateUserOnline', payload)
  })
  socket.on('setStatusOffline', payload => {
    store.commit('friends/stateUserOffline', payload)
  })
  socket.on('offerToFriendship', payload => {
    store.commit('home/incCounter')
    store.commit('friends/setFriends', {addingMe : [payload]})
  })
  socket.on('msg', payload => {
    let sender = payload.sender
    let lastMsg = {
      counterUnreadMsgs : 1,
      image: sender.image,
      lastName: sender.lastName,
      name: sender.name,
      _id: sender._id,
      message: payload.message
    }
    let messageState = store.state.messages
    let checkExistenceLastMsg = messageState.lastMsgs.some( el => el._id === sender._id )
    if(messageState.lastMsgs.length) {
      messageState.lastMsgs.forEach(el => {
        if(el._id === sender._id) {
          if(el.counterUnreadMsgs) {
            el.counterUnreadMsgs += 1
          } else {
            el.counterUnreadMsgs = 1
          }
          el.message = payload.message
        }
        if(!checkExistenceLastMsg) {
          messageState.lastMsgs.push(lastMsg)
        }
      })
    } else {
      messageState.lastMsgs.push(lastMsg)
    }
    if(messageState.stateDialogWindow &&  messageState.friend.id === sender._id) {
      let months = 'january,february,march,april,may,june,july,august,september,october,november,december'.split(',')
      let d = new Date(payload.created)
      let minutes = d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes()
      let date = `${d.getDate()} ${months[d.getMonth()]}`
      payload.date = date
      payload.time = `${d.getHours()}:${minutes}`
      messageState.friend.msgs.push(payload)
    } else {
      store.commit('home/incCounterMsg')
    }
  })
  socket.on('markReadMsgs', payload => {
    let messageState = store.state.messages
    if(messageState.stateDialogWindow && messageState.friend.id === payload.from) {
      messageState.friend.msgs.forEach(el => {
        el.stateRead = true
      })
    }
  })
})

export {socket}
