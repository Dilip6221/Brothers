const express = require("express");
const { Blog } = require("../model/Blog");
const { Services } = require("../model/Services");

const router = express.Router();

const escapeXml = (value) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&apos;");

router.get("/sitemap.xml", async (req, res) => {
  try {
    const siteUrl = (process.env.SITE_URL || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");
    const [blogs, services] = await Promise.all([
      Blog.find({ status: "PUBLISHED" }).select("slug updatedAt").lean(),
      Services.find({ status: "ACTIVE" }).select("slug updatedAt").lean(),
    ]);

    const staticPaths = ["/", "/about", "/services", "/blog", "/gallery", "/contact-us", "/faqs", "/online-services"];
    const urls = [
      ...staticPaths.map((path) => ({ path })),
      ...services.map((service) => ({ path: `/service/${service.slug}`, updatedAt: service.updatedAt })),
      ...blogs.map((blog) => ({ path: `/blog/${blog.slug}`, updatedAt: blog.updatedAt })),
    ];

    const body = urls.map(({ path, updatedAt }) => `
  <url>
    <loc>${escapeXml(`${siteUrl}${path}`)}</loc>${updatedAt ? `
    <lastmod>${new Date(updatedAt).toISOString()}</lastmod>` : ""}
  </url>`).join("");

    res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}
</urlset>`);
  } catch (error) {
    console.error("Sitemap error:", error);
    res.status(500).type("text/plain").send("Unable to generate sitemap");
  }
});

router.get("/robots.txt", (req, res) => {
  const siteUrl = (process.env.SITE_URL || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");
  res.type("text/plain").send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /profile\nDisallow: /my-car-vault\nDisallow: /login\nDisallow: /forget-password\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
});

module.exports = router;
