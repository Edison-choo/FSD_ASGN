const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Promotions = db.define('promotions',{
    name: {
        type: Sequelize.STRING
    },
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
    },
    staffid: {
        type: Sequelize.INTEGER
    },
    counter: {
        type: Sequelize.INTEGER
    }
});

module.exports = Promotions;