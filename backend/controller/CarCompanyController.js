const express = require("express");
const { CarCompany } = require("../model/CarCompany.js");
const { CarModel } = require("../model/CarModel.js");


const getCarCompay = async (req, res) => {
    try {
        const companies = await CarCompany.find({ isActive: true })
        .select("name slug");
        res.json({ success: true, data: companies });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: err.message });
    }
};

// router.get("/models/:companyId", async (req, res) => {
const getCarModels = async (req, res) => {
  try {
    const { companyId } = req.params;
    const models = await CarModel.find({
      companyId,
      isActive: true
    }).select("name");
    res.json({ success: true, data: models });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

module.exports = {getCarCompay,getCarModels};