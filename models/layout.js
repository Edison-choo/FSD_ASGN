const Sequelize = require('sequelize');
const db = require("../config/DBConfig");

const Layout = db.define('layout', {
    res_name:{
        type:Sequelize.STRING
    },
    seat:{
        type:Sequelize.STRING(1234)
    },
    square:{
        type:Sequelize.STRING(1234)
    },
    tables:{
        type:Sequelize.STRING(1234)
    },
    occupied:{
        type:Sequelize.STRING
    },
})

module.exports = Layout;