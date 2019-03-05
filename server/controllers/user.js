const User = require('../models/User')
const Friend = require('../models/Friend')
const passport = require('passport')
const errorHandler = require('../utils/errorHandler')
module.exports = express => {
  const router = express.Router()
  router.post('/home', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
      const user = await User.findById(req.body.id).select('name lastName image')
      const whoAddingMe = await Friend.findOne({user:req.body.id}, '-_id addingMe')
      let whoAddingMeLength 
      if(whoAddingMe) {
        whoAddingMeLength = whoAddingMe.addingMe.length
      } else {
        whoAddingMeLength = 0
      }
      let obj = {
        user: user,
        whoAddingMeLength: whoAddingMeLength
      }
      res.status(200).json(obj)
    } catch (e) {
      errorHandler(res, e)
    }
  })
  return router
}