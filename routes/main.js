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
					new_res = []
					for (i = restaurants.length - 1; i >= 0; i--){
						if(new_res.length < 4 ){
							new_res.push(restaurants[i])
						}
					}
					console.log(new_res)
					res.render('index', {restaurants: restaurants, promotions: promotions, title : title, new_res: new_res});
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

router.post('/getcounter/:res_name/:id', (req, res) =>{
	if (req.user){
		let counters = parseInt(req.body.counter) + 1
	console.log(req.params.id)
	Promotions.update({
		counter: counters
	},
		{where:{id: req.params.id}}
	)
	}res.redirect(`/bookingInterface/bookForm/${req.params.res_name}`)
});



module.exports = router;
