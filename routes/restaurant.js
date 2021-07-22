const express = require('express');
const router = express.Router();
const Restaurant = require("../models/restaurants");
const Reviews = require('../models/reviews');
var sortSource = require("../public/js/res");
const ensureAuthenticated = require('../helpers/auth');

//Restaurants Page
router.get('/', (req, res) => {
    Restaurant.findAll({
        attributes: { exclude: ['comp_name, uen'] },
        order: [sortSource.sortBy]
    })
        .then(restaurant => {
            res.render('restaurant/restaurants', { restaurant });
        })
});
router.get('/restaurant_1/:restaurant', (req, res) => {
    let restaurantname = req.params.restaurant;
    Restaurant.findOne({ where: { res_name: restaurantname } })
        .then(restaurant => {
            Reviews.findAll({ where: { restaurant: restaurantname } }
            ).then((reviews) => {
                let totalaverage = 0;
                if (reviews) {
                    for (i in reviews) {
                        totalaverage += reviews[i].average
                    }
                    totalaverage = totalaverage / reviews.length;
                }
                console.log(totalaverage);
                res.render('restaurant/restaurant_1', { restaurant, reviews, totalaverage: totalaverage.toFixed(1) });
            })
        })
});


module.exports = router;