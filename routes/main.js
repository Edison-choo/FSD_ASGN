const express = require('express');
const { session } = require('passport');
const router = express.Router();
const User = require("../models/user");
// login
var validator = require("validator");

var userLog = false;
var location = "";

//Home page
router.get('/', (req, res) => {
	const title = "FooDecent Home";

	location = "index";
	
	if(req.session.passport.user === undefined){
		nocurrentUser(location, title, res);
	}else{
		checkCurrentUser(req.session.passport.user, location, title, res);
	}
	

	
	
});

//Booking page
router.get('/', (req, res) => {
	const title = "FooDecent Booking"
	res.render('index', {title: title})
});


// Rendering of customers

function checkUser(user){
	if(user > 0){
		userLog = true;
	}else{
		userLog = false;
	}
	return userLog;
}

function nocurrentUser(location, title, res){
	res.render(location, {title:title, userLog:false});
}

function checkCurrentUser(user, location, title, res){
	if(user != 0){
		 User.findOne({ where: {id: user} })
		 			.then(users => {
		 				res.render(location, {title: title, fname: users.fname, userLog:checkUser(user)});
		 			});	
	 }
}

module.exports = router;
