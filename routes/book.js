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
  // req.session.total = undefined;
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
  let userId = req.user ? req.user.id : 0;
  let tempCart = undefined;
  if (sess.cart) {
    tempCart = sess.cart.filter((food) => food.userId === userId);
  }
  // console.log(sess.cart);
  if (tempCart) {
    let cart = tempCart.map((c) => parseInt(c.id));
    Menu.findAll({
      where: {
        id: { [Op.in] : cart }
      },
    })
      .then((menus) => {
        if (menus) {
          let count = 0;
          menus.forEach((food) => {
            tempCart[cart.indexOf(food.id)].orders.forEach((order) => {
              count += (parseFloat(food.price)+order.additional) * order.quantity;
            })
            // count += parseFloat(food.price) * sess.cart[cart.indexOf(food.id)].quantity;
          })
          if ('total' in req.session) {
            let specTotal = req.session.total.filter((t) => t.userId === userId);
            if (req.session.total.indexOf(specTotal[0]) > -1) {
              req.session.total[req.session.total.indexOf(specTotal[0])] = {userId: userId, count: count};
            } else {
              req.session.total.push({userId: userId, count: count})
            }          
          } else {
            req.session.total = [{userId: userId, count: count}];
          }
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
// router.post("/add/:id", urlencodedParser, (req, res) => {
//   let cart = [];
//   let existCart = [];
//   let { menuImage, quantity, specifications, remark } = req.body;
//   remark = remark === undefined ? '' : remark;
//   specifications = specifications === undefined ? '' : specifications;
//   specifications = typeof(specifications) === 'string' ? [specifications]: specifications;
//   let userId = req.user ? req.user.id : 0;
//   let sess = req.session;
//   let tempCart = [];
//   if (sess.cart) {
//     tempCart = sess.cart.filter((food) => food.userId === userId);
//   } else {
//     sess.cart = [];
//   }
//   if (tempCart) {
//     existCart = (tempCart.map((food) => food.id));
//   }
//   console.log(existCart);
//   MenuSpec.findAll({ where: { option: { [Op.in] : specifications }
//     // , restaurant_id:1
//   }})
//   .then((specs) => {
//     let additional = 0;
//     specs.forEach(spec => {
//       additional += parseFloat(spec.addPrice)
//       console.log(spec.addPrice);
//     });
//     console.log(additional);
//     cart.push({
//       id: req.params.id,
//       userId: userId,
//       orders: [{
//       uniqueId: 1,
//       image: menuImage,
//       quantity: quantity,
//       specifications: specifications,
//       additional: additional,
//       remark: remark,
//       }]
//     });
//     if (existCart.indexOf(req.params.id) > -1) {
//       //tbr
//       cart[0].orders[0].uniqueId = tempCart[existCart.indexOf(req.params.id)].orders.length + 1;
//       tempCart[existCart.indexOf(req.params.id)].orders = tempCart[existCart.indexOf(req.params.id)].orders.concat(cart[0].orders);
//     } else if (tempCart) {
//       tempCart = tempCart.concat(cart);
//     } else {
//       tempCart = cart;
//     }
//     console.log(tempCart);
//     sess.cart = tempCart.concat(sess.cart.filter((food) => food.userId !== userId));
//     alertMessage(res, "success",'Food is added to the shopping cart', 'fas fa-sign-in-alt', true);
//     res.redirect("/book/menuBook"); 
//   });
  
// });

//update item
// router.post("/update/:id", urlencodedParser, (req, res) => {
//   let cart = [];
//   let existCart = [];
//   let { menuImage, quantity, specifications, remark } = req.body;
//   remark = remark === undefined ? '' : remark;
//   specifications = specifications === undefined ? '' : specifications;
//   specifications = typeof(specifications) === 'string' ? [specifications]: specifications;
//   let userId = req.user ? req.user.id : 0;
//   let sess = req.session;
//   let foodId = req.params.id.split('-')[0];
//   let uniqueId = req.params.id.split('-')[1];
//   let tempCart = sess.cart.filter((food) => food.userId === userId);
//   if (tempCart) {
//     existCart = (tempCart.map((food) => food.id));
//   }
//   MenuSpec.findAll({ where: { option: { [Op.in] : specifications }
//     // , restaurant_id:1
//   }})
//   .then((specs) => {
//     let additional = 0;
//     specs.forEach(spec => {
//       additional += parseFloat(spec.addPrice)
//     });
//     cart.push({
//       id: foodId,
//       userId: userId,
//       orders: [{
//       uniqueId: uniqueId,
//       image: menuImage,
//       quantity: quantity,
//       specifications: specifications,
//       additional: additional,
//       remark: remark,
//       }]
//     });
//     console.log(cart[0].orders)
//     if (existCart.indexOf(foodId) > -1) {
//       tempCart[existCart.indexOf(foodId)].orders[uniqueId-1] = cart[0].orders[0];
//     }
//     sess.cart = tempCart.concat(sess.cart.filter((food) => food.userId !== userId));
//     alertMessage(res, "success",'Food is updated in the shopping cart', 'fas fa-sign-in-alt', true);
//     res.redirect("/book/menuBook");
//   });
//   // cart.push({
//   //   id: foodId,
//   //   orders: [{
//   //   uniqueId: 1,
//   //   image: menuImage,
//   //   quantity: quantity,
//   //   specifications: specifications,
//   //   additional: additional,
//   //   remark: remark,
//   //   }]
//   // });
//   // if (existCart.indexOf(foodId) > -1) {
//   //   //tbr
//   //   sess.cart[existCart.indexOf(foodId)].orders[uniqueId-1] = cart[0].orders[0];
//   // }
//   // alertMessage(res, "success",'Food is updated in the shopping cart', 'fas fa-sign-in-alt', true);
//   // res.redirect("/book/menuBook");
// });

//delete item from session
// router.get('/delete/:id', (req, res) => {
//   let sess = req.session;
//   let foodId = req.params.id.split('-')[0];
//   let uniqueId = req.params.id.split('-')[1];
//   let userId = req.user ? req.user.id : 0;
//   let tempCart = sess.cart.filter((food) => food.userId === userId);
//   let existCart = tempCart.map((food) => food.id);
//   console.log(foodId, uniqueId);
//   tempCart[existCart.indexOf(foodId)].orders = tempCart[existCart.indexOf(foodId)].orders.filter((c) => c.uniqueId != uniqueId);
//   if (tempCart[existCart.indexOf(foodId)].orders.length === 0) {
//     tempCart = tempCart.filter((c) => c.id != foodId);
//   }
//   sess.cart = tempCart.concat(sess.cart.filter((food) => food.userId !== userId));
//   alertMessage(res, "success",'Food is removed to the shopping cart', 'fas fa-trash-alt', true);
//   res.redirect('../../book/foodCart');
// });

//create order
router.post('/createOrder', urlencodedParser, (req, res) => {
  let sess = req.session;
  let {remark} = req.body;
  let userId = req.user ? req.user.id : 0;
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
      userId: userId,
      food:JSON.stringify(sess.cart.filter((food) => food.userId === userId)),
      date: new Date(),
      total:(req.session.total.filter((t) => t.userId === userId).map((t) => t.count))[0],
      remarks: remark
    }).then((order) => {
      sess.cart = sess.cart.filter((f) => f.userId !== userId);
      sess.total = sess.total.filter((f) => f.userId !== userId);
      res.redirect('/book/receipt/'+order.id);
    }).catch((err) => console.log(err));
  } else {
    console.log("test")
    res.redirect('/book/foodCart');
  }
});

// ajax get food detail
router.get('/getfood', (req, res) => {
  var types = [];
  Menu.findAll({
    attributes: { exclude: ["restaurantId"] },
  })
    .then((menus) => {
      if (menus) {
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
              menuSpec[option.name] = [{option:option.option, addPrice:option.addPrice}];
            }
          });
          console.log(menuSpec);
          res.json({
            menus,
            types,
            menuSpec
          });
        });
      }
    })
    .catch((err) => console.log(err));
});

// ajax add item to session
router.post("/add/:id", urlencodedParser, (req, res) => {
  let cart = [];
  let existCart = [];
  let { menuImage, quantity, specifications, remark } = req.body;
  remark = remark === undefined ? '' : remark;
  specifications = specifications === undefined ? '' : specifications;
  specifications = typeof(specifications) === 'string' ? [specifications]: specifications;
  let userId = req.user ? req.user.id : 0;
  let sess = req.session;
  let tempCart = [];
  if (sess.cart) {
    tempCart = sess.cart.filter((food) => food.userId === userId);
  } else {
    sess.cart = [];
  }
  if (tempCart) {
    existCart = (tempCart.map((food) => food.id));
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
      userId: userId,
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
      cart[0].orders[0].uniqueId = tempCart[existCart.indexOf(req.params.id)].orders.length + 1;
      tempCart[existCart.indexOf(req.params.id)].orders = tempCart[existCart.indexOf(req.params.id)].orders.concat(cart[0].orders);
    } else if (tempCart) {
      tempCart = tempCart.concat(cart);
    } else {
      tempCart = cart;
    }
    console.log(tempCart);
    sess.cart = tempCart.concat(sess.cart.filter((food) => food.userId !== userId));
    res.json({cart:sess.cart, success:`food is added to cart`});
  });
});

// ajax get session cart data
router.get('/getCart', (req, res) => {
  let sess = req.session;
  Menu.findAll({
    attributes: { exclude: ["restaurantId"] },
  })
    .then((menus) => {
      if (menus) {
        MenuSpec.findAll().then((specs) => {
          let menuSpec = {};
          specs.forEach((option) => {
            if (option.name in menuSpec) {
              menuSpec[option.name] = menuSpec[option.name].concat([
                {option:option.option, addPrice:option.addPrice}
              ]);
            } else {
              menuSpec[option.name] = [{option:option.option, addPrice:option.addPrice}];
            }
          });
          console.log(menuSpec);
          res.json({
            menus,
            cart:sess.cart,
            menuSpec
          });
        });
      }
    })
    .catch((err) => console.log(err));
});

// ajax update session cart
router.post("/update/:id", urlencodedParser, (req, res) => {
  let cart = [];
  let existCart = [];
  let { menuImage, quantity, specifications, remark } = req.body;
  remark = remark === undefined ? '' : remark;
  specifications = specifications === undefined ? '' : specifications;
  specifications = typeof(specifications) === 'string' ? [specifications]: specifications;
  let userId = req.user ? req.user.id : 0;
  let sess = req.session;
  let foodId = req.params.id.split('-')[0];
  let uniqueId = req.params.id.split('-')[1];
  let tempCart = sess.cart.filter((food) => food.userId === userId);
  if (tempCart) {
    existCart = (tempCart.map((food) => food.id));
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
      id: foodId,
      userId: userId,
      orders: [{
      uniqueId: uniqueId,
      image: menuImage,
      quantity: quantity,
      specifications: specifications,
      additional: additional,
      remark: remark,
      }]
    });
    console.log(cart[0].orders)
    if (existCart.indexOf(foodId) > -1) {
      tempCart[existCart.indexOf(foodId)].orders[uniqueId-1] = cart[0].orders[0];
    }
    sess.cart = tempCart.concat(sess.cart.filter((food) => food.userId !== userId));
    res.json({cart:session.cart, success: "Cart is updated"});
  });
});

// ajax delete food from cart
router.get('/delete/:id', (req, res) => {
  let sess = req.session;
  let foodId = req.params.id.split('-')[0];
  let uniqueId = req.params.id.split('-')[1];
  let userId = req.user ? req.user.id : 0;
  let tempCart = sess.cart.filter((food) => food.userId === userId);
  let existCart = tempCart.map((food) => food.id);
  console.log(foodId, uniqueId);
  tempCart[existCart.indexOf(foodId)].orders = tempCart[existCart.indexOf(foodId)].orders.filter((c) => c.uniqueId != uniqueId);
  if (tempCart[existCart.indexOf(foodId)].orders.length === 0) {
    tempCart = tempCart.filter((c) => c.id != foodId);
  }
  sess.cart = tempCart.concat(sess.cart.filter((food) => food.userId !== userId));
  res.json({success: "Food is removed from cart"});
});

module.exports = router;
