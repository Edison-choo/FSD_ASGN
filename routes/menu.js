const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const alertMessage = require("../helpers/messenger");
const Menu = require("../models/menu");
const MenuSpec = require("../models/menuSpec");
const menuSpecification = require("../models/menuSpecification");
const User = require("../models/user");
const { Op, STRING } = require("sequelize");
const e = require("connect-flash");
const ensureAuthenticated = require('../helpers/auth');
const Restaurant = require("../models/restaurants");
const Order = require("../models/order");
const axios = require('axios');


// Required for file upload
const fs = require("fs");
const upload = require("../helpers/imageUpload");
const { data } = require("jquery");
const { EINPROGRESS } = require("constants");
const sgMail = require('@sendgrid/mail');
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


var urlencodedParser = bodyParser.urlencoded({ extended: false });

//page of user view menu
router.get("/", ensureAuthenticated, (req, res) => {
  var types = [];
  Menu.findAll({
    where: { userId: req.user.id},
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
        MenuSpec.findAll({
          where: { userId: req.user.id},
        }).then((specs) => {
          let menuSpec = {};
          specs.forEach((option) => {
            if (option.name in menuSpec) {
              menuSpec[option.name] = menuSpec[option.name].concat([
                { option: option.option, addPrice: option.addPrice },
              ]);
            } else {
              console.log("test1");
              menuSpec[option.name] = [
                { option: option.option, addPrice: option.addPrice },
              ];
            }
          });
          console.log(menuSpec);
          res.render("menu/menu", {
            menus,
            menuSpecification,
            types,
            menuSpec,
          });
        });
      }
    })
    .catch((err) => console.log(err));
});

// view menu in user side
router.get("/view/:resName", (req, res) => {
  var types = [];
  User.findOne({ where: { fname: req.params.resName } })
    .then(resUser => {
      Menu.findAll({
        where: { userId: resUser.id},
      })
        .then((menus) => {
          if (menus) {
            menus.forEach((menu) => {
              if (types.includes(menu.type) === false) {
                types.push(menu.type);
              }
            });
            types.sort();
            MenuSpec.findAll({
              where: { userId: resUser.id},
            }).then((specs) => {
              let menuSpec = {};
              specs.forEach((option) => {
                if (option.name in menuSpec) {
                  menuSpec[option.name] = menuSpec[option.name].concat([
                    { option: option.option, addPrice: option.addPrice },
                  ]);
                } else {
                  console.log("test1");
                  menuSpec[option.name] = [
                    { option: option.option, addPrice: option.addPrice },
                  ];
                }
              });
              console.log(menuSpec);
              res.render("menu/viewMenu", {
                menus,
                menuSpecification,
                types,
                menuSpec,
              });
            });
          }
        })
        .catch((err) => console.log(err));
    });
});

//page of menu table
router.get("/updateMenu", ensureAuthenticated, (req, res) => {
  let types = [];
  Menu.findAll({
    where: { userId: req.user.id},
  }).then((menus) => {
    if (menus) {
      // menus.forEach((menu) => {
      // 	menu.specifications = JSON.parse(menu.specifications);
      // });
      menus.forEach((menu) => {
        if (types.includes(menu.type) === false) {
          types.push(menu.type);
        }
      });
      MenuSpec.findAll({
        where: { userId: req.user.id},
      }).then((specs) => {
        let menuSpec = {};
        specs.forEach((option) => {
          if (option.name in menuSpec) {
            menuSpec[option.name] = menuSpec[option.name].concat([
              option.option,
            ]);
          } else {
            console.log("test1");
            menuSpec[option.name] = [option.option];
          }
        });
        console.log(menuSpec);
        res.render("menu/updateMenu", {
          menus,
          menuSpecification,
          types,
          menuSpec,
        });
      });
    }
  });
});

router.get('/statistics', ensureAuthenticated, (req, res) => {
  var types = [];
  Menu.findAll({
    where: { userId: req.user.id},
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
        MenuSpec.findAll({
          where: { userId: req.user.id},
        }).then((specs) => {
          let menuSpec = {};
          specs.forEach((option) => {
            if (option.name in menuSpec) {
              menuSpec[option.name] = menuSpec[option.name].concat([
                { option: option.option, addPrice: option.addPrice },
              ]);
            } else {
              console.log("test1");
              menuSpec[option.name] = [
                { option: option.option, addPrice: option.addPrice },
              ];
            }
          });
          console.log(menuSpec);
          res.render('menu/menuStat', {
            menus,
            menuSpecification,
            types,
            menuSpec,
          });
        });
      }
    })
    .catch((err) => console.log(err));
  
})

//fix
//i change req.user.id to 1
//upload image
router.post("/upload", urlencodedParser, ensureAuthenticated, (req, res) => {
  // Creates user id directory for upload if not exist
  if (!fs.existsSync("./public/uploads/menu/" + req.user.id)) {
    fs.mkdirSync("./public/uploads/menu/" + req.user.id);
  }
  upload.menuUpload(req, res, (err) => {
    if (err) {
      res.json({ file: "/img/no-image.jpg", err: err });
    } else {
      if (req.file === undefined) {
        res.json({ file: "/img/no-image.jpg", err: err });
      } else {
        res.json({ file: `/uploads/menu/${req.user.id}/${req.file.filename}` });
      }
    }
  });
});

//upload image (edit)
router.post("/uploadEdit", urlencodedParser, ensureAuthenticated, (req, res) => {
  // Creates user id directory for upload if not exist
  if (!fs.existsSync("./public/uploads/menu/" + req.user.id)) {
    fs.mkdirSync("./public/uploads/menu/" + req.user.id);
  }
  upload.menuUploadEdit(req, res, (err) => {
    console.log(err, req.file);
    if (err) {
      res.json({ file: "/img/no-image.jpg", err: err });
    } else {
      if (req.file === undefined) {
        res.json({ file: "/img/no-image.jpg", err: err });
      } else {
        res.json({ file: `/uploads/menu/${req.user.id}/${req.file.filename}` });
      }
    }
  });
});

// ajax get data
router.get("/getMenu", ensureAuthenticated, (req, res) => {
  let types = [];
  Menu.findAll({
    where: {userId: req.user.id}
  }).then((menus) => {
    if (menus) {
      menus.forEach((menu) => {
        if (types.includes(menu.type) === false) {
          types.push(menu.type);
        }
      });
      MenuSpec.findAll({
        where: { userId: req.user.id},
      }).then((specs) => {
        let menuSpec = {};
        specs.forEach((option) => {
          if (option.name in menuSpec) {
            menuSpec[option.name] = menuSpec[option.name].concat([
              option.option,
            ]);
          } else {
            menuSpec[option.name] = [option.option];
          }
        });
        res.json({1: menus, 2:menuSpec});
      });
    }
  });
});

// ajax add food to menu
router.post("/addMenu", urlencodedParser, ensureAuthenticated, (req, res) => {
  let errors = [];
  let types = [];
  let { menuImage, foodName, foodType, foodPrice, specifications } = req.body;
  menuImage = menuImage === undefined ? '' : menuImage;
  specifications = specifications === undefined ? "" : specifications.toString();
  console.log(menuImage);
  if (foodPrice < 0) {
    errors.push({ text: "Please do not enter negative value for price!" });
  }
  Menu.findAll({
    where: {userId: req.user.id}
  })
    .then((menus) => {
      if (menus) {
        menus.forEach((menu) => {
          if (types.includes(menu.type) === false) {
            types.push(menu.type);
          }
        });
        let menuOrder = menus
          .filter((f) => f.type == foodType)
          .sort((f1, f2) => (f1.foodNo > f2.foodNo ? 1 : -1));
        let menuLength = 0;
        if (menuOrder[0] === undefined) {
          menuLength = 1;
        } else {
          menuLength =
            parseInt(menuOrder[menuOrder.length - 1].foodNo.slice(-2)) + 1;
        }
        if (errors.length > 0) {
          res.json({
            errors,
          });
        } else {
          Menu.findOne({ where: { 
            [Op.and]: [
              { name: foodName },
              { userId: req.user.id }
            ]} })
            .then((menu) => {
              if (menu) {
                res.json({
                  error: 'Food name is already registered!'
                });
              } else {
                let id = 1;
                let foodId =
                  foodType.slice(0, 1).toUpperCase() +
                  foodType.slice(-1).toUpperCase() +
                  ("00" + menuLength).slice(-2);
                Menu.create({
                  foodNo: foodId,
                  name: foodName,
                  price: foodPrice,
                  type: foodType,
                  specifications: specifications,
                  image: menuImage,
                  userId: req.user.id,
                })
                  .then((menu) => {
                    res.json({menu, types, success:`${menu.name} successfully added to menu!`});
                  })
                  .catch((err) => console.log(err));
              }
            })
            .catch((err) => console.log(err));
        }
      }
    })
    .catch((err) => console.log(err));
});

// ajax delete food from menu
router.get("/delete/:id", ensureAuthenticated, (req, res) => {
  let id = req.params.id;
  Menu.findOne({ where: { id: id } })
    .then((menu) => {
      Menu.destroy({ where: { id: id } })
      .then((n) => {
        if (n > 0) {
          console.log(`${n} number of rows have been deleted...`);
        } else {
          console.log("Unsuccessful deletion of data...");
        }
        res.json({success: `${menu.name} is successfully deleted from the menu`, menu});
      })
      .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});


// ajax update food 
router.post("/update/:id", urlencodedParser, ensureAuthenticated, (req, res) => {
  let errors = [];
  let id = req.params.id;
  let { menuImage, foodName, foodType, foodPrice, specifications } = req.body;
  specifications = specifications === undefined ? "" : specifications.toString();
  menuImage = menuImage === undefined ? '' : menuImage;
  if (foodPrice < 0) {
    errors.push({ text: "Please do not enter negative value for price!" });
  }
  Menu.findAll({
    where: {userId: req.user.id}
  }).then((menus) => {
    if ((menus.filter(m => m.id == id))[0].name == foodName) {
      
    } else {
      if ((menus.map(m => m.name)).includes(foodName)) {
        errors.push({ text: "Please do not enter used name!" });
      }
    }
    if (errors.length > 0) {
      res.json({errors})
    } else {
      Menu.update(
        {
          name: foodName,
          price: foodPrice,
          type: foodType,
          specifications: specifications,
          image: menuImage,
        },
        { where: { id: id } }
      )
        .then((n) => {
          if (n > 0) {
            console.log(`${n} has been updated`);
          } else {
            console.log(`Unsuccessful update of data...`);
          }
          Menu.findOne({where: {id: id}})
            .then((menu) => {
              res.json({menu, success:`${menu.name} successfully updated!`})
            }).catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }
  })
});

// ajax get new specifications
router.get("/getNewSpec/:name", (req, res) => {
  let name = req.params.name;
  console.log(name);
  MenuSpec.findOne({ 
    where: { 
      [Op.and]: [
        { name: name },
        { userId: req.user.id }
      ]} })
    .then((specs) => {
      console.log(specs);
      let menuSpec = {};
      specs.forEach((option) => {
        if (option.name in menuSpec) {
          menuSpec[option.name] = menuSpec[option.name].concat([
            { option: option.option, addPrice: option.addPrice },
          ]);
        } else {
          console.log("test1");
          menuSpec[option.name] = [
            { option: option.option, addPrice: option.addPrice },
          ];
        }
      });
      res.json({menuSpec});
    })
    .catch((err) => console.log(err));
});

// ajax add specifications
router.post("/addSpec", urlencodedParser, (req, res) => {
  let errors = [];
  let name = req.body.name;
  let optionList = [];
  for (i in req.body) {
    // console.log(req.body[i]);
    if (i !== "name" && i.slice(0, 1) === "o") {
      optionList.push([req.body[i]]);
    } else if (i !== "name" && i.slice(0, 1) === "a") {
      optionList[optionList.length - 1] = optionList[
        optionList.length - 1
      ].concat([req.body[i]]);
    }
  }
  for (i = 0; i < optionList.length; i++) {
    if (optionList[i][1] < 0) {
      errors.push({ text: "Please do not enter negative value for price!" })
    }
  }
  console.log(optionList);
  if (errors.length > 0) {
    res.json({
      errors,
    });
  } else { 
    MenuSpec.findOne({ 
      where: { 
        [Op.and]: [
          { name: name },
          { userId: req.user.id }
        ]} })
      .then((spec) => {
        if (spec) {
          res.json({error:"Specification name is already registered!"});
        } else {
          for (i = 0; i < optionList.length; i++) {
            let option = optionList[i][0];
            let addPrice = optionList[i][1];
            MenuSpec.create({
              name: name,
              option: option,
              addPrice: addPrice,
              userId: req.user.id,
            })
              .then((specOption) => {
                console.log(`Successfuly added ${option} to ${name}`);
              })
              .catch((err) => console.log(err));
          }
        res.json({success:`new spec is successfully added!`, optionList:optionList.map(m=>m[0])});
        }
      }).catch((err) => console.log(err));
  }
});

// ajax delete specifications
router.get("/deleteSpec/:name", (req, res) => {
  let name = req.params.name;
  MenuSpec.destroy({ 
    where: { 
      [Op.and]: [
        { name: name },
        { userId: req.user.id }
      ]} })
    .then((n) => {
      if (n) {
        console.log(`${n} number of rows have been deleted...`);
      } else {
        console.log("Unsuccessful deletion of data...");
      }
      res.json({success: `${name} is successfully deleted from the menu`});
    })
    .catch((err) => console.log(err));
});

// ajax get order data and menu data
router.get('/getStatData', (req, res) => {
  let types = [];
  Menu.findAll({
    where: {userId: req.user.id}
  }).then((menus) => {
      menus.forEach((menu) => {
        if (types.includes(menu.type) === false) {
          types.push(menu.type);
        }
      });
      MenuSpec.findAll({
        where: { userId: req.user.id},
      }).then((specs) => {
        let menuSpec = {};
        specs.forEach((option) => {
          if (option.name in menuSpec) {
            menuSpec[option.name] = menuSpec[option.name].concat([
              option.option,
            ]);
          } else {
            menuSpec[option.name] = [option.option];
          }
        });
        Restaurant.findOne({
          where: { staffId: req.user.id }
        }).then(restaurant => {
          if (restaurant) {
            Order.findAll({ 
              where: { res_name: restaurant.res_name},
            }).then((orders) => {
              if (orders.length > 0) {
                orders.forEach((order) => {
                  order.food = JSON.parse(order.food);
                })
                const labels = menus.map(f => f.name);
                const orderList = [];
                for (i=0; i<orders.length;i++) {
                  for (j=0; j<orders[i].food.length;j++) {
                      for (k=0; k<orders[i].food[j].orders.length;k++) {
                          for (l=0; l<parseInt(orders[i].food[j].orders[k].quantity);l++) {
                              orderList.push(orders[i].food[j].id);
                          }
                      }
                  }
              }
                const dataList = []
                menus.forEach((menu, i) => {
                    if (orderList.indexOf(menu.id.toString()) >= 0) {
                        dataList.push([labels[i], orderList.filter(n => n == menu.id).length])
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
                const total = orders.map(m=>parseInt(m.total)).reduce((x, y) => {
                  return x+y
                })
                res.json({menus, menuSpec, orders, topMenu:newList2, total});
              } else {
                res.json({empty:true, menus});
              }
              
            });
          }
        });
      });
    
  });
});

module.exports = router;
