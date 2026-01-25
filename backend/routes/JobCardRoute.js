const express = require("express");
const router = express.Router();
const { getUserCars,createUserCar } = require("../controller/JobCardController.js");

router.post("/admin/user-cars",getUserCars );
router.post("/admin/user-cars/create",createUserCar );

module.exports = router;
