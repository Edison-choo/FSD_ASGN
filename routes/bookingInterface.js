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
const { username } = require('../config/db');

var res_name
var email
var email_id

router.get('/bookForm/:res_name', (req, res) => {
    res_name = req.params.res_name;
    Restaurant.findOne({ where: { res_name: res_name } });
    res.render('bookingInterface/bookForm', { res_name });
});

router.get('/updateForm/:email/:res_name', (req, res) => {
    email_id = req.params.email;
    res_name_id = req.params.res_name;
    Booking.findOne({
        where: {
            [Op.and]: [{ email: email_id }, { res_name: res_name_id }]
        }
    }).then(booking => {
        console.log(booking);
        res.render('bookingInterface/updateForm', { booking });
    })
})

router.post('/updateForm/:email/:res_name', urlencodedParser, (req, res) => {
    let email = req.params.email;
    let date = req.body.bookingDate;
    let timing = req.body.bookingTime;
    let pax = req.body.bookingPax;
    let confirm = req.body.bookingConfirm

    console.log(date, timing, email, pax)

    Booking.update({
        timing: timing,
        date: date,
        pax: pax,
        confirm: confirm
    }, {
        where: {
            [Op.and]: [{ email: req.params.email }, { res_name: req.params.res_name }]
        }
    }).then(booking => {
        res.redirect('/bookingInterface/bookingDetails/' + email + '/' + req.params.res_name);
    })
});

router.get('/bookingDetailsList/:email', (req, res) => {
    email_id = req.params.email;
    Booking.findAll({
            where: { email: email_id }
        }).then(booking => {
            console.log(booking);

            res.render('bookingInterface/bookingDetailsList', { booking });
        })
        .catch((err) => console.log(err));
});

router.get('/bookingDetailsListPage/:email/:res_name', (req, res) => {
    email_id = req.params.email;
    res_name_id = req.params.res_name
    Booking.findOne({
        where: {
            [Op.and]: [{ email: email_id }, { res_name: res_name_id }]
        }
    }).then(booking => {
        console.log(booking);
        res.render('bookingInterface/bookingDetailsListPage', { booking });
    })
});

router.post('/deleteBooking/:email/:res_name', (req, res) => {

    Booking.destroy({
        where: {
            [Op.and]: [{ email: req.params.email }, { res_name: req.params.res_name }]
        }
    }).then(() =>
        res.redirect('/')
    ).catch(err => console.log(err));

});

router.post('/bookingDetailsListPage/:email/:res_name', (req, res) => {

    let confirm = req.params.bookingConfirm

    Booking.update({
        confirm: confirm
    }, {
        where: {
            [Op.and]: [{ email: req.params.email }, { res_name: req.params.res_name }]
        }
    }).then(booking => {
        console.log(booking)
        res.redirect('/bookingStaff/viewBookings/' + req.user.fname);
    })

});

router.get('/bookingDetails/:email/:res_name', (req, res) => {
    email = req.params.email;
    res_name = req.params.res_name;
    Booking.findOne({
            where: {
                [Op.and]: [{ email: email }, { res_name: res_name }]
            },
            order: [
                ['id', 'DESC']
            ]
        })
        .then(booking => {
            console.log(booking);
            res.render('bookingInterface/bookingDetails', { booking });
        })
});

router.post('/bookForm/:res_name', urlencodedParser, (req, res) => {
    res_name = req.params.res_name;
    let errors = [];

    let {
        date,
        timing,
        firstName,
        lastName,
        email,
        pax
    } = req.body;

    if (!emailValidator.validate(email)) {
        errors.push({ text: "Email is invalid!" })
    };

    if (errors.length > 0) {
        res.render('bookingInterface/bookForm', {
            errors,
            date,
            timing,
            firstName,
            lastName,
            email,
            pax,
        });
    } else {
        Booking.findOne({
                where: {
                    [Op.and]: [{ email: req.body.email }, { res_name: res_name }]
                }
            })
            .then((booking) => {
                if (booking) {
                    res.render("bookingInterface/bookForm", {
                        error: booking.email + "has already booked a slot at " + booking.res_name,
                        date,
                        timing,
                        firstName,
                        lastName,
                        email,
                        pax,
                    })
                } else {
                    Booking.create({
                            res_name: res_name,
                            firstName: firstName,
                            lastName: lastName,
                            email: email,
                            timing: timing,
                            date: date,
                            pax: pax
                        }).then(booking => {
                            res.redirect('/bookingInterface/bookingDetails/' + email);
                        })
                        .catch(err => console.log(err));
                }
            })
            .catch((err) => console.log(err));

    }

});

module.exports = router;