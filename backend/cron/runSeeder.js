require("dotenv").config();
const connectDB = require("../config/db");
const seedCars = require("../cron/carSeeder");

const run = async () => {
  await connectDB(); 
  await seedCars();
  process.exit();
};

run();