const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const alertMessage = require('../helpers/messenger');
const Menu = require('../models/menu');
const menuSpecification = require('../models/menuSpecification');

router.get('/menuBook', (req, res) => {
	var types = [];
	Menu.findAll({
		attributes: { exclude: ['restaurantMenuId']}
	})
	.then(menus => {
		if (menus) {
			// menus.specifications = JSON.parse(menus.specifications);
			menus.forEach((menu) => {
				menu.specifications = JSON.parse(menu.specifications);
				if (types.includes(menu.type) === false) {
					types.push(menu.type);
				}
			});
			types.sort();
			res.render('book/menuBook', {menus, types, menuSpecification});
		}
	}).catch(err => console.log(err));
});

router.get('/foodCart', (req, res) => {
	res.render('book/foodCart');
});

router.get('/receipt', (req, res) => {
	res.render('book/receipt');
});

router.get('/payment', (req, res) => {
	res.render('book/payment');
});

module.exports = router;