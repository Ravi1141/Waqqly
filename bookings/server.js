const express = require('express');
const path = require('path');
const ejs = require('ejs');
require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const BookingRouter = require('./Controllers/Bookings');

const connectDb = require('./Utils/connection');
connectDb();

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json()); // Parses JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded bodies
app.use(express.static(path.join(__dirname, './views')))
app.set('view engine', 'ejs');

app.use('/', BookingRouter);

app.listen(process.env.PORT, () => {
	console.log(`App running on port ${process.env.PORT}`);
})