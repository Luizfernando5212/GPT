require('dotenv').config();
const request = require('../util/requestBuilder');
const axios = require("axios").default;

const token = process.env.WHATSAPP_TOKEN;

const pergunta = "O que o futuro me reserva?";

exports.webHook = async (req, res) => {
    let body = req.body;
    // let type = body.entry[0].changes[0].value.messages[0].type;
    let message;

    // console.log(JSON.stringify(body));

    if (body.object) {
        if (req.body.entry &&
            req.body.entry[0].changes &&
            req.body.entry[0].changes[0] &&
            req.body.entry[0].changes[0].value.messages &&
            req.body.entry[0].changes[0].value.messages[0]) {
            let phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id;
            let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
            console.log(body.entry[0].changes[0].value.messages[0].timestamp)
            console.log((Date.now() / 1000) - 5)

            console.log()

            if (body.entry[0].changes[0].value.messages[0].text &&
                body.entry[0].changes[0].value.messages[0].text.body &&
                body.entry[0].changes[0].value.messages[0].timestamp > Date.now() /1000 - 5) {
                message = body.entry[0].changes[0].value.messages[0].text.body;
                let nome = req.body.entry[0].changes[0].value.contacts[0].profile.name;

                try {
                    await axios(request.interactiveMessage(from, {
                        header: `Olá, seja bem vindo ${nome}`,
                        body: 'O que gostaria de realizar hoje ?'
                    }, ['Comprar tokens', 'Jogar'], token, phone_number_id, 1));
                    res.status(200);
                } catch (err) {
                    console.log("Deu ruim ", err);
                    res.sendStatus(400);
                }

            } else if (body.entry[0].changes[0].value.messages[0].interactive &&
                body.entry[0].changes[0].value.messages[0].interactive.button_reply &&
                body.entry[0].changes[0].value.messages[0].interactive.button_reply.id) {

                let msg_body =
                    req.body.entry[0].changes[0].value.messages[0].interactive
                        .button_reply.title;
                let id =
                    req.body.entry[0].changes[0].value.messages[0].interactive
                        .button_reply.id;

                try {
                    await axios(request.textMessage(from, `Iremos te encaminhar para ${msg_body}`, token, phone_number_id))
                    console.log(typeof id)
                    if (id == 1) {
                        await axios(request.fullMessage(from, {
                            header: `Link de compra`,
                            body: 'Entre no link abaixo para realizar a compra, após a compra você receberá um código para utilizar no jogo',
                            footer: 'www.google.com.br'
                        }, token, phone_number_id))
                    } else if (id == 2) {
                        const usuario = await axios(request.getTokens(from));
                        console.log(usuario);
                        if (usuario.tokens >= 1) {
                            var possibilidades = [1, 2, 3, 4, 5, 6, 8, 10, 20];
                            const cartas = [];
                            for (const i of possibilidades) {
                                if (usuario.tokens >= i) cartas.push(`${i} ${i === 1 ? 'carta' : 'cartas'}`);
                            }
                            // Faça a sua pergunta
                            await axios(request.interactiveMessage(from,
                                `Você possui ${usuario.tokens} tokens. Escolha a quantidade de cartas que deseja sortear`,
                                cartas, token, phone_number_id, 3));
                        }
                    } else if (id >= 3) {
                        const cartasSorteadas = await axios(request.sorteioCartas(possibilidades[id - 3]));
                        let combinacoes = '';
                        if (cartasSorteadas.menores) {
                            for (let i = 0; i <= cartasSorteadas.menores.length; i++) {
                                combinacoes += `${i + 1}ª combinação` + ' -> ' + cartasSorteadas.maiores[i] +
                                    ' e ' + cartasSorteadas.menores[i] + '\n'
                            }
                            await axios(request.fullMessage(from, {
                                header: `Suas cartas são:`,
                                body: combinacoes,
                                footer: 'Digite a sua pergunta para receber a resposta'
                            }, token, phone_number_id));

                            let response = await axios(request.interactiveMessage(from))
                        }
                        await axios(request.textMessage(from, `Suas cartas são: ${cartasSorteadas.data}`, token, phone_number_id));
                    }
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