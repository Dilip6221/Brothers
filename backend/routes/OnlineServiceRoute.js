const express = require('express');
const router = express.Router();
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory,createService,getServices,getServiceById,updateService,deleteService , createPackage, getPackages, getPackageById, updatePackage, deletePackage , createAddon,getAddons,getAddonById,updateAddon,deleteAddon} = require('../controller/OnlineServiceController');

const { upload } = require('../middleware/multer');
const { authUser, authAdminRole } = require('../middleware/auth');

router.post('/admin/online-category-create', authAdminRole, createCategory);
router.get('/admin/online-category',authAdminRole, getCategories);
router.get("/:id", authUser, getCategoryById);
router.put('/admin/online-category/:id', authAdminRole, updateCategory);
router.delete('/admin/online-category/:id', authAdminRole, deleteCategory);

router.post('/admin/online-service-create', authAdminRole, createService);
router.get('/admin/get-online-service/:id', authUser, getServiceById);
router.put('/admin/online-service-update/:id', authAdminRole, updateService);
router.delete('/admin/online-service-delete/:id', authAdminRole, deleteService); // Delete a service
router.get('/admin/list-online-service', authUser, getServices);

router.post("/admin/package-create",authAdminRole,  createPackage);
router.get("/admin/package", authUser, getPackages);
router.get("/admin/package/:id", authUser, getPackageById);
router.put("/admin/package-update/:id", authAdminRole, updatePackage);
router.delete("/admin/package-delete/:id", authAdminRole, deletePackage);


router.post("/admin/addon-create", authAdminRole, createAddon);
router.get("/admin/addon", authUser, getAddons);
router.get("/admin/addon/:id", authUser, getAddonById);
router.put("/admin/addon-update/:id", authAdminRole, updateAddon);
router.delete("/admin/addon-delete/:id", authAdminRole, deleteAddon);

// router.post('/admin/slot', upload.single("image"), createService);
// router.get('/admin/slot', authUser, getAllInquiries);
// router.put('/admin/slot/:id', authUser, updateServiceStatus);
// router.delete('/admin/slot/:id', authUser, deleteSlot);


// router.get('/admin/bookings', authUser,  getAllInquiries);
// router.put('/admin/bookings/:id', authUser, updateServiceStatus);



module.exports = router;