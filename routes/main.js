const express = require('express');
const { session } = require('passport');
const router = express.Router();
//Login - Copy Paste
const User = require("../models/user");

//Home page
router.get('/', (req, res) => {
	const title = "FooDecent Home";
	//Login 
	res.render("index", {title:title});
	
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
