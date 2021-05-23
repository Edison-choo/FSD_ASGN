const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const alertMessage = require("../helpers/messenger");
const Menu = require("../models/menu");
const menuSpecification = require("../models/menuSpecification");
const User = require("../models/user");

var userLog = false;
var location = "";

var urlencodedParser = bodyParser.urlencoded({ extended: false });

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
        res.render("menu/menu", { menus, types, menuSpecification });
      }
    })
    .catch((err) => console.log(err));
});

router.get("/addMenu", (req, res) => {
  res.render("menu/addMenu");
});

router.get("/updateMenu", (req, res) => {
  Menu.findAll({
    attributes: { exclude: ["restaurant_id"] },
  }).then((menus) => {
    if (menus) {
      // menus.forEach((menu) => {
      // 	menu.specifications = JSON.parse(menu.specifications);
      // });
      res.render("menu/updateMenu", { menus, menuSpecification });
    }
  });
});

router.post("/addMenu", urlencodedParser, (req, res) => {
  let errors = [];
  let { foodId, foodName, foodType, foodPrice, specifications } = req.body;
  var menuList;

  foodId = foodId.toString();

  if (foodPrice < 0) {
    errors.push({ text: "Please do not enter negative value for price" });
  }

  // res.render('menu/updateMenu')

  Menu.findAll({
    attributes: { exclude: ["restaurant_id"] },
  })
    .then((menus) => {
      if (menus) {
        // menus.forEach((menu) => {
        // 	menu.specifications = JSON.parse(menu.specifications);
        // });
        if (errors.length > 0) {
          res.render("menu/updateMenu", {
            errors,
            menus,
            foodId,
            foodName,
            foodType,
            foodPrice,
            specifications,
          });
        } else {
          Menu.findOne({ where: { foodNo: foodId } })
            .then((menu) => {
              if (menu) {
                res.render("menu/updateMenu", {
                  error: menu.name + " already exists",
                  menus: menuList,
                  foodId,
                  foodName,
                  foodType,
                  foodPrice,
                  specifications,
                  menuSpecification,
                });
              } else {
                let id = 1;
                console.log(id);
                specifications = specifications.toString();
                Menu.create({
                  foodNo: foodId,
                  name: foodName,
                  price: foodPrice,
                  type: foodType,
                  specifications: specifications,
                  restaurantId: id,
                })
                  .then((menu) => {
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
      res.redirect("/menu/updateMenu");
    })
    .catch((err) => console.log(err));
});

router.get("/delete/:id", (req, res) => {
  let id = req.params.id;
  Menu.destroy({ where: { id: id } })
    .then((n) => {
      if (n) {
        console.log(`${n} number of rows have been deleted...`);
      } else {
        console.log("Unsuccessful deletion of data...");
      }
      res.redirect("/menu/updateMenu");
    })
    .catch((err) => console.log(err));
});

module.exports = router;
