// require('dotenv').config()
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'opediabug@gmail.com',
    pass: 'zzarxuchgqersujf'
  },
})


const generateOTP = () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('')

const sendOTPEmail = (email = [], subject = 'Email Subject', body, cc = [], bcc = []) => {
  const mailOptions = {
    from: `Bug O Pedia <${process.env.GMAIL_USER}>`,
    to: email.toString(),
    cc: cc.toString(),
    bcc: bcc.toString(),
    subject: subject,
    html: body,
  }

  transporter.sendMail(mailOptions)
    .then(info => console.log('Email sent:', info.response))
    .catch(error => console.log('Error sending email:', error))
}

module.exports = {
  generateOTP,
  sendOTPEmail
}
