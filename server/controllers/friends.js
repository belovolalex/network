const User = require('../models/User')
const Friend = require('../models/Friend')
const passport = require('passport')
const errorHandler = require('../utils/errorHandler')

module.exports = express => {
  
  const router = express.Router()
  
  router.post('/friends', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
      const populateQuery = [
                              {path: 'friends', select: 'image online name lastName', options: {limit : req.body.limit }},
                              {path: 'addingMe', select: 'image online name lastName'}
                            ]
      const friends = await Friend.findOne({user: req.body.id}, '_id').populate(populateQuery)
      res.status(200).json(friends)
    } catch(e) {
      errorHandler(res, e)
    }
  })
  
  router.post('/humans', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try{
      const user = await Friend.findOne({user: req.body.id}, '-_id IAdding addingMe friends')
      let addingMe
      let friends
      let IAdding
      if(user) {
        user.addingMe.length ? addingMe = {_id: {$nin: user.addingMe}} : addingMe = {}
        user.friends.length ? friends = {_id: {$nin: user.friends}} : friends = {}
        user.IAdding.length ? IAdding = {_id: {$nin: user.IAdding}} : IAdding = {}
      } else {
        addingMe = {}
        friends = {}
        IAdding = {}
      }
      const humans = await User.find({$and: [{_id: {$ne: req.body.id}}, addingMe, IAdding, friends]})
        .sort([['date', -1]])
        .limit(req.body.limit)
        .select('name lastName image online')
        res.status(200).json(humans)
      } catch(e) {
      errorHandler(res, e)
    }
  })
  
  router.post('/offerToFriendship', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try{
      const senderCandidate = await Friend.findOne({
        user: req.body.id
      })
      if(senderCandidate) {
        await senderCandidate.update({$addToSet: {IAdding: req.body.humanId}})
        await senderCandidate.save()
      } else {
        const friend = new Friend({
          user: req.body.id,
          IAdding: req.body.humanId
        })
        await friend.save()
      }
      const recipientCandidate = await Friend.findOne({
        user: req.body.humanId
      })
      if(recipientCandidate) {
        await recipientCandidate.update({$addToSet: {addingMe: req.body.id}})
        await recipientCandidate.save()
      } else {
        const friend = new Friend({
          user: req.body.humanId,
          addingMe: req.body.id
        })
        await friend.save()
      }
    } catch(e) {
      errorHandler(res, e)
    }
  })
  
  router.post('/addFriend', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try{
      const addFriendTosender = await Friend.findOneAndUpdate( {user: req.body.id}, {$addToSet: {friends: req.body.friendId}} )
      const deletefromAddingMe = await Friend.findOneAndUpdate( {user: req.body.id}, {$pull: {addingMe: req.body.friendId}} )
      const addFriendToRecipient = await Friend.findOneAndUpdate( {user: req.body.friendId}, { $addToSet: { friends: req.body.id}} )
      const deletefromIAdding = await Friend.findOneAndUpdate({user: req.body.friendId}, {$pull: {IAdding: req.body.id}})
      await addFriendTosender.save()
      await deletefromAddingMe.save()
      await addFriendToRecipient.save()
      await deletefromIAdding.save()
      res.status(200).json({message: 'друг добавлен'})      
    } catch(e) {
      errorHandler(res, e)
    }
  })

  router.post('/deleteFriend', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
      const sender = await Friend.findOneAndUpdate({user: req.body.id}, {$pull: {friends: req.body.friendId}})
      const friends = await Friend.findOneAndUpdate({user: req.body.friendId}, {$pull: {friends: req.body.id}})
      sender.save()
      friends.save()
      res.status(200).json({message: 'удаление успешно'})
    } catch(e) {
      errorHandler(res, e)
    }
  })
  
  router.post('/rejectionFriendship', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
      const sender = await Friend.findOneAndUpdate({user: req.body.id}, {$pull: {addingMe: req.body.humanId}})
      const recipient = await Friend.findOneAndUpdate({user:req.body.humanId}, {$pull: {IAdding: req.body.id}})
      sender.save()
      recipient.save()
      res.status(200).json({message: 'удаление успешно'})
    } catch(e) {
      errorHandler(res, e)
    }
  })
  
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

  return router
}