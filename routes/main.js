const express = require('express');
const { session } = require('passport');
const router = express.Router();

//Home page
router.get('/', (req, res) => {
	const title = "FooDecent Home"
	console.log(req.user);
	res.render('index', {title: title})
});

//Booking page
router.get('/', (req, res) => {
	const title = "FooDecent Booking"
	res.render('index', {title: title})
});


module.exports = router;
