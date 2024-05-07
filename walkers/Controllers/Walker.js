const router = require('express').Router();
const Walker = require('../Models/Walker');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config(); 
const verifyTokenWalker = require('../Utils/verifyTokenWalker');

router.get('/walkers', async (req, res) => {
	const walkers = await Walker.find();
	return res.json(walkers);
})

router.get('/walker/:id', async (req, res) => {
	const walker = await Walker.findById(req.params.id);
	if (!walker) {
		return res.status(404).send('Walker not found');
	}
	return res.json(walker);
});

router.get('/signup', async (req, res) => {
	res.render('signup')
})
router.get('/login', async (req, res) => {
	res.render('login')
})

router.post('/signup', async (req, res) => {
	try {

		let existingWalker = await Walker.findOne({ email: req.body.email });
		if (existingWalker) {
			return res.status(400).send("Email already exists");
		}

		const salt = await bcrypt.genSalt(10); // 10 here is default thing 
		const securedPassword = bcrypt.hash(req.body.password, salt);

		existingWalker = await Walker.create
			({
				name: req.body.name,
				password: (await securedPassword).toString(),
				email: req.body.email,
				address: req.body.address,
				lat: req.body.lat,
				long: req.body.long,
				preferredTime: req.body.preferredTime
			})

		const data = {
			user: {
				id: existingWalker.id
			}
		}

		req.user =
		{
			id: existingWalker.id
		}

		console.log(req.user);

		const token = jwt.sign(data, process.env.JWT_SECRET);
		res.cookie('auth_token_walker', token, {
			httpOnly: true, // Helps prevent client-side JavaScript from accessing the cookie
			secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
		});
		return res.json(token);
	}
	catch (error) {
		res.status(500).send({ error: error.message });
	}
})

router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	try {
		let existingWalker = await Walker.findOne({ email });
		if (!existingWalker) {
			return res.status(400).send({ message: "Please enter correct credentials" });
		}

		// comparing passwords (hashed)

		const passwordCompare = await bcrypt.compare(password, existingWalker.password);

		if (!passwordCompare) {
			return res.status(400).send({ message: "Please enter correct credentials" });
		}

		const data = {
			user: {
				id: existingWalker.id
			}
		}

		const token = jwt.sign(data, process.env.JWT_SECRET);
		res.cookie('auth_token_walker', token, {
			httpOnly: true, // Helps prevent client-side JavaScript from accessing the cookie
			secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
		});
		console.log(req.headers);
		return res.json(token);
	}
	catch (error) {
		res.status(500).send({ error: error });
	}
})

router.use(verifyTokenWalker);

router.get('/bookings', async (req, res) => {
	try {
		const response = await axios.get(`${process.env.APP_URI}/bookings`);
		let bookings = response.data;
		console.log(bookings);
		bookings = bookings.filter((booking) => {
			return booking.walker._id == req.walker.id;
		})
		return res.render('bookings', { bookings: bookings });
	}
	catch (error) {
		res.status(500).send({ error: error });
	}
})

module.exports = router; 