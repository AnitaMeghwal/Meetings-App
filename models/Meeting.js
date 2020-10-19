const mongoose = require('mongoose');

const UserSchema1 = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	organizer: {
		type: String,
		required: true
	},
	participants: {
		type: String,
		required: true
	},
	date: {
		type: String,
		required: true
	},
	mtime: {
		type: String,
		required: true
	}
});

const Meeting = mongoose.model('Meeting', UserSchema1);

module.exports = Meeting;