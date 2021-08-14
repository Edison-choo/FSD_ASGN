const Sequelize = require("sequelize");
const db = require("../config/DBConfig");

const ChatBot = db.define('ChatBot', {
    userid: {
        type: Sequelize.INTEGER
    },
    botMsg: {
        type: Sequelize.STRING
    },
    userMsg: {
        type: Sequelize.STRING
    }
});

module.exports = ChatBot;



