const mySQLDB = require("./EDBConfig");
const menu = require("../models/Menu");
const restaurant = require("../models/Restaurant");
// If drop is true, all existing tables are dropped and recreated
const setUpEDB = (drop) => {
  mySQLDB
    .authenticate()
    .then(() => {
      console.log("foodecent database connected");
    })
    .then(() => {
      /*
Defines the relationship where a user has many videos.
In this case the primary key from user will be a foreign key
in video.
*/
      restaurant.hasMany(menu);
      mySQLDB
        .sync({
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
module.exports = { setUpEDB };
