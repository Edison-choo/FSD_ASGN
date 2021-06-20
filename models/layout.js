const Sequelize = require('sequelize');
const db = require("../config/DBConfig");

const Layout = db.define('layout', {
    res_name:{
        type:Sequelize.STRING
    },
    seat:{
        type:Sequelize.STRING(4000)
    },
    square:{
        type:Sequelize.STRING(4000)
    },
    tables:{
        type:Sequelize.STRING(4000)
    },
    occupied:{
        type:Sequelize.STRING(400)
    },
})

module.exports = Layout;