const express = require('express');
const path = require('path');
const ejs = require('ejs');
require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors'); 

const UserRouter = require('./Controllers/User');
const connectDb = require('./Utils/connection');
connectDb();

const app = express(); 

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static(path.join(__dirname, './views')))
app.set('view engine', 'ejs');

app.use('/', UserRouter);

app.listen(process.env.PORT, () => {
	console.log(`App running on port ${process.env.PORT}`);
})