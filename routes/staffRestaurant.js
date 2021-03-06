const express = require("express");
const exphbs = require("express-handlebars");
const router = express.Router();
const bodyParser = require("body-parser");
const alertMessage = require("../helpers/messenger");
const Restaurant = require("../models/restaurants");
const TableStatus = require("../models/tableStatus");
const urlValidator = require("valid-url");
const fs = require("fs");
const upload = require("../helpers/imageUpload");
const ensureAuthenticated = require("../helpers/auth");
const moment = require("moment");
const { queue } = require("jquery");

var urlencodedParser = bodyParser.urlencoded({ extended: false });

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
      unit,
      name,
      website,
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

    //Name validation
    if (!name) {
      errors.push({ text: "Name required!" });
    }

    //Address validation
    if (!address.match(/(\d{1,3}.)?.+\s(\d{6})$/)) {
      errors.push({ text: "Address is invalid!" });
    }

    //Unit number validation
    if (!unit.match(/([-#0-9])/)) {
      errors.push({ text: "Unit Number is invalid!" });
    }

    //Cuisine number validation
    if (!cuisine) {
      errors.push({ text: "Cuisine required!" });
    }

    //Phone validation
    if (!phone.match(/[6|8|9]\d{7}|\+65[6|8|9]\d{7}|\+65\s[6|8|9]\d{7}/)) {
      errors.push({ text: "Phone is invalid!" });
    }

    //Website url validation
    if (!urlValidator.isUri(website) && website !== "") {
      errors.push({ text: "Website url is formatted incorrectly!" });
    }

    //Price validation
    if (!(10 <= price <= 100)) {
      errors.push({ text: "Price is entered incorrectly!" });
    }

    //Halal validation
    if (typeof halal == "boolean") {
      errors.push({ text: "Price is entered incorrectly!" });
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

    //Image validation
    if (!iconURL) {
      errors.push({ text: "Logo required!" });
    }

    //Push errors
    if (errors.length > 0) {
      res.render("staffRestaurant/createRestaurant", {
        errors,
        address,
        unit,
        name,
        website,
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
          staffid: req.user.id,
          name: name,
          website: website,
          address: address,
          unit: unit,
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
          res.render("statistics", {success_msg: "Restaurant tab successfully created"});
        })
        .catch((err) => console.log(err));
    }
  }
);

// Cuisine select value pass in
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

//Post for edit restaurant
router.post(
  "/editRestaurant",
  urlencodedParser,
  ensureAuthenticated,
  (req, res) => {
    let errors = [];
    let res_name = req.user.fname;
    let {
      address,
      unit,
      name,
      website,
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

    //Name validation
    if (!name) {
      errors.push({ text: "Name required!" });
    }

    //Address validation
    if (!address.match(/(\d{1,3}.)?.+\s(\d{6})$/)) {
      errors.push({ text: "Address is invalid!" });
    }

    //Unit number validation
    if (!unit.match(/([-#0-9])/)) {
      errors.push({ text: "Unit Number is invalid!" });
    }

    //Cuisine validation
    if (!cuisine) {
      errors.push({ text: "Cuisine required!" });
    }

    //Phone validation
    if (!phone.match(/[6|8|9]\d{7}|\+65[6|8|9]\d{7}|\+65\s[6|8|9]\d{7}/)) {
      errors.push({ text: "Phone is invalid!" });
    }

    //Website url validation
    if (!urlValidator.isUri(website) && website !== "") {
      errors.push({ text: "Website url is formatted incorrectly!" });
    }

    //Open time validation
    if (!open_time.match(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/)) {
      errors.push({ text: "Opening time is formatted incorrectly!" });
    }

    //Close time validation
    if (!close_time.match(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/)) {
      errors.push({ text: "Closing time is formatted incorrectly!" });
    }

    //Price validation
    if (!(10 <= price <= 100)) {
      errors.push({ text: "Price is entered incorrectly!" });
    }

    //Halal validation
    if (typeof halal == "boolean") {
      errors.push({ text: "Price is entered incorrectly!" });
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

    //Image validation
    if (!iconURL) {
      errors.push({ text: "Logo required!" });
    }

    if (errors.length > 0) {
      restaurant = {
        res_name: res_name,
        name: name,
        website: website,
        address: address,
        unit: unit,
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
      };
      res.render("staffRestaurant/editRestaurant", {
        errors,
        restaurant,
      });
    } else {
      Restaurant.update(
        {
          name: name,
          website: website,
          address: address,
          unit: unit,
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
        .then(() => {
          res.redirect("viewRestaurant");
        })
        .catch((err) => console.log(err));
    }
  }
);

//Get create table layout page
router.get("/createLayout", (req, res) => {
  res.render("staffRestaurant/createLayout");
});

//Post for create layout page
router.post(
  "/createLayout",
  urlencodedParser,
  ensureAuthenticated,
  (req, res) => {
    let res_name = req.user.fname;
    let errors = [];
    let { seat, square, tables } = req.body;

    //Seat validation
    if (seat.length == 0) {
      errors.push({ text: "No Seats!" });
    }

    //Square validation
    if (square.length == 0) {
      errors.push({ text: "No Tables!" });
    }

    //Table validation
    if (Object.keys(tables).length == 0) {
      errors.push({ text: "Incorrect format!" });
    } 

    if (errors.length > 0) {
      res.render("staffRestaurant/createLayout", {
        errors,
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
          res.render("statistics", {success_msg: "Restaurant layout successfully created!"});
        })
        .catch((err) => console.log(err));
    }
  }
);

//Get for seat manager page
router.get("/seatManager", ensureAuthenticated, (req, res) => {
  let res_name = req.user.fname;
  Restaurant.findOne({ where: { res_name: res_name } }).then((layouts) => {
    res.render("staffRestaurant/seatManager", { layouts });
  });
});

//Async post for seat manager page
router.post(
  "/seatManager",
  urlencodedParser,
  ensureAuthenticated,
  (req, res) => {
    let errors = [];
    let res_name = req.user.fname;
    let { occupied, queue } = req.body;
    if (queue < 0) {
      errors.push({ text: "Please do not enter negative value for queue!" });
    }
    if (errors.length > 0) {
      res.json({
        errors,
      });
    } else {
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
        .then(
          TableStatus.create({
            res_name: res_name,
            queue: queue,
            occupiedCount: occupied.split(",").length - 1,
            dateTime: moment().format(),
          }).then((restaurant) => {
            res.json({ restaurant });
          })
        )
        .catch((err) => console.log(err));
    }
  }
);

//Async image upload for restaurant logo
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

//Get for view layout page
router.get("/viewLayout", ensureAuthenticated, (req, res) => {
  let res_name = req.user.fname;
  Restaurant.findOne({ where: { res_name: res_name } }).then((layouts) => {
    res.render("staffRestaurant/viewLayout", { layouts });
  });
});

//Get for edit layout page
router.get("/editLayout", ensureAuthenticated, (req, res) => {
  let res_name = req.user.fname;
  Restaurant.findOne({ where: { res_name: res_name } }).then((layouts) => {
    res.render("staffRestaurant/editLayout", { layouts });
  });
});

//Post for edit layout page
router.post(
  "/editLayout",
  urlencodedParser,
  ensureAuthenticated,
  (req, res) => {
    let res_name = req.user.fname;
    let errors = [];
    let { seat, square, tables } = req.body;
    //Seat validation
    if (seat.length == 0) {
      errors.push({ text: "No Seat!" });
    }
    //Square validation
    if (square.length == 0) {
      errors.push({ text: "No Tables!" });
    }
    //Table validation
    if (Object.keys(tables).length == 0) {
      errors.push({ text: "Incorrect format!" });
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
          res.redirect("viewLayout");
        })
        .catch((err) => console.log(err));
    }
  }
);

//Get queue & occupancy data
router.get("/getTblData", (req, res) => {
  let res_name = req.user.fname;
  TableStatus.findAll({
    where: { res_name: res_name },
  }).then((status) => {
    res.json(status);
  });
});
module.exports = router;
