const { Subscription } = require('../model/Subscribe.js');

/* For save subscription data by user */
const saveSubscription = async (req, res) => {
    try {

        const { email } = req.body;
        if (!email) {
            return res.json({ success: false, message: "Email is required" });
        }
        const existingData = await Subscription.findOne({ email });
        if (existingData) {
            return res.json({ success: false, message: "This email is already register" });
        }
        const newSubscription = await Subscription.create({email});
        return res.json({ success: true, message: "Thank you for subscribing to our newsletter!" });
    } catch (error) {
        console.error('Error in Subscribe:', error);
        res.json({ success: false, message: error.message });
    }

}
const showSubscriptionData = async (req, res) => {
    try {
        const allSubscribeData = await Subscription.find().sort({ createdAt: -1 });
        res.json({ success: true, data: allSubscribeData });
    } catch (error) {
        console.error('Error in find subscription Data:', error);
        res.json({ success: false, message: error.message });
    }
}
module.exports = {saveSubscription,showSubscriptionData};
