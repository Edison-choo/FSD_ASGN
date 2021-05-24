const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const alertMessage = require("../helpers/messenger");
const Menu = require("../models/menu");
const menuSpecification = require("../models/menuSpecification");
const { session } = require("passport");
// const { Sequelize } = require("sequelize/types");
const { Op } = require("sequelize");

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get("/menuBook", (req, res) => {
  var types = [];
  // req.session.cart = undefined;
  Menu.findAll({
    attributes: { exclude: ["restaurantId"] },
  })
    .then((menus) => {
      if (menus) {
        // menus.specifications = JSON.parse(menus.specifications);
        menus.forEach((menu) => {
          if (types.includes(menu.type) === false) {
            types.push(menu.type);
          }
        });
        types.sort();
        res.render("book/menuBook", { menus, types, menuSpecification });
      }
    })
    .catch((err) => console.log(err));
});

router.get("/foodCart", (req, res) => {
  let sess = req.session;
  if (sess.cart) {
    let cart = sess.cart.map((c) => parseInt(c.id));

    Menu.findAll({
      where: {
        id: { [Op.in] : cart }
      },
    })
      .then((menus) => {
        if (menus) {
          res.render("book/foodCart", {menus});
        }
      })
      .catch((err) => console.log(err))
  } else {
    res.render("book/foodCart");
  }
  
});

router.get("/receipt", (req, res) => {
  res.render("book/receipt");
});

router.get("/payment", (req, res) => {
  res.render("book/payment");
});

//add item to session
router.post("/add/:id", urlencodedParser, (req, res) => {
  cart = [];
  let { quantity, specifications } = req.body;
  // console.log(quantity, specifications)
  let sess = req.session;
  cart.push({
    id: req.params.id,
    quantity: quantity,
    specifications: specifications,
  });
  if (sess.cart) {
    sess.cart = sess.cart.concat(cart);
  } else {
    sess.cart = cart;
  }
  console.log(sess.cart);
  res.redirect("/book/menuBook");
});

//delete item from session
router.get('/delete/:id', (res, req) => {
  let sess = req.session;
  console.log(sess);
  let cart = sess.cart.filter((c) => c.id == req.params.id);
  if (cart) {
    delete sess.cart[sess.cart.indexOf(cart)];
    res.redirect('video/foodCart');
  }
  res.redirect('video/foodCart');
});

module.exports = router;
