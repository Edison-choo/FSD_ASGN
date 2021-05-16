const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Promotions = db.define('promotions',{
    startdate: {
        type: Sequelize.DATE
    },
    enddate: {
        type: Sequelize.DATE
    },
    discount: {
        type: Sequelize.INTEGER
    },
    details: {
        type: Sequelize.STRING
    },
    banner: {
        type: Sequelize.STRING
    }
});

module.exports = Promotions;