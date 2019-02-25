const User = require('../models/User')
const Message = require('../models/User')
module.exports = io => {
  let users = []
  io.on('connection', function(socket) {
    socket.on('setStatusOnline', payload => {
      if(payload !== null) {
        users.push({[socket.id]: payload})
        User.updateOne({_id: payload}, {online: true}, function(err, res) {
          if(err) return console.log('err', err)
          io.emit('setStatusOnline', payload)
        })
      }
    })
    socket.on('disconnect', () => {
      users.forEach((el, idx, arr) => {
        User.updateOne({_id: el[socket.id]}, {online: false}, function(err, res) {
          if(err) return console.log('err', err)
          io.emit('setStatusOffline', el[socket.id])
          el[socket.id] ? arr.splice(idx, 1) : null
        })
      })
    })
    socket.on('addNewFriend', payload => {
      users.some(el => {
        if(payload.recipient === Object.values(el)[0]) {
          const user = User.findById(payload.sender, 'name lastName online image', (err, doc) => {
            io.to(Object.keys(el)[0]).emit('addNewFriend', doc)
          })
          return true
        }
      })
    })
    socket.on('deleteFriendOnSenderSide', payload => {
      users.some(el => {
        if(payload.friend = Object.values(el)[0]) {
          io.to(Object.keys(el)[0]).emit('deleteFriendOnSenderSide', payload.sender)
          return true
        }
      })
    })
    socket.on('addFriendAtSenderSide', payload => {
      users.some(el=> {
        if(payload.recipient === Object.values(el)[0]) {
          const user = User.findById(payload.sender, 'name lastName online image', (err, doc) => {
            io.to(Object.keys(el)[0]).emit('addFriendAtSenderSide', doc)
          })
          return true
        }
      })
    })

    socket.on('msg', payload => {
      users.some(el => {
        if(payload.recipient === Object.values(el)[0]) {
          User.findById(payload.sender, 'name lastName image', (err, doc) => {
            io.to(Object.keys(el)[0]).emit('msg', {message: payload.message, _id: doc._id, image: doc.image, name: doc.name, lastName: doc.lastName})
          })
          return true
        }
     })
    })
    
    socket.on('readMsg', payload => {
      users.some(el => {
        if(payload.recipient === Object.values(el)[0]) {
          io.to(Object.keys(el)[0]).emit('readMsg', {id: payload.sender})
          return true
       }
     })
    })
    socket.on('changeStateRead', payload => {
      users.some(el => {
        if(payload.recipient === Object.values(el)[0]) {
          io.to(Object.keys(el)[0]).emit('changeStateRead', {stateWindow: true})
          return true
       }
     })
    })

    socket.on('typing', payload => {
      users.some(el => {
        if(payload.recipient === Object.values(el)[0]) {
          User.findById(payload.sender, 'name', (err, doc) => {
            io.to(Object.keys(el)[0]).emit('typing', payload.msg)
          })
          return true
       }
     })
    })
  })
  return io
}