const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
  message: {
    type: String
  },
  stateRead: {
    type: Boolean,
    default: false
  },
  sender: {
    ref: 'users',
    type: Schema.Types.ObjectId
  },
  recipient: {
    ref: 'users',
    type: Schema.Types.ObjectId
  },
  created: { 
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('message', messageSchema)
