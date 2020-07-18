const Homeless = require('./../models/homelessModel');

exports.getAllHomeless = async (req, res) => {
	try {
		const homeless = await Homeless.find();

		res.status(200).json({
			status: 'success',
			results: homeless.length,
			data: {
				homeless
			}
		});
	} catch (error) {
		res.status(404).json({
			status: 'fail',
			message: error
		});
	}
};

exports.getHomeless = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not yet defined!'
	});
};

exports.createHomeless = async (req, res) => {
	try {
		const newHomeless = await Homeless.create(req.body);

		res.status(201).json({
			status: 'success',
			data: {
				homeless: newHomeless
			}
		});
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			message: error
		});
	}
};

exports.updateHomeless = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not yet defined!'
	});
};

exports.deleteHomeless = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not yet defined!'
	});
};
