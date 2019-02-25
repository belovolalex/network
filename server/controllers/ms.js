const passport = require('passport')
const Message = require('../models/Message')
const mongoose = require('mongoose')

module.exports = express => {
  const router = express.Router()
  router.post('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
    let newMsg = {
      message: req.body.message,
      sender: req.body.sender,
      recipient: req.body.recipient
    }
    let message = new Message(newMsg)
    try {
      await message.save()
      res.status(200).json({message:'ok'})
    } catch(e) {
      console.log(e)
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
      console.log(e)
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
          res.status(200).json(msgs)
    } catch(e) {  
      console.log(e)
    }
  })
  router.post('/changeStateReadMsgs', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
      let msgs = Message.updateMany({_id: {$in: req.body}}, {$set: {'stateRead': true}}, (err, doc) => {
        console.log('doc', doc)
      })
    } catch(e) {

    }  
  })
  return router
}
