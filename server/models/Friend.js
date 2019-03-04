const mongoose = require('mongoose')
const Schema = mongoose.Schema

const friendSchema = new Schema({
  whomIAdding: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }],
  whoAddingMe: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
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
