const express = require('express');
const exphbs = require('express-handlebars');
const router = express.Router();
var bodyParser = require('body-parser');
const alertMessage = require('../helpers/messenger');
const Reviews = require('../models/reviews');
const Booking = require("../models/booking")
const ensureAuthenticated = require('../helpers/auth');
const { username } = require('../config/db');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/:restaurant', (req, res) => {
    let restaurant = req.params.restaurant
    Booking.findOne({
        where: { id: req.user.id }
    }).then(booking => {
        res.render('reviews/createReviews', { booking, restaurant });
    })
});

router.post('/reviews/createReviews/:restaurant', urlencodedParser,(req,res) => {
    console.log("test")
    let errors = [];
    let{FoodOption, CustOption, EnvOption, comments} = req.body;
    let Average = (parseInt(FoodOption) + parseInt(CustOption) + parseInt(EnvOption))/ 3
    let res_name = req.params.restaurant
    console.log(FoodOption);
    console.log(CustOption);
    if(errors.length > 0){
        res.render('reviews/createReviews', {
            FoodOption,
            CustOption, 
            EnvOption, 
            Average,
            comments,
        });
    } else{
        Reviews.findOne({ where: {userid: req.user.id} })
        .then(reviews => {
                Reviews.create({
                    food: FoodOption,
                    service: CustOption,
                    environment: EnvOption,
                    average: Average,
                    comments: comments,
                    userid: req.user.id,
                    restaurant: res_name
                }).then(reviews => {
                    res.redirect('/')
                })
                .catch(err => console.log(err));
            
        });
    }
});


module.exports = router;