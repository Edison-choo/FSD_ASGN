const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const alertMessage = require("../helpers/messenger");
const Menu = require("../models/menu");
const MenuSpec = require("../models/menuSpec");
const menuSpecification = require("../models/menuSpecification");
const User = require("../models/user");
const e = require("connect-flash");

var userLog = false;
var location = "";

var urlencodedParser = bodyParser.urlencoded({ extended: false });

//page of user view menu
router.get("/", (req, res) => {
  var types = [];
  Menu.findAll({
    attributes: { exclude: ["restaurant_id"] },
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
          res.render("menu/menu", {
            menus,
            menuSpecification,
            types,
            menuSpec,
          });
        });
        // res.render("menu/menu", { menus, types, menuSpecification });
      }
    })
    .catch((err) => console.log(err));
});

// router.get("/addMenu", (req, res) => {
//   res.render("menu/addMenu");
// });

//page of menu table
router.get("/updateMenu", (req, res) => {
  let types = [];
  Menu.findAll({
    attributes: { exclude: ["restaurant_id"] },
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
      MenuSpec.findAll().then((specs) => {
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

//add food
router.post("/addMenu", urlencodedParser, (req, res) => {
  let errors = [];
  let { foodName, foodType, foodPrice, specifications } = req.body;
  // let foodId = foodType.slice(0, 1).toUpperCase() + '01';
  if (specifications) {
    specifications = specifications.toString();
  } else {
    specifications = "";
  }
  // specifications = undefined ? " " : specifications.toString();
  // foodId = foodId.toString();

  if (foodPrice < 0) {
    errors.push({ text: "Please do not enter negative value for price" });
  }

  // res.render('menu/updateMenu')

  Menu.findAll({
    attributes: { exclude: ["restaurant_id"] },
  })
    .then((menus) => {
      if (menus) {
        let menuOrder = menus.filter(f => f.type == foodType).sort((f1, f2) => f1.foodNo > f2.foodNo ? 1 : -1);
        let menuLength = 0;
        if (menuOrder[0] === undefined) {
          menuLength = 1;
        } else {
          menuLength = parseInt((menuOrder[menuOrder.length - 1].foodNo).slice(-2)) + 1;
        }
        // menus.forEach((menu) => {
        // 	menu.specifications = JSON.parse(menu.specifications);
        // });
        if (errors.length > 0) {
          res.render("menu/updateMenu", {
            errors,
            menus,
            foodName,
            foodType,
            foodPrice,
            specifications,
          });
        } else {
          Menu.findOne({ where: { name: foodName } })
            .then((menu) => {
              if (menu) {
                alertMessage(
                  res,
                  "danger",
                  "Food name is already registered",
                  "fas fa-ban",
                  true
                );
                res.render("menu/updateMenu", {
                  menus: menus,
                  foodName,
                  foodType,
                  foodPrice,
                  specifications,
                  menuSpecification,
                });
              } else {
                let id = 1;
                let foodId = foodType.slice(0,1).toUpperCase() + foodType.slice(-1).toUpperCase() + ("00" + menuLength).slice(-2);
                Menu.create({
                  foodNo: foodId,
                  name: foodName,
                  price: foodPrice,
                  type: foodType,
                  specifications: specifications,
                  restaurant_id: id,
                })
                  .then((menu) => {
                    alertMessage(
                      res,
                      "success",
                      "Food is successfully added to the menu",
                      "fas fa-check-circle",
                      true
                    );
                    res.redirect("/menu/updateMenu");
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
//fix menuSpec

//update food
router.post("/update/:id", urlencodedParser, (req, res) => {
  let id = req.params.id;
  let { foodId, foodName, foodType, foodPrice, specifications } = req.body;
  specifications = specifications.toString();

  Menu.update(
    {
      foodNo: foodId,
      name: foodName,
      price: foodPrice,
      type: foodType,
      specifications: specifications,
    },
    { where: { id: id } }
  )
    .then((n) => {
      if (n) {
        console.log(`${n} has been updated`);
      } else {
        console.log(`Unsuccessful update of data...`);
      }
      alertMessage(
        res,
        "success",
        "Food is successfully updated",
        "fas fa-check-circle",
        true
      );
      res.redirect("/menu/updateMenu");
    })
    .catch((err) => console.log(err));
});

//delete food from menu
router.get("/delete/:id", (req, res) => {
  let id = req.params.id;
  Menu.destroy({ where: { id: id } })
    .then((n) => {
      if (n) {
        console.log(`${n} number of rows have been deleted...`);
      } else {
        console.log("Unsuccessful deletion of data...");
      }
      alertMessage(
        res,
        "success",
        "Food is successfully deleted from the menu",
        "fas fa-check-circle",
        true
      );
      res.redirect("/menu/updateMenu");
    })
    .catch((err) => console.log(err));
});

// add specifications
router.post("/addSpec", urlencodedParser, (req, res) => {
  let name = req.body.name;
  let optionList = [];
  for (i in req.body) {
    // console.log(req.body[i]);
    if (i !== 'name' && i.slice(0,1) === 'o') {
      optionList.push([req.body[i]]);
    } else if (i !== 'name' && i.slice(0,1) === 'a') {
      optionList[optionList.length - 1] = optionList[optionList.length - 1].concat([req.body[i]]);
    }
  };
  console.log(optionList);
  for (i = 0; i < optionList.length; i++) {
    let option = optionList[i][0];
    let addPrice = optionList[i][1];
    MenuSpec.findOne({ where: { name: name } }).then((spec) => {
      if (spec) {
        alertMessage(
          res,
          "danger",
          "Specification name is already registered",
          "fas fa-ban",
          true
        );
        res.redirect("/updateMenu");
      } else {
        let id = 1;
        MenuSpec.create({
          name: name,
          option: option,
          addPrice: addPrice,
          restaurantId: id,
        })
          .then((specOption) => {
            console.log(`Successfuly added ${option} to ${name}`);
          })
          .catch((err) => console.log(err));
      }
      // if (i === optionList.length - 1) {
      //   if (check === true) {
      //     alertMessage(res, "success",'Specification is successfully added', 'fas fa-check-circle', true);
      //   } else {
      //     alertMessage(res, "danger",'Error encountered. Pls retry', 'fas fa-ban', true);
      //   }
      // }
    });
  }
  res.redirect("/menu/updateMenu");
});

//delete specifications
router.get("/deleteSpec/:name", (req, res) => {
  let name = req.params.name;
  MenuSpec.destroy({ where: { name: name } })
    .then((n) => {
      if (n) {
        console.log(`${n} number of rows have been deleted...`);
      } else {
        console.log("Unsuccessful deletion of data...");
      }
      alertMessage(
        res,
        "success",
        "Specifications is successfully deleted",
        "fas fa-check-circle",
        true
      );
      res.redirect("/menu/updateMenu");
    })
    .catch((err) => console.log(err));
});

module.exports = router;
