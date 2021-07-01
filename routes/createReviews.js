const express = require('express');
const exphbs = require('express-handlebars');
const router = express.Router();
var bodyParser = require('body-parser');
const alertMessage = require('../helpers/messenger');
const Reviews = require('../models/reviews');
const ensureAuthenticated = require('../helpers/auth');
const { username } = require('../config/db');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', (req, res) => {
    res.render('reviews/createReviews');
});

router.post('/reviews/createReviews', urlencodedParser,(req,res) => {
    let errors = [];
    let{FoodOption, CustOption, EnvOption, comments} = req.body;
    let Average = (parseInt(FoodOption) + parseInt(CustOption) + parseInt(EnvOption))/ 3
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
            if (reviews){
                res.render('/review/createReviews', {
                    error: reviews.name + 'already exist',
                    FoodOption,
                    CustOption,
                    EnvOption,
                    Average,
                    comments
                });
            } else{
                Reviews.create({
                    food: FoodOption,
                    service: CustOption,
                    environment: EnvOption,
                    average: Average,
                    comments: comments,
                    userid: req.user.id
                }).then(reviews => {
                    res.redirect('/')
                })
                .catch(err => console.log(err));
            }
        });
    }
});
module.exports = router;