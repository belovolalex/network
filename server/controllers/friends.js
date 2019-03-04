const User = require('../models/User')
const Friend = require('../models/Friend')
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

  router.post('/friends', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try{
      // console.log('req.body', req.body)
      // const ttt = await User.findById(req.body.id, '-_id friends').populate('friends')
      // const friendsId = await User.findById(req.body.id, '-_id friends')
      const friendsId = await User.findById(req.body.id)
      console.log('friendsId ------- ', friendsId)
      // let ttt = friendsId.friends.populate(user._id)
      // console.log('----------------', ttt)
      const whoAddingMeId = await User.findById(req.body.id, '-_id whoAddingMe')
      const whoAddingMe = await getFriends(whoAddingMeId.whoAddingMe, ['name', 'lastName', 'image', 'online']) 
      const friends = await getFriends(friendsId.friends, ['name', 'lastName', 'image', 'online'])
      res.status(200).json({friends: friends, whoAddingMe: whoAddingMe})
    } catch(e) {
      errorHandler(res, e)
    }
  })
  
  router.post('/humans', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try{
      const friends = await User.findById(req.body.id, ['-_id', 'friends'])
      const whoAddingMeId = await User.findById(req.body.id, '-_id whoAddingMe')
      let humans = await User.find({$and : [{_id: {$nin : friends.friends}}, {_id: {$nin: whoAddingMeId.whoAddingMe}}, {_id: {$ne: req.body.id}}]}, ['_id', 'image', 'name', 'lastName', 'online'])
      .sort([['date', -1]])
      .limit(req.body.limit)
      .select('name lastName image online whoAddingMe')
        res.status(200).json(humans)
      } catch(e) {
      errorHandler(res, e)
    }
  })
  
  router.post('/addToFriends', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try{
      const sender = await User.findOneAndUpdate({_id: req.body.id}, { $addToSet: { whomIAdding: req.body.humanId} })
      const recipient = await User.findOneAndUpdate({_id: req.body.humanId}, { $addToSet: { whoAddingMe: req.body.id} })
      await sender.save()
      await recipient.save()
      res.status(200).json({
        message: 'запрос добавлен'
      })
    } catch(e) {
      errorHandler(res, e)
    }
  })
  
  router.post('/addFriend', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try{
      const addFriendToSender = await User.findOneAndUpdate({_id: req.body.id}, { $addToSet: { friends: req.body.friendId} })
      const addFriendToRecipient = await User.findOneAndUpdate({_id: req.body.friendId}, { $addToSet: { friends: req.body.id} })
      const deletefromWhoAddingMe = await User.findOneAndUpdate({_id: req.body.id}, {$pull: {whoAddingMe: req.body.friendId}})
      const deletefromWhomIAdding = await User.findByIdAndUpdate(req.body.friendId, {$pull: {whomIAdding: req.body.id}})
      await deletefromWhoAddingMe.save()
      await deletefromWhomIAdding.save()
      await addFriendToRecipient.save()
      await addFriendToSender.save()
      res.status(200).json({message: 'друг добавлен'})      
    } catch(e) {
      errorHandler(res, e)
    }
  })

  router.post('/deleteFriend', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
      const sender = await User.findByIdAndUpdate(req.body.id, {$pull: {friends: req.body.friendId}})
      const friends = await User.findByIdAndUpdate(req.body.friendId, {$pull: {friends: req.body.id}})
      sender.save()
      friends.save()
      res.status(200).json({message: 'удаление успешно'})
    } catch(e) {
      errorHandler(res, e)
    }
  })
  
  router.post('/rejectionFriendship', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
      const sender = await User.findByIdAndUpdate(req.body.id, {$pull: {whoAddingMe: req.body.humanId}})
      const recipient = await User.findByIdAndUpdate(req.body.humanId, {$pull: {whomIAdding: req.body.id}})
      sender.save()
      recipient.save()
      res.status(200).json({message: 'удаление успешно'})
    } catch(e) {
      errorHandler(res, e)
    }
  })
  
  // router.post('/deleteFriend', passport.authenticate('jwt', {session: false}), async (req, res) => {
  //   try{
  //     const sender = await User.findByIdAndUpdate(req.body.sender, {$pull: {friends: req.body.friend}})
  //     const friends = await User.findByIdAndUpdate(req.body.friend, {$pull: {friends: req.body.sender}})
  //     sender.save()
  //     friends.save()
  //     res.status(200).json({message: 'удаление успешно'})
  //   } catch(e) {
  //     errorHandler(res, e)
  //   }
  // })
  // router.post('/friendsForMessage', passport.authenticate('jwt', {session: false}), async (req, res) => {
  //   try {
  //     const friendsId = await User.findById(req.body.id, '-_id friends')
  //     const friends = await getFriends(friendsId.friends, ['name', 'lastName', 'image', 'online'])
  //     res.status(200).json(friends)
  //   } catch (e) {
  //     errorHandler(res, e)
  //   }
  // })

  // router.post('/newFriends', passport.authenticate('jwt', {session: false}), async (req, res) => {
  //   try {
  //     const whomIAdd = await User.findById(req.body.id, 'whomIAdd')
  //     const myFriends = await User.findById(req.body.id, ['-_id', 'friends'])
  //     const friends = await User.find({$and : [{_id: {$nin : myFriends.friends}}, {_id: {$ne: req.body.id}}]}, ['_id', 'image', 'name', 'lastName', 'online'])
  //     let data = [
  //       whomIAdd,
  //       {friends: friends}
  //     ]
  //     res.status(200).json(data)
  //   } catch (e) {
  //     errorHandler(res, e)
  //   }
  // })

  // router.post('/potentialFriends', passport.authenticate('jwt', {session: false}), async (req, res) => {
  //   try{
  //     const sender = await User.findOneAndUpdate({_id: req.body.sender}, { $addToSet: { whomIAdd:  req.body.recipient} })
  //     const recipient = await User.findOneAndUpdate({_id: req.body.recipient}, { $addToSet: { potentialFriends:  req.body.sender} })
  //     await sender.save()
  //     await recipient.save()
  //     res.status(200).json({
  //       message: 'запрос добавлен'
  //     })
  //   } catch(e) {
  //     errorHandler(res, e)
  //   }
  // })
  // router.post('/friendsRequest', passport.authenticate('jwt', {session: false}), async (req, res) => {
  //   try{
  //     const potentialFriendsId = await User.findById(req.body.id, '-_id potentialFriends')
  //     const potentialFriends = await getFriends(potentialFriendsId.potentialFriends, ['name', 'lastName', 'image', 'online'])
  //     res.status(200).json(potentialFriends)
  //   } catch(e) {
  //     errorHandler(res, e)
  //   }
  // })
  // router.patch('/deletefriendRequest', passport.authenticate('jwt', {session: false}), async (req, res) => {
  //   try{
  //     const sender = await User.findByIdAndUpdate(req.body.sender, {$pull: {potentialFriends: req.body.friendRequestId}})
  //     const recipient = await User.findByIdAndUpdate(req.body.friendRequestId, {$pull: {whomIAdd: req.body.sender}})
  //     sender.save()
  //     recipient.save()

  //     res.status(200).json({message: 'друг удален'})
  //   } catch(e) {
  //     errorHandler(res, e)
  //   }
  // })
  // router.post('/addToFriends', passport.authenticate('jwt', {session: false}), async (req, res) => {
  //   try{
  //     const addFriendToSender = await User.findOneAndUpdate({_id: req.body.sender}, { $addToSet: { friends: req.body.recipient} })
  //     const addFriendToRecipient = await User.findOneAndUpdate({_id: req.body.recipient}, { $addToSet: { friends: req.body.sender} })
  //     const deletefromSenderPotential = await User.findOneAndUpdate({_id: req.body.sender}, {$pull: {potentialFriends: req.body.recipient}})
  //     const deletefromSenderRecipient = await User.findByIdAndUpdate(req.body.recipient, {$pull: {whomIAdd: req.body.sender}})
  //     await addFriendToSender.save()
  //     await addFriendToRecipient.save()
  //     await deletefromSenderPotential.save()
  //     await deletefromSenderRecipient.save()
  //     res.status(200).json({message: 'друг добавлен'})
  //   } catch(e) {
  //     errorHandler(res, e)
  //   }
  // })
  
  return router
}