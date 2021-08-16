const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const tableStatus = db.define('tableStatus', {
    res_name: {
        type: Sequelize.STRING,
    },
    queue: {
        type: Sequelize.INTEGER,
    },
    occupiedCount: {
        type: Sequelize.INTEGER,
    },
    vacantCount: {
        type: Sequelize.INTEGER,
    },
    dateTime: {
        type: Sequelize.DATE,
    }
});

module.exports = tableStatus;