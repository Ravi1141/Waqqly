const router = require('express').Router();
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const verifyToken = require('../Utils/verifyToken');
const haversine = require('haversine-distance'); // Helper library for calculating distance
const axios = require('axios');
require('dotenv').config();


router.get('/login', (req, res) => {
	res.render('login');
})

router.get('/signup', (req, res) => {
	res.render('signup');
})

router.get('/user/:id', async (req, res) => {
	const user = await User.findById(req.params.id);
	res.json(user);
})

router.post('/signup', async (req, res) => {
	// check whether the owner with same email exists already 
	try {

		let existingUser = await User.findOne({ email: req.body.email });
		if (existingUser) {
			return res.status(400).send("Email already exists");
		}

		const salt = await bcrypt.genSalt(10); // 10 here is default thing 
		const securedPassword = bcrypt.hash(req.body.password, salt);
		console.log(req.body);
		existingUser = await User.create
			({
				name: req.body.name,
				password: (await securedPassword).toString(),
				email: req.body.email,
				address: req.body.address,
				lat: req.body.lat,
				long: req.body.lng,
			})

		const data = {
			user: {
				id: existingUser.id
			}
		}

		req.user =
		{
			id: existingUser.id
		}

		console.log(req.user);

		const token = jwt.sign(data, process.env.JWT_SECRET);
		res.cookie('auth_token_user', token, {
			httpOnly: true, // Helps prevent client-side JavaScript from accessing the cookie
			secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
		});
		return res.redirect('/users/findWalkers');
	}
	catch (error) {
		res.status(500).send({ error: error.message });
	}

})

router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	console.log(req.body);

	try {
		let existingUser = await User.findOne({ email });
		if (!existingUser) {
			return res.status(400).send({ message: "Please enter correct credentials" });
		}

		// comparing passwords (hashed)

		const passwordCompare = await bcrypt.compare(password, existingUser.password);

		if (!passwordCompare) {
			return res.status(400).send({ message: "Please enter correct credentials" });
		}

		const data = {
			user: {
				id: existingUser.id
			}
		}

		const token = jwt.sign(data, process.env.JWT_SECRET);
		res.cookie('auth_token_user', token, {
			httpOnly: true, // Helps prevent client-side JavaScript from accessing the cookie
			secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
		});
		console.log(req.headers);
		return res.json({ token, id: data.user.id });
	}
	catch (error) {
		res.status(500).send({ error: error });
	}
})

router.use(verifyToken);

router.get('/findWalkers', async (req, res) => {
	try {

		const { distance } = req.query;
		const response = await axios.get(`${process.env.APP_URI}/walkers/walkers`);
		const walkers = response.data;
		if (!distance) {
			return res.render('walkers', { walkers: walkers });
		}
		else {
			const id = req.user.id;
			const user = await User.findById(id);
			if (!user) {
				return res.status(404).json({ "message": "User not found" });
			}

			const radius = parseFloat(distance); // Parse distance to a number
			const userLocation = { latitude: parseFloat(user.lat), longitude: parseFloat(user.long) };
			console.log(userLocation)
			// Filter walkers by distance
			const filteredWalkers = walkers.filter((walker) => {
				const walkerLocation = {
					latitude: parseFloat(walker.lat),
					longitude: parseFloat(walker.long),
				};
				const distanceToWalker = haversine(userLocation, walkerLocation);
				return distanceToWalker <= radius; // Check if walker is within the specified radius
			});

			return res.render('walkers', { walkers: filteredWalkers });
		}
	}
	catch (error) {
		return res.status(500).json(error);
	}
})


router.get('/bookings', async (req, res) => {
	try {
		const response = await axios.get(`${process.env.APP_URI}/bookings`);
		let bookings = response.data;
		console.log(bookings);
		bookings = bookings.filter((booking) => {
			return booking.owner._id == req.user.id;
		})
		return res.render('bookings', { bookings: bookings });
	}
	catch (error) {
		res.status(500).send({ error: error });
	}
})

router.post('/bookings', async (req, res) => {
	try {
		const { from, to, walker } = req.body;
		const id = req.user.id;

		const formData = {
			from: from,
			to: to,
			id: id,
			walker: walker
		}
		fetch(`${process.env.APP_URI}/bookings`, {
			method: 'POST', 
			headers: {
				"Content-Type": "application/json", // Specify the content type
			},
			body: JSON.stringify(formData)
		}).then(
			response=> response.json())
		.then(data=> {
			return res.json({data});
		})
		
		
	}
	catch (error) {
		res.status(500).send({ error: error });
	}
})

module.exports = router; 