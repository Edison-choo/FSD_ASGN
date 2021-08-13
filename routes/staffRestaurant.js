const express = require("express");
const exphbs = require("express-handlebars");
const router = express.Router();
const bodyParser = require("body-parser");
const alertMessage = require("../helpers/messenger");
const Restaurant = require("../models/restaurants");
const emailValidator = require("email-validator");
const urlValidator = require("valid-url");
const fs = require("fs");
const upload = require("../helpers/imageUpload");
const ensureAuthenticated = require("../helpers/auth");
const moment = require("moment");
const { queue } = require("jquery");

var urlencodedParser = bodyParser.urlencoded({ extended: false });

//Page if restaurant page not created
router.get("/", ensureAuthenticated, (req, res) => {
  res.render("staffRestaurant/start");
});

//Create Restaurant Page
router.get("/createRestaurant", ensureAuthenticated, (req, res) => {
  res.render("staffRestaurant/createRestaurant");
});

//View Restaurant Page
router.get("/viewRestaurant", ensureAuthenticated, (req, res) => {
  let res_name = req.user.fname;
  Restaurant.findOne({ where: { res_name: res_name } }).then((restaurant) => {
    res.render("staffRestaurant/viewRestaurant", { restaurant });
  });
});

//Edit Restaurant Page
router.get("/editRestaurant", ensureAuthenticated, (req, res) => {
  let res_name = req.user.fname;
  Restaurant.findOne({
    where: {
      res_name: res_name,
    },
  })
    .then((restaurant) => {
      checkOptions(restaurant);
      res.render("staffRestaurant/editRestaurant", {
        restaurant: restaurant,
      });
    })
    .catch((err) => console.log(err));
});

//Post for Create Restaurant Page
router.post(
  "/createRestaurant",
  urlencodedParser,
  ensureAuthenticated,
  (req, res) => {
    let res_name = req.user.fname;
    let errors = [];

    // Retrieves fields from register page from request body
    let {
      address,
      comp_email,
      phone,
      cuisine,
      open_time,
      close_time,
      price,
      halal,
      facebook,
      twitter,
      instagram,
      iconURL,
    } = req.body;

    //Email validation
    if (!emailValidator.validate(comp_email)) {
      errors.push({ text: "Email is invalid!" });
    }

    //Phone validation
    if (!phone.match(/[6|8|9]\d{7}|\+65[6|8|9]\d{7}|\+65\s[6|8|9]\d{7}/g)) {
      errors.push({ text: "Phone is invalid!" });
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
        address,
        comp_email,
        phone,
        cuisine,
        open_time,
        close_time,
        price,
        halal,
        facebook,
        twitter,
        instagram,
        iconURL,
      });
    } else {
      //Check if address is already used
      Restaurant.findOne({
        where: { address: address },
      })
        .then((restaurant) => {
          if (restaurant) {
            res.render("staffRestaurant/createRestaurant", {
              error: address + " is already in use...",
              comp_email,
              phone,
              cuisine,
              open_time,
              close_time,
              price,
              halal,
              facebook,
              twitter,
              instagram,
              iconURL,
            });
          } else {
            Restaurant.update(
              {
                comp_email: comp_email,
                staffid: req.user.id,
                address: address,
                phone: phone,
                cuisine: cuisine,
                open_time: open_time,
                close_time: close_time,
                price: price,
                halal: halal,
                facebook: facebook,
                twitter: twitter,
                instagram: instagram,
                image: iconURL,
              },
              {
                where: {
                  res_name: res_name,
                },
              }
            )
              .then((restaurant) => {
                res.redirect("/staffRestaurant");
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
    }
  }
);

function checkOptions(restaurant) {
  restaurant.western =
    restaurant.cuisine.search("Western") >= 0 ? "selected" : "";
  restaurant.mexican =
    restaurant.cuisine.search("Mexican") >= 0 ? "selected" : "";
  restaurant.thai = restaurant.cuisine.search("Thai") >= 0 ? "selected" : "";
  restaurant.indian =
    restaurant.cuisine.search("Indian") >= 0 ? "selected" : "";
  restaurant.Japanese =
    restaurant.cuisine.search("Japanese") >= 0 ? "selected" : "";
  restaurant.french =
    restaurant.cuisine.search("French") >= 0 ? "selected" : "";
  restaurant.chinese =
    restaurant.cuisine.search("Chinese") >= 0 ? "selected" : "";
  restaurant.italian =
    restaurant.cuisine.search("Italian") >= 0 ? "selected" : "";
  restaurant.seafood =
    restaurant.cuisine.search("Seafood") >= 0 ? "selected" : "";
  restaurant.local = restaurant.cuisine.search("Local") >= 0 ? "selected" : "";
}

//Put for edit restaurant
router.post(
  "/editRestaurant",
  urlencodedParser,
  ensureAuthenticated,
  (req, res) => {
    let errors = [];
    let res_name = req.user.fname;
    let {
      comp_name,
      address,
      open_time,
      close_time,
      cuisine,
      price,
      halal,
      comp_email,
      phone,
      facebook,
      twitter,
      instagram,
      iconURL,
    } = req.body;

    //Email validator
    if (!emailValidator.validate(comp_email)) {
      errors.push({ text: "Email is invalid!" });
    }

    //Phone validation
    if (!phone.match(/[6|8|9]\d{7}|\+65[6|8|9]\d{7}|\+65\s[6|8|9]\d{7}/g)) {
      errors.push({ text: "Phone is invalid!" });
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
      restaurant = {
        comp_name: comp_name,
        address: address,
        open_time: open_time,
        close_time: close_time,
        cuisine: cuisine,
        price: price,
        halal: halal,
        comp_email: comp_email,
        phone: phone,
        facebook: facebook,
        twitter: twitter,
        instagram: instagram,
        image: iconURL,
      };
      res.render("staffRestaurant/editRestaurant", {
        errors,
        restaurant,
      });
    } else {
      Restaurant.update(
        {
          comp_name: comp_name,
          address: address,
          open_time: open_time,
          close_time: close_time,
          cuisine: cuisine,
          halal: halal,
          comp_email: comp_email,
          phone: phone,
          facebook: facebook,
          twitter: twitter,
          instagram: instagram,
          image: iconURL,
        },
        {
          where: {
            res_name: res_name,
          },
        }
      )
        .then(() => {
          res.redirect("/staffRestaurant/viewRestaurant");
        })
        .catch((err) => console.log(err));
    }
  }
);

//Get create table layout page
router.get("/createLayout", (req, res) => {
  res.render("staffRestaurant/createLayout");
});

router.post(
  "/createLayout",
  urlencodedParser,
  ensureAuthenticated,
  (req, res) => {
    let res_name = req.user.fname;
    let errors = [];
    let { seat, square, tables } = req.body;

    if (seat.length == 0) {
      errors.push({ text: "No Seat!" });
    }
    if (square.length == 0) {
      errors.push({ text: "No Tables!" });
    }
    if (errors.length > 0) {
      res.render("staffRestaurant/createLayout", {
        errors,
        seat,
        square,
        tables,
      });
    } else {
      Restaurant.update(
        {
          seat: seat,
          square: square,
          tables: tables,
          occupied: "",
        },
        {
          where: {
            res_name: res_name,
          },
        }
      )
        .then((layout) => {
          res.redirect("/staffRestaurant");
        })
        .catch((err) => console.log(err));
    }
  }
);

router.get("/seatManager", ensureAuthenticated, (req, res) => {
  let res_name = req.user.fname;
  Restaurant.findOne({ where: { res_name: res_name } }).then((layouts) => {
    res.render("staffRestaurant/seatManager", { layouts });
  });
});

router.post(
  "/seatManager",
  urlencodedParser,
  ensureAuthenticated,
  (req, res) => {
    let res_name = req.user.fname;
    let { occupied, queue } = req.body;
    Restaurant.update(
      {
        occupied: occupied,
        queue: queue,
      },
      {
        where: {
          res_name: res_name,
        },
      }
    )
      .then(() => {
        res.redirect("/staffRestaurant/seatManager");
      })
      .catch((err) => console.log(err));
  }
);
router.post("/upload", urlencodedParser, ensureAuthenticated, (req, res) => {
  // Creates user id directory for upload if not exist
  if (!fs.existsSync("./public/uploads/resIcon/" + req.user.id)) {
    fs.mkdirSync("./public/uploads/resIcon/" + req.user.id);
  }
  upload.restUpload(req, res, (err) => {
    if (err) {
      res.json({ file: "/img/no-image.jpg", err: err });
    } else {
      if (req.file === undefined) {
        res.json({ file: "/img/no-image.jpg", err: err });
      } else {
        res.json({
          file: `/uploads/resIcon/${req.user.id}/${req.file.filename}`,
        });
      }
    }
  });
});

router.get("/viewLayout", ensureAuthenticated, (req, res) => {
  let res_name = req.user.fname;
  Restaurant.findOne({ where: { res_name: res_name } }).then((layouts) => {
    res.render("staffRestaurant/viewLayout", { layouts });
  });
});

router.get("/editLayout", ensureAuthenticated, (req, res) => {
  let res_name = req.user.fname;
  Restaurant.findOne({ where: { res_name: res_name } }).then((layouts) => {
    res.render("staffRestaurant/editLayout", { layouts });
  });
});

router.post(
  "/editLayout",
  urlencodedParser,
  ensureAuthenticated,
  (req, res) => {
    let res_name = req.user.fname;
    let errors = [];
    let { seat, square, tables } = req.body;

    if (seat.length == 0) {
      errors.push({ text: "No Seat!" });
    }
    if (square.length == 0) {
      errors.push({ text: "No Tables!" });
    }
    if (errors.length > 0) {
      res.render("staffRestaurant/createLayout", {
        errors,
        seat,
        square,
        tables,
      });
    } else {
      Restaurant.update(
        {
          seat: seat,
          square: square,
          tables: tables,
          occupied: "",
        },
        {
          where: {
            res_name: res_name,
          },
        }
      )
        .then((layout) => {
          res.redirect("/staffRestaurant/viewLayout");
        })
        .catch((err) => console.log(err));
    }
  }
);
module.exports = router;
