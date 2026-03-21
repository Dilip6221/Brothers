const { CustomerReview } = require("../model/CustomerReview.js");

const saveCustomerReview = async (req, res) => {
  try {
    const { name, rating, review, /* service, car */ } = req.body;
    let finalName = name;
    if (req.user) {
      finalName = req.user.name;
    }
    if (!finalName || !rating || !review) {
      return res.json({success: false,message: "All fields are required"});
    }
    const createdCustomerReview = await CustomerReview.create({
        name: finalName,
        userId: req.user ? req.user._id : null,
        rating,
        review,
        // service,
        // car,
      });
    res.json({success: true,message: "Thank you for giving us your valuable feedback!."});
  } catch (error) {
    console.error(error);
    res.json({success: false,message: error.message});
  }
};

const approveCustomerReview = async (req, res) => {
  try {
    const { id } = req.params;
    await CustomerReview.findByIdAndUpdate(id, {
      isApproved: true,
    });
    res.json({success: true,message: "Review approved",});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await CustomerReview.find()
      .sort({ createdAt: -1 });
    res.json({success: true,data: reviews});
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = { saveCustomerReview, approveCustomerReview, getAllReviews };