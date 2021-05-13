const Sequelize = require("sequelize");
const db = require("../config/EDBConfig");

const Restaurant = db.define("restaurant", {
  name: {
    type: Sequelize.STRING,
  },

});

module.exports = Restaurant;
