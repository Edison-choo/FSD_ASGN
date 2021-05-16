const express = require('express');
const router = express.Router();
const Restaurant = require("../models/restaurants");

var sessionData

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
    id = localStorage.getItem("id")
    Restaurant.findOne({ where: {id: id}})
    .then(restaurant => {
        res.render('restaurant/restaurant_1', {restaurant});
    })
})


module.exports = router;