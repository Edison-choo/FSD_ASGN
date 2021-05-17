const express = require('express');
const exphbs = require('express-handlebars');
const router = express.Router();
var bodyParser = require('body-parser');
const alertMessage = require('../helpers/messenger');
const Reviews = require('../models/reviews');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', (req, res) => {
    res.render('reviews/createReviews');
});

router.post('/reviews/createReviews', urlencodedParser,(req,res) => {
    let errors = [];

    let{email, FoodOption, CustOption, EnvOption, comments} = req.body;

    if(errors.length > 0){
        res.render('reviews/createReviews', {
            email,
            FoodOption,
            CustOption, 
            EnvOption, 
            comments
        });
    } else{
        Reviews.findOne({ where: {email: req.body.email} })
        .then(reviews => {
            if (reviews){
                res.render('/review/createReviews', {
                    error: reviews.name + 'already exist',
                    email,
                    FoodOption,
                    CustOption,
                    EnvOption,
                    comments
                });
            } else{
                Reviews.create({
                    EmailAddress: email,
                    FoodRatings: FoodOption,
                    ServiceRatings: CustOption,
                    EnvRatings: EnvOption,
                    AddComments: comments
                }).then(reviews => {
                    res.redirect('/')
                })
                .catch(err => console.log(err));
            }
        });
    }
});
module.exports = router;