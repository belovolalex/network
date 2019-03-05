const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  secretToken: {
    type: String
  },
  image: {
    type: String,
    default: 'https://res.cloudinary.com/dquwzmbz/image/upload/v1551698615/avatar.svg'
  },
  active: {
    type: Boolean
  },
  publicId: {
    type: String
  },
  date: { 
    type: Date,
    default: Date.now
  },
  online: {
    type: Boolean,
    default: false
  }
})
module.exports = mongoose.model('users', userSchema)
