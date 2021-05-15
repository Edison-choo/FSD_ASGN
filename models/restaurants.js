const Sequelize = require('sequelize');
const db = require("../config/DBConfig");

const Restaurants = db.define('restaurants', {
    comp_name: {
        type:Sequelize.STRING
    },
    address: {
        type:Sequelize.STRING
    },
    comp_email: {
        type: Sequelize.STRING
    },
    uen: {
        type: Sequelize.STRING
    },
    res_name: {
        type: Sequelize.STRING
    },
    cuisine: {
        type: Sequelize.STRING
    },
    open_time:{
        type: Sequelize.STRING
    },
    close_time:{
        type: Sequelize.STRING
    },
    halal:{
        type: Sequelize.BOOLEAN
    },
    facebook:{
        type: Sequelize.STRING
    },
    twitter:{
        type: Sequelize.STRING
    },
    instagram:{
        type: Sequelize.STRING
    },
});

module.exports = Restaurants;