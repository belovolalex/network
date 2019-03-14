const User = require('../models/User')
module.exports = io => {
  let users = []
  io.on('connection', function(socket) {
    socket.on('setStatusOnline', async payload => {
      if(payload !== null) {
        users.push({[socket.id]: payload})
        let user = await User.findOne({_id: payload})
        if(user) {
          user.online = true
          await user.save()
        }
        io.emit('setStatusOnline', payload)
      }
    })
    socket.on('disconnect', async () => {
      let userId
      users.some((el, idx, arr) => {
        if(el[socket.id]) {
          userId = el[socket.id]
          arr.splice(idx, 1)
          return true
        }
      })
      let user = await User.findOne({_id: userId})
      if(user) {
        user.online = false
        await user.save()
      }
      io.emit('setStatusOffline', userId)
    })
    socket.on('offerToFriendship', payload => {
      users.some(async el => {
        if(payload.to === Object.values(el)[0]) {
          const user = await User.findById(payload.from, 'name lastName online image')
          io.to(Object.keys(el)[0]).emit('offerToFriendship', user)
        }
      })
    })
    socket.on('msg', payload => {
      users.some(el => {
        if(payload.message.recipient === Object.values(el)[0]) {
          User.findById(payload.message.sender, 'name lastName image online', (err, doc) => {
            let sender = {
              sender: doc
            }
            let obj = Object.assign(payload.message, sender)
            io.to(Object.keys(el)[0]).emit('msg', obj)
          })
          return true
        }
     })
    })
    socket.on('markReadMsgs', payload => {
      users.some(el => {
        if(payload.to === Object.values(el)[0]) {
          io.to(Object.keys(el)[0]).emit('markReadMsgs', {msgs: payload.arrMsgs, from: payload.from})
          return true
        }
      })
    })
  })
  return io
}