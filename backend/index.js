const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const cors = require('cors');
const UserRoute = require('./routes/UserRoute.js');
const serviceInquiryRoute = require('./routes/InquiryRoute.js');
const CustomerReviewRoute = require('./routes/CustomerReviewRoute.js');
const SubscribeRoute = require('./routes/SubscribeRoute.js')
const BlogRoute = require('./routes/BlogRoute.js')
const ServiceRoute = require('./routes/ServiceRoute.js')
const GalleryRoute = require('./routes/GalleryRoute.js');
const JobCardRoute = require('./routes/JobCardRoute.js');
const connectDB = require('./config/db.js');
const cookieParser = require('cookie-parser');
app.use(express.static('public'));
/* Db connection */
connectDB();

/* Middleware */
app.use(cors(
    { origin: process.env.FRONTEND_URL, credentials: true ,methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH']}
));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* Routes */
app.use('/api/user', UserRoute);
app.use('/api/inquery', serviceInquiryRoute);
app.use('/api/subscribe', SubscribeRoute);
app.use('/api/blog', BlogRoute);
app.use('/api/service', ServiceRoute);
app.use('/api/gallery', GalleryRoute);
app.use('/api/jobcard', JobCardRoute);
app.use('/api/customer-reviews', CustomerReviewRoute);

app.get('/', (req, res) => {
    res.send('Welcome To BROTHERS');
});

/* Port running */
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
