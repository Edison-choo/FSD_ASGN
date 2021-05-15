const Sequelize = require("sequelize");
const db = require("../config/DBConfig");

const Restaurant = db.define("restaurant", {
  name: {
    type: Sequelize.STRING,
  },

});

module.exports = Restaurant;
