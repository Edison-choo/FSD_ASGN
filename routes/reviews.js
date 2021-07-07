const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../helpers/auth');
const Reviews = require('../models/reviews');
const Restaurant = require('../models/restaurants');

router.get('/reviews', (req, res) => {
    // let restaurant = req.params.restaurant
    Reviews.findAll(
        ).then((reviews) => {
            let totalaverage = 0;
            for(i in reviews){
                totalaverage += reviews[i].average
            }
            totalaverage = totalaverage / reviews.length;
            console.log(totalaverage);
            Restaurant.findOne({where: {staffid: req.user.id}}
                ).then((restaurants) => {
                    res.render('reviews/reviews', {restaurants: restaurants, reviews: reviews, totalaverage: totalaverage.toFixed(1)});
                })
            // res.render('reviews/reviews', {reviews: reviews, totalaverage: totalaverage.toFixed(1)});
        }).catch(err => console.log(err));
});


module.exports = router;