const express = require('express');
const exphbs = require('express-handlebars');
const router = express.Router();
var bodyParser = require('body-parser');
const alertMessage = require('../helpers/messenger');
const Restaurant = require("../models/restaurants");

var urlencodedParser = bodyParser.urlencoded({extended: false});

//Page if restaurant page not created
router.get('/', (req, res) => {
    res.render('staffRestaurant/start')
});

//Create Restaurant Page
router.get('/createRestaurant', (req, res) => {
    res.render('staffRestaurant/createRestaurant')
});

//Post for Create Restaurant Page
router.post('/createRestaurant', urlencodedParser, (req, res) => {
    let errors = [];
    let {comp_name, address, comp_email, uen, res_name, cuisine, open_time, close_time, halal, facebook, twitter, instagram} = req.body;
    if (errors.length > 0) {
        res.render('staffRestaurant/createRestaurant')
    }
    else{
        Restaurant.create({ comp_name:comp_name, address:address, comp_email:comp_email, uen:uen, res_name:res_name, cuisine:cuisine, open_time:open_time, close_time:close_time, halal:halal, facebook:facebook, twitter:twitter, instagram:instagram })
        .then(restaurant => {
            res.redirect('/staffRestaurant')
        })
        .catch(err => console.log(err));
    }
});

module.exports = router;