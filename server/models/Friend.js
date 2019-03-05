const mongoose = require('mongoose')
const Schema = mongoose.Schema

const friendSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  IAdding: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }],
  addingMe: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }],
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'users'
  }],
  created: { 
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('friends', friendSchema)
