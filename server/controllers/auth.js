const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const { check, validationResult } = require('express-validator/check')
const mailer = require('../middleware/mailer')

module.exports = express => {
  const router = express.Router()

  router.post('/register', [
    check('email').isEmail()
  ], async (req, res) => {
    try {
      const errors = validationResult(req)
      if(!errors.isEmpty()) {
        console.log('errors', errors.array())
      }
      const candidate = await User.findOne({
        email: req.body.email
      })
        if(candidate) {
          res.status(409).json({
            message: 'такой email уже занят! Попробуйте еще раз'
          })
        } else {
          const salt = bcrypt.genSaltSync(10)
          const secretToken = bcrypt.genSaltSync(10)
          const password = req.body.password
          const user = new User({
            email: req.body.email,
            name: req.body.name,
            lastName: req.body.lastName,
            password: bcrypt.hashSync(password, salt),
            secretToken: secretToken,
            active: false
          })
          let mailOptions = {
            from: 'social network Friend',
            to : req.body.email,
            subject : "регистрация в Friend",
            html : `<p style="text-transform: capitalize;">Здравствуйте, ${req.body.name}! Для подтверждения регистрации, скопируйте и введите секретный ключ в форму</p><br> <span style="border: 1px solid #285892; padding: 5px; border-radius: 2px; color:#285892; display:inline-block;">${secretToken}</span>`
          }
          try {
            await user.save()
            await mailer.sendEmail(req, res, mailOptions)
            res.status(201).json({message: 'пользователь добавлен', email: req.body.email})
          } catch(e) {
            res.status(400).json({message: 'что-то пошло не так', error: e})
          }
        }
    } catch(e) {
        console.log(e)
    }
  })
  router.post('/login', async (req, res) => {
    const candidate = await User.findOne({
      email: req.body.email,
      active: true
    })
    
    if(candidate) {
      const passwordResult = bcrypt.compareSync(req.body.password, candidate.password )
      if(passwordResult) {
        candidate.secretToken = undefined
        candidate.save()
        const token = jwt.sign({
          email: candidate.email,
          userId: candidate._id
        }, keys.jwt, { expiresIn: 60 * 60 * 168})
        res.status(200).json({
          token: `Bearer ${token}`,
          id: candidate._id,
          name: candidate.name
        })
      } else {
        res.status(401).json({
          message: 'пароли не совпадают'
        })
      }
    } else {
      res.status(404).json({
        message: "пользователь с таким email не найден"
      })
    }
  })
  return router
}