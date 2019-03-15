const express = require('express')
const app = express()
const mongoose = require('mongoose')
const http = require('http').createServer(app)
const keys = require('./config/keys')
const bodyParser = require('body-parser')
const passport = require('passport')
const io = require('socket.io').listen(http)
const cors = require('cors')

const authController = require('./controllers/auth')(express)
const verifyController = require('./controllers/verify')(express)
const userController = require('./controllers/user')(express)
const friendsController = require('./controllers/friends')(express)
const aploadAvatarController = require('./controllers/aploadAvatar')(express)
const msController = require('./controllers/ms')(express)

require('./sockets/index')(io)

mongoose.connect(keys.mongoURI, { useNewUrlParser: true })
  .then(() => console.log('mongodb connected'))
  .catch(error => console.log(error))
mongoose.set('useFindAndModify', false)

app.use(passport.initialize())
require('./middleware/passport')(passport)


app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(express.static('public'))

app.use('/api/aploadAvatar', aploadAvatarController)
app.use('/api/auth', authController)
app.use('/api/verifyEmail', verifyController)
app.use('/api/user', userController)
app.use('/api/friends', friendsController)
app.use('/api/ms', msController)


if(process.env.NODE_ENV === 'production') {
  app.use(express.static(__dirname + '/public/'))

  app.get(/.*/, (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
  })
}

http.listen(process.env.PORT || 3000, ()=> console.log('server has been started'))
