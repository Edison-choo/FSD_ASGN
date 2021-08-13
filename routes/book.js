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
const uuid = require('uuid/v4');
const axios = require('axios');
const queryString = require("querystring");
const CreditCard = require("../models/creditcard");
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = 'pk_test_51JE5hbAlVdHui4tw2KBqHHsXvSwykR4HwI9zksrVoUNyjCg4Do5DtqIiCsrJbJcEXXfQAplLk7qIRtgPeB7wc60Y00hCS9bXiM';
const stripe = require('stripe')(stripeSecretKey);

// console.log(stripeSecretKey, stripePublicKey);

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get("/menuBook/:resName", ensureAuthenticated, (req, res) => {
    if (!(req.session.booking)) {
        alertMessage(res, 'danger', 'Cannot access page without booking', 'fas fa-exclamation-circle', true);
        res.redirect('/');
    } else {
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
                            Order.findAll({ 
                                where: { res_name: req.params.resName },
                                }).then((orders) => {
                                orders.forEach((order) => {
                                    order.food = JSON.parse(order.food);
                                })
                                const labels = menus.map(f => f.name);
                                const orderList = orders.map(f => f.food.map(o => o.id));
                                const newList = [];
                                for (i=0; i<orderList.length;i++) {
                                    for (j=0; j<orderList[i].length;j++) {
                                        newList.push(orderList[i].pop())
                                    }
                                }
                                const dataList = []
                                menus.forEach((menu, i) => {
                                    if (newList.indexOf(menu.id.toString()) >= 0) {
                                        dataList.push([labels[i], newList.map(n => n == menu.id).length])
                                    } else {
                                        dataList.push([labels[i], 0]);
                                    }
                                })
                                dataList.sort((first, second) => second[1] - first[1])
                                const newList2 = [];
                                dataList.slice(0, 5).forEach((menu) => {
                                    newList2.push({name:menu[0], count:menu[1]})
                                })
                                console.log(newList2)
                                res.render("book/menuBook", {
                                    menus,
                                    menuSpecification,
                                    types,
                                    menuSpec,
                                    topMenu:newList2
                                });
                            });
                            
                        });
                        // res.render("book/menuBook", { menus, types, menuSpecification });
                    }
                })
                .catch((err) => console.log(err));
        })
    }
});

router.get("/foodCart", ensureAuthenticated, (req, res) => {
    if (!(req.session.booking)) {
        alertMessage(res, 'danger', 'Cannot access page without booking', 'fas fa-exclamation-circle', true);
        res.redirect('/');
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
                    // res.render("book/foodCart", { menus, count, stripeSecretKey, stripePublicKey });
                    CreditCard.findAll({where: {userid: req.user.id}})
                    .then(creditcard => {
                        if(creditcard){
                            res.render("book/foodCart", { count, menus, creditcard, stripeSecretKey, stripePublicKey });
                        }else{
                            res.render("book/foodCart", { count, menus, stripeSecretKey, stripePublicKey })
                        }
                    })
                    
                }
            })
            .catch((err) => console.log(err))
    } else {
        CreditCard.findAll({where: {userid: req.user.id}})
        .then(creditcard => {
            if(creditcard){
                res.render("book/foodCart", { count: 0, creditcard, stripeSecretKey, stripePublicKey });
            }else{
                res.render("book/foodCart", { count: 0, stripeSecretKey, stripePublicKey })
            }
        })
    }
}
});

router.get("/receipt/:id", ensureAuthenticated, (req, res) => {
    if (!(req.session.booking)) {
        alertMessage(res, 'danger', 'Cannot access page without booking', 'fas fa-exclamation-circle', true);
        res.redirect('/');
    } else {
    if (req.session) {
      req.session.cart = req.session.cart.filter((f) => f.userId !== req.user.id);
      req.session.total = req.session.total.filter((f) => f.userId !== req.user.id);
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
    }
});

router.get("/payment", (req, res) => {
    res.render("book/payment");
});

// payment
router.post('/charge', (req, res) => {

    // let { remark, count, token } = req.body;
    // console.log(remark, count, token);
    // let idempontencyKey = uuid();
    let remark = req.body.remark;
    let token = req.body.stripeToken;
    stripe.tokens.create({
        card: {
            number: '4242424242424242',
            exp_month: 8,
            exp_year: 2022,
            cvc: '314',
        },
    }).then(newToken => {
        console.log(req.body);
        // console.log(newToken);
        console.log((req.session.total.filter(t => t.userId == req.user.id)[0].count*100).toFixed(0));
        token = token == '' ? newToken.id : token;
        stripe.customers.create({
            email: req.body.stripeEmail,
            source: token
        })
        .then((customer) => {
            // have access to the customer object
            stripe.charges.create({
                    amount: (req.session.total.filter(t => t.userId == req.user.id)[0].count*100).toFixed(0),
                    currency: 'sgd',
                    description: 'Food Ordering',
                    customer: customer.id,
                })
                .then((result) => {
                    // console.log(result);
                    axios.post('http://localhost:5000/book/createOrder', {
                        remark:req.body.remark,
                        session:req.session,
                        user:req.user
                    },
                    {withCredentials: true}
                    )
                    .then(function(response){
                        console.log("Booking food...");
                        if (response.data.error) {
                            res.redirect('/book/foodCart');
                        } else {
                            res.redirect("/book/receipt/"+response.data.orderId);
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    });
                })
                .catch((err) => {
                    console.log(err)
                });
        });
    })
});

//create order
router.post('/createOrder', (req, res) => {
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
            total: (req.body.session.total.filter((t) => t.userId === userId).map((t) => t.count))[0],
            remarks: remark,
            bookingId: req.body.session.booking.id,
            res_name: req.body.session.booking.res_name
        }).then((order) => {
            sess.cart = sess.cart.filter((f) => f.userId !== userId);
            sess.total = sess.total.filter((f) => f.userId !== userId);
            res.send({orderId:order.id});
        }).catch((err) => console.log(err));
    } else {
        console.log("test")
        res.send({error:'Not successful payment, Please try again'});
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