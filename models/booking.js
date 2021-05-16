const Sequelize = require('sequelize');
const db = require("../config/DBConfig");

const Booking = db.define('booking', {
    firstName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    },
    email:{
        type: Sequelize.STRING
    },
    timing: {
        type: Sequelize.TIME
    },
    date: {
        type: Sequelize.DATEONLY
    },
    pax: {
        type: Sequelize.INTEGER
    },
});

module.exports = Booking;
