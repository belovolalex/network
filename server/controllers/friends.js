const User = require('../models/User')
const passport = require('passport')
const mongoose = require('mongoose')
const errorHandler = require('../utils/errorHandler')
module.exports = express => {

  const router = express.Router()

  async function getFriends(arr, fields) {
    let friends = []
    for(item of arr) {
      let friend = await searchFriend(item, fields)
      friends.push(friend)
    }
    return friends
  }

  async function searchFriend(item, fields) {
    let objectIdItem = mongoose.Types.ObjectId(item)
    let friend = await User.findById({_id: objectIdItem}, fields)
    return friend
  }

  router.post('/friendsForMessage', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
      const friendsId = await User.findById(req.body.id, '-_id friends')
      const friends = await getFriends(friendsId.friends, ['name', 'lastName', 'image', 'online'])
      res.status(200).json(friends)
    } catch (e) {
      errorHandler(res, e)
    }
  })

  router.post('/newFriends', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
      const whomIAdd = await User.findById(req.body.id, 'whomIAdd')
      const myFriends = await User.findById(req.body.id, ['-_id', 'friends'])
      const friends = await User.find({$and : [{_id: {$nin : myFriends.friends}}, {_id: {$ne: req.body.id}}]}, ['_id', 'image', 'name', 'lastName', 'online'])
      let data = [
        whomIAdd,
        {friends: friends}
      ]
      res.status(200).json(data)
    } catch (e) {
      errorHandler(res, e)
    }
  })

  router.post('/potentialFriends', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try{
      const sender = await User.findOneAndUpdate({_id: req.body.sender}, { $addToSet: { whomIAdd:  req.body.recipient} })
      const recipient = await User.findOneAndUpdate({_id: req.body.recipient}, { $addToSet: { potentialFriends:  req.body.sender} })
      await sender.save()
      await recipient.save()
      res.status(200).json({
        message: 'запрос добавлен'
      })
    } catch(e) {
      errorHandler(res, e)
    }
  })
  router.post('/friendsRequest', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try{
      const potentialFriendsId = await User.findById(req.body.id, '-_id potentialFriends')
      const potentialFriends = await getFriends(potentialFriendsId.potentialFriends, ['name', 'lastName', 'image', 'online'])
      res.status(200).json(potentialFriends)
    } catch(e) {
      errorHandler(res, e)
    }
  })
  router.patch('/deletefriendRequest', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try{
      const sender = await User.findByIdAndUpdate(req.body.sender, {$pull: {potentialFriends: req.body.friendRequestId}})
      const recipient = await User.findByIdAndUpdate(req.body.friendRequestId, {$pull: {whomIAdd: req.body.sender}})
      sender.save()
      recipient.save()

      res.status(200).json({message: 'друг удален'})
    } catch(e) {
      errorHandler(res, e)
    }
  })
  router.post('/addToFriends', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try{
      const addFriendToSender = await User.findOneAndUpdate({_id: req.body.sender}, { $addToSet: { friends: req.body.recipient} })
      const addFriendToRecipient = await User.findOneAndUpdate({_id: req.body.recipient}, { $addToSet: { friends: req.body.sender} })
      const deletefromSenderPotential = await User.findOneAndUpdate({_id: req.body.sender}, {$pull: {potentialFriends: req.body.recipient}})
      const deletefromSenderRecipient = await User.findByIdAndUpdate(req.body.recipient, {$pull: {whomIAdd: req.body.sender}})
      await addFriendToSender.save()
      await addFriendToRecipient.save()
      await deletefromSenderPotential.save()
      await deletefromSenderRecipient.save()
      res.status(200).json({message: 'друг добавлен'})
    } catch(e) {
      errorHandler(res, e)
    }
  })
  router.post('/getFriends', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try{
      const friendsId = await User.findById(req.body.id, '-_id friends')
      const friends = await getFriends(friendsId.friends, ['name', 'lastName', 'image', 'online'])
      res.status(200).json(friends)
    } catch(e) {
      errorHandler(res, e)
    }
  })
  router.post('/deleteFriend', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try{
      const sender = await User.findByIdAndUpdate(req.body.sender, {$pull: {friends: req.body.friend}})
      const friends = await User.findByIdAndUpdate(req.body.friend, {$pull: {friends: req.body.sender}})
      sender.save()
      friends.save()
      res.status(200).json({message: 'удаление успешно'})
    } catch(e) {
      errorHandler(res, e)
    }
  })
  
  return router
}