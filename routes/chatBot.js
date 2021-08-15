const express = require('express');
const router = express.Router();
// Chat Bot Code
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const ChatBot = require("../models/chatbot");

router.get("/chatbotlayout", (req, res) => {
    ChatBot.findAll({where: {userid: req.user.id}})
    .then(chatbotmsg => {
        if(chatbotmsg){
            res.render("chatbot/layout", {chatbotmsg});
        }
    })
})

router.post("/sendChatBotMsg", (req, res) => {
    let userMsg = req.body.MSG;
    if(userMsg){
        ChatBot.create({userid: req.user.id, userMsg: userMsg});
    }
  
    /**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
    async function runSample(textMsg, userid, projectId = 'foodecent-chatbot-wtml') {
        // A unique identifier for the given session
        const sessionId = uuid.v4();
    
        // Create a new session
        const sessionClient = new dialogflow.SessionsClient({
            keyFilename: "foodecent-chatbot-wtml-3472136c49a8.json"
        });
        const sessionPath = sessionClient.projectAgentSessionPath(
        projectId,
        sessionId
        );
    
        // The text query request.
        const request = {
        session: sessionPath,
        queryInput: {
            text: {
            // The query to send to the dialogflow agent
            text: `${textMsg}`,
            // The language used by the client (en-US)
            languageCode: 'en-US',
            },
        },
        };
    
        // Send request and log result
        const responses = await sessionClient.detectIntent(request);
        console.log('Detected intent');
        const result = responses[0].queryResult;
        console.log(`  Query: ${result.queryText}`);
        console.log(`  Response: ${result.fulfillmentText}`);
        if(result.fulfillmentText && result.queryText != undefined){
            ChatBot.create({userid: userid, botMsg: result.fulfillmentText})
            .then(chatbot => {
                ChatBot.findAll({where: {userid: req.user.id}})
                .then(chatbotmsg => {
                    if(chatbotmsg){
                         res.render("chatbot/layout", {chatbotmsg, lastbotmsg: result.fulfillmentText});
                    }
                })
            })
        }
    }

    runSample(userMsg, req.user.id);


    
})

router.get("/endchat", (req, res) => {
    ChatBot.destroy({where: {userid: req.user.id}})
    .then(chatbot => {
        res.redirect("/chatbot/chatbotlayout");
    })
})

module.exports = router;