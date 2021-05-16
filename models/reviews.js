const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Reviews = db.define('reviews', {
    food: {
        type: Sequelize.INTEGER
    },
    service: {
        type: Sequelize.INTEGER
    },
    environmnet: {
        type: Sequelize.INTEGER
    },
    email: {
        type: Sequelize.STRING
    },
    comments: {
        type: Sequelize. STRING
    }
});

module.exports = Reviews;