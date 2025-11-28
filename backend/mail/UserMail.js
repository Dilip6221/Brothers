const nodemailer = require('nodemailer');
const { transporter } = require('../model/User.js');

const sendWelcomeMail = async (user) => {
  try {
    await transporter.sendMail({
      from: `"BROTHER'S" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "🚀 Welcome to Brother's Garage!",
      html: `
        <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(90deg, #ff4b2b, #72545b); padding: 20px; text-align: center; color: #fff;">
              <img src="https://res.cloudinary.com/dagsmbnaa/image/upload/v1763031828/brand_cuxsip.png" alt="BROTHER'S" style="width: 120px;" />
              <p style="margin: 5px 0 0;">At BROTHER'S, We Don’t Just Fix Cars – We Build Trust</p>
            </div>
            <div style="padding: 20px; color: #333;">
              <p>Welcome to <strong>Our Studio</strong>! 🎉</p>
              <p>We’re excited to have you on board. From classic restorations to the latest supercars, 
              we’ve got everything to fuel your passion for cars.</p>
              <p>🚀 Start exploring now and make your journey unforgettable!</p>
              <a href="${process.env.FRONTEND_URL}" 
                 style="display: inline-block; margin-top: 15px; padding: 12px 20px; background: #ff4b2b; color: #fff; 
                        text-decoration: none; border-radius: 5px; font-weight: bold;">
                 Visit Garage
              </a>
              <p style="margin-top: 20px; font-size: 12px; color: #777;">
                If you didn’t register, please ignore this email.
              </p>
            </div>
            <div style="background: #eee; padding: 15px; text-align: center; font-size: 12px; color: #555;">
              © ${new Date().getFullYear()} BROTHER'S GARAGE. All rights reserved.
            </div>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};
module.exports = { sendWelcomeMail };