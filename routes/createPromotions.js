const express = require('express');
const exphbs = require('express-handlebars');
const router = express.Router();
var bodyParser = require('body-parser');
const alertMessage = require('../helpers/messenger');
const Promotions = require('../models/promotions');
const moment = require('moment');
const ensureAuthenticated = require('../helpers/auth');
const upload = require('../helpers/imageUpload');
const fs = require('fs');
const Restaurant = require('../models/restaurants');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', (req, res) => {
    Promotions.findAll( {where: {staffid: req.user.id}}
    ).then((promotions) => {
        console.log(promotions)
        Restaurant.findOne({where: {staffid: req.user.id}}
            ).then((restaurants) => {
                console.log(restaurants.image)
                res.render('promotion/createPromotions', {restaurants: restaurants, promotions: promotions});
            })
    }).catch(err => console.log(err));
});
// router.get('/', (req, res) => {
//     res.render('promotion/createPromotions');
// });

router.post('/createPromotions', urlencodedParser,(req, res) => {
    let errors = [];
    let{name, startdate, enddate, discount, details, banner, staffid} = req.body;

    if(!( 0 <= discount <= 100 )){
        errors.push({text: "Invalid amount!"})
    }

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
                    error: promotions.name + ' already exist',
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
                    banner: banner,
                    staffid: req.user.id,
                    counter: 0
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
    let{name, startdate, enddate, discount, details} = req.body;

        Promotions.update({ name, startdate, enddate, discount, details},
            {where: {id:req.params.id} })
        .then(() => {
                    res.redirect('/createPromotions');
                })
                .catch(err => console.log(err));
            });

router.post('/upload/:id', ensureAuthenticated, (req, res) => {
    // Creates user id directory for upload if not exist
    if (!fs.existsSync('./public/uploads/bannerimg/' + req.user.id)){
        fs.mkdirSync('./public/uploads/bannerimg/' + req.user.id);
    }
    upload.bannerUpload(req, res, (err) => {
    if (err) {
        res.json({err})
    } else {
        if (req.file === undefined) {
            res.json({err})
        } else {
            console.log("test")
            Promotions.update({
                banner: `/uploads/bannerimg/${req.user.id}/${req.file.filename}`
            },
            {where:{id:req.params.id}}
            )
        }
    }
    });
});

router.get('/createPromotions/promoStats', (req, res) => {
    Promotions.findAll( {where: {staffid: req.user.id}}
    ).then((promotions) => {
        console.log(promotions)
        Restaurant.findOne({where: {staffid: req.user.id}}
            ).then((restaurants) => {
                console.log(restaurants.image)
                res.json({restaurants, promotions});
            })
    }).catch(err => console.log(err));
});
module.exports = router;