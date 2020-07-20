const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [ true, 'Please tell us your name!' ],
		minlength: 5
	},
	email: {
		type: String,
		required: [ true, 'Please provide your email' ],
		unique: true,
		lowercase: true,
		validate: [ validator.isEmail, 'please provide a valid email' ]
	},
	password: {
		type: String,
		required: [ true, 'Please provide a password' ],
		minlength: 8,
		select: false
	},
	passwordConfirm: {
		type: String,
		required: [ true, 'Please confirm your password' ],
		validate: {
			// on CREATE and SAVE
			validator: function(el) {
				return el === this.password;
			},
			message: 'Passwords are not the same!'
		}
	},
	passwordChangedAt: {
		type: Date
	},
	role: {
		type: String,
		enum: [ 'user', 'admin' ],
		default: 'user'
	},
	passwordResetToken: String,
	passwordResetExpires: Date
});

// mongoose middleware
// between getting the data and saving it to the database
userSchema.pre('save', async function(next) {
	// Only run this function if password was actually modified
	if (!this.isModified('password')) return next();
	// Hash the password with cost of 12
	this.password = await bcrypt.hash(this.password, 12);
	// Delete passwordConfirm field
	this.passwordConfirm = undefined;
	next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
		return JWTTimestamp < changedTimestamp;
	}
	// False means NOT changed
	return false;
};

// a randome string going to send to the user
userSchema.methods.createPasswordResetToken = function() {
	const resetToken = crypto.randomBytes(32).toString('hex');

	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

	console.log({ resetToken }, this.passwordResetToken);

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
