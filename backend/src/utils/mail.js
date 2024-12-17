const nodemailer = require('nodemailer')
const { MailtrapClient } = require("mailtrap");

const TOKEN = process.env.MAILTRAP_TOKEN;
const client = new MailtrapClient({
  token: TOKEN,
});
const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_TEST_USER,
      pass: process.env.MAILTRAP_TEST_PASS
    }
  });

  const sendVerificationMailProd = async (options) => {
    console.log("Sending email in production...");
    const sender = {
      email: "no-reply@hoangnd20215580.name.vn",
      name: "User Sign In",
    };
    const recipients = [
      {
        email: options.to,
      },
    ];
  
    try {
      const response = await client.send({
        from: sender,
        to: recipients,
        template_uuid: "82daa3b5-7f92-466b-b95a-a38b2a92a7ba",
        template_variables: {
          "user_name": options.name,
          "next_step_link": options.link,
          "get_started_link": "Test_Get_started_link",
          "onboarding_video_link": "Test_Onboarding_video_link",
        },
      });
      console.log("Email sent successfully:", response);
    } catch (error) {
      console.error("Error sending email in production:", error);
    }
  };

const sendVerificationTestMail = async (options) => {
    // Looking to send emails in production? Check out our Email API/SMTP product!

    await transport.sendMail({
      to: options.to,
      from: process.env.VERIFICATION_MAIL,
      subject: 'Auth Verification',
      html: `
          <div>
          <p>Please click on <a href="${options.link}">this link</a> to verify yout account.</p>
          </div>
      `,
    })

} 

const mail = {
  async sendVerificationMail(options) {
    if (process.env.NODE_ENV === "production")
      await sendVerificationMailProd(options);
    else await sendVerificationTestMail(options);
  },
}

module.exports = mail