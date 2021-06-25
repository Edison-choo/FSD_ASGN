const express = require('express');
const exphbs = require('express-handlebars');
const router = express.Router();
var bodyParser = require('body-parser');
const User = require("../models/user");
const bcrypt = require("bcryptjs")
const passport = require("passport");
const { response } = require('express');
const ensureAuthenticated = require('../helpers/auth');
var validator = require('email-validator');
var urlencodedParser = bodyParser.urlencoded({extended: false});

router.get('/login', (req, res) => {
	res.render('user/login');
});

router.get('/register', (req, res) => {
	res.render('user/register');
});

router.get('/registerOwner', urlencodedParser, (req, res) => {
	res.render('user/registerOwner')
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
				User.create({fname:fname, lname:lname, phone:phone, email:email, password:password, cust_type:"customer"})
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

router.post('/registeringOwner', urlencodedParser, (req, res) => {
	let errors = []
    let success_msg = ''; 

    let {restname, email, phone, addressl1, addressl2, postalcode, password, cpassword} = req.body;	

    if(req.body.password != req.body.cpassword){
        errors.push({"text": "Password do not match"});
    }

    if(req.body.password.length < 8){
        errors.push({"text": "Password must be at least 8 characters"});
    }

	if(String(req.body.postalcode).length != 6){
		errors.push({"text": "Please enter valid postal code"});
	}

	emailValidate = validator.validate(req.body.email);
	if(!emailValidate){
		errors.push({"text": "Email is not valid"});
	}

	if(String(req.body.phone).length != 8){
		errors.push({"text": "Phone number must have at least 8 digit"});
	}

	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(req.body.password, salt, function(err, hash) {
			req.body.password = hash;
		});
	});

    if(errors.length == 0){
        User.findOne({ where: {email: req.body.email} })
		.then(user => {
			if (user) {
		// If user is found, email has already been registered
			res.render('user/registerOwner', {error: user.email + ' already registered'});
			} else {
 			// Create new user record
				User.create({fname: req.body.restname, phone: req.body.phone, email:req.body.email, addressl1: req.body.addressl1, addressl2: req.body.addressl2, postalcode: req.body.postalcode, password:req.body.password, cust_type:"staff"})
				.then(user => {
					success_msg = email + " registered successfully";
					res.render('user/login', {success_msg:success_msg});
				})
				.catch(err => console.log(err));
			}
		})
    }else{
        res.render('user/registerOwner', {errors})
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

router.get('/profile', urlencodedParser, ensureAuthenticated, (req,res) => {
	res.render("user/profile");
});

router.get('/editProfile', urlencodedParser, ensureAuthenticated, (req, res) => {
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
	let {fname, lname, email, phone, passport, cpassword, addressl1, addressl2, postalcode, restname} = req.body;

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

	if(req.user.cust_type == "staff"){
		if(String(req.user.postalcode).length != 6){
			errors.push({"text": "Please enter valid postal code"});
		}
	}

	if(errors.length == 0){
		if(req.user.cust_type == "customer"){
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
			User.update({
				fname: req.body.restname,
				phone: req.body.phone,
				email: req.body.email,
				addressl1: req.body.addressl1,
				addressl2: req.body.addressl2,
				postalcode: req.body.postalcode
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
		}
	}else{
		res.render('user/editProfile', {errors})
	}
});

module.exports = router;