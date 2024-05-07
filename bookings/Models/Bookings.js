const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookingsSchema = new Schema({
	from: {
		type: String, 
		required: true
	}, 
	to: {
		type: String, 
		required: true
	}, 
	owner: {
		type: String, 
		required: true
	}, 
	walker: {
		type: String, 
		required: true
	}, 
})

const Bookings = mongoose.model('bookings', BookingsSchema);
module.exports = Bookings; 