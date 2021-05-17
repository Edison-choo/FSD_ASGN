const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const express = require('express');
const exphbs = require('express-handlebars');
const moment = require('moment');
const validator = require("email-validator")
const router = express.Router();
const Booking = require("../models/booking")
const emailValidator = require("email-validator");

router.get('/bookForm', (req, res) => {
	res.render('bookingInterface/bookForm');
});

router.get('/updateForm', (req, res) => {
	res.render('bookingInterface/updateForm');
});

router.get('/bookingDetails', (req, res) => {
	res.render('bookingInterface/bookingDetails');
});

router.post('/bookForm', urlencodedParser, (req, res) => {
let errors = []

	let firstName = req.body.bookingFName
	let lastName = req.body.bookingLName
	let email = req.body.bookingEmail
	let timing = req.body.bookingTime
	let date = req.body.bookingDate
	let pax = req.body.bookingPax

	if (!emailValidator.validate(email)){
		errors.push({text: "Email is invalid!"})
	}

	Booking.create({firstName, lastName, email, timing, date, pax
	}).then(booking => {
		res.redirect('/bookingInterface/bookingDetails');
	})
	.catch(err => console.log(err));
	
		
});

module.exports = router;