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
                path.textPath(from, state, usuario, token, phone_number_id);
                

            } else if (body.entry[0].changes[0].value.messages[0].interactive &&
                body.entry[0].changes[0].value.messages[0].interactive.button_reply &&
                body.entry[0].changes[0].value.messages[0].interactive.button_reply.id &&
                body.entry[0].changes[0].value.messages[0].timestamp > Date.now() / 1000 - 5) {
                message = req.body.entry[0].changes[0].value.messages[0].interactive.button_reply.title;
                if (state === 30) {
                    try {
                        await axios(request.updateState(from, 0));
                        await axios(request.updateQuestion(from, ''));
                        await axios(request.textMessage(from, `Sessão encerrada com sucesso, envie uma nova menssagem`, token, phone_number_id));
                        return
                    } catch (err) {
                        console.log("Deu ruim ", err);
                        res.sendStatus(400);
                    }
                }
                try {
                    await axios(request.textMessage(from, `Iremos te encaminhar para ${message}`, token, phone_number_id))
                    if (state == 1) {
                        await axios(request.fullMessage(from, {
                            header: `Link de compra`,
                            body: 'Entre no link abaixo para realizar a compra, após a compra você receberá um código para utilizar no jogo',
                            footer: 'www.google.com.br'
                        }, token, phone_number_id))
                    } else if (state == 2) {
                        if (usuario.tokens >= 1) {
                            await axios(request.textMessage(from, `Escreva *agora* a pergunta que gostaria de ser respondida.`,
                                token, phone_number_id))
                            await axios(request.updateState(from, 3));
                        } else {
                            await axios(request.textMessage(from, `Você não possui tokens suficientes`, token, phone_number_id))
                        }
                    }
                    res.sendStatus(200);
                } catch (err) {
                    console.log("Deu ruim ", err);
                    res.sendStatus(400);
                }
            } else if (body.entry[0].changes[0].value.messages[0].interactive &&
                body.entry[0].changes[0].value.messages[0].interactive.list_reply &&
                body.entry[0].changes[0].value.messages[0].interactive.list_reply.id &&
                body.entry[0].changes[0].value.messages[0].timestamp > Date.now() / 1000 - 5) {
                let combinacoes = '';
                try {
                    if (state >= 4 && state <= 12) {
                        let cartasSorteadas = await axios(request.sorteioCartas(possibilidades[state - 4]));
                        cartasSorteadas = cartasSorteadas.data;
                        if (cartasSorteadas.menores) {
                            for (let i = 0; i < cartasSorteadas.menores.length; i++) {
                                combinacoes += `${i + 1}ª combinação` + ' -> ' + cartasSorteadas.maiores[i] +
                                    ' e ' + cartasSorteadas.menores[i] + '\n'
                            }
                            await axios(request.textMessage(from, "*Suas cartas são*\n" +
                                combinacoes + "\n```Sua pergunta será respondida em alguns momentos!!```", token, phone_number_id));
                            const response = await axios(request.completion(usuario.question, cartasSorteadas));
                            if (response.status !== 200) {
                                await axios(request.textMessage(from, `Não foi possível responder sua pergunta, tente novamente mais tarde`,
                                    token, phone_number_id))
                            } else {
                                await axios(request.textMessage(from, response.data.result, token, phone_number_id));
                                await axios(request.textMessage(from, 'Obrigado por utilizar o nosso serviço', token, phone_number_id));
                                await axios(request.updateState(from, 0));
                                await axios(request.updateQuestion(from, ''));
                                await axios(request.updateTokens(from, usuario.tokens - state + 4));
                            }
                            // let response = await axios(request.interactiveMessage(from))
                        } else {
                            for (let i = 0; i < cartasSorteadas.maiores.length; i++) {
                                combinacoes += `${i + 1}ª carta` + ' -> ' + cartasSorteadas.maiores[i] + '\n'
                            }
                            await axios(request.textMessage(from, "*Suas cartas são*\n" +
                                combinacoes + "\n```Sua pergunta será respondida em alguns momentos!!```", token, phone_number_id));
                            const response = await axios(request.completion(usuario.question, cartasSorteadas));
                            if (response.status !== 200) {
                                await axios(request.textMessage(from, `Não foi possível responder sua pergunta, tente novamente mais tarde`,
                                    token, phone_number_id))
                            } else {
                                await axios(request.textMessage(from, response.data.result, token, phone_number_id));
                                await axios(request.textMessage(from, 'Obrigado por utilizar o nosso serviço', token, phone_number_id));
                                await axios(request.updateState(from, 0));
                                await axios(request.updateQuestion(from, ''));
                            }
                        }
                    }
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