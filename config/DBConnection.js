const mySQLDB = require("./DBConfig");
const menu = require("../models/Menu");
const restaurantMenu = require("../models/RestaurantMenu");
const restaurants = require("../models/restaurants");
const reviews = require("../models/reviews");
const promotions = require("../models/promotions");

// If drop is true, all existing tables are dropped and recreated
const setUpDB = (drop) => {
  mySQLDB.authenticate()
    .then(() => {
      console.log("foodecent database connected");
    })
    .then(() => {
      /*
Defines the relationship where a user has many videos.
In this case the primary key from user will be a foreign key
in video.
*/
      restaurantMenu.hasMany(menu);
      mySQLDB.sync({
          // Creates table if none exists
          force: drop,
        })
        .then(() => {
          console.log("Create tables if none exists");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log("Error: " + err));
};
module.exports = { setUpDB };