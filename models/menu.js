const Sequelize = require("sequelize");
const db = require("../config/DBConfig");

const Menu = db.define('menu', {
    foodNo: {
        type: Sequelize.STRING
    },
    name: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.FLOAT
    },
    type: {
        type: Sequelize.STRING
    },
    specifications: {
        type: Sequelize.STRING
    },
    image: {
        type: Sequelize.STRING
    },
    userId: {
        type: Sequelize.INTEGER
    }
});

module.exports = Menu;