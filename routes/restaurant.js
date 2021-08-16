const express = require("express");
const router = express.Router();
const Restaurant = require("../models/restaurants");
const Reviews = require("../models/reviews");
const TableStatus = require("../models/tableStatus");
var sortSource = require("../public/js/res");
const ensureAuthenticated = require("../helpers/auth");
const Sequelize = require("sequelize");
const { urlencoded } = require("body-parser");
const Op = Sequelize.Op;

const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });


//Get restaurants page
router.get("/", (req, res) => {
  Restaurant.findAll().then((restaurant) => {
    res.render("restaurant/restaurants");
  });
});

//Ajax pass data into restaurant page
router.get("/getRes", (req, res) => {
  Restaurant.findAll().then((restaurant) => {
    res.json(restaurant);
  });
})

//Get specific restaurant page
router.get("/restaurant_1/:restaurant", (req, res) => {
  let restaurantname = req.params.restaurant;
  Restaurant.findOne({ where: { res_name: restaurantname } }).then(
    (restaurant) => {
      Reviews.findAll({ where: { restaurant: restaurantname } }).then(
        (reviews) => {
          let totalaverage = 0;
          if (reviews) {
            for (i in reviews) {
              totalaverage += reviews[i].average;
            }
            totalaverage = totalaverage / reviews.length;
          }
          console.log(totalaverage);
          res.render("restaurant/restaurant_1", {
            restaurant,
            reviews,
            totalaverage: totalaverage.toFixed(1),
          });
        }
      );
    }
  );
})

//Xuan Wei Pagination Route
router.get("/restaurant_1/pagination/:restaurant", (req, res) => {
  let restaurantname = req.params.restaurant;
  Restaurant.findOne({ where: { res_name: restaurantname } }).then(
    (restaurant) => {
      Reviews.findAll({ where: { restaurant: restaurantname } }).then(
        (reviews) => {
          let totalaverage = 0;
          if (reviews) {
            for (i in reviews) {
              totalaverage += reviews[i].average;
            }
            totalaverage = totalaverage / reviews.length;
          }
          console.log(totalaverage, "test");
          res.json({
            reviews,
            totalaverage: totalaverage.toFixed(1)
          });
        }
      );
    }
  );
});

module.exports = router;
