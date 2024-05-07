const Bookings = require('../Models/Bookings');
const axios = require('axios');
require('dotenv').config(); 

const router = require('express').Router();

router.get('/', async (req, res) => {
	try {
		// Get all bookings
		const bookings = await Bookings.find();

		// If there are no bookings, return an empty array
		if (!bookings.length) {
			return res.json([]);
		}

		// For each booking, retrieve owner and walker details
		const enhancedBookings = await Promise.all(bookings.map(async (booking) => {
			// Retrieve owner and walker data concurrently
			const [owner, walker] = await Promise.all([
				axios.get(`${process.env.APP_URI}/users/user/${booking.owner}`),
				axios.get(`${process.env.APP_URI}/walkers/walker/${booking.walker}`)
			]);

			// Return the enhanced booking object with additional details
			return {
				...booking.toObject(), // Make sure to convert to object for safe manipulation
				owner: owner.data,
				walker: walker.data,
			};
		}));

		return res.json(enhancedBookings);
	} catch (error) {
		console.error(error); // Log error for debugging
		return res.status(500).json({ error: error.message });
	}
});

router.post('/', async (req, res) => {
	try {
		console.log(req.body);
		const booking = await Bookings.create({
			from: req.body.from,
			to: req.body.to,
			owner: req.body.id,
			walker: req.body.walker
		})

		res.json(booking) 
	}
	catch (error) {
		return res.status(500).json(error);
	}

})


module.exports = router; 