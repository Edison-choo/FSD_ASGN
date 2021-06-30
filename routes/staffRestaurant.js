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

var urlencodedParser = bodyParser.urlencoded({ extended: false });

//Page if restaurant page not created
router.get("/", (req, res) => {
  res.render("staffRestaurant/start");
});

//Create Restaurant Page
router.get("/createRestaurant", (req, res) => {
  res.render("staffRestaurant/createRestaurant");
});

//View Restaurant Page
router.get("/viewRestaurant", (req, res) => {
  let email = req.user.email;
  Restaurant.findOne({ where: { email: email } }).then((restaurant) => {
    res.render("staffRestaurant/viewRestaurant", { restaurant });
  });
});

//Edit Restaurant Page
router.get("/editRestaurant", (req, res) => {
  let email = req.user.email;
  Restaurant.findOne({
    where: {
      email: email,
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
router.post("/createRestaurant", urlencodedParser, (req, res) => {
  let email = req.user.email;
  let errors = [];

  // Retrieves fields from register page from request body
  let {
    res_name,
    comp_email,
    cuisine,
    open_time,
    close_time,
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
      res_name,
      comp_email,
      cuisine,
      open_time,
      close_time,
      halal,
      facebook,
      twitter,
      instagram,
      iconURL,
    });
  } else {
    //Check if address is already used
    Restaurant.findOne({
      where: {res_name:res_name},
    })
      .then((restaurant) => {
        if (restaurant) {
          res.render("staffRestaurant/createRestaurant", {
            error: res_name + " is already in use...",
            res_name,
            comp_email,
            cuisine,
            open_time,
            close_time,
            halal,
            facebook,
            twitter,
            instagram,
            iconURL,
          });
        } else {
          Restaurant.update(
            {
              res_name: res_name,
              comp_email: comp_email,
              cuisine: cuisine,
              open_time: open_time,
              close_time: close_time,
              halal: halal,
              facebook: facebook,
              twitter: twitter,
              instagram: instagram,
              image: iconURL,
            },
            {
              where: {
                email: email,
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
});

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
router.post("/editRestaurant", urlencodedParser, (req, res) => {
  email = req.user.email;
  let {
    comp_name,
    address,
    open_time,
    close_time,
    cuisine,
    halal,
    comp_email,
    iconURL,
  } = req.body;
  Restaurant.update(
    {
      comp_name: comp_name,
      address: address,
      open_time: open_time,
      close_time: close_time,
      cuisine: cuisine,
      halal: halal,
      comp_email: comp_email,
      image: iconURL,
    },
    {
      where: {
        email: email,
      },
    }
  )
    .then(() => {
      res.redirect("/staffRestaurant/viewRestaurant");
    })
    .catch((err) => console.log(err));
});

//Get create table layout page
router.get("/createLayout", (req, res) => {
  res.render("staffRestaurant/createLayout");
});

router.post("/createLayout", urlencodedParser, (req, res) => {
  let email = req.user.email;
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
          email: email,
        },
      }
    )
      .then((layout) => {
        res.redirect("/staffRestaurant");
      })
      .catch((err) => console.log(err));
  }
});

router.get("/seatManager", (req, res) => {
  let email = req.user.email;
  Restaurant.findOne({ where: { email: email } }).then((layouts) => {
    res.render("staffRestaurant/seatManager", { layouts });
  });
});

router.post("/seatManager", urlencodedParser, (req, res) => {
  let email = req.user.email;
  let { occupied } = req.body;
  Restaurant.update(
    {
      occupied: occupied,
    },
    {
      where: {
        email: email,
      },
    }
  )
    .then(() => {
      res.redirect("/staffRestaurant/seatManager");
    })
    .catch((err) => console.log(err));
});
router.post("/upload", urlencodedParser, (req, res) => {
  // Creates user id directory for upload if not exist
  if (!fs.existsSync("./public/uploads/" + 1)) {
    fs.mkdirSync("./public/uploads/" + 1);
  }
  upload.restUpload(req, res, (err) => {
    if (err) {
      res.json({ file: "/img/no-image.jpg", err: err });
    } else {
      if (req.file === undefined) {
        res.json({ file: "/img/no-image.jpg", err: err });
      } else {
        res.json({ file: `/uploads/1/${req.file.filename}` });
      }
    }
  });
});
module.exports = router;
