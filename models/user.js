const Sequelize = require("sequelize");
const db = require("../config/DBConfig");
const bcrypt = require("bcryptjs")
const LocalStrategy = require('passport-local').Strategy;

const User = db.define('users', {
    fname: {
        type: Sequelize.STRING
    },
    lname: {
        type: Sequelize.STRING
    },
    phone: {
        type: Sequelize.INTEGER
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    cust_type: {
        type: Sequelize.STRING
    },
});

module.exports = User;



