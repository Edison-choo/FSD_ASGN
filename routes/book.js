const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const alertMessage = require("../helpers/messenger");
const Menu = require("../models/menu");
const menuSpecification = require("../models/menuSpecification");
const { session } = require("passport");
// const { Sequelize } = require("sequelize/types");
const { Op } = require("sequelize");
const Order = require("../models/order");

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
  // console.log(sess.cart);
  if (sess.cart) {
    let cart = sess.cart.map((c) => parseInt(c.id));
    Menu.findAll({
      where: {
        id: { [Op.in] : cart }
      },
    })
      .then((menus) => {
        if (menus) {
          let count = 0;
          menus.forEach((food) => {
            count += parseFloat(food.price) * sess.cart[cart.indexOf(food.id)].quantity;
          })
          req.session.total = count;
          res.render("book/foodCart", {menus, count});
        }
      })
      .catch((err) => console.log(err))
  } else {
    res.render("book/foodCart");
  }
  
});

router.get("/receipt/:id", (req, res) => {
  Order.findOne({ where: { id:req.params.id } })
    .then((order) => {
      if (order) {
        order.food = JSON.parse(order.food);
        if (order.food) {
          let cart = order.food.map((c) => parseInt(c.id));
          Menu.findAll({
            where: {
              id: { [Op.in] : cart }
            },
          })
            .then((menus) => {
              if (menus) {
                res.render("book/receipt", {order, menus});
              }
            })
            .catch((err) => console.log(err))
        }
      }
    }).catch((err) => console.log(err));
});

router.get("/payment", (req, res) => {
  res.render("book/payment");
});

//add item to session
router.post("/add/:id", urlencodedParser, (req, res) => {
  let cart = [];
  let existCart = [];
  let { quantity, specifications } = req.body;
  // console.log(quantity, specifications)
  let sess = req.session;
  if (sess.cart) {
    existCart = (sess.cart.map((food) => food.id));
  }
  console.log(existCart);
  cart.push({
    id: req.params.id,
    quantity: quantity,
    specifications: specifications,
  });
  if (existCart.indexOf(req.params.id) > -1) {
    sess.cart[existCart.indexOf(req.params.id)] = cart[0]
  } else if (sess.cart) {
    sess.cart = sess.cart.concat(cart);
  } else {
    sess.cart = cart;
  }
  console.log(sess.cart);
  alertMessage(res, "success",'Food is added to the shopping cart', 'fas fa-sign-in-alt', true);
  res.redirect("/book/menuBook"); 
});

//delete item from session
router.get('/delete/:id', (req, res) => {
  let sess = req.session;
  sess.cart = sess.cart.filter((c) => c.id !== req.params.id);
  alertMessage(res, "success",'Food is removed to the shopping cart', 'fas fa-trash-alt', true);
  res.redirect('../../book/foodCart');
});

//create order
router.post('/createOrder', urlencodedParser, (req, res) => {
  let sess = req.session;
  let {remark} = req.body;
  if (sess.cart) {
    let total = 0;
    // let cart = sess.cart.map((c) => parseInt(c.id));
    // Menu.findAll({
    //   where: {
    //     id: { [Op.in] : cart }
    //   },
    // })
    //   .then((menus) => {
    //     if (menus) {
    //       menus.forEach((food) => {
    //         $scope.total += parseFloat(food.price) * sess.cart[cart.indexOf(food.id)].quantity;
    //       })
    //     }
    //   })
    //   .catch((err) => console.log(err))
    Order.create({
      userId: 1,
      food:JSON.stringify(sess.cart),
      date: new Date(),
      total:req.session.total,
      remarks: remark
    }).then((order) => {
      sess.cart = undefined;
      res.redirect('/book/receipt/'+order.id);
    }).catch((err) => console.log(err));
  } else {
    console.log("test")
    res.redirect('/book/foodCart');
  }
});

module.exports = router;
