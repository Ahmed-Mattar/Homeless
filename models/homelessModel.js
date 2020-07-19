const mongoose = require('mongoose');
const validator = require('validator');

const HomelessSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		maxlength: [ 40, 'A name must have less or equal than 40 characters' ],
		minlength: [ 10, 'A name must have more or equal than 10 characters' ],
		validate: [ validator.isAlpha, 'name must only contain characters ' ]
	},
	author: {
		type: String,
		required: [ true, 'A case published must have an author' ]
	},
	description: {
		type: String,
		required: [ true, 'A case published must have a brief description' ],
		trim: true,
		maxlength: [ 150, 'A description of a case must have more or equal to 150 character' ]
	},
	medicalCare: {
		type: Boolean,
		required: [ true, 'A case published must have a medical status' ]
	},
	gender: {
		type: String,
		enum: {
			values: [ 'Male', 'Female' ],
			message: 'Gender is either: Male or Female'
		},
		required: [ true, 'A case published must have a gender' ]
	},
	underAge: {
		type: Boolean,
		required: [ true, "A case published must be known if it's underage " ]
	},
	age: {
		type: Number,
		max: [ 110, 'max age is 110' ]
	},
	imageCover: {
		type: String
	},
	createdAt: { type: Date, default: Date.now, select: false }
	// location
	// comments
});

const Homeless = mongoose.model('Homeless', HomelessSchema);

module.exports = Homeless;

// const testHomeless = new Homeless({
// 	author: 'ahmed mattar',
// 	description: 'old guy in a very bad shape',
// 	medicalCare: true
// });

// testHomeless
// 	.save()
// 	.then((doc) => {
// 		console.log(doc);
// 	})
// 	.catch((err) => {
// 		console.log('Error:', err);
// 	});
