const User = require('../models/User')
module.exports = express => {
  const router = express.Router()

  router.post('/', async (req, res) => {
    console.log('req.body', req.body)
    const verify = await User.findOne({
      email: req.body.email,
      secretToken: req.body.token
    })
    if(verify) {
      verify.active = true
      verify.save()
      res.status(200).json({message: 'успешная регистрация'})
    } else {
      res.status(400).json({message: 'ключ не совпал'})
    }
  })
  return router
}
