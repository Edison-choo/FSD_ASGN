const express = require('express');
const router = express.Router();
const User = require('../models/menu');
const alertMessage = require('../helpers/messenger');

router.get('/', (req, res) => {
	res.render('menu/menu');
});

router.get('/addMenu', (req, res) => {
	res.render('menu/addMenu');
});

router.get('/updateMenu', (req, res) => {
	res.render('menu/updateMenu');
});

router.post('/updateMenu', (req, res) => {
	let errors = [];
	console.log(req.body);
	let {foodId, foodName, foodType, foodPrice, spiceLevel, temperature, portion} = req.body;

	console.log(foodId);
	console.log(foodName);
	console.log(foodType);
	console.log(foodPrice);
	console.log(spiceLevel);
	console.log(temperature);
	console.log(portion);

});

module.exports = router;