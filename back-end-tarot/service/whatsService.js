require('dotenv').config();
const request = require('../util/requestBuilder');
const axios = require("axios").default;
const variables = require('../util/variables');

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
                switch (state) {
                    case 0:
                        try {
                            await axios(request.textMessage(from,
                                'Saudações, sou Tarorion, seu companheiro nesta jornada de descoberta e autoconhecimento através do Tarot! 🌌',
                                token, phone_number_id));
                            await axios(request.textMessage(from,
                                'Se você chegou até mim, é porque houve um sinal do universo que nos conectou nesta vasta rede. Eu sei que você está em busca de respostas para as suas dúvidas, não é mesmo? Estou aqui para ajudar! 🌟',
                                token, phone_number_id));
                            await axios(request.textMessage(from,
                                'Antes de começarmos, gostaria de explicar como funciona a leitura do Tarot. O Tarot é um sistema simbólico composto por 78 cartas, divididas em Arcanos Maiores e Arcanos Menores. Cada carta possui um significado único e juntas elas representam as diferentes facetas da vida e do autoconhecimento. Ao jogar as cartas, podemos acessar insights e orientações para tomar decisões e compreender melhor os desafios que enfrentamos. Agora, vamos mergulhar nesse universo juntos!',
                                token, phone_number_id));
                            await axios(request.textMessage(from,
                                'Primeiro vamos estabelecer uma conexão energética. Me fale o seu *nome*.',
                                token, phone_number_id));

                            await axios(request.updateState(from, 1));

                            // await axios(request.interactiveMessage(from, {
                            //     header: `Olá, seja bem vindo ${nome}`,
                            //     body: 'O que gostaria de realizar hoje ?🌌'
                            // }, ['Comprar tokens', 'Jogar'], token, phone_number_id, 1));
                            res.status(200);
                        } catch (err) {
                            console.log("Deu ruim ", err);
                            res.sendStatus(400);
                        };

                        break;
                    case 1:
                        try {
                            await axios(request.updateUser(from, message));
                            await axios(request.textMessage(from,
                                `${message}, feche os olhos por alguns instantes, respire profundamente e concentre-se em sua pergunta. Sinta a energia fluindo entre nós. Agora iremos iniciar a sua primeira consulta.`
                                , token, phone_number_id));
                            await axios(request.textMessage(from,
                                'Escreva sua pergunta para eu poder revelar os caminhos que as cartas mostrarão 🎴Você pode escreve a pergunta da forma que ela vier na sua cabeça, o importante é que faça sentido para você aquilo que deseja saber.'
                                , token, phone_number_id));

                            await axios(request.updateState(from, 2));
                            res.status(200);

                        } catch (err) {
                            console.log('deu ruim ', err);
                            res.sendStatus(400);
                        };
                        break;
                    case 2:
                        try {
                            if (usuario.question === '') {
                                await axios(request.updateQuestion(from, message));
                                if (usuario.tokens >= 3) {
                                    await axios(request.textMessage(from,
                                        'Agora relaxe sua mente e coração, e se pergunte: o que eu posso descobrir sobre essa situação? 🔮',
                                        token, phone_number_id));
                                    await axios(request.mediaMessage(from, 'https://i.imgur.com/q57SM0Z.jpg', token, phone_number_id));
                                    await axios(request.interactiveListMessage(from,
                                        'Eu embaralhei as cartas. Agora quero que você escolha um cristal:',
                                        variables.cristais, token, phone_number_id, 0));
                                    await axios(request.updateState(from, 100));

                                } else {
                                    await axios(request.interactiveMessage(from,
                                        `Você possui *${usuario.tokens}* estrelas. Infelizmente não é possível realizar a consulta. Para adquirir estrelas, clique no botão abaixo.`,
                                        ['Comprar estrelas'], token, phone_number_id));
                                }
                            }

                        } catch (err) {
                            console.log('deu ruim ', err);
                            res.sendStatus(400);
                        };
                        break;
                    case 3:
                        try {
                            await axios(request.updateQuestion(from, message));
                            if (usuario.tokens >= 1) {
                                const cartas = [];
                                for (const i of possibilidades) {
                                    if (usuario.tokens >= i) cartas.push(`${i} ${i === 1 ? 'carta' : 'cartas'}`);
                                }
                                // Faça a sua pergunta
                                await axios(request.interactiveListMessage(from,
                                    `Você possui *${usuario.tokens}* tokens. Escolha a quantidade de cartas que deseja sortear`,
                                    cartas, token, phone_number_id, 4));
                            }
                        } catch (err) {
                            console.log('deu ruim ', err);
                            res.sendStatus(400);
                        }
                        break;
                    default:
                        try {
                            await axios(request.interactiveMessage(from, `Você já está em uma sessão, selecione uma das opções acima ou encerre a sessão.`,
                                ['Encerrar sessão'], token, phone_number_id, 30))
                            res.status(200);
                        } catch (err) {
                            console.log("Deu ruim ", err);
                            res.sendStatus(400);
                        }
                        break;
                }
                // else if (state !== 0) {
                //     try {
                //         await axios(request.interactiveMessage(from, `Você já está em uma sessão, selecione uma das opções acima ou encerre a sessão.`,
                //             ['Encerrar sessão'], token, phone_number_id, 30))
                //         res.status(200);
                //     } catch (err) {
                //         console.log("Deu ruim ", err);
                //         res.sendStatus(400);
                //     }
                // } else {
                //     try {
                //         await axios(request.textMessage(from,
                //             'Saudações, sou Tarorion, seu companheiro nesta jornada de descoberta e autoconhecimento através do Tarot! 🌌',
                //             token, phone_number_id));
                //         await axios(request.textMessage(from,
                //             'Se você chegou até mim, é porque houve um sinal do universo que nos conectou nesta vasta rede. Eu sei que você está em busca de respostas para as suas dúvidas, não é mesmo? Estou aqui para ajudar! 🌟',
                //             token, phone_number_id));
                //         await axios(request.textMessage(from,
                //             'Antes de começarmos, gostaria de explicar como funciona a leitura do Tarot. O Tarot é um sistema simbólico composto por 78 cartas, divididas em Arcanos Maiores e Arcanos Menores. Cada carta possui um significado único e juntas elas representam as diferentes facetas da vida e do autoconhecimento. Ao jogar as cartas, podemos acessar insights e orientações para tomar decisões e compreender melhor os desafios que enfrentamos. Agora, vamos mergulhar nesse universo juntos!',
                //             token, phone_number_id));
                //         await axios(request.textMessage(from,
                //             'Primeiro vamos estabelecer uma conexão energética. Me fale o seu *nome*.',
                //             token, phone_number_id));

                //         await axios(request.updateState(from, 1));

                //         // await axios(request.interactiveMessage(from, {
                //         //     header: `Olá, seja bem vindo ${nome}`,
                //         //     body: 'O que gostaria de realizar hoje ?🌌'
                //         // }, ['Comprar tokens', 'Jogar'], token, phone_number_id, 1));
                //         res.status(200);
                //     } catch (err) {
                //         console.log("Deu ruim ", err);
                //         res.sendStatus(400);
                //     }
                // }

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
                switch (state) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                        try {
                            let cartasSorteadas = await axios(request.sorteioCartas(3));
                            cartasSorteadas = cartasSorteadas.data;
                            for (let i = 0; i < cartasSorteadas.maiores.length; i++) {
                                combinacoes += `${i + 1}ª posição *${variables.posicoes}*` + ' -> ' + cartasSorteadas.maiores[i] + '\n'
                            }
                            await axios(request.textMessage(from, "*Suas cartas são*\n" + combinacoes, token, phone_number_id));
                            await axios(request.textMessage(from,
                                `Agora, deixe-me interpretar o significado das cartas em relação à sua pergunta. Elas revelam caminhos ocultos e possíveis respostas para você 👁️‍🗨️`,
                                token, phone_number_id));
                            const response = await axios(request.completion(usuario.question, cartasSorteadas));
                            if (response.status !== 200) {
                                await axios(request.textMessage(from,
                                    'Ocorreu um erro ao tentar interpretar sua pergunta, tente novamente mais tarde',
                                    token, phone_number_id));
                            } else {
                                await axios(request.textMessage(from,
                                    'Através das cartas, vejo\n' + response.data.result,
                                    token, phone_number_id));
                                await axios(request.textMessage(from,
                                    'Espero que essa mensagem tenha feito sentido para você e te ajude a clarear sua dúvida 💫 Lembre-se de que o futuro é moldado por suas escolhas e intenções. Confie em sua intuição e siga o caminho que ressoa com seu coração. 🔮',
                                    token, phone_number_id));
                                await axios(request.textMessage(from,
                                    '🌟 Se você deseja explorar mais aspectos de sua vida ou fazer outras perguntas, estou aqui para auxiliá-lo. O conhecimento do Tarot é vasto e podemos desvendar juntos muitos segredos ocultos 🔮',
                                    token, phone_number_id));
                                await axios(request.interactiveMessage(from, 'Você quer saber mais alguma coisa?', ['Sim', 'Não'], token, phone_number_id, 0));
                            }
                        } catch (err) {
                            console.log("Deu ruim ", err);
                            res.sendStatus(400);
                        }
                }
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