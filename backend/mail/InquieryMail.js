const { transporter } = require('../model/User.js');

const sendInqueryMail = async (user) => {
  try {
    await transporter.sendMail({
      from: `"BROTHER'S" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: "New Customer Inquiry Received!",
      html: `
      <div style="font-family: Arial, sans-serif; background: #f6f6f6; padding: 20px;">
        <div style="max-width: 650px; margin:auto; background:#ffffff; box-shadow:0 4px 12px rgba(0,0,0,0.1); overflow:hidden;">

          <!-- HEADER -->
          <div style="background: linear-gradient(90deg, #ff4b2b, #72545b); text-align:center; color:#fff;">
            <img src="https://res.cloudinary.com/dagsmbnaa/image/upload/v1763031828/brand_cuxsip.png"
                 style="width:120px;" />
          </div>

          <!-- CUSTOMER INFO -->
          <div style="padding:20px;">
            <h3 style="border-left:4px solid #ff4b2b; padding-left:10px; color:#333;">👤 Customer Information</h3>
            <div style="background:#fafafa; padding:15px; border-radius:8px; margin-top:10px;">
              <p><strong>Name:</strong> ${user.name}</p>
              <p><strong>Phone:</strong> ${user.phone}</p>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>City:</strong> ${user.city}</p>
              <p><strong>Address:</strong> ${user.address}</p>
            </div>
          </div>

          <!-- CAR INFO -->
          <div style="padding:20px;">
            <h3 style="border-left:4px solid #72545b; padding-left:10px; color:#333;">🚘 Car Details</h3>
            <div style="background:#fafafa; padding:15px; border-radius:8px; margin-top:10px;">
              <p><strong>Brand:</strong> ${user.carBrand}</p>
              <p><strong>Model:</strong> ${user.carModel}</p>
            </div>
          </div>

          <!-- SERVICES SECTION -->
          <div style="padding:20px;">
            <h3 style="border-left:4px solid #ff4b2b; padding-left:10px; color:#333;">🛠 Selected Services</h3>
            <div style="background:#fafafa; padding:15px; border-radius:8px; margin-top:10px;">
              <p><strong>Services:</strong> ${user.services?.length ? user.services.join(", ") : "—"}</p>
            </div>
          </div>

          <!-- NOTES -->
          <div style="padding:20px;">
            <h3 style="border-left:4px solid #72545b; padding-left:10px; color:#333;">📝 Additional Notes</h3>
            <div style="background:#fafafa; padding:15px; border-radius:8px; margin-top:10px;">
              <p>${user.notes || "No notes provided."}</p>
            </div>
          </div>

          <!-- BUTTON -->
          <div style="padding:20px; text-align:center;">
            <a href="${process.env.FRONTEND_URL}"
               style="padding:12px 25px; background:#ff4b2b; color:#fff; text-decoration:none;
                      border-radius:6px; font-weight:bold;">Open Dashboard</a>
          </div>

          <!-- FOOTER -->
          <div style="background:#eee; padding:15px; text-align:center; font-size:12px; color:#555;">
            © ${new Date().getFullYear()} BROTHER'S. All rights reserved.
          </div>

        </div>
      </div>
      `,
    });
  } catch (error) {
    console.error("Error sending inquiry email:", error);
  }
};

module.exports = { sendInqueryMail };
