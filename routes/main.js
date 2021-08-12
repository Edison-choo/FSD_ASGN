const express = require('express');
const { session } = require('passport');
const router = express.Router();
//Login - Copy Paste
const User = require("../models/user");
const Promotions = require('../models/promotions');
const Restaurant = require('../models/restaurants')
const ensureAuthenticated = require('../helpers/auth');

//Home page
router.get('/', (req, res) => {
	const title = "FooDecent Home";
	//Login 
	req.session.booking = undefined;
	
	Promotions.findAll(
		).then((promotions) => {
			console.log(promotions)
			Restaurant.findAll(
				).then((restaurants) => {
					vacant = []
					for (i in restaurants){
						if(i.occupied ){
							vacant.add(i)
						}
					}
					
					res.render('index', {restaurants: restaurants, promotions: promotions, title : title, vacant: vacant});
				})
		}).catch(err => console.log(err));
	
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
