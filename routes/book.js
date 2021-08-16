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
const User = require("../models/user");
const ensureAuthenticated = require("../helpers/auth");
const axios = require("axios");
const queryString = require("querystring");
const CreditCard = require("../models/creditcard");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const sgMail = require("@sendgrid/mail");
const API_Key =
  "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";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey =
  "pk_test_51JE5hbAlVdHui4tw2KBqHHsXvSwykR4HwI9zksrVoUNyjCg4Do5DtqIiCsrJbJcEXXfQAplLk7qIRtgPeB7wc60Y00hCS9bXiM";
const stripe = require("stripe")(stripeSecretKey);

// console.log(stripeSecretKey, stripePublicKey);

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get("/menuBook/:resName", ensureAuthenticated, (req, res) => {
  if (!req.session.booking) {
    alertMessage(
      res,
      "danger",
      "Cannot access page without booking",
      "fas fa-exclamation-circle",
      true
    );
    res.redirect("/");
  } else {
    var types = [];
    // req.session.cart = undefined;
    // req.session.total = undefined;
    req.session.resName = req.params.resName;
    console.log(req.session.cart);
    User.findOne({ where: { fname: req.params.resName } }).then((resUser) => {
      Menu.findAll({
        where: { userId: resUser.id },
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
            MenuSpec.findAll({ where: { userId: resUser.id } }).then(
              (specs) => {
                let menuSpec = {};
                specs.forEach((option) => {
                  if (option.name in menuSpec) {
                    menuSpec[option.name] = menuSpec[option.name].concat([
                      { option: option.option, addPrice: option.addPrice },
                    ]);
                  } else {
                    menuSpec[option.name] = [
                      { option: option.option, addPrice: option.addPrice },
                    ];
                  }
                });
                console.log(menuSpec);
                Order.findAll({
                  where: { res_name: req.params.resName },
                }).then((orders) => {
                  orders.forEach((order) => {
                    order.food = JSON.parse(order.food);
                  });
                  const labels = menus.map((f) => f.name);
                  const orderList = [];
                  for (i = 0; i < orders.length; i++) {
                    for (j = 0; j < orders[i].food.length; j++) {
                      for (k = 0; k < orders[i].food[j].orders.length; k++) {
                        for (
                          l = 0;
                          l < parseInt(orders[i].food[j].orders[k].quantity);
                          l++
                        ) {
                          orderList.push(orders[i].food[j].id);
                        }
                      }
                    }
                  }
                  const dataList = [];
                  menus.forEach((menu, i) => {
                    if (orderList.indexOf(menu.id.toString()) >= 0) {
                      dataList.push([
                        labels[i],
                        orderList.filter((n) => n == menu.id).length,
                      ]);
                    } else {
                      dataList.push([labels[i], 0]);
                    }
                  });
                  dataList.sort((first, second) => second[1] - first[1]);
                  const newList2 = [];
                  dataList.slice(0, 4).forEach((menu) => {
                    newList2.push({ name: menu[0], count: menu[1] });
                  });
                  console.log(newList2);
                  res.render("book/menuBook", {
                    menus,
                    menuSpecification,
                    types,
                    menuSpec,
                    topMenu: newList2,
                  });
                });
              }
            );
            // res.render("book/menuBook", { menus, types, menuSpecification });
          }
        })
        .catch((err) => console.log(err));
    });
  }
});

router.get("/foodCart", ensureAuthenticated, (req, res) => {
  if (!req.session.booking) {
    alertMessage(
      res,
      "danger",
      "Cannot access page without booking",
      "fas fa-exclamation-circle",
      true
    );
    res.redirect("/");
  } else {
    console.log(stripeSecretKey, stripePublicKey);
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
          id: {
            [Op.in]: cart,
          },
        },
      })
        .then((menus) => {
          if (menus) {
            let count = 0;
            menus.forEach((food) => {
              tempCart[cart.indexOf(food.id)].orders.forEach((order) => {
                count +=
                  (parseFloat(food.price) + order.additional) * order.quantity;
              });
              // count += parseFloat(food.price) * sess.cart[cart.indexOf(food.id)].quantity;
            });
            if ("total" in req.session) {
              let specTotal = req.session.total.filter(
                (t) => t.userId === userId
              );
              if (req.session.total.indexOf(specTotal[0]) > -1) {
                req.session.total[req.session.total.indexOf(specTotal[0])] = {
                  userId: userId,
                  count: count,
                };
              } else {
                req.session.total.push({ userId: userId, count: count });
              }
            } else {
              req.session.total = [{ userId: userId, count: count }];
            }
            // res.render("book/foodCart", { menus, count, stripeSecretKey, stripePublicKey });
            CreditCard.findAll({ where: { userid: req.user.id } }).then(
              (creditcard) => {
                if (creditcard) {
                  res.render("book/foodCart", {
                    count,
                    menus,
                    creditcard,
                    stripeSecretKey,
                    stripePublicKey,
                  });
                } else {
                  res.render("book/foodCart", {
                    count,
                    menus,
                    stripeSecretKey,
                    stripePublicKey,
                  });
                }
              }
            );
          }
        })
        .catch((err) => console.log(err));
    } else {
      CreditCard.findAll({ where: { userid: req.user.id } }).then(
        (creditcard) => {
          if (creditcard) {
            res.render("book/foodCart", {
              count: 0,
              creditcard,
              stripeSecretKey,
              stripePublicKey,
            });
          } else {
            res.render("book/foodCart", {
              count: 0,
              stripeSecretKey,
              stripePublicKey,
            });
          }
        }
      );
    }
  }
});

router.get("/receipt/:id", ensureAuthenticated, (req, res) => {
  if (!req.session.booking) {
    alertMessage(
      res,
      "danger",
      "Cannot access page without booking",
      "fas fa-exclamation-circle",
      true
    );
    res.redirect("/");
  } else {
    if (req.session) {
      req.session.cart = req.session.cart.filter(
        (f) => f.userId !== req.user.id
      );
      req.session.total = req.session.total.filter(
        (f) => f.userId !== req.user.id
      );
    }
    Order.findOne({ where: { id: req.params.id } })
      .then((order) => {
        if (order) {
          order.food = JSON.parse(order.food);
          if (order.food) {
            let cart = order.food.map((c) => parseInt(c.id));
            Menu.findAll({
              where: {
                id: {
                  [Op.in]: cart,
                },
              },
            })
              .then((menus) => {
                if (menus) {
                  res.render("book/receipt", { order, menus });
                }
              })
              .catch((err) => console.log(err));
          }
        }
      })
      .catch((err) => console.log(err));
  }
});

router.get("/payment", (req, res) => {
  res.render("book/payment");
});

// payment
router.post("/charge", (req, res) => {
  // let { remark, count, token } = req.body;
  // console.log(remark, count, token);
  // let idempontencyKey = uuid();
  let remark = req.body.remark;
  let token = req.body.stripeToken;
  stripe.tokens
    .create({
      card: {
        number: "4242424242424242",
        exp_month: 8,
        exp_year: 2022,
        cvc: "314",
      },
    })
    .then((newToken) => {
      console.log(req.body);
      // console.log(newToken);
      console.log(
        (
          req.session.total.filter((t) => t.userId == req.user.id)[0].count *
          100
        ).toFixed(0)
      );
      token = token == "" ? newToken.id : token;
      stripe.customers
        .create({
          email: req.body.stripeEmail,
          source: token,
        })
        .then((customer) => {
          // have access to the customer object
          stripe.charges
            .create({
              amount: (
                req.session.total.filter((t) => t.userId == req.user.id)[0]
                  .count * 100
              ).toFixed(0),
              currency: "sgd",
              description: "Food Ordering",
              customer: customer.id,
            })
            .then((result) => {
              // console.log(result);
              axios
                .post(
                  "http://localhost:5000/book/createOrder",
                  {
                    remark: req.body.remark,
                    session: req.session,
                    user: req.user,
                  },
                  { withCredentials: true }
                )
                .then(function (response) {
                  console.log("Booking food...");
                  if (response.data.error) {
                    res.redirect("/book/foodCart");
                  } else {
                    res.redirect("/book/receipt/" + response.data.orderId);
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        });
    });
});

//create order
router.post("/createOrder", (req, res) => {
  let sess = req.body.session;
  let remark = req.body.remark;
  // console.log(req.body);
  let userId = req.body.user ? req.body.user.id : 0;
  if (sess.cart) {
    let total = 0;
    Order.create({
      userId: userId,
      food: JSON.stringify(sess.cart.filter((food) => food.userId === userId)),
      date: new Date(),
      total: req.body.session.total
        .filter((t) => t.userId === userId)
        .map((t) => t.count)[0],
      remarks: remark,
      bookingId: req.body.session.booking.id,
      res_name: req.body.session.booking.res_name,
    })
      .then((order) => {
        sess.cart = sess.cart.filter((f) => f.userId !== userId);
        sess.total = sess.total.filter((f) => f.userId !== userId);
        order.food = JSON.parse(order.food);
        let cart = order.food.map((c) => parseInt(c.id));
        var msg = `
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous">
  <div class="col-md-2"></div>
  <div class="col-md-8" style='width:60%; margin:0px auto; border:1px solid grey;'>
      <div class="receipt" style="margin: 20px 0 30px;box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;padding: 10px 20px;padding: 30px 30px 50px;">
          <img src="https://images.freeimages.com/images/large-previews/99f/green-tick-in-circle-1147519.jpg" alt="" style="height: 150px;
          width: 150px;
          margin: 10px auto 40px;
          display: block;">
          <div>
              <div class="receiptTitle" style="text-align: center;font-size: 1.4em;font-weight: bold;margin-bottom: 40px;">Payment is successful</div>
              <div style="text-align: center;">
                  Thanks for your purchase. We will start preparing your food 15 minutes in advance of your booked timeslot. See you there
              </div>
          </div>
          <div>
              <div class="receiptSubTitle" style="text-align: center;padding-bottom: 3px;border-bottom: #35322d solid 2px;font-weight: 600;margin: 30px auto 20px;">Booking details</div>
              <table class="bookTable bookTable1" style="border-collapse: collapse !important;width: 95%; margin: 10px auto;">
                  <tr>
                      <td style='font-weight: bold;'>Restaurant:</td>
                      <td style='text-align: right;'>${req.body.session.booking.res_name}</td>
                  </tr>
                  <tr>
                      <td style='font-weight: bold;'>Booking Date:</td>
                      <td style='text-align: right;'>${req.body.session.booking.date}</td>
                  </tr>
                  <tr>
                      <td style='font-weight: bold;'>Booking Time:</td>
                      <td style='text-align: right;'>${req.body.session.booking.timing}</td>
                  </tr>
                  <tr>
                      <td style='font-weight: bold;'>Pax:</td>
                      <td style='text-align: right;'>${req.body.session.booking.pax}</td>
                  </tr>
              </table>
              </div>
              <div>
                  <div class="receiptSubTitle" style="text-align: center;padding-bottom: 3px;border-bottom: #35322d solid 2px;font-weight: 600; margin: 30px auto 20px;">Order details</div>
                  <table class="bookTable bookTable2" style="border-collapse: collapse !important;width: 95%; margin: 10px auto;">
              <thead>
                  <tr style="height: 40px;border-bottom: rgba(54, 54, 54, 0.479) solid 2px;
                  vertical-align: center; text-align:left;">
                  <th style="height: 40px;border-bottom: rgba(54, 54, 54, 0.479) solid 2px;
                  vertical-align: center; text-align:left;" scope="col">#</th>
                  <th style="height: 40px;border-bottom: rgba(54, 54, 54, 0.479) solid 2px;
                  vertical-align: center; text-align:left;" scope="col">Food</th>
                  <th style="height: 40px;border-bottom: rgba(54, 54, 54, 0.479) solid 2px;
                  vertical-align: center; text-align:left;" scope="col">Quantity</th>
                  <th style="height: 40px;border-bottom: rgba(54, 54, 54, 0.479) solid 2px;
                  vertical-align: center; text-align:left;" scope="col">Price</th>
                  </tr>
              </thead>
                <tbody>`;
        Menu.findAll({
          where: {
            id: {
              [Op.in]: cart,
            },
          },
        })
          .then((menus) => {
            if (menus) {
              for (let i = 0; i < order.food.length; i++) {
                for (let j = 0; j < order.food[i].orders.length; j++) {
                  for (let k = 0; k < menus.length; k++) {
                    if (menus[k].id == order.food[i].id) {
                      msg += `<tr style="padding-bottom: 10px">
                            <td style="height: 40px;font-weight: 300;
                            font-size: 0.9em;
                            vertical-align:text-top;
                            padding-bottom: 10px;">${1}</td>
                            <td style="height: 40px;font-weight: 300;
                            font-size: 0.9em;
                            vertical-align:text-top;
                            padding-bottom: 10px;">${menus[k].name}`;
                      if (order.food[i].orders[j].specifications != "") {
                        msg += `
                              <br><span style="font-size: 0.8em;">Spec: ${order.food[i].orders[j].specifications}</span>
                              `;
                      }
                      if (order.food[i].orders[j].remark) {
                        msg += `<br><span style="font-size: 0.8em;">Remark: ${order.food[i].orders[j].remark}</span></td>`;
                      }
                      msg += `
                            <td style="height: 40px;font-weight: 300;
                            font-size: 0.9em;
                            vertical-align:text-top;
                            padding-bottom: 10px;">${
                              order.food[i].orders[j].quantity
                            }</td>
                            <td style="height: 40px;font-weight: 300;
                            font-size: 0.9em;
                            vertical-align:text-top;
                            padding-bottom: 10px;">${
                              (menus[k].price +
                                order.food[i].orders[j].additional) *
                              order.food[i].orders[j].quantity
                            }</td>
                            </tr>`;
                    }
                  }
                }
              }
              msg += `</tbody>
        </table>
        <div style="margin-left:10px; font-size:0.95em;">Total: ${order.total}</div>
        <div style="margin-left:10px; font-size:0.95em;">Remarks: ${order.remarks}</div>
    </div>
</div>
</div>
<div class="col-md-2">
</div>
</div>`;
              const message = {
                to: req.body.session.booking.email,
                from: "donotreply.foodecent@gmail.com",
                subject: "Booking receipt",
                text: "Booking receipt",
                html: msg,
              };
              sgMail
                .send(message)
                .then((response) => {
                  console.log("Email sent...");
                  res.send({ orderId: order.id });
                })
                .catch((error) => console.log(error.message));
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  } else {
    console.log("test");
    res.send({ error: "Not successful payment, Please try again" });
  }
});

// ajax get food detail
router.get("/getFood", (req, res) => {
  var types = [];
  User.findOne({ where: { fname: req.session.resName } }).then((resUser) => {
    Menu.findAll({
      where: { userId: resUser.id },
    })
      .then((menus) => {
        if (menus) {
          menus.forEach((menu) => {
            if (types.includes(menu.type) === false) {
              types.push(menu.type);
            }
          });
          types.sort();
          MenuSpec.findAll({ where: { userId: resUser.id } }).then((specs) => {
            let menuSpec = {};
            specs.forEach((option) => {
              if (option.name in menuSpec) {
                menuSpec[option.name] = menuSpec[option.name].concat([
                  { option: option.option, addPrice: option.addPrice },
                ]);
              } else {
                menuSpec[option.name] = [
                  { option: option.option, addPrice: option.addPrice },
                ];
              }
            });
            console.log(menuSpec);
            res.json({
              menus,
              types,
              menuSpec,
            });
          });
        }
      })
      .catch((err) => console.log(err));
  });
});

// ajax add item to session
router.post("/add/:id", urlencodedParser, (req, res) => {
  let cart = [];
  let existCart = [];
  let { menuImage, quantity, specifications, remark } = req.body;
  remark = remark === undefined ? "" : remark;
  specifications = specifications === undefined ? "" : specifications;
  specifications =
    typeof specifications === "string" ? [specifications] : specifications;
  let userId = req.user ? req.user.id : 0;
  let sess = req.session;
  let tempCart = [];
  if (sess.cart) {
    tempCart = sess.cart.filter((food) => food.userId === userId);
  } else {
    sess.cart = [];
  }
  if (tempCart) {
    existCart = tempCart.map((food) => food.id);
  }
  console.log(existCart);
  User.findOne({ where: { fname: req.session.resName } }).then((resUser) => {
    MenuSpec.findAll({
      where: {
        option: {
          [Op.in]: specifications,
        },
        userId: resUser.id,
      },
    }).then((specs) => {
      let additional = 0;
      specs.forEach((spec) => {
        additional += parseFloat(spec.addPrice);
        console.log(spec.addPrice);
      });
      console.log(additional);
      cart.push({
        id: req.params.id,
        userId: userId,
        orders: [
          {
            uniqueId: 1,
            image: menuImage,
            quantity: quantity,
            specifications: specifications,
            additional: additional,
            remark: remark,
          },
        ],
      });
      if (existCart.indexOf(req.params.id) > -1) {
        //tbr
        cart[0].orders[0].uniqueId =
          tempCart[existCart.indexOf(req.params.id)].orders.length + 1;
        tempCart[existCart.indexOf(req.params.id)].orders = tempCart[
          existCart.indexOf(req.params.id)
        ].orders.concat(cart[0].orders);
      } else if (tempCart) {
        tempCart = tempCart.concat(cart);
      } else {
        tempCart = cart;
      }
      console.log(tempCart);
      sess.cart = tempCart.concat(
        sess.cart.filter((food) => food.userId !== userId)
      );
      res.json({ cart: sess.cart, success: `food is added to cart` });
    });
  });
});

// ajax get session cart data
router.get("/getCart", (req, res) => {
  let sess = req.session;
  User.findOne({ where: { fname: req.session.resName } }).then((resUser) => {
    Menu.findAll({
      where: { userId: resUser.id },
    })
      .then((menus) => {
        if (menus) {
          MenuSpec.findAll({ where: { userId: resUser.id } }).then((specs) => {
            let menuSpec = {};
            specs.forEach((option) => {
              if (option.name in menuSpec) {
                menuSpec[option.name] = menuSpec[option.name].concat([
                  { option: option.option, addPrice: option.addPrice },
                ]);
              } else {
                menuSpec[option.name] = [
                  { option: option.option, addPrice: option.addPrice },
                ];
              }
            });
            console.log(menuSpec);
            res.json({
              menus,
              cart: sess.cart,
              menuSpec,
            });
          });
        }
      })
      .catch((err) => console.log(err));
  });
});

// ajax update session cart
router.post("/update/:id/:uniqueId", urlencodedParser, (req, res) => {
  let cart = [];
  let existCart = [];
  let { menuImage, quantity, specifications, remark } = req.body;
  remark = remark === undefined ? "" : remark;
  specifications = specifications === undefined ? "" : specifications;
  specifications =
    typeof specifications === "string" ? [specifications] : specifications;
  let userId = req.user ? req.user.id : 0;
  let sess = req.session;
  let foodId = req.params.id;
  let uniqueId = req.params.uniqueId;
  let tempCart = sess.cart.filter((food) => food.userId === userId);
  if (tempCart) {
    existCart = tempCart.map((food) => food.id);
  }
  User.findOne({ where: { fname: req.session.resName } }).then((resUser) => {
    MenuSpec.findAll({
      where: {
        option: {
          [Op.in]: specifications,
        },
        userId: resUser.id,
      },
    }).then((specs) => {
      let additional = 0;
      specs.forEach((spec) => {
        additional += parseFloat(spec.addPrice);
      });
      cart.push({
        id: foodId,
        userId: userId,
        orders: [
          {
            uniqueId: uniqueId,
            image: menuImage,
            quantity: quantity,
            specifications: specifications,
            additional: additional,
            remark: remark,
          },
        ],
      });
      console.log(cart[0].orders);
      if (existCart.indexOf(foodId) > -1) {
        tempCart[existCart.indexOf(foodId)].orders[uniqueId - 1] =
          cart[0].orders[0];
      }
      sess.cart = tempCart.concat(
        sess.cart.filter((food) => food.userId !== userId)
      );
      res.json({ cart: session.cart, success: "Cart is updated" });
    });
  });
});

// ajax delete food from cart
router.get("/delete/:id/:uniqueId", (req, res) => {
  let sess = req.session;
  let foodId = req.params.id;
  let uniqueId = req.params.uniqueId;
  let userId = req.user ? req.user.id : 0;
  let tempCart = sess.cart.filter((food) => food.userId === userId);
  let existCart = tempCart.map((food) => food.id);
  console.log(foodId, uniqueId);
  tempCart[existCart.indexOf(foodId)].orders = tempCart[
    existCart.indexOf(foodId)
  ].orders.filter((c) => c.uniqueId != uniqueId);
  if (tempCart[existCart.indexOf(foodId)].orders.length === 0) {
    tempCart = tempCart.filter((c) => c.id != foodId);
  }
  sess.cart = tempCart.concat(
    sess.cart.filter((food) => food.userId !== userId)
  );
  alertMessage(res, 'success', 'Successfully removed food from cart', 'fas fa-ban', true);
  res.redirect('/book/foodCart')
//   res.json({ success: "Food is removed from cart" });
});

module.exports = router;
