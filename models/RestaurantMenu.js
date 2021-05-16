const Sequelize = require("sequelize");
const db = require("../config/DBConfig");

const RestaurantMenu = db.define("restaurantMenu", {
  name: {
    type: Sequelize.STRING,
  },

});

module.exports = RestaurantMenu;
