const mongoose = require('mongoose');

const HomelessSchema = new mongoose.Schema({
	name: {
		type: String
	},
	author: {
		type: String,
		required: [ true, 'A case published must have an author' ]
	},
	description: {
		type: String,
		required: [ true, 'A case published must have a brief description' ],
		trim: true
	},
	medicalCare: {
		type: Boolean,
		required: [ true, 'A case published must have a medical status' ]
	},
	gender: {
		type: String,
		enum: [ 'Male', 'Female' ],
		required: [ true, 'A case published must have a gender' ]
	},
	underAge: {
		type: Boolean,
		required: [ true, "A case published must be known if it's underage " ]
	},
	age: {
		type: Number,
		min: 3,
		max: 100
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
