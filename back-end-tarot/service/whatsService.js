require('dotenv').config();
const facebook = require('../util/urls');
const request = require('../util/requestBuilder');
const axios = require("axios").default;

const token = process.env.WHATSAPP_TOKEN;

exports.webHook = async (req, res) => {
    let body = req.body;

    console.log(JSON.stringify(body));

    if (req.body.object) {
        if (
            req.body.entry &&
            req.body.entry[0].changes &&
            req.body.entry[0].changes[0] &&
            req.body.entry[0].changes[0].value.messages &&
            req.body.entry[0].changes[0].value.messages[0]
        ) {
            let phone_number_id = req.body.entry[0].changes[0].value.metadata.phone_number_id;
            let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
            if ("text" in req.body.entry[0].changes[0].value.messages[0]) {
                let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;
                let nome = req.body.entry[0].changes[0].value.contacts[0].profile.name;

                try {
                    const response = await axios(request.interactiveMessage(from, {
                        header: `Olá, seja bem vindo ${nome}`,
                        body: 'O que gostaria de realizar hoje ?'
                    }, ['Comprar tokens', 'Jogar'], token, phone_number_id));
                    res.status(200).json(response);
                } catch (err) {
                    console.log("Deu ruim ", err);
                    res.sendStatus(400);
                }
            } else {
                let msg_body =
                    req.body.entry[0].changes[0].value.messages[0].interactive
                        .button_reply.title;
                let id =
                    req.body.entry[0].changes[0].value.messages[0].interactive
                        .button_reply.id;

                try {
                    await axios(request.textMessage(from, `Iremos te encaminhar para ${msg_body}`, token, phone_number_id))
                    res.sendStatus(200);
                } catch (err) {
                    console.log("Deu ruim ", err);
                    res.sendStatus(400);
                }
            } // extract the message text from the webhook payload
        }
    } else {
        // Return a '404 Not Found' if event is not from a WhatsApp API
        res.sendStatus(404);
    }
}

exports.getAccess = async (req, res) => {
    const verify_token = process.env.VERIFY_TOKEN;

    // Parse params from the webhook verification request
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    console.log(req.query)


    // Check if a token and mode were sent
    if (mode && token) {
        // Check the mode and token sent are correct
        if (mode === "subscribe" && token === verify_token) {
            // Respond with 200 OK and challenge token from the request
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
}