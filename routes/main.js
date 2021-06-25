const express = require('express');
const { session } = require('passport');
const router = express.Router();
//Login - Copy Paste
const User = require("../models/user");
const Promotions = require('../models/promotions');

//Home page
router.get('/', (req, res) => {
	const title = "FooDecent Home";
	//Login 
	Promotions.findAll(
		).then((promotions) => {
			console.log(promotions)
			res.render('index', {promotions: promotions, title : title})
		}).catch(err => console.log(err));
	
});

//Booking page
router.get('/', (req, res) => {
	const title = "FooDecent Booking"
	res.render('index', {title: title})
});

// User Login Route
router.get('/showLogin', (req, res) => {
	res.render('user/login');
});



module.exports = router;
