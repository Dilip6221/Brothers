const express = require('express');
const router = express.Router();
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory,createService,getServices,getServiceById,updateService,deleteService , createPackage, getPackages, getPackageById, updatePackage, deletePackage , createAddon,getAddons,getAddonById,updateAddon,deleteAddon} = require('../controller/OnlineServiceController');

const { upload } = require('../middleware/multer');
const { authUser } = require('../middleware/auth');

router.post('/admin/online-category-create', authUser, createCategory);
router.get('/admin/online-category',authUser, getCategories);
router.get("/:id", authUser, getCategoryById);
router.put('/admin/online-category/:id', authUser, updateCategory);
router.delete('/admin/online-category/:id', authUser, deleteCategory);

router.post('/admin/online-service-create', authUser, createService);
router.get('/admin/get-online-service/:id', authUser, getServiceById);
router.put('/admin/online-service-update/:id', authUser, updateService);
router.delete('/admin/online-service-delete/:id', authUser, deleteService); // Delete a service
router.get('/admin/list-online-service', authUser, getServices);

router.post("/admin/package-create",  createPackage);
router.get("/admin/package", authUser, getPackages);
router.get("/admin/package/:id", authUser, getPackageById);
router.put("/admin/package-update/:id", authUser, updatePackage);
router.delete("/admin/package-delete/:id", authUser, deletePackage);


router.post("/admin/addon-create",  createAddon);
router.get("/admin/addon", authUser, getAddons);
router.get("/admin/addon/:id", authUser, getAddonById);
router.put("/admin/addon-update/:id", authUser, updateAddon);
router.delete("/admin/addon-delete/:id", authUser, deleteAddon);

// router.post('/admin/slot', upload.single("image"), createService);
// router.get('/admin/slot', authUser, getAllInquiries);
// router.put('/admin/slot/:id', authUser, updateServiceStatus);
// router.delete('/admin/slot/:id', authUser, deleteSlot);


// router.get('/admin/bookings', authUser,  getAllInquiries);
// router.put('/admin/bookings/:id', authUser, updateServiceStatus);



module.exports = router;