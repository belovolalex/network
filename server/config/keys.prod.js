module.exports = {
  mongoURI: process.env.mongoUri,
  jwt: process.env.jwt,
  mailer: {
    user: process.env.mailerUser,
    pass: process.env.mailerPath
  },
  cloudinary: { 
    cloud_name: process.env.cloudName, 
    api_key: process.env.cloudKey,
    api_secret: process.env.cloudSecret
  }
}