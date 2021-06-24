const express = require('express');
const exphbs = require('express-handlebars');
const router = express.Router();
var bodyParser = require('body-parser');
const User = require("../models/user");
const bcrypt = require("bcryptjs")
const passport = require("passport");
const { response } = require('express');
var validator = require('email-validator');
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
		// If user is found, email has already been registered
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
});

router.get('/forget_password', (req, res) => {
	 res.render('user/forgetpassword');
});

router.post('/changePassword', urlencodedParser, (req, res) => {
	let errors = [];
	let success_msg = '';
	let {email, password, cpassword} = req.body;

	emailValidate = validator.validate(email);
	if(!emailValidate){
		errors.push({"text": "Email is not valid"});
	}

	if(password != cpassword){
        errors.push({"text": "Password do not match"});
    }

    if(password.length < 8){
        errors.push({"text": "Password must be at least 8 characters"});
    }

    if(errors.length == 0){
		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(password, salt, function(err, hash) {
        User.update({
			password: hash
		},
		{where:{email: req.body.email}}
		)
		.then(user => {
			if (user > 0) {
			console.log(user, req.body.email, user.email, errors.length);
			// If user is found, email has already been registered
				success_msg = "Password has been resetted";
				res.render('user/login', {success_msg:success_msg});
			
			}else{
				errors.push({"text": "User not found"});
				res.render('user/forgetpassword', {errors, email, passport, cpassword});
			} 
		})
	})})
    }else{
        res.render('user/forgetpassword', {errors, email, password, cpassword})
    }

});

router.get('/profile', (req,res) => {
	res.render("user/profile");
});

router.get('/editProfile', urlencodedParser, (req, res) => {
	res.render('user/editProfile');
});

router.post('/deleteProfile/:id', urlencodedParser, (req, res) => {
	User.destroy({
		where: {
			id: req.params.id
		}
	}).then(() => {
		req.logout();

		req.flash("success_msg", "Account have been successfully removed.");
	
		res.redirect("/user/login");
	}).catch(err => console.log(err));
});

router.post('/updateProfile/:id', urlencodedParser, (req, res) => {
	let errors = [];
	let success_msg = '';
	let {fname, lname, email, phone, passport, cpassword} = req.body;
	var new_password = "";

	User.findOne({ where: {id: req.params.id} })
	.then(user => {
		if(user){
			if(user.password != req.body.password){

			
				if(req.body.password != req.body.cpassword){
					errors.push({"text": "Password do not match"})
				}else{
					if(req.body.password.length < 8){
						errors.push({"text": "Password must be at least 8 characters"});
					}else{
						bcrypt.genSalt(10, function(err, salt) {
							bcrypt.hash(req.body.password, salt, function(err, hash) {
							User.update({
								password: hash
							},
							{where:{id: req.params.id}}
							)
						})})
					}
					
				}
			}
		}
	})

	emailValidate = validator.validate(email);
	if(!emailValidate){
		errors.push({"text": "Email is not valid"});
	}

	if(String(phone).length != 8){
		errors.push({"text": "Phone number must have at least 8 digit"});
	}

	if(errors.length == 0){
		User.update({
			fname: req.body.fname,
			lname: req.body.lname,
			phone: req.body.phone,
			email: req.body.email,
		},
		{where:{id: req.params.id}}
		)
		.then(user => {
			if(user){
				res.redirect("/user/profile")
			}else{
				errors.push({"text": "User not found"});
				res.render('user/profile', {errors});
			}
		})
	}else{
		res.render('user/editProfile', {errors})
	}
});

module.exports = router;