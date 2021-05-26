const express = require('express');
const { session } = require('passport');
const router = express.Router();
//Login - Copy Paste
const User = require("../models/user");
var userLog = false;
var location = "";

//Home page
router.get('/', (req, res) => {
	const title = "FooDecent Home";

	//Login 
	location = "index"; //Change Location to your res render
	
	if(req.session.passport === undefined){
		nocurrentUser(location, title, res); //Add or Change anything inside the parameter
	}else if(req.session.passport.user === undefined) {
		nocurrentUser(location, title, res); //Add or Change anything inside the parameter
	}else{
		checkCurrentUser(req.session.passport.user, location, title, res); //Add or Change anything inside the parameter
	}
	
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

// Rendering of customers
// Copy Paste
function checkUser(user){
	if(user > 0){
		userLog = true;
	}else{
		userLog = false;
	}
	return userLog;
}
//Change or add parameter 
function nocurrentUser(location, title, res){ 
	res.render(location, {title:title, userLog:false});
}
//Change or add parameter 
function checkCurrentUser(user, location, title, res){
	if(user != 0){
		 User.findOne({ where: {id: user} })
		 			.then(users => {
		 				res.render(location, {title: title, fname: users.fname, userLog:checkUser(user)});
		 			});	
	 }
}

module.exports = router;
