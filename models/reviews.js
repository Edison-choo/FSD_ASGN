const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Reviews = db.define('reviews', {
    food: {
        type: Sequelize.INTEGER
    },
    service: {
        type: Sequelize.INTEGER
    },
    environment: {
        type: Sequelize.INTEGER
    },
    average: {
        type: Sequelize.INTEGER
    },
    comments: {
        type: Sequelize. STRING
    },
    userid:{
        type: Sequelize.INTEGER
    },
    restaurant: {
        type: Sequelize.STRING
    }
});

module.exports = Reviews;