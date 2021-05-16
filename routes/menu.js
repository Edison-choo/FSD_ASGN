const express = require('express');
const exphbs = require('express-handlebars');
const router = express.Router();
var bodyParser = require('body-parser');
const alertMessage = require('../helpers/messenger');
const Menu = require('../models/menu');

var urlencodedParser = bodyParser.urlencoded({extended: false});

router.get('/', (req, res) => {
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
			res.render('menu/menu', {menus, types});
		}
	}).catch(err => console.log(err));
});

router.get('/addMenu', (req, res) => {
	res.render('menu/addMenu');
});

router.get('/updateMenu', (req, res) => {
	Menu.findAll({
		attributes: { exclude: ['restaurantMenuId']}
	})
	.then(menus => {
		if (menus) {
			// menus.specifications = JSON.parse(menus.specifications);
			menus.forEach((menu) => {
				menu.specifications = JSON.parse(menu.specifications);
			});
			console.log(menus[0].specifications);
			res.render('menu/updateMenu', {menus});
		}
	});
});

router.post('/updateMenu', urlencodedParser,(req, res) => {
	let errors = [];
	let specifications = [];
	let {foodId, foodName, foodType, foodPrice, spiceLevel, temperature, portion} = req.body;

	foodId = foodId.toString();

	// res.render('menu/updateMenu')

	Menu.findOne({ where: {foodNo: foodId} })
		.then(menu => {
			if (menu) {
				res.render('menu/updateMenu', {
					error: menu.foodName + ' already existed',
					foodId,
					foodName,
					foodType,
					foodPrice,
					spiceLevel,
					temperature,
					portion
				});
			} else {
				if (spiceLevel) {
					specifications.push('spiceLevel');
				}
				if (temperature) {
					specifications.push('temperature');
				}
				if (portion) {
					specifications.push('portion');
				}
				specifications = JSON.stringify(specifications)
				Menu.create({foodNo:foodId, name:foodName, price:foodPrice, type:foodType, specifications:specifications, restaurantMenuId:1})
				.then(menu => {
					res.redirect('/menu/updateMenu');
				})
				.catch(err => console.log(err));
			}
		})
		.catch(err => console.log(err))
});

module.exports = router;