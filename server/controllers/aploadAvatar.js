const User = require('../models/User')
const uploadFoto = require('../middleware/multer')
const keys = require('../config/keys')
const cloudinary = require('cloudinary')


cloudinary.config({ 
  cloud_name: keys.cloudinary.cloud_name, 
  api_key: keys.cloudinary.api_key, 
  api_secret: keys.cloudinary.api_secret 
})

module.exports = express => {
  const router = express.Router()
  router.post('/', (req, res) => {
    uploadFoto(req, res, async (err) => {
      if(err){
        res.status(400).json({
          message: err
        })
      } else {
        if(req.file == undefined){
          res.status(400).json({
            message: 'пусто'
          })
        } else {
          const user = await User.findById(req.body.id, (err, doc) => {
            if(err) return console.log(err)
          })
          let prevImg = user.publicId
          if(user) {
            cloudinary.v2.uploader.upload(req.file.path,
              function(error, result) {
                if(result) {
                  user.image = result.secure_url
                  user.publicId = result.public_id
                  res.status(201).json({
                    message: 'файл добавлен',
                    image: result.secure_url
                  })
                  user.save()
                  if(prevImg) {
                    cloudinary.v2.uploader.destroy(prevImg, {invalidate: true }, (error, result) => {
                      console.log(result, error)})
                    }
                } else {
                  res.status(400).json({
                    message: 'что то пошло не так',
                  })
                }
            })
          }
        }
      }
    })
  })
  return router
}