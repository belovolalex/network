const passport = require('passport')
const Message = require('../models/Message')
const mongoose = require('mongoose')
const errorHandler = require('../utils/errorHandler')

module.exports = express => {
  const router = express.Router()
  router.post('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
    let newMsg = {
      message: req.body.message,
      sender: req.body.from,
      recipient: req.body.to
    }
    let message = new Message(newMsg)
    try {
      let msg = await message.save()
      res.status(200).json({message: msg})
    } catch(e) {
      errorHandler(res, e)
    }
  })
  router.post('/friendMsgs', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
      const msgs = await Message.find({$or: [{"$and" : [{sender: {_id: req.body.sender}}, {recipient: {_id: req.body.recipient }}]}, {"$and" : [{recipient: {_id: req.body.sender}}, {sender: {_id: req.body.recipient }}]}]}, '-__v')
        .populate('sender', ['name'])
        .limit(req.body.limit)
        .sort({created: -1})
        .skip(req.body.skip * req.body.limit)
      res.status(200).json(msgs)
    } catch(e) {
      errorHandler(res, e)
    }
  })
  router.post('/lastMsgs', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
      let idToSearch = mongoose.Types.ObjectId(req.body.sender)
        const msgs = await Message.aggregate(
          [
            {
              $match: {
                $or: [{sender: idToSearch}, {recipient: idToSearch}]
              }
            },
            { $sort: { created: 1 } },
            {
              $group: {
                _id: {
                  $cond:
                  { if: {$gte: ["$sender", "$recipient"]},
                        then: ["$sender", "$recipient"],
                        else: ["$recipient", "$sender"]
                      }
                    },
                'message':{$last: '$$ROOT'}
              }
            },
            {
              $lookup: {
                from: 'users',
                localField: 'message.sender',
                foreignField: '_id',
                as: 'user1'
              }
            },
            {
              $unwind: "$user1"
            },
            {
              $lookup: {
                from: 'users',
                localField: 'message.recipient',
                foreignField: '_id',
                as: 'user2'
              }
            },
            {
              $unwind: "$user2"
            },
            
            {
              $project: {
                user1: {
                  _id: 1,
                  name: 1,
                  lastName: 1,
                  image: 1,
                  stateRead: 1
                },
                user2: {
                  _id: 1,
                  name: 1,
                  lastName: 1,
                  image: 1,
                  stateRead: 1
                },
                message: '$message'
              }
            }
          ]
          )
          let unreadMsgs = await Message.aggregate(
            [
              {
                $match: {
                  $and: [{recipient: mongoose.Types.ObjectId(req.body.sender)}, {stateRead: false}]
                }
              },
              {
                $group: {
                  _id: "$sender",
                  countUnreadMsgs : { $sum : 1 }
                }
              }
            ]
          )
          res.status(200).json({msgs: msgs, unreadMsgs : unreadMsgs})
    } catch(e) {  
      errorHandler(res, e)
    }
  })
  router.post('/changeStateReadMsgs', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
      await Message.updateMany({_id: {$in: req.body.arrMsgsId}}, {$set: {'stateRead': true}})
      res.status(200).json({message: 'msgs was updated'})
    } catch(e) {
      errorHandler(res, e)
    }
  })
  return router
}
