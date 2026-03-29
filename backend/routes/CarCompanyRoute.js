const express = require("express");
const router = express.Router();

const { getCarCompay,getCarModels} = require("../controller/CarCompanyController.js");

router.get("/:companyId/car-models", getCarModels);
router.get("/companies", getCarCompay);

module.exports = router;
