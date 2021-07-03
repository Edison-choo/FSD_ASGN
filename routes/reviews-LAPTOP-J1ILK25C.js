const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../helpers/auth');
const Reviews = require('../models/reviews');

router.get('/reviews', (req, res) => {
    Reviews.findAll(
        ).then((reviews) => {
            res.render('reviews/reviews', {reviews: reviews})
        }).catch(err => console.log(err));
});


module.exports = router;