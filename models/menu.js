const Sequelize = require("sequelize");
const db = require("../config/EDBConfig");

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
});

module.exports = Menu;