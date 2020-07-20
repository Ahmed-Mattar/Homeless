const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const bcrypt = require('bcryptjs');

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN
	});
};

exports.signup = async (req, res, next) => {
	try {
		const newUser = await User.create({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			passwordConfirm: req.body.password
		});

		const token = signToken(newUser._id);

		res.status(201).json({
			status: 'success',
			token,
			data: {
				user: newUser
			}
		});
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			message: error
		});
	}
};

exports.login = async (req, res, next) => {
	const { email, password } = req.body;
	try {
		// 1) Check if email and password exist
		if (!email || !password) {
			throw new Error('Please provide email and password!');
		}
		// 2) Check if user exist && password is correct
		const user = await User.findOne({ email }).select('+password');

		if (!user || !await user.correctPassword(password, user.password)) {
			throw new Error('Incorrect email or password!');
		}

		// 3) if everything is ok, send jsonwebtoken to client
		const token = signToken(user._id);
		res.status(200).json({
			status: 'success',
			token
		});
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			message: error.message
		});
	}
};
