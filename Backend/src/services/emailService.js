const nodemailer = require('nodemailer')

const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  // Development fallback: Log email content to console if SMTP not configured
  return {
    sendMail: async (options) => {
      console.log('------------------ [EMAIL LOG FALLBACK] ------------------')
      console.log(`To: ${options.to}`)
      console.log(`Subject: ${options.subject}`)
      console.log(`Body: ${options.text || options.html}`)
      console.log('----------------------------------------------------------')
      return { messageId: 'simulated-email-id' }
    },
  }
}

const sendEmail = async ({ email, subject, message, html }) => {
  const transporter = createTransporter()
  const mailOptions = {
    from: `${process.env.FROM_NAME || 'SmartCart AI'} <${process.env.FROM_EMAIL || 'noreply@smartcart.ai'}>`,
    to: email,
    subject: subject,
    text: message,
    html: html || message,
  }

  await transporter.sendMail(mailOptions)
}

module.exports = sendEmail
