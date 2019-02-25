const User = require('../models/User')
const passport = require('passport')
const errorHandler = require('../utils/errorHandler')
module.exports = express => {
  const router = express.Router()
  router.post('/home', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
      const user = await User.findById(req.body.id)
      res.status(200).json(user)
    } catch (e) {
      errorHandler(res, e)
    }
  })
  return router
}