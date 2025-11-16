const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const cors = require('cors');
const userRoute = require('./routes/UserRoute.js');
const serviceInquiryRoute = require('./routes/InquiryRoute.js');
const connectDB = require('./config/db.js');
const cookieParser = require('cookie-parser');
app.use(express.static('public'));
/* Db connection */
connectDB();

/* Middleware */
app.use(cors(
    { origin: process.env.FRONTEND_URL, credentials: true ,methods: ['GET', 'POST', 'PUT', 'DELETE']}
));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* Routes */
app.use('/api/user', userRoute);
app.use('/api/service', serviceInquiryRoute);

app.get('/', (req, res) => {
    res.send('hello wordle');
});

/* Port running */
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
