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

exports.getHomelessStats = async (req, res) => {
	try {
		// the documents pass throgh stages of processing // aggregation framework
		const stats = await Homeless.aggregate([
			{
				$match: { age: { $lte: 18 } }
			},
			{
				$group: {
					_id: '$gender', //everything in one group not seperated
					numHomeless: { $sum: 1 },
					averageAge: { $avg: '$age' },
					minAge: { $min: '$age' },
					maxAge: { $max: '$age' }
					//femaleNum: { $filter: { input: gender, as: 'Female' } }
					// MaleNum: {}
				}
			},
			{
				$sort: { numHomeless: -1 } // 1 for ascending -1 for desc
			}
		]);

		res.status(200).json({
			status: 'success',
			data: stats
		});
	} catch (error) {
		res.status(404).json({
			status: 'fail',
			message: error
		});
	}
};
