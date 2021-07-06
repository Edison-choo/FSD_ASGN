const Sequelize = require("sequelize");
const db = require("../config/DBConfig");

const MenuSpec = db.define('menuSpec', {
    name: {
        type: Sequelize.STRING
    },
    option: {
        type: Sequelize.STRING
    },
    addPrice: {
        type: Sequelize.FLOAT
    },
    userId: {
        type: Sequelize.INTEGER
    }
});

module.exports = MenuSpec;