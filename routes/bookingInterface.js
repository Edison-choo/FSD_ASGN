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

	let {firstName:bookingFName, lastName:bookingLName, email:bookingEmail, timing:bookingTime, date:bookingDate, pax:bookingPax} = req.body;

	if (!emailValidator.validate(bookingEmail)){
		errors.push({text: "Email is invalid!"})
	}

	if (errors.length > 0){
		res.render('/bookingInterface/bookForm')
	}
	else{
		Booking.create({firstName:bookingFName, lastName:bookingLName, email:bookingEmail, timing:bookingTime, date:bookingDate, pax:bookingPax
		}).then(booking => {
			res.redirect('/bookingInterface/bookingDetails');
		})
		.catch(err => console.log(err));
	}		
		
});

module.exports = router;