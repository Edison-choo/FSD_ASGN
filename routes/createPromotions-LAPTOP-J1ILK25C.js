const express = require('express');
const exphbs = require('express-handlebars');
const router = express.Router();
var bodyParser = require('body-parser');
const alertMessage = require('../helpers/messenger');
const Promotions = require('../models/promotions');
const moment = require('moment');
const ensureAuthenticated = require('../helpers/auth');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', (req, res) => {
    Promotions.findAll(
    ).then((promotions) => {
        console.log(promotions)
        res.render('promotion/createPromotions', {promotions: promotions})
    }).catch(err => console.log(err));
});
// router.get('/', (req, res) => {
//     res.render('promotion/createPromotions');
// });

router.post('/createPromotions', urlencodedParser,(req, res) => {
    let errors = [];

    let{name, startdate, enddate, discount, details, banner} = req.body;
    // startdate = moment(req.body.startdate, "DD/MM/YYYY");
    // enddate = moment(req.body.enddate, "DD/MM/YYYY");

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
                res.render('promotion/createPromotions', {
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
                    name: name,
                    startdate: startdate,
                    enddate: enddate,
                    discount: discount,
                    details: details,
                    banner: banner
                }).then(promotions =>{
                    res.redirect('/createPromotions');
                })
                .catch(err => console.log(err));
            }
        });
    }
});

router.get('/:id', (req, res) => {
            Promotions.destroy({
                where: {
                    id: req.params.id
                }
            }).then(() => {
                res.redirect('/createPromotions');
            }).catch(err => console.log(err));
});

router.post('/updatePromotions/:id', urlencodedParser,(req, res) => {
    let{name, startdate, enddate, discount, details, banner} = req.body;
    // startdate = moment(req.body.startdate, "DD/MM/YYYY");
    // enddate = moment(req.body.enddate, "DD/MM/YYYY");

        Promotions.update({ name, startdate, enddate, discount, details, banner},
            {where: {id:req.params.id} })
        .then(() => {
                    res.redirect('/createPromotions');
                })
                .catch(err => console.log(err));
            });

module.exports = router;