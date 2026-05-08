const express = require('express');
const serviceRoute = express.Router();
const { createService,getAllInquiries,getSlugService,updateServiceStatus} = require('../controller/ServiceController');
const { upload } = require('../middleware/multer');
const { authUser, authAdminRole} = require('../middleware/auth');

// serviceRoute.post('/admin/create', createService);
serviceRoute.post('/admin/create', authAdminRole, upload.single("image"), createService);
serviceRoute.get('/admin/services', getAllInquiries);
serviceRoute.get('/get-service/:id', getSlugService);
serviceRoute.post("/admin/update-status", authAdminRole, updateServiceStatus);

module.exports = serviceRoute;