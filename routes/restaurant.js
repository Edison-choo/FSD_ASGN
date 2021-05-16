const express = require('express');
const router = express.Router();
const Restaurant = require("../models/restaurants");

//Restaurants Page
router.get('/', (req, res) => {
    Restaurant.findAll({
        attributes: { exclude: ['comp_name, uen']}
    })
    .then(restaurant => {
        res.render('restaurant/restaurants', {restaurant});
    })
});
router.get('/restaurant_1', (req, res) =>{
    res.render('restaurant/restaurant_1')
})


module.exports = router;