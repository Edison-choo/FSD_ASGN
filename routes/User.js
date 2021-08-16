const express = require('express');
const exphbs = require('express-handlebars');
const router = express.Router();
var bodyParser = require('body-parser');
const User = require("../models/user");
const Restaurant = require("../models/restaurants");
const Promotion = require("../models/promotions");
const CreditCard = require("../models/creditcard");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { response } = require('express');
const ensureAuthenticated = require('../helpers/auth');
var validator = require('email-validator');
var urlencodedParser = bodyParser.urlencoded({extended: false});
const fs = require('fs');
const upload = require('../helpers/imageUpload');
var valid = require("card-validator");
const { Sequelize } = require('sequelize');
const op = Sequelize.Op;
const sgMail = require("@sendgrid/mail");
const { request } = require('http');
if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
  }
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

	// current timestamp in milliseconds
	let ts = Date.now();

	let date_ob = new Date(ts);
	let date = date_ob.getDate();
	let month = date_ob.getMonth() + 1;
	let year = date_ob.getFullYear();

	// prints date & time in YYYY-MM-DD format
	let fulldate = year + "-" + month + "-" + date;

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

    if(errors.length == 0){
        User.findOne({ where: {email: req.body.email} })
		.then(user => {
			if (user) {
		// If user is found, email has already been registered
			res.render('user/register', {error: user.email + ' already registered', fname, lname, phone, email, password, cpassword });
			} else {
 			// Create new user record
			 bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(password, salt, function(err, hash) {
				User.create({fname:fname, lname:lname, phone:phone, email:email, password:hash, cust_type:"customer", date: fulldate})
				.then(user => {
					success_msg = email + " registered successfully";
					res.render('user/login', {success_msg:success_msg});
				})
				.catch(err => console.log(err));
				})
			})
			}
		})
    }else{
        res.render('user/register', {errors, fname, lname, phone, email, password, cpassword})
    }
});

router.post('/registeringOwner', urlencodedParser, (req, res) => {
	let errors = []
    let success_msg = ''; 

    let {res_chain, res_tag, email, password, cpassword, uen} = req.body;	

	let res_name = req.body.res_chain + "@" + req.body.res_tag;

	// current timestamp in milliseconds
	let ts = Date.now();

	let date_ob = new Date(ts);
	let date = date_ob.getDate();
	let month = date_ob.getMonth() + 1;
	let year = date_ob.getFullYear();

	// prints date & time in YYYY-MM-DD format
	let fulldate = year + "-" + month + "-" + date;

	if (!/[^a-zA-Z]/.test(req.body.res_chain)){
	}else{
		errors.push({"text": "Restaurant Name should only contains alphabet"})
	}

    if(req.body.password != req.body.cpassword){
        errors.push({"text": "Password do not match"});
    }

    if(req.body.password.length < 8){
        errors.push({"text": "Password must be at least 8 characters"});
    }

	emailValidate = validator.validate(req.body.email);
	if(!emailValidate){
		errors.push({"text": "Email is not valid"});
	}
		

    if(errors.length == 0){
        User.findOne({ where: {[op.or]: [{ email: req.body.email }, { fname: res_name }]} })
		.then(user => {
			if (user) {
		// If user is found, email has already been registered
			res.render('user/registerOwner', {error: 'User already registered'});
			} else {
 			// Create new user record
			 bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(req.body.password, salt, function(err, hash) {
				User.create({fname: res_name, email:req.body.email, password:hash, uen: req.body.uen, cust_type:"staff", date: fulldate}),
				Restaurant.create({res_name: res_name})
				.then(
					user => {
					success_msg = "User registered successfully";
					res.render('user/login', {success_msg:success_msg});
				})
				.catch(err => console.log(err));
				});
			});
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
	let {email} = req.body;

	emailValidate = validator.validate(email);
	if(!emailValidate){
		errors.push({"text": "Email is not valid"});
	}
	
	if(errors.length == 0){
		User.findOne({where: {email:req.body.email}})
		.then(user => {
			if(user){
				var new_password = '';
				var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
				var charactersLength = characters.length;
				for ( var i = 0; i < 8; i++ ) {
					new_password += characters.charAt(Math.floor(Math.random() * charactersLength));
				}
				bcrypt.genSalt(10, function(err, salt) {
					bcrypt.hash(new_password, salt, function(err, hash) {
					User.update({
						password: hash
					},
					{where:{email: req.body.email}}
					)
				})})
				const message = {
					to: req.body.email,
					from: 'donotreply.foodecent@gmail.com',
					subject: 'New password',
					text: "New Password",
					html: `Your new password is <b>${new_password}</b>`
				}
				sgMail.send(message)
				.then((response) => console.log("Email sent..."))
				.catch((error) => console.log(error.message));
		
				success_msg = "Email has been sent to " + req.body.email;
				res.render("user/login", {success_msg:success_msg});
			}else{
				res.render("user/forgetpassword", {error: req.body.email + ' not found'})
			}
		})
	}else{
		res.render("user/forgetpassword", {errors:errors});
	}
	

});

router.get('/profile', urlencodedParser, ensureAuthenticated, (req,res) => {
	if(req.user.cust_type == "staff"){
		Restaurant.findOne({where: {res_name: req.user.fname}})
		.then(restaurant => {
			if(restaurant){
				res.render("user/profile", {restaurant});
			}
		})
	}else{
		CreditCard.findAll({where: {userid: req.user.id}})
		.then(creditcard => {
			if(creditcard){
				res.render("user/profile", {creditcard});
			}else{
				res.render("user/profile")
			}
		})
	}
	
});

router.get('/editProfile', urlencodedParser, ensureAuthenticated, (req, res) => {
	res.render('user/editProfile');
});

router.post('/deleteProfile/:id', urlencodedParser, (req, res) => {
	User.destroy({
		where: {
			id: req.params.id
		}
	}),
	Restaurant.destroy({
		where: {
			res_name: req.user.fname
		}
	}),
	Promotion.destroy({
		where: {
			staffid: req.params.id
		}
	}),
	CreditCard.destroy({
		where: {
			userid: req.params.id
		}
	})
	.then(() => {
		req.logout();

		req.flash("success_msg", "Account have been successfully removed.");
	
		res.redirect("/user/login");
	}).catch(err => console.log(err));
});

router.post('/updateProfile/:id', urlencodedParser, (req, res) => {
	let errors = [];
	let success_msg = '';
	let {fname, lname, email, phone, passport, cpassword, address, res_chain, res_tag} = req.body;

	if(req.user.cust_type == "staff"){
		if (!/[^a-zA-Z]/.test(req.body.res_chain)){
		}else{
			errors.push({"text": "Restaurant Name should only contains alphabet"})
		}
		let res_name = req.body.res_chain + "@" + req.body.res_tag;
	}

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
	
	if(req.user.cust_type == "customer"){
		if(String(phone).length != 8){
			errors.push({"text": "Phone number must have at least 8 digit"});
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
				fname: req.body.res_chain + "@" + req.body.res_tag,
				email: req.body.email
			},
			{where:{id: req.params.id}}
			)
			Restaurant.update({
				res_name: req.body.res_chain + "@" + req.body.res_tag,
				email: req.body.email
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

router.post('/upload', ensureAuthenticated, (req, res) => {
	// Creates user id directory for upload if not exist
	if (!fs.existsSync('./public/uploads/UserProfileImg/' + req.user.id)){
		fs.mkdirSync('./public/uploads/UserProfileImg/' + req.user.id);
	}
	upload.userUpload(req, res, (err) => {
	if (err) {
		res.json({file: '/img/no-image.jpg', err: err});
	} else {
		if (req.file === undefined) {
			res.json({file: '/img/no-image.jpg', err: err});
		} else {
			User.update({
				profilepic: `/uploads/userProfileImg/${req.user.id}/${req.file.filename}`
			},
			{where:{id:req.user.id}}
			)
			res.json({file: `/uploads/userProfileImg/${req.user.id}/${req.file.filename}`});
		}
	}
	});
})

router.get('/addCreditCard', ensureAuthenticated, (req, res) => {
	res.render("user/addCreditCard");
})

router.post('/addCard', (req, res) => {
	let errors = [];
	let success_msg = '';
	
	let {cardname, cardno, mm, yyyy, cvv} = req.body;

	if(req.body.cardno.toString().length != 16){
		errors.push({"text": "Card number should be 16 digits"});
	}

	if(req.body.cvv.toString().length != 3){
		errors.push({"text": "Please enter valid card cvv"});
	}

	var numberValidation = valid.number(cardno.toString());
	if(numberValidation.isPotentiallyValid == false){
		errors.push({"text": "Please enter valid card number"});
	}


	if(errors.length == 0){
		CreditCard.findOne({where: {cardno: req.body.cardno.toString()}})
		.then(card => {
			if(card){
				res.render('user/addCreditCard', {error: 'Card is already registered'});
			}else{
				CreditCard.create({cardname: req.body.cardname, cardno: req.body.cardno.toString(), mm: req.body.mm, yyyy: req.body.yyyy, cvv: req.body.cvv, cardtype: numberValidation.card.type, userid: req.user.id})
				.then(card => {
					if(card){
						res.redirect('/user/profile');
					}
				})
			}
		})
	}else{
		res.render('user/addCreditCard', {errors})
	}
})

router.post("/deleteCreditCard/:id", (req, res) => {
	CreditCard.destroy({where: {id: req.params.id}})
	.then(card => {
		if(card){
			res.redirect("/user/profile")
		}
	})
})

router.get("/editCreditCard/:id", ensureAuthenticated, (req, res) => {
	CreditCard.findOne({where: {id: req.params.id}})
	.then(card => {
		if(card){
			res.render("user/editCreditCard", {card})
		}
	})
})

router.post("/editCard/:id", (req, res) => {
	let errors = [];
	let success_msg = '';
	
	let {cardname, cardno, mm, yyyy, cvv} = req.body;

	if(req.body.cardno.toString().length != 16){
		errors.push({"text": "Card number should be 16 digits"});
	}

	if(req.body.cvv.toString().length != 3){
		errors.push({"text": "Please enter valid card cvv"});
	}

	var numberValidation = valid.number(cardno.toString());
	if(numberValidation.isPotentiallyValid == false) {
		errors.push({"text": "Please enter valid card number"});
	}

	if(errors.length == 0){
		CreditCard.update({
			cardname: req.body.cardname,
			cardno: req.body.cardno.toString(), 
			mm: req.body.mm, 
			yyyy: req.body.yyyy, 
			cvv: req.body.cvv, 
			cardtype: numberValidation.card.type
		},
		{where: {id: req.params.id}})
		.then(card => {
			if(card){
				res.redirect("/user/profile");
			}else{
				errors.push({"text": "Card not found"});
				res.render('user/profile', {errors});
			}
		})
	}else{
		CreditCard.findAll({where: {userid: req.user.id}})
		.then(creditcard => {
			if(creditcard){
				res.render("user/profile", {creditcard, errors});
			}else{
				res.render("user/profile", {errors})
			}
		})
	}
})

module.exports = router;