const express = require('express');
const serviceRoute = express.Router();
const { createService,getAllInquiries,getSlugService} = require('../controller/ServiceController');
// const { authUser } = require('../middleware/auth.js');
// 
serviceRoute.post('/admin/create-service', createService);
serviceRoute.get('/admin/services', getAllInquiries);
serviceRoute.get('/service/:slug', getSlugService);

module.exports = serviceRoute;