const express = require("express");
const router = express.Router();
const Restaurant = require("../models/restaurants");
const Reviews = require("../models/reviews");
var sortSource = require("../public/js/res");
const ensureAuthenticated = require("../helpers/auth");
const Sequelize = require("sequelize");
const { urlencoded } = require("body-parser");
const Op = Sequelize.Op;

const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//Restaurants Page
// router.get("/", (req, res) => {
//   const { search, sort } = req.query;
//   if (search || sort) {
//     Restaurant.findAll({
//       where: { res_name: { [Op.like]: "%" + search + "%" } },
//       order: [[sort, "ASC"]],
//     }).then((restaurant) => {
//       res.render("restaurant/restaurants", { restaurant, search, sort });
//     });
//   } else {
//     Restaurant.findAll({}).then((restaurant) => {
//       res.render("restaurant/restaurants", { restaurant });
//     });
//   }
// });

router.get("/", (req, res) => {
  Restaurant.findAll().then((restaurant) => {
    res.render("restaurant/restaurants");
  });
});

router.get("/getRes", (req, res) => {
  Restaurant.findAll().then((restaurant) => {
    res.json(restaurant);
  });
})

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
