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
const Order = require("../models/order");
const Menu = require("../models/menu");
const sgMail = require('@sendgrid/mail');
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


router.get('/bookForm/:res_name', ensureAuthenticated, (req, res) => {
    res_name = req.params.res_name;
    Restaurant.findOne({ where: { res_name: res_name } });
    res.render('bookingInterface/bookForm', { res_name });
});

router.get('/updateForm/:email/:res_name', ensureAuthenticated, (req, res) => {
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
        res.redirect('/bookingInterface/bookingDetailsListPage/' + email + '/' + req.params.res_name);
    })
});

router.get('/bookingDetailsList/:email', ensureAuthenticated, (req, res) => {
    email_id = req.params.email;

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
            where: { email: email_id }
        }).then(booking => {
            console.log(booking);

            res.render('bookingInterface/bookingDetailsList', { booking });
        })
        .catch((err) => console.log(err));
});

router.get('/bookingConfirmed/:email/:res_name/:id', ensureAuthenticated, (req, res) => {
    email_id = req.params.email;
    res_name_id = req.params.res_name
    Booking.findOne({
        where: {
            [Op.and]: [{ email: email_id }, { res_name: res_name_id }, { id: req.params.id }]
        }
    }).then(booking => {
        Order.findOne({ where: { bookingId: booking.id } })
            .then((order) => {
                if (order) {
                    order.food = JSON.parse(order.food);
                    if (order.food) {
                        let cart = order.food.map((c) => parseInt(c.id));
                        Menu.findAll({
                                where: {
                                    id: {
                                        [Op.in]: cart
                                    }
                                },
                            })
                            .then((menus) => {
                                if (menus) {
                                    res.render('bookingInterface/bookingConfirmed', { booking, order, menus });

                                }
                            })
                            .catch((err) => console.log(err))
                    }
                }
                console.log(booking);
            })
    })
});

router.get('/bookingDetailsListPage/:email/:res_name/:id', ensureAuthenticated, (req, res) => {
    email_id = req.params.email;
    res_name_id = req.params.res_name
    Booking.findOne({
        where: {
            [Op.and]: [{ email: email_id }, { res_name: res_name_id }, { id: req.params.id }]
        }
    }).then(booking => {
        Order.findOne({ where: { bookingId: booking.id } })
            .then((order) => {
                if (order) {
                    order.food = JSON.parse(order.food);
                    if (order.food) {
                        let cart = order.food.map((c) => parseInt(c.id));
                        Menu.findAll({
                                where: {
                                    id: {
                                        [Op.in]: cart
                                    }
                                },
                            })
                            .then((menus) => {
                                if (menus) {
                                    res.render('bookingInterface/bookingDetailsListPage', { booking, order, menus });

                                }
                            })
                            .catch((err) => console.log(err))
                    }
                } else {
                    console.log("test")
                    res.render('bookingInterface/bookingDetailsListPage', { booking })
                }
                console.log(booking);
            })
    })
});

router.get('/deleteBooking/:id', (req, res) => {

    Booking.destroy({
        where: {
            id: req.params.id
        }
    }).then(() =>
        res.redirect('/bookingInterface/bookingDetailsList/' + req.user.email)
    ).catch(err => console.log(err));

});

router.get('/bookingDetails/:email/:res_name', ensureAuthenticated, (req, res) => {
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
                if (booking && booking.confirm == 0) {
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

                            req.session.booking = booking
                            res.redirect('/bookingInterface/bookingDetails/' + email + '/' + res_name);
                        })
                        .catch(err => console.log(err));
                }
            })
            .catch((err) => console.log(err));

    }

});

router.get('/sendEmail', (req, res) => {
    var msg = `
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous">
  <div class="col-md-2"></div>
  <div class="col-md-8" style='width:60%; margin:0px auto; border:1px solid grey;'>
      <div class="receipt" style="margin: 20px 0 30px;box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;padding: 10px 20px;padding: 30px 30px 50px;">
          <img src="https://images.freeimages.com/images/large-previews/99f/green-tick-in-circle-1147519.jpg" alt="" style="height: 150px;
          width: 150px;
          margin: 10px auto 40px;
          display: block;">
          <div>
              <div class="receiptTitle" style="text-align: center;font-size: 1.4em;font-weight: bold;margin-bottom: 40px;">Booking is successful</div>
              <div style="text-align: center;">
                  Thanks for your purchase. See you there
              </div>
          </div>
          <div>
              <div class="receiptSubTitle" style="text-align: center;padding-bottom: 3px;border-bottom: #35322d solid 2px;font-weight: 600;margin: 30px auto 20px;">Booking details</div>
              <table class="bookTable bookTable1" style="border-collapse: collapse !important;width: 95%; margin: 10px auto;">
                  <tr>
                      <td style='font-weight: bold;'>Restaurant:</td>
                      <td style='text-align: right;'>${req.session.booking.res_name}</td>
                  </tr>
                  <tr>
                      <td style='font-weight: bold;'>Booking Date:</td>
                      <td style='text-align: right;'>${req.session.booking.date}</td>
                  </tr>
                  <tr>
                      <td style='font-weight: bold;'>Booking Time:</td>
                      <td style='text-align: right;'>${req.session.booking.timing}</td>
                  </tr>
                  <tr>
                      <td style='font-weight: bold;'>Pax:</td>
                      <td style='text-align: right;'>${req.session.booking.pax}</td>
                  </tr>
              </table>
              </div>
              </div>
              <div class="col-md-2">
              </div>
              </div>`;
    const message = {
        to: req.session.booking.email,
        from: 'donotreply.foodecent@gmail.com',
        subject: 'Booking receipt',
        text: "Booking receipt",
        html: `${msg}`
    }
    sgMail.send(message)
        .then((response) => console.log("Email sent..."))
        .catch((error) => console.log(error.message));
    res.redirect('/');
})

module.exports = router;