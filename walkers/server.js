const express = require('express');
const path = require('path');
const ejs = require('ejs');
require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const WalkerRouter = require('./Controllers/Walker');

const connectDb = require('./Utils/connection');
connectDb();

const app = express();
app.use(express.json()); 
app.use(cookieParser());
app.use(bodyParser.json()); // Parses JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded bodies
app.use(express.static(path.join(__dirname, './views')))
app.set('view engine', 'ejs');

app.use('/', WalkerRouter);

app.listen(process.env.PORT, () => {
	console.log(`App running on port ${process.env.PORT}`);
})