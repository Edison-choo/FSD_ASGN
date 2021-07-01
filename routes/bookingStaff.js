const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const express = require('express');
const exphbs = require('express-handlebars');
const moment = require('moment');
const validator = require("email-validator")
const router = express.Router();
const Booking = require("../models/booking")
const emailValidator = require("email-validator");
const alertMessage = require('../helpers/messenger');
const Restaurant = require('../models/restaurants')
const { Op } = require("sequelize");
const ensureAuthenticated = require('../helpers/auth');

var res_name
var email

router.get('/viewBookings/:res_name', (req, res) => {
    res_name = req.params.res_name;
    Booking.findAll({
        where: { res_name: res_name }
    }).then(booking => {
        console.log(booking);
        res.render('bookingStaff/viewBookings', { res_name });
    })
});


module.exports = router;