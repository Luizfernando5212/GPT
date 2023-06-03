require('dotenv').config();
const request = require('./requestBuilder');
const axios = require('axios');

exports.textPath = async (from, state, usuario, body, token, phone_number_id, res) => {
    let message = body.entry[0].changes[0].value.messages[0].text.body;
    let nome = body.entry[0].changes[0].value.contacts[0].profile.name;
    var possibilidades = [1, 2, 3, 4, 5, 6, 8, 10, 20]
    if (state === 3 && usuario.question === '') {
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
    } else if (state !== 0) {
        try {
            await axios(request.interactiveMessage(from, `Você já está em uma sessão, selecione uma das opções acima ou encerre a sessão.`,
                ['Encerrar sessão'], token, phone_number_id, 30))
            res.status(200);
        } catch (err) {
            console.log("Deu ruim ", err);
            res.sendStatus(400);
        }
    } else {
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
    }
}


exports.buttonPath = async (from, state, usuario, body, token, phone_number_id, res) => {
    let message = req.body.entry[0].changes[0].value.messages[0].interactive.button_reply.title;
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
}


exports.listPath = async (from, state, usuario, body, token, phone_number_id, res) => {
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
}