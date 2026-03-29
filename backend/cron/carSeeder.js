const cron = require("node-cron");
const { CarCompany } = require("../model/CarCompany");
const { CarModel } = require("../model/CarModel");
const carData = require("../config/CarData");

const makeSlug = (text) =>
  text.toLowerCase().trim().replace(/\s+/g, "-");

const seedCars = async () => {
  try {
    console.log("🚀 Car seeding started...");
    for (const companyData of carData) {
      let company = await CarCompany.findOneAndUpdate(
        { slug: companyData.slug },
        {
          name: companyData.name,
          slug: companyData.slug,
          code: companyData.code
        },
        { new: true, upsert: true }
      );
      for (const model of companyData.models) {
        const modelSlug = makeSlug(model.name);
        await CarModel.findOneAndUpdate(
          {
            companyId: company._id,
            name: model.name
          },
          {
            slug: modelSlug,
            code: model.code,
            bodyType: model.bodyType,
            // launchYear: model.launchYear
          },
          { new: true, upsert: true }
        );
      }
    }
    console.log("✅ Car seeding completed");
  } catch (err) {
    console.error("❌ Error in seeding:", err);
  }
};


// 🔥 Run once on server start (IMPORTANT)
// const runSeeder = async () => {
//   await seedCars();
// };

// // 🕒 Cron (monthly enough)
// cron.schedule("0 0 1 * *", () => {
//   console.log("⏰ Running monthly car seeder...");
//   seedCars();
// });

// module.exports = runSeeder;
module.exports = seedCars;