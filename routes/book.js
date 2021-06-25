const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const alertMessage = require("../helpers/messenger");
const Menu = require("../models/menu");
const MenuSpec = require("../models/menuSpec");
const menuSpecification = require("../models/menuSpecification");
const { session } = require("passport");
// const { Sequelize } = require("sequelize/types");
const { Op, STRING } = require("sequelize");
const Order = require("../models/order");
const ensureAuthenticated = require('../helpers/auth');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get("/menuBook", (req, res) => {
  var types = [];
  // req.session.cart = undefined;
  console.log(req.session.cart);
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
        MenuSpec.findAll().then((specs) => {
          let menuSpec = {};
          specs.forEach((option) => {
            if (option.name in menuSpec) {
              menuSpec[option.name] = menuSpec[option.name].concat([
                {option:option.option, addPrice:option.addPrice}
              ]);
            } else {
              console.log("test1");
              menuSpec[option.name] = [{option:option.option, addPrice:option.addPrice}];
            }
          });
          console.log(menuSpec);
          res.render("book/menuBook", {
            menus,
            menuSpecification,
            types,
            menuSpec,
          });
        });
        // res.render("book/menuBook", { menus, types, menuSpecification });
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
            sess.cart[cart.indexOf(food.id)].orders.forEach((order) => {
              count += (parseFloat(food.price)+order.additional) * order.quantity;
            })
            // count += parseFloat(food.price) * sess.cart[cart.indexOf(food.id)].quantity;
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
  let { menuImage, quantity, specifications, remark } = req.body;
  remark = remark === undefined ? '' : remark;
  specifications = specifications === undefined ? '' : specifications;
  specifications = typeof(specifications) === 'string' ? [specifications]: specifications;
  console.log(specifications)
  let sess = req.session;
  if (sess.cart) {
    existCart = (sess.cart.map((food) => food.id));
  }
  console.log(existCart);
  MenuSpec.findAll({ where: { option: { [Op.in] : specifications }
    // , restaurant_id:1
  }})
  .then((specs) => {
    let additional = 0;
    specs.forEach(spec => {
      additional += parseFloat(spec.addPrice)
      console.log(spec.addPrice);
    });
    console.log(additional);
    cart.push({
      id: req.params.id,
      orders: [{
      uniqueId: 1,
      image: menuImage,
      quantity: quantity,
      specifications: specifications,
      additional: additional,
      remark: remark,
      }]
    });
    if (existCart.indexOf(req.params.id) > -1) {
      //tbr
      cart[0].orders[0].uniqueId = sess.cart[existCart.indexOf(req.params.id)].orders.length + 1;
      sess.cart[existCart.indexOf(req.params.id)].orders = sess.cart[existCart.indexOf(req.params.id)].orders.concat(cart[0].orders);
    } else if (sess.cart) {
      sess.cart = sess.cart.concat(cart);
    } else {
      sess.cart = cart;
    }
    console.log(sess.cart);
    alertMessage(res, "success",'Food is added to the shopping cart', 'fas fa-sign-in-alt', true);
    res.redirect("/book/menuBook"); 
  });
  
});

//update item
router.post("/update/:id", urlencodedParser, (req, res) => {
  let cart = [];
  let existCart = [];
  let { menuImage, quantity, specifications, remark } = req.body;
  remark = remark === undefined ? '' : remark;
  specifications = specifications === undefined ? '' : specifications;
  specifications = typeof(specifications) === 'string' ? [specifications]: specifications;
  let sess = req.session;
  let foodId = req.params.id.split('-')[0];
  let uniqueId = req.params.id.split('-')[1];
  console.log(foodId, uniqueId, quantity);
  if (sess.cart) {
    existCart = (sess.cart.map((food) => food.id));
  }
  MenuSpec.findAll({ where: { option: { [Op.in] : specifications }
    // , restaurant_id:1
  }})
  .then((specs) => {
    let additional = 0;
    specs.forEach(spec => {
      additional += parseFloat(spec.addPrice)
    });
    cart.push({
      id: req.params.id,
      orders: [{
      uniqueId: 1,
      image: menuImage,
      quantity: quantity,
      specifications: specifications,
      additional: additional,
      remark: remark,
      }]
    });
    if (existCart.indexOf(foodId) > -1) {
      sess.cart[existCart.indexOf(foodId)].orders[uniqueId-1] = cart[0].orders[0];
    }
    alertMessage(res, "success",'Food is updated in the shopping cart', 'fas fa-sign-in-alt', true);
    res.redirect("/book/menuBook");
  });
  // cart.push({
  //   id: foodId,
  //   orders: [{
  //   uniqueId: 1,
  //   image: menuImage,
  //   quantity: quantity,
  //   specifications: specifications,
  //   additional: additional,
  //   remark: remark,
  //   }]
  // });
  // if (existCart.indexOf(foodId) > -1) {
  //   //tbr
  //   sess.cart[existCart.indexOf(foodId)].orders[uniqueId-1] = cart[0].orders[0];
  // }
  // alertMessage(res, "success",'Food is updated in the shopping cart', 'fas fa-sign-in-alt', true);
  // res.redirect("/book/menuBook");
});

//delete item from session
router.get('/delete/:id', (req, res) => {
  let sess = req.session;
  let existCart = sess.cart.map((food) => food.id);
  let foodId = req.params.id.split('-')[0];
  let uniqueId = req.params.id.split('-')[1];
  console.log(foodId, uniqueId);
  sess.cart[existCart.indexOf(foodId)].orders = sess.cart[existCart.indexOf(foodId)].orders.filter((c) => c.uniqueId != uniqueId);
  if (sess.cart[existCart.indexOf(foodId)].orders.length === 0) {
    sess.cart = sess.cart.filter((c) => c.id != foodId);
  }
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
