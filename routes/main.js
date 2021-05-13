const express = require('express');
const router = express.Router();

//Home page
router.get('/', (req, res) => {
	const title = "FooDecent Home"
	res.render('index', {title: title})
});

//Booking page
router.get('/', (req, res) => {
	const title = "FooDecent Booking"
	res.render('index', {title: title})
});


module.exports = router;
