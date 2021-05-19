const express = require('express');
const exphbs = require('express-handlebars');
const router = express.Router();
var bodyParser = require('body-parser');
const User = require("../models/user");
const bcrypt = require("bcryptjs")
const passport = require("passport");
const { response } = require('express');

var urlencodedParser = bodyParser.urlencoded({extended: false});

router.get('/login', (req, res) => {
	res.render('user/login');
});

router.get('/register', (req, res) => {
	res.render('user/register');
});

router.post('/registerUser', urlencodedParser, (req, res) => {
	let errors = []
    let success_msg = ''; 

    let password = req.body.password;
    let cpassword = req.body.cpassword;
    let email = req.body.email;
    let fname = req.body.fname;
	let lname = req.body.lname;
	let phone = req.body.phone;
	let usertype = "customer";

	var validator = require('email-validator');

    if(password != cpassword){
        errors.push({"text": "Password do not match"});
    }

    if(password.length < 8){
        errors.push({"text": "Password must be at least 8 characters"});
    }

	emailValidate = validator.validate(email);
	if(!emailValidate){
		errors.push({"text": "Email is not valid"});
	}

	if(String(phone).length != 8){
		errors.push({"text": "Phone number must have at least 8 digit"});
	}

	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(password, salt, function(err, hash) {
			password = hash;
		});
	});

    if(errors.length == 0){
        User.findOne({ where: {email: req.body.email} })
		.then(user => {
			if (user) {
		// If user is found, that means email has already been
 		// registered
			res.render('user/register', {error: user.email + ' already registered', fname, lname, phone, email, password, cpassword });
			} else {
 			// Create new user record
				User.create({fname, lname, phone, email, password, cust_type:"customer"})
				.then(user => {
					success_msg = email + " registered successfully";
					res.render('user/login', {success_msg:success_msg});
				})
				.catch(err => console.log(err));
			}
		})
    }else{
        res.render('user/register', {errors, fname, lname, phone, email, password, cpassword})
    }
});

router.post('/loginUser', urlencodedParser, (req, res, next) => {
	passport.authenticate('local', {
	successRedirect: '/', // Route to / URL
	failureRedirect: '/user/login', // Route to /login URL
	failureFlash: true,
	 /* Setting the failureFlash option to true instructs Passport to flash an error message using the
	message given by the strategy's verify callback, if any. When a failure occur passport passes the message
	object as error */
	})(req, res, next);
});

router.get('/logout', (req, res) => {
	req.logout();

	req.flash("success_msg", "You are logged out");

	res.redirect("/user/login");
})

router.get('/forget_password', (req, res) => {
	 res.render('user/forgetpassword');
});

router.get('/profile', (req,res) => {
	location = "user/profile";
	checkCurrentUser(req.session.passport.user, location, res);
})

function checkUser(user){
	if(user > 0){
		userLog = true;
	}else{
		userLog = false;
	}
	return userLog;
}

function checkCurrentUser(user, location, res){
	if(user != 0){
		 User.findOne({ where: {id: user} })
		 			.then(users => {
		 				res.render(location, {fname: users.fname, userLog:checkUser(user)});
		 			});	
	 }
}

module.exports = router;