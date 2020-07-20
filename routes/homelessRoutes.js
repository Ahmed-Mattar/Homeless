const express = require('express');
const homelessController = require('./../controllers/homelessController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/near-me').get(homelessController.aliasNearMe, homelessController.getAllHomeless);

router.route('/homeless-stats-underage').get(homelessController.getHomelessStats);

router
	.route('/')
	.get(authController.protect, homelessController.getAllHomeless)
	.post(homelessController.createHomeless);

router
	.route('/:id')
	.get(homelessController.getHomeless)
	.patch(homelessController.updateHomeless)
	.delete(authController.protect, authController.restrictTo('admin'), homelessController.deleteHomeless);

module.exports = router;
