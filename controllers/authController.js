const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const sendEmail = require('./../utils/email');

const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);

	res.status(statusCode).json({
		status: 'success',
		token,
		data: {
			user
		}
	});
};

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
			passwordConfirm: req.body.password,
			role: req.body.role
		});

		createSendToken(newUser, 201, res);
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
		createSendToken(user, 200, res);
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			message: error.message
		});
	}
};

exports.protect = async (req, res, next) => {
	try {
		// 1) Getting token and check of it's there
		let token;
		if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
			token = req.headers.authorization.split(' ')[1];
		}
		if (!token) {
			throw new Error('You are not logged in! Please log in to get access');
		}
		// 2) Verification token
		const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

		// 3) Check if user still exists
		const currentUser = await User.findById(decoded.id);
		if (!currentUser) {
			throw new Error('The user belonging to this token does no longer exist');
		}

		// 4) Check if user changed password after the token was issued
		if (currentUser.changedPasswordAfter(decoded.iat)) {
			throw new Error('User recently changed password! Please log in again');
		}

		// Grant access to protected route
		req.user = currentUser;
		next();
	} catch (error) {
		res.status(401).json({
			status: 'fail',
			message: error.message
		});
	}
};

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		// roles ['admin', 'charity']
		try {
			if (!roles.includes(req.user.role)) {
				throw new Error('You do not have permission to perform this action');
			}
			next();
		} catch (error) {
			res.status(403).json({
				status: 'fail',
				message: error.message
			});
		}
	};
};

exports.forgotPassword = async (req, res, next) => {
	try {
		//1) Get user based on POSTed email
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			throw new Error('There is no user with email address');
		}
		//2) Generate the random reset token

		const resetToken = user.createPasswordResetToken();

		await user.save({ validateBeforeSave: false });
		//3) Send it to user's email
		const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}}`;

		const message = `Forgot your password? Submit a Patch request with your new password and passwordConfirm to: 
		${resetURL}.\n If you didn't forget your password, please ignore this message`;

		try {
			await sendEmail({
				email: user.email,
				subject: 'Your password reset token (valid for 10 min)',
				message
			});

			res.status(200).json({
				status: 'success',
				message: 'Token send to email!'
			});
		} catch (error) {
			user.passwordResetToken = undefined;
			user.passwordResetExpires = undefined;

			await user.save({ validateBeforeSave: false });
			throw new Error('There was an error sending the email. try again later!');
		}
		next();
	} catch (error) {
		res.status(404).json({
			status: 'fail',
			message: error.message
		});
	}
};

exports.resetPassword = async (req, res, next) => {
	try {
		// 1) get user based on the token
		const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

		const user = await User.findOne({
			passwordResetToken: hashedToken,
			passwordResetExpires: { $gt: Date.now() }
		});
		// 2) if Token has not expired, and there is user, set the new password
		if (!user) {
			throw new Error('Token is invalid or has expired');
		}
		user.password = req.body.password;
		user.passwordConfirm = req.body.passwordConfirm;
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save();
		// 3) Update changedPasswordAt property for the user
		// 4) log the user in, send JWT
		createSendToken(user, 200, res);
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			message: error.message
		});
	}
};

// for logged in users
exports.updatePassword = async (req, res, next) => {
	try {
		// 1) Get user from collection
		const user = await User.findById(req.user.id).select('+password');
		// 2) check if POSTed password is correct
		if (!await user.correctPassword(req.body.passwordCurrent, user.password)) {
			throw new Error('Your current password is wrong');
		}
		// 3) If so, update password
		user.password = req.body.password;
		user.passwordConfirm = req.body.passwordConfirm;
		await user.save();
		// 4) Log user in, send Jwt
		createSendToken(user, 200, res);
	} catch (error) {
		res.status(401).json({
			status: 'fail',
			message: error.message
		});
	}
};
