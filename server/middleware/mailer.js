const nodemailer = require("nodemailer")
const config = require('../config/keys')

let smtpTransport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: config.mailer.user,
    pass: config.mailer.pass
  },
  tls: {
    rejectUnauthorized: false
  }
})

module.exports.sendEmail = function (req, res, mailOptions) {
  return smtpTransport.sendMail(mailOptions, async function(error, response){
    try {
      console.log('')
    } catch(e) {
      console.log(e)
    }
  })
}