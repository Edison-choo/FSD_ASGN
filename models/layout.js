const Sequelize = require('sequelize');
const db = require("../config/DBConfig");

const Layout = db.define('layout', {
    restaurant:{
        type:Sequelize.STRING
    },
    seat:{
        type:Sequelize.STRING
    },
    square:{
        type:Sequelize.STRING
    },
    tables:{
        type:Sequelize.STRING
    },
    occupied:{
        type:Sequelize.STRING
    },
})

module.exports = Layout;