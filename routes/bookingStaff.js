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



router.get('/viewBookings/:res_name', ensureAuthenticated, (req, res) => {
    res_name_id = req.params.res_name;
    Booking.destroy({
        where: {
            [Op.and]: [{ confirm: 0 },
                {
                    date: {
                        [Op.lt]: Date()
                    }
                }
            ]
        }
    })
    Booking.findAll({
            where: { res_name: res_name_id }
        }).then(booking => {
            console.log(booking);

            res.render('bookingStaff/viewBookings', { booking });
        })
        .catch((err) => console.log(err));
});

router.get('/acceptBooking/:email/:res_name', ensureAuthenticated, (req, res) => {
    res_name_id = req.params.res_name
    email_id = req.params.email
    Booking.update({
        confirm: 1
    }, {
        where: {
            [Op.and]: [{ email: email_id }, { res_name: res_name_id }]
        }
    }).then(() => {
        res.redirect('/bookingStaff/viewBookings/' + res_name_id)
    })
})

router.get('/deleteBooking/:email/:res_name', ensureAuthenticated, (req, res) => {
    res_name_id = req.params.res_name
    Booking.destroy({
        where: {
            [Op.and]: [{ email: req.params.email }, { res_name: req.params.res_name }]
        }
    }).then(() =>
        res.redirect('/bookingStaff/viewBookings/' + res_name_id)
    ).catch(err => console.log(err));

});


module.exports = router;