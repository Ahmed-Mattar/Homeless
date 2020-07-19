const Homeless = require('./../models/homelessModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasNearMe = (req, res, next) => {
	// logic for getting near me locations in a certain radius
	next();
};

exports.getAllHomeless = async (req, res) => {
	try {
		// EXECUTE QUERY
		const features = new APIFeatures(Homeless.find(), req.query).filter().sort().limitFields().paginate();

		const homeless = await features.query;

		// SEND RESPONSE
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
			message: error.message,
			error
		});
	}
};

exports.getHomeless = async (req, res) => {
	try {
		const homeless = await Homeless.findById(req.params.id);
		// Homeless.findOne({_id: req.params.id})

		res.status(200).json({
			status: 'success',
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

exports.createHomeless = async (req, res) => {
	try {
		console.log(req.body);
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

exports.updateHomeless = async (req, res) => {
	try {
		const homeless = await Homeless.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		});
		// new -- > the new updated documents is the one that gets returned

		res.status(200).json({
			status: 'success',
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

exports.deleteHomeless = async (req, res) => {
	try {
		await Homeless.findByIdAndDelete(req.params.id);
		res.status(500).json({
			status: 'success',
			data: null
		});
	} catch (error) {
		res.status(404).json({
			status: 'fail',
			message: error
		});
	}
};
