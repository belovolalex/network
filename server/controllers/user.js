const User = require('../models/User')
const Friend = require('../models/Friend')
const Message = require('../models/Message')
const passport = require('passport')
const errorHandler = require('../utils/errorHandler')
module.exports = express => {
  const router = express.Router()
  router.post('/home', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
      const user = await User.findById(req.body.id).select('name lastName image')
      const unreadMsgs = await Message.find({$and: [{recipient: req.body.id}, {stateRead: false}]})
      const unreadMsgsLength = unreadMsgs.length

      const whoAddingMe = await Friend.findOne({user:req.body.id}, '-_id addingMe')
      let whoAddingMeLength
      if(whoAddingMe) {
        whoAddingMeLength = whoAddingMe.addingMe.length
      } else {
        whoAddingMeLength = 0
      }
      let obj = {
        user: user,
        whoAddingMeLength: whoAddingMeLength,
        unreadMsgsLength : unreadMsgsLength
      }
      res.status(200).json(obj)
    } catch (e) {
      errorHandler(res, e)
    }
  })
  router.post('/human', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
      const stateAddingQuery = await Friend.find({$and: [{user: req.body.id}, {IAdding: req.body.humanId}]})
      const stateFriendQuery = await Friend.find({$and: [{user: req.body.id}, {friends: req.body.humanId}]})
      const stateAddingMeQuery = await Friend.find({$and: [{user: req.body.id}, {addingMe: req.body.humanId}]})
      let stateAdding
      let stateFriendship
      let stateAddingMe
      stateAddingMeQuery.length ? stateAddingMe = true : stateAddingMe = false
      stateFriendQuery.length ? stateFriendship = true : stateFriendship = false
      stateAddingQuery.length ? stateAdding = true : stateAdding = false 
      const user = await User.findById(req.body.humanId).select('name lastName image online')
      res.status(200).json({user: user, stateAdding: stateAdding, stateFriendship: stateFriendship, stateAddingMe: stateAddingMe})
    } catch (e) {
      errorHandler(res, e)
    }
  })
  return router
}