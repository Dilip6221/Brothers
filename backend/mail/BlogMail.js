const { transporter } = require('../model/User.js');

const sendSubscribeMail = async (email, blog) => {
  try {
    await transporter.sendMail({
      from: `"BROTHER'S GARAGE" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `📝 New Blog Published: ${blog.title}`,
      html: `
      <div style="font-family: Arial, sans-serif; background: #f3f3f3; padding: 25px;">
        <div style="max-width: 620px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 6px 16px rgba(0,0,0,0.12);">

          <!-- Header -->
          <div style="background: linear-gradient(90deg, #ff4b2b, #6a414b); padding: 25px; text-align: center; color: #fff;">
            <img src="https://res.cloudinary.com/dagsmbnaa/image/upload/v1763031828/brand_cuxsip.png" 
                 alt="BROTHER'S" 
                 style="width: 120px; margin-bottom: 10px;" />
            <h2 style="margin: 0; font-size: 22px;">🚀 New Blog Just Arrived!</h2>
          </div>

          <!-- Blog Image -->
          ${blog.thumbnail ? `
            <img src="${blog.thumbnail}" alt="${blog.title}"
              style="width:100%; max-height:280px; object-fit:cover;" />
          ` : ''}

          <!-- Content -->
          <div style="padding: 25px; color: #333; line-height: 1.6;">

            <h2 style="margin: 0; font-size: 24px; color:#222;">${blog.title}</h2>

            <p style="font-size: 14px; color:#777;">
              Stay updated with our latest automobile tips, guides, repairs & expert insights.
            </p>

            <!-- CTA Button -->
            <a href="${process.env.FRONTEND_URL}/blog/${blog.slug}"
               style="display: inline-block; margin-top: 20px; padding: 12px 22px; 
               background: #ff4b2b; color: #fff; text-decoration: none; 
               border-radius: 6px; font-weight: bold; font-size: 15px;">
              Read Full Blog →
            </a>

            <p style="margin-top: 25px; font-size: 12px; color: #aaa;">
              You are receiving this email because you subscribed to BROTHER'S GARAGE blog updates.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #eee; padding: 18px; text-align: center; font-size: 12px; color: #555;">
            © ${new Date().getFullYear()} BROTHER'S GARAGE — All Rights Reserved.
          </div>

        </div>
      </div>
      `,
    });
  } catch (error) {
    console.error("Error sending blog email:", error);
  }
};

module.exports = { sendSubscribeMail };
