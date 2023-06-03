require('dotenv').config();
const request = require('../util/requestBuilder');
const axios = require("axios").default;
const path = require('../util/messages');

const token = process.env.WHATSAPP_TOKEN;


exports.webHook = async (req, res) => {
    let body = req.body;
    let message;
    let usuario;
    let state;
    var possibilidades = [1, 2, 3, 4, 5, 6, 8, 10, 20]
    // console.log(body.entry[0].changes[0].value.messages[0].timestamp);
    // console.log(Date.now() / 1000)
    // id = await axios()

    // console.log(JSON.stringify(body));

    if (body.object) {
        if (req.body.entry &&
            req.body.entry[0].changes &&
            req.body.entry[0].changes[0] &&
            req.body.entry[0].changes[0].value.messages &&
            req.body.entry[0].changes[0].value.messages[0] &&
            body.entry[0].changes[0].value.messages[0].timestamp > Date.now() / 1000 - 6) {
            console.log(body.entry[0].changes[0].value.messages[0].timestamp);
            console.log(Math.round(Date.now() / 1000))
            let phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id;
            let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload


            // console.log(body.entry[0].changes[0].value.messages[0].timestamp);
            // console.log(Date.now() / 1000)back-end-tarot\images\tarot_img1.jpeg
            // try {
            //     await axios(request.mediaMessage(from, 'https://i.imgur.com/q57SM0Z.jpg', token, phone_number_id));
            // } catch (err) {
            //     console.log('Não há mensagem de mídia no momento ', err)
            // }
            

            try {
                try {
                    state = req.body.entry[0].changes[0].value.messages[0].interactive.button_reply.id;
                } catch (err) {
                    try {
                        state = req.body.entry[0].changes[0].value.messages[0].interactive.list_reply.id;
                    } catch (err) { }
                }

                await axios(request.updateState(from, state));
            } catch (err) {
                console.log('Não há estado no momento ')
            }

            try {
                let response = await axios(request.getUser(from));
                if (response.status === 200) {
                    usuario = response.data;
                    state = usuario.state;
                } else {
                    let response = await axios(request.postUser(from, req.body.entry[0].changes[0].value.contacts[0].profile.name));
                    if (response.status === 200) {
                        console.log('Usuário cadastrado ');
                    }
                }
            } catch (err) {
                console.log('Não há usuário para ser cadastrado '/* , err */)
            }

            console.log(JSON.stringify(body));

            if (body.entry[0].changes[0].value.messages[0].text &&
                body.entry[0].changes[0].value.messages[0].text.body &&
                body.entry[0].changes[0].value.messages[0].timestamp > Date.now() / 1000 - 5) {
                message = body.entry[0].changes[0].value.messages[0].text.body;
                let nome = req.body.entry[0].changes[0].value.contacts[0].profile.name;

                // Caso do usuário fazer a pergunta
                try {
                    await path.textPath(from, state, usuario, body, token, phone_number_id, nome, res);
                } catch (err) {
                    console.log('Não há mensagem de texto no momento ', err)
                }
                
                

            } else if (body.entry[0].changes[0].value.messages[0].interactive &&
                body.entry[0].changes[0].value.messages[0].interactive.button_reply &&
                body.entry[0].changes[0].value.messages[0].interactive.button_reply.id &&
                body.entry[0].changes[0].value.messages[0].timestamp > Date.now() / 1000 - 5) {
                
                // Caso do usuário escolher o tipo de pergunta
                try {
                    await path.buttonPath(from, state, usuario, body, token, phone_number_id, res);
                } catch (err) {
                    console.log('Não há mensagem de botão no momento ', err)
                }


            } else if (body.entry[0].changes[0].value.messages[0].interactive &&
                body.entry[0].changes[0].value.messages[0].interactive.list_reply &&
                body.entry[0].changes[0].value.messages[0].interactive.list_reply.id &&
                body.entry[0].changes[0].value.messages[0].timestamp > Date.now() / 1000 - 5) {
                
                // Caso do usuário escolher o tipo de pergunta
                try {
                    await path.listPath(from, state, usuario, body, token, phone_number_id, res);
                } catch (err) {
                    console.log('Não há mensagem de lista no momento ', err)
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