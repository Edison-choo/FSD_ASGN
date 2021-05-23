const Sequelize = require("sequelize");
const db = require("../config/DBConfig");

const Order = db.define('order', {
    userId: {
        type: Sequelize.INTEGER
    },
    date: {
        type: Sequelize.DATE
    },
    total: {
        type: Sequelize.FLOAT
    },
    remarks: {
        type: Sequelize.STRING
    }
});

module.exports = Order;