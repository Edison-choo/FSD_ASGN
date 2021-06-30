const Sequelize = require("sequelize");

const User = db.define('users', {
    cardno: {
        type: Sequelize.STRING
    },
    mm: {
        type: Sequelize.INTEGER
    },
    yyyy: {
        type: Sequelize.INTEGER
    },
    CVV: {
        type: Sequelize.INTEGER
    }
});

module.exports = User;



