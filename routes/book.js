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
const ensureAuthenticated = require('../helpers/auth');
const stripe = require('stripe')('pk_test_51JE5hbAlVdHui4tw2KBqHHsXvSwykR4HwI9zksrVoUNyjCg4Do5DtqIiCsrJbJcEXXfQAplLk7qIRtgPeB7wc60Y00hCS9bXiM');
const uuid = require('uuid/v4');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = 'pk_test_51JE5hbAlVdHui4tw2KBqHHsXvSwykR4HwI9zksrVoUNyjCg4Do5DtqIiCsrJbJcEXXfQAplLk7qIRtgPeB7wc60Y00hCS9bXiM';
console.log(stripeSecretKey, stripePublicKey);

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get("/menuBook/:resName", (req, res) => {
    var types = [];
    // req.session.cart = undefined;
    // req.session.total = undefined;
    req.session.resName = req.params.resName;
    console.log(req.session.cart);
    User.findOne({ where: { fname: req.params.resName } })
        .then((resUser) => {
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
                        MenuSpec.findAll({ where: { userId: resUser.id } }).then((specs) => {
                            let menuSpec = {};
                            specs.forEach((option) => {
                                if (option.name in menuSpec) {
                                    menuSpec[option.name] = menuSpec[option.name].concat([
                                        { option: option.option, addPrice: option.addPrice }
                                    ]);
                                } else {
                                    menuSpec[option.name] = [{ option: option.option, addPrice: option.addPrice }];
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
        })
});

router.get("/foodCart", (req, res) => {
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
                        [Op.in]: cart
                    }
                },
            })
            .then((menus) => {
                if (menus) {
                    let count = 0;
                    menus.forEach((food) => {
                        tempCart[cart.indexOf(food.id)].orders.forEach((order) => {
                                count += (parseFloat(food.price) + order.additional) * order.quantity;
                            })
                            // count += parseFloat(food.price) * sess.cart[cart.indexOf(food.id)].quantity;
                    })
                    if ('total' in req.session) {
                        let specTotal = req.session.total.filter((t) => t.userId === userId);
                        if (req.session.total.indexOf(specTotal[0]) > -1) {
                            req.session.total[req.session.total.indexOf(specTotal[0])] = { userId: userId, count: count };
                        } else {
                            req.session.total.push({ userId: userId, count: count })
                        }
                    } else {
                        req.session.total = [{ userId: userId, count: count }];
                    }
                    res.render("book/foodCart", { menus, count, stripeSecretKey, stripePublicKey });
                }
            })
            .catch((err) => console.log(err))
    } else {
        res.render("book/foodCart", { count: 0, stripeSecretKey, stripePublicKey });
    }

});

router.get("/receipt/:id", (req, res) => {
    Order.findOne({ where: { id: req.params.id } })
        .then((order) => {
            if (order) {
                order.food = JSON.parse(order.food);
                if (order.food) {
                    let cart = order.food.map((c) => parseInt(c.id));
                    Menu.findAll({
                            where: {
                                id: {
                                    [Op.in]: cart
                                }
                            },
                        })
                        .then((menus) => {
                            if (menus) {
                                res.render("book/receipt", { order, menus });
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

// payment
router.post('/checkout', (req, res) => {

    let { remark, count, token } = req.body;
    console.log(remark, count, token);
    let idempontencyKey = uuid();

    return stripe.customers
        .create({
            email: token.email,
            source: token.id
        })
        .then((customer) => {
            // have access to the customer object
            return stripe.charges
                .create({
                    customer: token.id,
                    amount: count,
                    currency: 'sgd',
                    description: 'preorder food',
                }, { idempontencyKey })
                .then((result) => {
                    console.log(result);
                    res.redirect('/book/receipt/' + 1);
                })
                .catch((err) => {
                    console.log(err)
                });
        });
});

// router.post('/create-checkout-session', async (req, res) => {
//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     line_items: [
//       {
//         price_data: {
//           currency: 'sgd',
//           unit_amount: 2000,
//         }
//       },
//     ],
//     mode: 'payment',
//     success_url: `https://127.0.0.1:5000/book/receipt/1`,
//     cancel_url: `https://127.0.0.1:5000/book/receipt/1`,
//   });
//   res.redirect(303, session.url)
// });

//create order
router.post('/createOrder', urlencodedParser, (req, res) => {
    let sess = req.session;
    let remark = req.body.remark;
    console.log(req.body);
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
            food: JSON.stringify(sess.cart.filter((food) => food.userId === userId)),
            date: new Date(),
            total: (req.session.total.filter((t) => t.userId === userId).map((t) => t.count))[0],
            remarks: remark,
            bookingId: req.session.booking.id
        }).then((order) => {
            sess.cart = sess.cart.filter((f) => f.userId !== userId);
            sess.total = sess.total.filter((f) => f.userId !== userId);
            res.redirect('/book/receipt/' + order.id);
        }).catch((err) => console.log(err));
        res.redirect('/book/receipt/' + 1);
    } else {
        console.log("test")
        res.redirect('/book/receipt/' + 1);
    }
});

// ajax get food detail
router.get('/getFood', (req, res) => {
    var types = [];
    User.findOne({ where: { fname: req.session.resName } })
        .then((resUser) => {
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
                                        { option: option.option, addPrice: option.addPrice }
                                    ]);
                                } else {
                                    menuSpec[option.name] = [{ option: option.option, addPrice: option.addPrice }];
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
        })
});

// ajax add item to session
router.post("/add/:id", urlencodedParser, (req, res) => {
    let cart = [];
    let existCart = [];
    let { menuImage, quantity, specifications, remark } = req.body;
    remark = remark === undefined ? '' : remark;
    specifications = specifications === undefined ? '' : specifications;
    specifications = typeof(specifications) === 'string' ? [specifications] : specifications;
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
    User.findOne({ where: { fname: req.session.resName } })
        .then((resUser) => {
            MenuSpec.findAll({
                    where: {
                        option: {
                            [Op.in]: specifications
                        },
                        userId: resUser.id
                    }
                })
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
                    res.json({ cart: sess.cart, success: `food is added to cart` });
                });
        })

});

// ajax get session cart data
router.get('/getCart', (req, res) => {
    let sess = req.session;
    User.findOne({ where: { fname: req.session.resName } })
        .then((resUser) => {
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
                                        { option: option.option, addPrice: option.addPrice }
                                    ]);
                                } else {
                                    menuSpec[option.name] = [{ option: option.option, addPrice: option.addPrice }];
                                }
                            });
                            console.log(menuSpec);
                            res.json({
                                menus,
                                cart: sess.cart,
                                menuSpec
                            });
                        });
                    }
                })
                .catch((err) => console.log(err));
        })
});

// ajax update session cart
router.post("/update/:id/:uniqueId", urlencodedParser, (req, res) => {
    let cart = [];
    let existCart = [];
    let { menuImage, quantity, specifications, remark } = req.body;
    remark = remark === undefined ? '' : remark;
    specifications = specifications === undefined ? '' : specifications;
    specifications = typeof(specifications) === 'string' ? [specifications] : specifications;
    let userId = req.user ? req.user.id : 0;
    let sess = req.session;
    let foodId = req.params.id;
    let uniqueId = req.params.uniqueId;
    let tempCart = sess.cart.filter((food) => food.userId === userId);
    if (tempCart) {
        existCart = (tempCart.map((food) => food.id));
    }
    User.findOne({ where: { fname: req.session.resName } })
        .then((resUser) => {
            MenuSpec.findAll({
                    where: {
                        option: {
                            [Op.in]: specifications
                        },
                        userId: resUser.id
                    }
                })
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
                        tempCart[existCart.indexOf(foodId)].orders[uniqueId - 1] = cart[0].orders[0];
                    }
                    sess.cart = tempCart.concat(sess.cart.filter((food) => food.userId !== userId));
                    res.json({ cart: session.cart, success: "Cart is updated" });
                });
        })

});

// ajax delete food from cart
router.get('/delete/:id/:uniqueId', (req, res) => {
    let sess = req.session;
    let foodId = req.params.id;
    let uniqueId = req.params.uniqueId;
    let userId = req.user ? req.user.id : 0;
    let tempCart = sess.cart.filter((food) => food.userId === userId);
    let existCart = tempCart.map((food) => food.id);
    console.log(foodId, uniqueId);
    tempCart[existCart.indexOf(foodId)].orders = tempCart[existCart.indexOf(foodId)].orders.filter((c) => c.uniqueId != uniqueId);
    if (tempCart[existCart.indexOf(foodId)].orders.length === 0) {
        tempCart = tempCart.filter((c) => c.id != foodId);
    }
    sess.cart = tempCart.concat(sess.cart.filter((food) => food.userId !== userId));
    res.json({ success: "Food is removed from cart" });
});

module.exports = router;