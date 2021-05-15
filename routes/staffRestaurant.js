const express = require('express');
const Restaurants = require('../models/restaurants');
const router = express.Router();
const Restaurant = require("../models/restaurants");

//Page if restaurant page not created
router.get('/', (req, res) => {
    res.render('staffRestaurant/start')
});

//Create Restaurant Page
router.get('/createRestaurant', (req, res) => {
    res.render('staffRestaurant/createRestaurant')
});

//Post for Create Restaurant Page
router.post('/createRestaurant', (req, res) => {
    let errors = [];
    // let {comp_name, address, comp_email, uen, res_name, cuisine, open_time, close_time, halal, facebook, twitter, instagram} = req.body;
    // if (errors.length > 0) {
    //     res.render('staffRestaurant/createRestaurant')
    // }
    // else{
    //     Restaurant.create({ comp_name, address, comp_email, uen, res_name, cuisine, open_time, close_time, halal, facebook, twitter, instagram })
    //     .then(restaurant => {
    //         console.log(res,"success", restaurant.comp_name + "added");
    //     })
    // }
    console.log(req.body);
});
module.exports = router