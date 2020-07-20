const User = require('./../models/userModel');

const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};

exports.getAllUsers = async (req, res) => {
	try {
		const users = await User.find();

		// SEND RESPONSE
		res.status(200).json({
			status: 'success',
			results: users.length,
			data: {
				users
			}
		});
	} catch (error) {
		res.status(500).json({
			status: 'error',
			message: 'This route is not yet defined!'
		});
	}
};

exports.updateMe = async (req, res, next) => {
	try {
		// 1) Create error if user POSTs password data
		if (req.body.password || req.body.passwordConfim) {
			throw new Error('This route is not for password updates. please use /updateMyPassword');
		}
		// 2) Update user document
		const filteredBody = filterObj(req.body, 'name', 'email');
		const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });

		res.status(200).json({
			status: 'success',
			data: {
				user: updatedUser
			}
		});
	} catch (error) {
		res.status(400).json({
			status: 'error',
			message: error.message
		});
	}
};

exports.getUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not yet defined!'
	});
};
exports.createUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not yet defined!'
	});
};
exports.updateUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not yet defined!'
	});
};
exports.deleteUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not yet defined!'
	});
};
