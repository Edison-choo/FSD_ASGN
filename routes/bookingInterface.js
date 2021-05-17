const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const express = require('express');
const exphbs = require('express-handlebars');
const moment = require('moment');
const validator = require("email-validator")
const router = express.Router();
const Booking = require("../models/booking")
const emailValidator = require("email-validator");
const alertMessage = require('../helpers/messenger');

var res_name
var firstName
var lastName
var timing
var pax
var email
var date

router.get('/bookForm/:res_name', (req, res) => {
	res_name = req.params.res_name
	res.render('bookingInterface/bookForm');
});

router.get('/updateForm', (req, res) => {
	res.render('bookingInterface/updateForm');
});

router.get('/bookingDetails', (req, res) => {
	firstName = firstName
	lastName = lastName
	timing = timing
	pax = pax
	email = email
	date = date
	res_name = res_name
	res.render('bookingInterface/bookingDetails');
});

router.post('/bookForm', urlencodedParser, (req, res) => {
let errors = [];

	let {
		date, 
		timing,
		firstName, 
		lastName, 
		email, 
		pax
	} = req.body;

	if (!emailValidator.validate(email)){
		errors.push({text: "Email is invalid!"})
	}

	Booking.create({res_name:res_name, firstName:firstName, lastName:lastName, email:email, timing:timing, date:date, pax:pax
	}).then(booking => {
		res.redirect('/bookingInterface/bookingDetails');
	})
	.catch(err => console.log(err));
	
});

module.exports = router;