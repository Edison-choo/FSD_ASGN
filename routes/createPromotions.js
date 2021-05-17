const express = require('express');
const exphbs = require('express-handlebars');
const router = express.Router();
var bodyParser = require('body-parser');
const alertMessage = require('../helpers/messenger');
const Promotions = require('../models/promotions');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', (req, res) => {
    res.render('promotion/createPromotions');
});

router.post('/createPromotions', urlencodedParser,(req, res) => {
    let errors = [];

    let{name, startdate, enddate, discount, details, banner} = req.body;

    if(errors.length > 0){
        res.render('promotion/createPromotions', {
            errors,
            name,
            startdate,
            enddate,
            discount,
            details,
            banner
        });
    } else{
        Promotions.findOne({ where: {name:req.body.name} })
        .then(promotions => {
            if(promotions){
                res.render('promotion/createPromotion', {
                    error: promotions.name + 'already exist',
                    name,
                    startdate,
                    enddate,
                    discount,
                    details,
                    banner
                });
            } else {
                Promotions.create({
                    PromoName: name,
                    PromoStart: startdate,
                    PromoEnd: enddate,
                    DiscountAmt: discount,
                    BannerImg: banner
                }).then(promotions =>{
                    res.redirect('/promotion/createPromotions');
                })
                .catch(err => console.log(err));
            }
        });
    }
});

module.exports = router;