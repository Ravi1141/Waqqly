const mongoose = require('mongoose');
const { Schema } = mongoose;

const WalkerSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	lat: String,
	long: String,
	preferredTime: {
		type: String,
		required: true
	},
	address: {
		type: String
	}
})

const Walker = mongoose.model('Walker', WalkerSchema);
module.exports = Walker; 