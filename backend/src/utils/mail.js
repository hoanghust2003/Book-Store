const nodemailer = require('nodemailer')
const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_TEST_USER,
      pass: process.env.MAILTRAP_TEST_PASS
    }
  });

const mail = {
    async sendVerificationMail(option){
         // Looking to send emails in production? Check out our Email API/SMTP product!
  
      await transport.sendMail({
        to: option.to,
        from: process.env.VERIFICATION_MAIL,
        subject: 'Auth Verification',
        html: `
            <div>
            <p>Please click on <a href="${option.link}">this link</a> to verify yout account.</p>
            </div>
        `,
      })
  
    },
}

module.exports = mail