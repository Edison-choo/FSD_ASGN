const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
const ensureAuthenticated = require('../helpers/auth');
const Reviews = require('../models/reviews');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/userReviews', (req, res) => {
    Reviews.findAll( {where: {userid: req.user.id}}
    ).then((reviews) => {
        console.log(reviews)
        res.render('reviews/userReviews', {reviews: reviews})
    }).catch(err => console.log(err));
});

router.get('/editReviews/:id', ensureAuthenticated, (req, res) =>{
    Reviews.findOne( {where: {id : req.params.id}}).then((reviews) =>{
        if (reviews){
            res.render('reviews/editReviews', {reviews: reviews})
        }
    }).catch(err => console.log(err));
})

router.post('/updateReviews/:id', urlencodedParser,(req, res) => {
    let{FoodOption, CustOption, EnvOption, comments} = req.body;
    let Average = (parseInt(FoodOption) + parseInt(CustOption) + parseInt(EnvOption))/ 3
    Reviews.update({food: FoodOption, service: CustOption, environment: EnvOption, average: Average, comments: comments},
        {where: {id:req.params.id} })
    .then(() => {
                res.redirect('/userReviews/userReviews');
            })
            .catch(err => console.log(err));
        });

router.post('/deleteReviews/:id', (req, res) => {
    Reviews.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => {
        res.redirect('/userReviews/userReviews');
    }).catch(err => console.log(err));
});


module.exports = router;