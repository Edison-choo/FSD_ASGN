const express = require("express");
const exphbs = require("express-handlebars");
const router = express.Router();
const bodyParser = require("body-parser");
const alertMessage = require("../helpers/messenger");
const Restaurant = require("../models/restaurants");
const emailValidator = require("email-validator");
const urlValidator = require("valid-url");

var urlencodedParser = bodyParser.urlencoded({ extended: false });

//Page if restaurant page not created
router.get("/", (req, res) => {
  res.render("staffRestaurant/start");
});

//Create Restaurant Page
router.get("/createRestaurant", (req, res) => {
  res.render("staffRestaurant/createRestaurant");
});

//Post for Create Restaurant Page
router.post("/createRestaurant", urlencodedParser, (req, res) => {
  let errors = [];

  // Retrieves fields from register page from request body
  let {
    comp_name,
    address,
    comp_email,
    uen,
    res_name,
    cuisine,
    open_time,
    close_time,
    halal,
    facebook,
    twitter,
    instagram,
  } = req.body;

  //Email validation
  if (!emailValidator.validate(comp_email)) {
    errors.push({ text: "Email is invalid!" });
  }

  //Facebook url validation
  if (!urlValidator.isUri(facebook) && facebook !== "") {
    errors.push({ text: "Facebook url is formatted incorrectly!" });
  }

  //Twitter url validation
  if (!urlValidator.isUri(twitter) && twitter !== "") {
    errors.push({ text: "Twitter url is formatted incorrectly!" });
  }

  //Instagram url validation
  if (!urlValidator.isUri(instagram) && instagram !== "") {
    errors.push({ text: "Instagram url is formatted incorrectly!" });
  }

  if (errors.length > 0) {
    res.render("staffRestaurant/createRestaurant", {
      errors,
      comp_name,
      address,
      comp_email,
      uen,
      res_name,
      cuisine,
      open_time,
      close_time,
      facebook,
      twitter,
      instagram,
    });
  } else {
    //Check if address is already used
    Restaurant.findOne({ where: { address: req.body.address } })
      .then((restaurant) => {
        if (restaurant) {
          res.render("staffRestaurant/createRestaurant", {
            error: restaurant.address + "is already in use...",
            comp_name,
            address,
            comp_email,
            uen,
            res_name,
            cuisine,
            open_time,
            close_time,
            facebook,
            twitter,
            instagram,
          });
        } else {
          Restaurant.create({
            comp_name: comp_name,
            address: address,
            comp_email: comp_email,
            uen: uen,
            res_name: res_name,
            cuisine: cuisine,
            open_time: open_time,
            close_time: close_time,
            halal: halal,
            facebook: facebook,
            twitter: twitter,
            instagram: instagram,
          })
            .then((restaurant) => {
              res.redirect("/staffRestaurant");
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }
});

module.exports = router;
