const mongoose = require('mongoose');

const HomelessSchema = new mongoose.Schema({
	author: {
		type: String,
		required: [ true, 'A case published must have an author' ]
	},
	description: {
		type: String,
		required: [ true, 'A case published must have a brief description' ]
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
	comments: [ { body: String, date: Date } ],
	date: { type: Date, default: Date.now }
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
