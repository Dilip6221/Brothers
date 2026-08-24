const { transporter } = require('../config/mail.js');
const { Services } = require('../model/Services.js');

const escapeHtml = (value = "") => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const renderSocialIcon = (type) => {
  const icons = {
    instagram: 'https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png',
    whatsapp: 'https://img.icons8.com/ios-filled/50/ffffff/whatsapp.png',
    youtube: 'https://img.icons8.com/ios-filled/50/ffffff/youtube-play.png',
    x: 'https://img.icons8.com/ios-filled/50/ffffff/x.png',
  };

  return `
    <img
      src="${icons[type]}"
      width="20"
      height="20"
      alt="${type}"
      border="0"
      style="display:block;border:0;outline:none;text-decoration:none;"
    />
  `;
};

const buildServiceCardsHtml = async () => {
  try {
    const services = await Services.find({ status: 'ACTIVE' })
      .sort({ displayOrder: 1, createdAt: -1 })
      .limit(3);

    if (!services.length) {
      return `
        <div style="text-align:center;padding:25px 10px;color:#bdbdbd;font-size:15px;">
          Premium services will appear here as soon as they are added to your studio catalog.
        </div>
      `;
    }

    return services.map((service, index) => {
      const imageUrl = service.image?.url || 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=900';
      const points = Array.isArray(service.cardFeatures) && service.cardFeatures.length
        ? service.cardFeatures
        : (Array.isArray(service.benefits) && service.benefits.length ? service.benefits : []);
      const displayPoints = points.slice(0, 3);
      const featureHtml = displayPoints.length
        ? displayPoints.map((point) => `
            <div style="margin-top:10px;color:#ff4033;font-weight:bold;font-size:14px;line-height:24px;">✓ ${escapeHtml(point)}</div>
          `).join('')
        : `
          <div style="margin-top:10px;color:#ff4033;font-weight:bold;font-size:14px;line-height:24px;">✓ Premium care tailored for your vehicle</div>
        `;

      const serviceUrl = service.slug ? `${process.env.FRONTEND_URL}/service/${encodeURIComponent(service.slug)}` : '#';
      const contentHtml = `
        <td style="padding:35px;">
          <div style="font-size:12px;letter-spacing:3px;color:#ff4033;font-weight:bold;margin-bottom:12px;">
            ${(service.category || 'PREMIUM SERVICE').toUpperCase()}
          </div>
          <h3 style="color:#ffffff;font-size:30px;margin:0;">
            ${escapeHtml(service.title)}
          </h3>
          <p style="color:#c8c8c8;line-height:28px;font-size:15px;margin-top:18px;">
            ${escapeHtml(service.shortDescription || service.description || 'Premium automotive service crafted with precision and care.')}
          </p>
          <div style="margin-top:20px;">
            ${featureHtml}
          </div>
          <div style="margin-top:24px;">
            <a href="${serviceUrl}" style="display:inline-block;padding:12px 26px;background:#ff3b30;color:#ffffff;text-decoration:none;border-radius:30px;font-size:14px;font-weight:bold;">
              View Service
            </a>
          </div>
        </td>
      `;

      const imageHtml = `
        <td width="42%">
          <img src="${imageUrl}" style="width:100%;height:240px;display:block;object-fit:cover;" alt="${escapeHtml(service.title)}" />
        </td>
      `;

      return `
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#1d1d1d;border-radius:18px;overflow:hidden;margin-bottom:30px;">
          <tr>
            ${index % 2 === 0 ? `${imageHtml}${contentHtml}` : `${contentHtml}${imageHtml}`}
          </tr>
        </table>
      `;
    }).join('');
  } catch (error) {
    console.error('Error loading services for welcome email:', error);
    return `
      <div style="text-align:center;padding:25px 10px;color:#bdbdbd;font-size:15px;">
        Premium services are currently unavailable, but our team is ready to assist you.
      </div>
    `;
  }
};

const buildWelcomeMailHtml = async (user) => {
  const serviceCardsHtml = await buildServiceCardsHtml();
  const displayName = escapeHtml(user?.name || 'Valued Customer');

  return `
      <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="
      background:#070707;
      padding:40px 0;
      font-family:Arial,Helvetica,sans-serif;
      ">

<tr>

<td align="center">

<table
width="680"
cellpadding="0"
cellspacing="0"
style="
background:#101010;
border-radius:18px;
overflow:hidden;
border:1px solid #232323;
">

<!-- HERO SECTION -->

<tr>

<td
style="
background: #000;
padding: 60px 45px;
">

<table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.94) 34%, rgba(0,0,0,0.55) 58%, rgba(0,0,0,0.18) 100%), url('https://res.cloudinary.com/dagsmbnaa/image/upload/v1785567750/photo-1544829099-b9a0c07fad1a_xsulke.avif') right center / cover no-repeat; border-radius: 24px; overflow: hidden;">
  <tr>
    <td>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="vertical-align:top;"></td>
          <td align="right" style="vertical-align:top;">
            <table cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;">
              <tr>
                <td>
                  <img src="https://res.cloudinary.com/dagsmbnaa/image/upload/v1784881879/rydax_hljrer.png" width="150" style="display:block;" alt="RYDAX STUDIO" />
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding: 0 50px 80px; text-align: left;">
      <span style="display:inline-block; padding:10px 24px; border-radius:999px; background: rgba(255,59,48,0.08); border:1px solid rgba(255,59,48,0.35); color:#ff3b30; font-size:12px; font-weight:800; letter-spacing:1.4px; text-transform:uppercase; margin-bottom:24px;">
        Trusted by premium car owners
      </span>

      <h1 style="margin:0; font-size:44px; line-height:52px; color:#ffffff; font-weight:900; font-family:Arial,Helvetica,sans-serif;">
        India’s Premium <span style="color:#ff3b30; display:block;">Car Detailing</span> Studio
      </h1>

      <p style="margin:24px 0 0; font-size:17px; line-height:28px; color:rgba(255,255,255,0.72); max-width:560px;">
  Welcome, <span style="color:#ffffff; font-weight:700;">${displayName}</span>! 👋
  Your account is ready. Explore our services and book your first appointment anytime.
</p>

      <table cellpadding="0" cellspacing="0" style="margin:32px 0 0;">
        <tr>
          <td style="padding-right:12px;">
            <a href="${process.env.FRONTEND_URL}/contact-us" style="display:inline-block; padding:16px 34px; background:#ff3b30; color:#ffffff; text-decoration:none; font-weight:bold; border-radius:40px; font-size:15px;">
              Book Consultation
            </a>
          </td>
          <td>
            <a href="${process.env.FRONTEND_URL}/services" style="display:inline-block; padding:16px 34px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,59,48,0.42); color:#ffffff; text-decoration:none; font-weight:bold; border-radius:40px; font-size:15px;">
              Explore Services
            </a>
          </td>
        </tr>
      </table>

      <table cellpadding="0" cellspacing="0" style="margin:40px 0 0; width:100%;">
        <tr>
          <td style="padding-right:10px; width:33%;">
            <div style="padding:20px 18px; border-radius:18px; background:rgba(255,255,255,0.045); border:1px solid rgba(255,59,48,0.22); text-align:center;">
              <div style="color:#ff3b30; font-size:28px; font-weight:900; margin-bottom:8px; font-family:Arial,Helvetica,sans-serif;">10K+</div>
              <div style="color:rgba(255,255,255,0.68); font-size:13px; line-height:1.4;">Cars Serviced</div>
            </div>
          </td>
          <td style="padding-right:10px; width:33%;">
            <div style="padding:20px 18px; border-radius:18px; background:rgba(255,255,255,0.045); border:1px solid rgba(255,59,48,0.22); text-align:center;">
              <div style="color:#ff3b30; font-size:28px; font-weight:900; margin-bottom:8px; font-family:Arial,Helvetica,sans-serif;">5+</div>
              <div style="color:rgba(255,255,255,0.68); font-size:13px; line-height:1.4;">Years Experience</div>
            </div>
          </td>
          <td style="width:33%;">
            <div style="padding:20px 18px; border-radius:18px; background:rgba(255,255,255,0.045); border:1px solid rgba(255,59,48,0.22); text-align:center;">
              <div style="color:#ff3b30; font-size:28px; font-weight:900; margin-bottom:8px; font-family:Arial,Helvetica,sans-serif;">98%</div>
              <div style="color:rgba(255,255,255,0.68); font-size:13px; line-height:1.4;">Happy Customers</div>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

</td>

</tr>
<!-- PREMIUM SERVICES -->

<tr>

<td
style="
background:#151515;
padding:60px 45px;
">

<div
style="
text-align:center;
">

<div
style="
font-size:13px;
letter-spacing:4px;
color:#ff4033;
font-weight:bold;
text-transform:uppercase;
">

OUR PREMIUM SERVICES

</div>

<h2
style="
margin-top:18px;
font-size:38px;
color:#ffffff;
margin-bottom:18px;
">

Built For Enthusiasts.
Trusted By Professionals.

</h2>

<p
style="
font-size:16px;
line-height:30px;
color:#bdbdbd;
max-width:560px;
margin:auto;
margin-bottom:55px;
">

Every vehicle deserves precision.
From detailing to protection,
RYDAX delivers luxury-grade automotive care.

</p>

</div>

${serviceCardsHtml}

</td>
</tr>
<!-- FOLLOW RYDAX -->

<tr>

<td
style="
padding:55px 45px;
background:#151515;
text-align:center;
border-top:1px solid #262626;
">

<div
style="
font-size:13px;
letter-spacing:4px;
color:#ff4033;
font-weight:bold;
text-transform:uppercase;
margin-bottom:14px;
">

FOLLOW RYDAX

</div>

<h2
style="
margin:0;
font-size:34px;
color:#ffffff;
font-weight:bold;
">

Stay Connected

</h2>

<p
style="
margin:20px auto 38px;
max-width:520px;
color:#bfbfbf;
font-size:16px;
line-height:30px;
">

See real customer transformations,
premium detailing projects,
exclusive offers and car care tips.

</p>

<table align="center" cellpadding="0" cellspacing="0" border="0" role="presentation">
  <tr>

    <!-- Instagram -->
    <td style="padding:0 6px;">
      <table width="50" height="50" cellpadding="0" cellspacing="0" border="0" role="presentation"
             style="background:#1d1d1d;border:1px solid #2b2b2b;border-radius:16px;">
        <tr>
          <td align="center" valign="middle">
            <a href="https://www.instagram.com/" target="_blank" style="display:block;">
              ${renderSocialIcon('instagram')}
            </a>
          </td>
        </tr>
      </table>
    </td>

    <!-- WhatsApp -->
    <td style="padding:0 6px;">
      <table width="50" height="50" cellpadding="0" cellspacing="0" border="0" role="presentation"
             style="background:#1d1d1d;border:1px solid #2b2b2b;border-radius:16px;">
        <tr>
          <td align="center" valign="middle">
            <a href="https://wa.me/919313015917" target="_blank" style="display:block;">
              ${renderSocialIcon('whatsapp')}
            </a>
          </td>
        </tr>
      </table>
    </td>

    <!-- YouTube -->
    <td style="padding:0 6px;">
      <table width="50" height="50" cellpadding="0" cellspacing="0" border="0" role="presentation"
             style="background:#1d1d1d;border:1px solid #2b2b2b;border-radius:16px;">
        <tr>
          <td align="center" valign="middle">
            <a href="https://youtube.com/@dilipahir6221" target="_blank" style="display:block;">
              ${renderSocialIcon('youtube')}
            </a>
          </td>
        </tr>
      </table>
    </td>

    <!-- X -->
    <td style="padding:0 6px;">
      <table width="50" height="50" cellpadding="0" cellspacing="0" border="0" role="presentation"
             style="background:#1d1d1d;border:1px solid #2b2b2b;border-radius:16px;">
        <tr>
          <td align="center" valign="middle">
            <a href="https://x.com/DilipBe00479036" target="_blank" style="display:block;">
              ${renderSocialIcon('x')}
            </a>
          </td>
        </tr>
      </table>
    </td>

  </tr>
</table>

<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:38px;">
  <tr>
    <td style="border-top:1px solid #2b2b2b;padding-top:28px;">

      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>

          <td align="center" style="width:33.33%;padding:0 10px;">
            <div style="font-size:11px;color:#ff3b30;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;">
              LOCATION
            </div>

            <div style="color:#ffffff;font-size:15px;line-height:24px;">
              📍 New Delhi, India
            </div>
          </td>

          <td align="center" style="width:1px;background:#2b2b2b;"></td>

          <td align="center" style="width:33.33%;padding:0 10px;">
            <div style="font-size:11px;color:#ff3b30;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;">
              CALL US
            </div>

            <a href="tel:+919313015917"
               style="color:#ffffff;font-size:15px;text-decoration:none;">
              📞 +91 93130 15917
            </a>
          </td>

          <td align="center" style="width:1px;background:#2b2b2b;"></td>

          <td align="center" style="width:33.33%;padding:0 10px;">
            <div style="font-size:11px;color:#ff3b30;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;">
              EMAIL
            </div>

            <a href="mailto:contact@rydaxstudio.com"
               style="color:#ffffff;font-size:15px;text-decoration:none;">
              ✉ contact@rydaxstudio.com
            </a>
          </td>

        </tr>
      </table>

    </td>
  </tr>
</table>

</td>

</tr>

<tr>

<td
style="
padding:40px;
background:#0b0b0b;
text-align:center;
border-top:1px solid #262626;
">

<p
style="
margin:0;
font-size:13px;
color:#666666;
line-height:24px;
">
© ${new Date().getFullYear()} <span style="color:#ff3c3c;font-weight:800;">RYDAX Studio</span>. All Rights Reserved.

</p>

</td>

</tr>
</table>
</td>
</tr>
</table>
`;
};

const sendWelcomeMail = async (user, options = {}) => {
  try {
    const html = await buildWelcomeMailHtml(user);

    if (options.previewOnly) {
      return { previewHtml: html, skipped: true };
    }

    await transporter.sendMail({
      from: `"RYDAX Studio" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Welcome to RYDAX — Premium Car Detailing Studio',
      html,
    });
    return { success: true, skipped: false };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
};
module.exports = { sendWelcomeMail, buildWelcomeMailHtml };