const express = require('express');
const exphbs = require('express-handlebars');
const router = express.Router();
var bodyParser = require('body-parser');
const alertMessage = require('../helpers/messenger');
const Reviews = require('../models/reviews');
const ensureAuthenticated = require('../helpers/auth');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', (req, res) => {
    res.render('reviews/createReviews');
});

router.post('/reviews/createReviews', urlencodedParser,(req,res) => {
    let errors = [];

    let{FoodOption, CustOption, EnvOption, email, comments} = req.body;
    console.log(FoodOption);
    console.log(CustOption);
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
                    food: FoodOption,
                    service: CustOption,
                    environment: EnvOption,
                    email: email,
                    comments: comments
                }).then(reviews => {
                    res.redirect('/')
                })
                .catch(err => console.log(err));
            }
        });
    }
});
module.exports = router;