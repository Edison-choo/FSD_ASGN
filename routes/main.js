const express = require('express');
const { session } = require('passport');
const router = express.Router();
const User = require("../models/user");

var userLog = false;
var location = "";

//Home page
router.get('/', (req, res) => {
	const title = "FooDecent Home";
	location = "index"
	checkCurrentUser(req.session.passport.user, location, title, res)
});

//Booking page
router.get('/', (req, res) => {
	const title = "FooDecent Booking"
	res.render('index', {title: title})
});


// Rendering of customers

function checkUser(user){
	if(user != 0){
		userLog = true;
	}else{
		userLog = false;
	}
	return userLog;
}

function checkCurrentUser(user, location, title, res){
	if(user != 0){
		User.findOne({ where: {id: user} })
					.then(users => {
						res.render(location, {title: title, fname: users.fname, userLog:checkUser(user)});
					});	
	}else{
		res.render(location, {title:title});
	}
}

module.exports = router;
