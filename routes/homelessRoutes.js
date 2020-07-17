const express = require('express');
const homelessController = require('./../controllers/homelessController');

const router = express.Router();

router.route('/').get(homelessController.getAllHomeless).post(homelessController.createHomeless);

router
	.route('/:id')
	.get(homelessController.getHomeless)
	.patch(homelessController.updateHomeless)
	.delete(homelessController.deleteHomeless);

module.exports = router;
