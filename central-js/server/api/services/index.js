var express = require('express');
var router = express.Router();
var controller = require('./servicesTree.controller.js');

router.get('/', controller.getServicesTree);
router.post('/', controller.setServicesTree);
router.delete('/service', controller.removeService);
router.delete('/serviceData', controller.removeServiceData);
router.delete('/subcategory', controller.removeSubcategory);
router.delete('/category', controller.removeCategory);
router.delete('/servicesTree', controller.removeServicesTree);

module.exports = router;
