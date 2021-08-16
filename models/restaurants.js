const Sequelize = require("sequelize");
const db = require("../config/DBConfig");

const Restaurants = db.define("restaurants", {
  staffid: {
    type: Sequelize.INTEGER,
  },
  address: {
    type: Sequelize.STRING,
  },
  unit:{
    type: Sequelize.STRING,
  },
  website: {
    type: Sequelize.STRING,
  },
  res_name: {
    type: Sequelize.STRING,
  },
  name:{
    type: Sequelize.STRING,
  },
  phone: {
    type: Sequelize.STRING,
  },
  cuisine: {
    type: Sequelize.STRING,
  },
  open_time: {
    type: Sequelize.TIME,
  },
  close_time: {
    type: Sequelize.TIME,
  },
  price: {
    type: Sequelize.INTEGER,
  },
  halal: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  facebook: {
    type: Sequelize.STRING,
  },
  twitter: {
    type: Sequelize.STRING,
  },
  instagram: {
    type: Sequelize.STRING,
  },
  image: {
    type: Sequelize.STRING,
  },
  seat: {
    type: Sequelize.STRING(4000),
  },
  square: {
    type: Sequelize.STRING(4000),
  },
  tables: {
    type: Sequelize.STRING(4000),
  },
  occupied: {
    type: Sequelize.STRING(400),
  },
  queue: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  reviewCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  avgReview: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});

module.exports = Restaurants;
