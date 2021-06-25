const express = require('express');
const router = express.Router();
const Restaurant = require("../models/restaurants");
const Layout = require("../models/layout");
var sortSource = require("../public/js/res");
const ensureAuthenticated = require('../helpers/auth');

//Restaurants Page
router.get('/', (req, res) => {
    Restaurant.findAll({
        attributes: { exclude: ['comp_name, uen']},
        order: [sortSource.sortBy]
    })
    .then(restaurant => {
        res.render('restaurant/restaurants', {restaurant});
    })
});
router.get('/restaurant_1/:id', (req, res) =>{
    let id = req.params.id;
    Restaurant.findOne({ where: {id: id}})
    .then(restaurant => {
        res.render('restaurant/restaurant_1', {restaurant});
    })
});


module.exports = router;