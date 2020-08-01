const express = require('express');
const homelessController = require('./../controllers/homelessController');
const authController = require('./../controllers/authController');

const router = express.Router();

// homelesss/-within/233/center/-40,45/unit/mi
router.route('/homeless-within/:distance/center/:latlng/unit/:unit').get(homelessController.getHomelessWithin);

router.route('/homeless-stats-underage').get(homelessController.getHomelessStats);
/*
router
	.route('/')
	.get(authController.protect, homelessController.getAllHomeless)
	.post(homelessController.createHomeless);
*/

router
	.route('/')
	.get(homelessController.getAllHomeless)
	.post(authController.protect, homelessController.createHomeless);

router
	.route('/:id')
	.get(homelessController.getHomeless)
	.patch(homelessController.updateHomeless)
	.delete(authController.protect, authController.restrictTo('admin'), homelessController.deleteHomeless);

module.exports = router;
