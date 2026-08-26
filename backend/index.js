const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const UserRoute = require('./routes/UserRoute.js');
const serviceInquiryRoute = require('./routes/InquiryRoute.js');
const CustomerReviewRoute = require('./routes/CustomerReviewRoute.js');
const SubscribeRoute = require('./routes/SubscribeRoute.js')
const BlogRoute = require('./routes/BlogRoute.js')
const ServiceRoute = require('./routes/ServiceRoute.js')
const GalleryRoute = require('./routes/GalleryRoute.js');
const JobCardRoute = require('./routes/JobCardRoute.js');
const AboutTimeLineRoute = require('./routes/AboutTimeLineRoute.js');
const CarCompanyRoute = require('./routes/CarCompanyRoute.js');
const authRoute = require('./routes/AuthRoute.js');
const OnlineServiceRoute = require('./routes/OnlineServiceRoute.js');
const SeoRoute = require('./routes/SeoRoute.js');

const connectDB = require('./config/db.js');
const cookieParser = require('cookie-parser');
const { csrfProtection } = require('./middleware/csrf.js');
const { validateEnvironment } = require('./config/env.js');
validateEnvironment();
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',').map((origin) => origin.trim()).filter(Boolean);
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet());
app.use(compression());
app.use(express.static('public'));
/* Db connection */
connectDB();

/* Middleware */
// app.use(cors(
//     { origin: process.env.FRONTEND_URL, credentials: true ,methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH']}
// ));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed'));
  },
  credentials: true
}));
app.use(cookieParser());
app.use(csrfProtection);
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication requests' },
});

/* Routes */
app.use('/api/user', UserRoute);
app.use('/api/inquery', serviceInquiryRoute);
app.use('/api/subscribe', SubscribeRoute);
app.use('/api/blog', BlogRoute);
app.use('/api/service', ServiceRoute);
app.use('/api/online-service', OnlineServiceRoute);
app.use('/api/gallery', GalleryRoute);
app.use('/api/jobcard', JobCardRoute);
app.use('/api/about-timeline', AboutTimeLineRoute);
app.use('/api/car-companies', CarCompanyRoute);
app.use('/api/customer-reviews', CustomerReviewRoute);
app.use('/api/auth', authLimiter, authRoute);
app.use('/', SeoRoute);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use((error, req, res, next) => {
  if (error.message === 'Origin not allowed') {
    return res.status(403).json({ success: false, message: 'Origin not allowed' });
  }
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'Request body too large' });
  }
  console.error('Unhandled server error:', error);
  return res.status(500).json({ success: false, message: 'Internal server error' });
});

app.get('/', (req, res) => {
    res.send('Welcome To RYDAX Studio');
});

/* Port running */
const port = process.env.PORT || 3000;

// app.listen(port, () => {
//     console.log(`Server is running on port: ${port}`);
// });
app.listen(port, '0.0.0.0',() => {
    console.log(`Server is running on port: ${port}`);
});
