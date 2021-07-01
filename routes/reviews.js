const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../helpers/auth');
const Reviews = require('../models/reviews');

router.get('/reviews', (req, res) => {
    Reviews.findAll(
        ).then((reviews) => {
            let totalaverage = 0;
            for(i in reviews){
                totalaverage += reviews[i].average
            }
            totalaverage = totalaverage / reviews.length;
            console.log(totalaverage)
            res.render('reviews/reviews', {reviews: reviews, totalaverage: totalaverage.toFixed(1)})
        }).catch(err => console.log(err));
});


module.exports = router;