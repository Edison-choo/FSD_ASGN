const Sequelize = require("sequelize");
const db = require("../config/DBConfig");

const CreditCard = db.define('creditcards', {
    cardname: {
        type: Sequelize.STRING
    },
    cardno: {
        type: Sequelize.STRING
    },
    mm: {
        type: Sequelize.INTEGER
    },
    yyyy: {
        type: Sequelize.INTEGER
    },
    cvv: {
        type: Sequelize.INTEGER
    },
    cardtype: {
        type: Sequelize.STRING
    },
    userid: {
        type: Sequelize.INTEGER
    }
});

module.exports = CreditCard;



