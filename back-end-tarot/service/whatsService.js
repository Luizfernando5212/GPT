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
            body.entry[0].changes[0].value.messages[0].timestamp > Date.now() / 1000 - 100) {
            console.log(body.entry[0].changes[0].value.messages[0].timestamp);
            console.log(Math.round(Date.now() / 1000))
            let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
            // console.log(cheguei)

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
                if (state) {
                    await axios(request.updateState(from, state));
                }
            } catch (err) {
                console.log('Não há estado no momento ')
            }

            try {
                let response = await axios(request.getUser(from));
                // console.log(response)
                if (response.data !== null) {
                    usuario = response.data;
                    state = usuario.state;
                } else {
                    let response = await axios(request.postUser(from, req.body.entry[0].changes[0].value.contacts[0].profile.name, true));
                    state = response.data.status
                    if (response.status === 200) {
                        console.log('Usuário cadastrado ');
                    }
                }
            } catch (err) {
                console.log('Não há usuário para ser cadastrado ', err)
            }

            console.log(JSON.stringify(body));

            if (body.entry[0].changes[0].value.messages[0].text &&
                body.entry[0].changes[0].value.messages[0].text.body /* &&
                body.entry[0].changes[0].value.messages[0].timestamp > Date.now() / 1000 - 10 */) {
                message = body.entry[0].changes[0].value.messages[0].text.body;
                let nome = req.body.entry[0].changes[0].value.contacts[0].profile.name;

                // Caso do usuário fazer a pergunta
                switch (state) {
                    case 0:
                        try {
                            await axios(request.textMessage(from,
                                'Saudações, sou Tarorion, seu companheiro nesta jornada de descoberta e autoconhecimento através do Tarot! 🌌'));
                            await axios(request.textMessage(from,
                                'Se você chegou até mim, é porque houve um sinal do universo que nos conectou nesta vasta rede. Eu sei que você está em busca de respostas para as suas dúvidas, não é mesmo? Estou aqui para ajudar! 🌟',));
                            await axios(request.textMessage(from,
                                'Antes de começarmos, gostaria de explicar como funciona a leitura do Tarot. O Tarot é um sistema simbólico composto por 78 cartas, divididas em Arcanos Maiores e Arcanos Menores. Cada carta possui um significado único e juntas elas representam as diferentes facetas da vida e do autoconhecimento. Ao jogar as cartas, podemos acessar insights e orientações para tomar decisões e compreender melhor os desafios que enfrentamos. Agora, vamos mergulhar nesse universo juntos!'));
                            await axios(request.textMessage(from,
                                'Primeiro vamos estabelecer uma conexão energética. Me fale o seu *nome*.'));

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
                        return;
                        // break;
                    case 1:
                        try {
                            await axios(request.updateUser(from, message, true));
                            await axios(request.textMessage(from,
                                `${message}, feche os olhos por alguns instantes, respire profundamente e concentre-se em sua pergunta. Sinta a energia fluindo entre nós. Agora iremos iniciar a sua primeira consulta.`));
                            await axios(request.textMessage(from,
                                'Escreva sua pergunta para eu poder revelar os caminhos que as cartas mostrarão 🎴Você pode escreve a pergunta da forma que ela vier na sua cabeça, o importante é que faça sentido para você aquilo que deseja saber.'));

                            await axios(request.updateState(from, 2));
                            res.status(200);

                        } catch (err) {
                            console.log('deu ruim ', err);
                            res.sendStatus(400);
                        };
                        return;
                        // break;
                    case 2:
                        try {
                            if (usuario.question === '') {
                                await axios(request.updateQuestion(from, message));
                                if (usuario.tokens >= 3) {
                                    await axios(request.textMessage(from,
                                        'Agora relaxe sua mente e coração, e se pergunte: o que eu posso descobrir sobre essa situação? 🔮'));
                                    await axios(request.mediaMessage(from, 'https://i.imgur.com/q57SM0Z.jpg'));
                                    await axios(request.interactiveListMessage(from,
                                        'Eu embaralhei as cartas. Agora quero que você escolha um cristal:',
                                        variables.cristais, 'Selecione um cristal', 0));
                                    await axios(request.updateState(from, 500));
                                    res.status(200);

                                } else {
                                    await axios(request.interactiveMessage(from,
                                        `Você possui *${usuario.tokens}* estrelas. Infelizmente não é possível realizar a consulta. Para adquirir estrelas, clique no botão abaixo.`,
                                        ['Comprar estrelas']));
                                        res.status(200);
                                }
                            } else {
                                try {
                                    await axios(request.interactiveMessage(from, `Você já está em uma sessão, selecione uma das opções acima ou encerre a sessão.`,
                                        ['Encerrar sessão'], 30))
                                    res.status(200);
                                } catch (err) {
                                    console.log("Deu ruim ", err);
                                    res.sendStatus(400);
                                }
                            }

                        } catch (err) {
                            console.log('deu ruim ', err);
                            res.sendStatus(400);
                        };
                        return;
                        // break;
                    case 3:
                        try {
                            if (usuario.question === '') {
                                await axios(request.interactiveMessage(from, `Você já está em uma sessão, selecione uma das opções acima ou encerre a sessão.`,
                                    ['Encerrar sessão'], 30))
                                res.status(200);

                            } else {
                                await axios(request.interactiveMessage(from, `Você já está em uma sessão, selecione uma das opções acima ou encerre a sessão.`,
                                    ['Encerrar sessão'], 30))
                                res.status(200);
                            }
                            // await axios(request.updateQuestion(from, message));
                            // if (usuario.tokens >= 1) {
                            //     const cartas = [];
                            //     for (const i of possibilidades) {
                            //         if (usuario.tokens >= i) cartas.push(`${i} ${i === 1 ? 'carta' : 'cartas'}`);
                            //     }
                            //     // Faça a sua pergunta
                            //     await axios(request.interactiveListMessage(from,
                            //         `Você possui *${usuario.tokens}* tokens. Escolha a quantidade de cartas que deseja sortear`,
                            //         cartas, 4));
                            // }
                        } catch (err) {
                            console.log('deu ruim ', err);
                            res.sendStatus(400);
                        }
                        // break;
                        return;
                    case 100:
                        try {
                            await axios(request.textMessage(from, `Fico feliz em ser o seu tarólogo e poder te ajudar nessa jornada. Vou te mostrar os jogos que podemos tirar para você.`));
                            await axios(request.mediaMessage(from, 'https://i.imgur.com/xnc1GQf.jpg'));
                            await axios(request.textMessage(from, `💖Espelho do Amor💖 - para relacionamento amoroso: Esse jogo utiliza o poder do espelho para revelar como você se sente em relação à pessoa e como ela se sente em relação a você. Tirarei a carta do futuro e darei um conselho para a relação. São necessárias 7 cartas para essa leitura. Nessa método não faremos perguntas diretas, deixaremos que cada carta em sua devida posição revele a mensagem necessária ✨`,));
                            await axios(request.mediaMessage(from, `https://i.imgur.com/4SmUIKx.jpg`));
                            await axios(request.textMessage(from, `👁️‍🗨️ Método Peladan👁️‍🗨️ - para perguntas objetivas: quando você precisa de uma resposta clara para a sua questão, sabe? Por exemplo, você pode fazer perguntas como: "Qual será o desfecho do meu relacionamento nos próximos três meses?" ou "Vou conseguir um trabalho ainda esse ano?".  Nesse método, utilizamos 5 cartas do Tarot Maior com 5 cartas do Tarot Menor.\nCada carta selecionada possui seu próprio significado e, juntas, elas formam uma mensagem única e personalizada para a sua pergunta. O Método Peladan é uma ferramenta poderosa para explorar situações específicas e obter uma compreensão mais profunda do momento presente e das possibilidades futuras.`,));
                            await axios(request.mediaMessage(from, `https://i.imgur.com/7Ay9csP.jpg`));
                            await axios(request.textMessage(from, '🎴Cruz Celta🎴 – para todos os tipos de perguntas: Ao jogar a Cruz Celta, utilizamos 10 cartas do Tarot Maior. Cada carta possui sua própria mensagem, e juntas elas fornecem um panorama completo e esclarecedor sobre a sua questão. Você pode fazer perguntas gerais, como: "Como será o futuro do meu relacionamento? Ele irá progredir?" ou "O que posso esperar do meu trabalho?". As respostas revelará o caminho e fornecerá previsões sobre os acontecimentos futuros.'));
                            await axios(request.textMessage(from, 'Agora que você sabe mais sobre os métodos de jogos de tarot, nós podemos iniciar uma  consulta👁️‍🗨️',));
                            await axios(request.textMessage(from, 'Para continuarmos, você precisa comprar X estrelas (cada quantidade de estrelas equivalem a X reais. Para cada jogo você precisa de X estrelas – especificar.)',));
                            await axios(request.interactiveMessage(from, `*Link de compra*\n` +
                                'Entre no link abaixo para realizar a compra, após a compra você receberá uma mensagem de confirmação e poderá iniciar a consulta.\n'+
                                'https://buy.stripe.com/test_cN2bKD3dibja1os000'
                            , ['Jogar'], 3))
                            res.status(200);
                            // await axios(request.updateState(from, 3));
                        } catch (err) {
                            console.log('deu ruim ', err);
                            res.sendStatus(400);
                        }
                        return;
                        // break;
                    case 101:
                        try {
                            await axios(request.updateQuestion(from, message));
                            await axios(request.textMessage(from, `Agora relaxe sua mente e coração, e se pergunte: o que eu posso descobrir sobre essa relação ? 🔮`));
                            await axios(request.mediaMessage(from, 'https://i.imgur.com/q57SM0Z.jpg'));
                            await axios(request.interactiveListMessage(from,
                                'Eu embaralhei as cartas. Agora quero que você escolha um cristal:',
                                variables.cristais, 'Selecione um cristal', 200));
                            await axios(request.updateState(from, 500));
                            res.status(200);
                        } catch (err) {
                            console.log('deu ruim ', err);
                            res.sendStatus(400);
                        };
                        return;
                        // break;
                    case 102:
                        try {
                            await axios(request.updateQuestion(from, message));
                            await axios(request.textMessage(from, `Ótimo! Agora, vou embaralhar as cartas para criar um vínculo energético com a sua pergunta. 🌌✨`));
                            await axios(request.textMessage(from, `Quando estiver pronto, me avise para que eu possa tirar as cartas.`));
                            await axios(request.mediaMessage(from, 'https://i.imgur.com/q57SM0Z.jpg'));
                            await axios(request.interactiveListMessage(from,
                                'Eu embaralhei as cartas. Agora quero que você escolha um cristal:',
                                variables.cristais, 'Selecione um cristal', 300));
                            await axios(request.updateState(from, 500));
                            res.status(200);
                        } catch (err) {
                            console.log('deu ruim ', err);
                            res.sendStatus(400);
                        };
                        return;
                        // break;
                    case 103:
                        try {
                            await axios(request.updateQuestion(from, message));
                            await axios(request.textMessage(from, 'Agora firme sua intenção em sua pergunta e escolha uma das opções abaixo:'));
                            await axios(request.mediaMessage(from, 'https://i.imgur.com/q57SM0Z.jpg'));
                            await axios(request.interactiveListMessage(from,
                                'Eu embaralhei as cartas. Agora quero que você escolha um cristal:',
                                variables.cristais, 'Selecione um cristal', 400));
                            await axios(request.updateState(from, 500));
                            res.status(200);
                        } catch (err) {
                            console.log('deu ruim ', err);
                            res.sendStatus(400);
                        };
                        return;
                        // break;
                    default:
                        try {
                            await axios(request.interactiveMessage(from, `Você já está em uma sessão, selecione uma das opções acima ou encerre a sessão.`,
                                ['Encerrar sessão'], 30))
                            res.status(200);
                        } catch (err) {
                            console.log("Deu ruim ", err);
                            res.sendStatus(400);
                        }
                        return;
                        // break;
                }
                // else if (state !== 0) {
                //     try {
                //         await axios(request.interactiveMessage(from, `Você já está em uma sessão, selecione uma das opções acima ou encerre a sessão.`,
                //             ['Encerrar sessão'], 30))
                //         res.status(200);
                //     } catch (err) {
                //         console.log("Deu ruim ", err);
                //         res.sendStatus(400);
                //     }
                // } else {
                //     try {
                //         await axios(request.textMessage(from,
                //             'Saudações, sou Tarorion, seu companheiro nesta jornada de descoberta e autoconhecimento através do Tarot! 🌌'));
                //         await axios(request.textMessage(from,
                //             'Se você chegou até mim, é porque houve um sinal do universo que nos conectou nesta vasta rede. Eu sei que você está em busca de respostas para as suas dúvidas, não é mesmo? Estou aqui para ajudar! 🌟'));
                //         await axios(request.textMessage(from,
                //             'Antes de começarmos, gostaria de explicar como funciona a leitura do Tarot. O Tarot é um sistema simbólico composto por 78 cartas, divididas em Arcanos Maiores e Arcanos Menores. Cada carta possui um significado único e juntas elas representam as diferentes facetas da vida e do autoconhecimento. Ao jogar as cartas, podemos acessar insights e orientações para tomar decisões e compreender melhor os desafios que enfrentamos. Agora, vamos mergulhar nesse universo juntos!'));
                //         await axios(request.textMessage(from,
                //             'Primeiro vamos estabelecer uma conexão energética. Me fale o seu *nome*.'));

                //         await axios(request.updateState(from, 1));

                //         // await axios(request.interactiveMessage(from, {
                //         //     header: `Olá, seja bem vindo ${nome}`,
                //         //     body: 'O que gostaria de realizar hoje ?🌌'
                //         // }, ['Comprar tokens', 'Jogar'], 1));
                //         res.status(200);
                //     } catch (err) {
                //         console.log("Deu ruim ", err);
                //         res.sendStatus(400);
                //     }
                // }

            } else if (body.entry[0].changes[0].value.messages[0].interactive &&
                body.entry[0].changes[0].value.messages[0].interactive.button_reply &&
                body.entry[0].changes[0].value.messages[0].interactive.button_reply.id /* &&
                body.entry[0].changes[0].value.messages[0].timestamp > Date.now() / 1000 - 5 */) {
                message = req.body.entry[0].changes[0].value.messages[0].interactive.button_reply.title;
                switch (state) {
                    case 0:
                        await axios(request.textMessage(from,
                            'Fico feliz em ser o seu tarólogo e poder te ajudar nessa jornada. Envie uma mensagem qualquer que te mostro os jogos que podemos tirar para você.'));
                        await axios(request.updateState(from, 100));
                        res.status(200);
                        return;
                        // break;
                    case 1:
                        try {
                            await axios(request.textMessage(from,
                                '🌟 Antes de encerrarmos, gostaria de compartilhar uma curiosidade: durante uma consulta presencial, as cartas são embaralhadas e escolhidas aleatoriamente. Da mesma forma, ao sortear suas cartas virtualmente, seguimos esse princípio de aleatoriedade. \nAo escrever suas perguntas, você está direcionando sua energia e intenção para a leitura. Essa energia é captada pelo tarô,  permitindo que as respostas e insights se manifestem de forma autêntica. A leitura das cartas do tarot se conecta ao nosso destino e nos guia nas respostas que buscamos. Se você tiver mais perguntas ou quiser uma nova consulta, estou aqui para ajudar. 🌟 É só me mandar um Oi que venho te aconselhar!'));
                            await axios(request.updateState(from, 100));
                            res.status(200);
                        } catch (err) {
                            console.log('deu ruim ', err);
                            res.sendStatus(400);
                        }
                        return;
                        // break;
                    case 3: 
                        try {
                            let response = await axios(request.getUser(from));
                            let botoes = []

                            let teste = false;
                            for (let metodo in variables.metodos) {
                                if (response.data.tokens >= variables.metodos[metodo]) {
                                    botoes.push(metodo);
                                    teste = true
                                }
                            }

                            if (teste) {
                                await axios(request.interactiveListMessage(from, 'Qual consulta você deseja realizar agora ?', botoes, 'Consultas', 100));
                                res.status(200);
                            } else {
                                await axios(request.textMessage(from, 'Você não possui estrelas suficientes para realizar uma consulta, compre mais estrelas para realizar uma consulta'));
                                res.status(200);
                            }

                        } catch (err) {
                            console.log('deu ruim ', err);
                            res.sendStatus(400);
                        }
                        return;
                        // break;
                }
                if (state === 30) {
                    try {
                        await axios(request.updateState(from, 0));
                        await axios(request.updateQuestion(from, ''));
                        await axios(request.textMessage(from, `Sessão encerrada com sucesso, envie uma nova menssagem`));
                        res.status(200);
                    } catch (err) {
                        console.log("Deu ruim ", err);
                        res.sendStatus(400);
                    }
                    return;
                }
                // try {
                //     await axios(request.textMessage(from, `Iremos te encaminhar para ${message}`))
                //     if (state == 1) {
                //         await axios(request.fullMessage(from, {
                //             header: `Link de compra`,
                //             body: 'Entre no link abaixo para realizar a compra, após a compra você receberá um código para utilizar no jogo',
                //             footer: 'www.google.com.br'
                //         }))
                //     } else if (state == 2) {
                //         if (usuario.tokens >= 1) {
                //             await axios(request.textMessage(from, `Escreva *agora* a pergunta que gostaria de ser respondida.`))
                //             await axios(request.updateState(from, 3));
                //         } else {
                //             await axios(request.textMessage(from, `Você não possui estrelas suficientes`))
                //         }
                //     }
                //     res.sendStatus(200);
                // } catch (err) {
                //     console.log("Deu ruim ", err);a
                //     res.sendStatus(400);
                // }
            } else if (body.entry[0].changes[0].value.messages[0].interactive &&
                body.entry[0].changes[0].value.messages[0].interactive.list_reply &&
                body.entry[0].changes[0].value.messages[0].interactive.list_reply.id &&
                body.entry[0].changes[0].value.messages[0].timestamp > Date.now() / 1000 - 5) {
                message = req.body.entry[0].changes[0].value.messages[0].interactive.list_reply.title;
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
                                combinacoes += `${i + 1}ª posição *${variables.posicoes[i]}*` + ' -> ' + cartasSorteadas.maiores[i] + '\n'
                            }
                            await axios(request.textMessage(from, "*Suas cartas são*\n" + combinacoes));
                            await axios(request.mediaMessage(from, `https://i.imgur.com/imYdWbd.jpg`));
                            await axios(request.textMessage(from,
                                `Agora, deixe-me interpretar o significado das cartas em relação à sua pergunta. Elas revelam caminhos ocultos e possíveis respostas para você 👁️‍🗨️`));
                            const response = await axios(request.completion(usuario.question, cartasSorteadas, combinacoes));
                            if (response.status !== 200) {
                                await axios(request.textMessage(from,
                                    'Ocorreu um erro ao tentar interpretar sua pergunta, tente novamente mais tarde'));
                                // await axios(request.textMessage(from, 'Você quer saber mais alguma coisa?', ['Sim', 'Não'], 0))
                                await axios(request.updateState(from, 0));
                                await axios(request.updateQuestion(from, ''));
                                res.status(200);
                            } else {
                                await axios(request.textMessage(from, response.data.result));
                                await axios(request.textMessage(from,
                                    'Espero que essa mensagem tenha feito sentido para você e te ajude a clarear sua dúvida 💫 Lembre-se de que o futuro é moldado por suas escolhas e intenções. Confie em sua intuição e siga o caminho que ressoa com seu coração. 🔮'));
                                await axios(request.textMessage(from,
                                    '🌟 Se você deseja explorar mais aspectos de sua vida ou fazer outras perguntas, estou aqui para auxiliá-lo. O conhecimento do Tarot é vasto e podemos desvendar juntos muitos segredos ocultos 🔮'));
                                await axios(request.updateTokens(from, -3));
                                await axios(request.interactiveMessage(from, 'Você quer saber mais alguma coisa?', ['Sim', 'Não'], 0));
                                await axios(request.updateQuestion(from, ''));
                                res.status(200);
                            }
                        } catch (err) {
                            console.log("Deu ruim ", err);
                            res.sendStatus(400);
                        }
                        return;
                        // break;
                    case 10:
                        try {
                            let response = await axios(request.getUser(from));
                            let botoes = []
                            let teste = false;
                            for (let metodo in variables.metodos) {
                                if (response.data.tokens >= variables.metodos[metodo]) {
                                    botoes.push(metodo);
                                    teste = true
                                }
                            }

                            if (teste) {
                                await axios(request.interactiveListMessage(from, 'Qual consulta você deseja realizar agora ?', botoes, 'Consultas', 100));
                                res.status(200);
                            } else {
                                await axios(request.textMessage(from, 'Você não possui estrelas suficientes para realizar uma consulta, compre mais estrelas para realizar uma consulta'));
                                res.status(200);
                            }
                            
                            
                        } catch (err) {
                            console.log('deu ruim ', err);
                            res.sendStatus(400);
                        }
                        return;
                        // break;
                    case 100:
                    case 101:
                    case 102:
                        try {
                            if (message === variables.metodos2[0]) {
                                await axios(request.textMessage(from, 'Você escolheu o Espelho do Amor. Serão tiradas 7 cartas para essa leitura. Cada carta em sua posição revelará uma mensagem valiosa sobre o seu relacionamento. Vamos iniciar? 💖'));
                                await axios(request.mediaMessage(from, `https://i.imgur.com/xnc1GQf.jpg`));
                                await axios(request.textMessage(from, 'Feche os olhos por um momento, respire profundamente e concentre-se na sua relação. Agora, *escreva o nome da pessoa pela qual você está apaixonado(a) ou em um relacionamento amoroso*. Isso nos ajudará a criar a conexão necessária para a leitura 💕'));
                                await axios(request.updateState(from, 101));
                                res.status(200);
                            } else if (message === variables.metodos2[1]) {
                                await axios(request.textMessage(from, '🎴 Cruz Celta 🎴 - para todos os tipos de perguntas. Com a Cruz Celta, utilizaremos 10 cartas do Tarot Maior para fornecer um panorama completo e esclarecedor sobre a sua questão. Você pode fazer perguntas gerais, como: "Como será o futuro do meu relacionamento? Ele irá progredir?" ou "O que posso esperar do meu trabalho?". As respostas revelarão o caminho e fornecerão previsões sobre os acontecimentos futuros. Vamos começar? 💫'));
                                await axios(request.mediaMessage(from, 'https://i.imgur.com/7Ay9csP.jpg'));
                                await axios(request.textMessage(from, 'Feche os olhos por um momento, respire fundo e concentre-se na sua pergunta. Agora, *escreva-a aqui* para que eu possa focar minha energia e intuição nesse objetivo. ✍️🔮'));
                                await axios(request.updateState(from, 102));
                                res.status(200);
                            } else if (message === variables.metodos2[2]) {
                                await axios(request.textMessage(from, '👁️‍🗨️ Método Peladan 👁️‍🗨️ - para perguntas objetivas. Este método é ideal quando você precisa de uma resposta clara e direta para a sua pergunta. Utilizaremos 5 cartas do Tarot Maior e 5 cartas do Tarot Menor para fornecer uma compreensão mais profunda do momento presente e das possibilidades futuras.'));
                                await axios(request.mediaMessage(from, `https://i.imgur.com/4SmUIKx.jpg`));
                                await axios(request.textMessage(from, 'Nesse jogo utilizaremos o baralho completo do Tarot, seguindo o método Europeu de embaralhar. Os Arcanos Maiores oferecerão uma visão ampla e simbólica, enquanto os Arcanos Menores fornecerão detalhes específicos e práticos. Ambos desempenham papéis fundamentais na interpretação do Tarot, Vamos Começar? 💫'));
                                await axios(request.textMessage(from, 'Pense em uma pergunta objetiva que você gostaria de fazer. Pode ser algo como: "Qual será o desfecho do meu relacionamento nos próximos três meses?" ou "Vou conseguir um trabalho ainda este ano?". *Escreva a sua pergunta para prosseguirmos*.'));
                                await axios(request.updateState(from, 103));
                                res.status(200);
                            }
                        } catch (err) {
                            console.log('deu ruim ', err);
                            res.sendStatus(400);
                        }
                        return;
                        // break;
                    case 200:
                    case 201:
                    case 202:
                    case 203:
                        try {

                            let cartasSorteadas = await axios(request.sorteioCartas(7));
                            cartasSorteadas = cartasSorteadas.data;
                            combinacoes = variables.espelho(cartasSorteadas.maiores);
                            // await axios(request.mediaMessage(from, `https://i.imgur.com/xnc1GQf.jpg`));
                            await axios(request.textMessage(from, "*Suas cartas são*\n" + combinacoes));
                            const response = await axios(request.completion(usuario.question, cartasSorteadas, combinacoes));
                            if (response.status !== 200) {
                                await axios(request.textMessage(from,
                                    'Ocorreu um erro ao tentar interpretar sua pergunta, tente novamente mais tarde'));
                                // await axios(request.textMessage(from, 'Você quer saber mais alguma coisa?', ['Sim', 'Não'], 0))
                                await axios(request.updateState(from, 0));
                                await axios(request.updateQuestion(from, ''));
                                res.status(200);
                            } else {
                                await axios(request.textMessage(from, response.data.result));
                                await axios(request.textMessage(from,
                                    'Lembre-se de que o caminho do amor requer compreensão, comunicação e autenticidade.'));
                                await axios(request.textMessage(from,
                                    'Espero que essa leitura tenha fornecido insights valiosos sobre o seu relacionamento amoroso. Se você tiver mais perguntas ou quiser explorar outros aspectos da sua vida, estou aqui para ajudar. 🔮'));
                                await axios(request.updateTokens(from, -7));
                                await axios(request.interactiveMessage(from, 'Você quer saber mais alguma coisa?', ['Sim', 'Não'], 0));
                                await axios(request.updateQuestion(from, ''));
                                res.status(200);
                            }
                            // let cartasSorteadas = await axios(request.sorteioCartas(7));
                            // cartasSorteadas = cartasSorteadas.data;
                            // for (let i = 0; i < cartasSorteadas.maiores.length; i++) {
                            //     combinacoes += `${i + 1}ª posição *${variables.posicoes[i]}*` + ' -> ' + cartasSorteadas.maiores[i] + '\n'
                            // }
                            // await axios(request.textMessage(from, "*Suas cartas são*\n" + combinacoes));
                            // await axios(request.mediaMessage(from, `https://i.imgur.com/imYdWbd.jpg`));
                            // await axios(request.textMessage(from,
                            //     `Agora, deixe-me interpretar o significado das cartas em relação à sua pergunta. Elas revelam caminhos ocultos e possíveis respostas para você 👁️‍🗨️`));
                            // const response = await axios(request.completion(usuario.question, cartasSorteadas, combinacoes));
                            // if (response.status !== 200) {
                            //     await axios(request.textMessage(from,
                            //         'Ocorreu um erro ao tentar interpretar sua pergunta, tente novamente mais tarde'));
                            //     // await axios(request.textMessage(from, 'Você quer saber mais alguma coisa?', ['Sim', 'Não'], 0))
                            //     await axios(request.updateState(from, 0));
                            //     await axios(request.updateQuestion(from, ''));
                            // } else {
                            //     await axios(request.textMessage(from, response.data.result));
                            //     await axios(request.textMessage(from,
                            //         'Espero que essa mensagem tenha feito sentido para você e te ajude a clarear sua dúvida 💫 Lembre-se de que o futuro é moldado por suas escolhas e intenções. Confie em sua intuição e siga o caminho que ressoa com seu coração. 🔮'));
                            //     await axios(request.textMessage(from,
                            //         '🌟 Se você deseja explorar mais aspectos de sua vida ou fazer outras perguntas, estou aqui para auxiliá-lo. O conhecimento do Tarot é vasto e podemos desvendar juntos muitos segredos ocultos 🔮'));
                            //     await axios(request.updateTokens(from, -7));
                            //     await axios(request.interactiveMessage(from, 'Você quer saber mais alguma coisa?', ['Sim', 'Não'], 0));
                            //     await axios(request.updateQuestion(from, ''));
                            // }
                        } catch (err) {
                            console.log('deu ruim ', err);
                            res.sendStatus(400);
                        };
                        return;
                        // break;
                    case 300:
                    case 301:
                    case 302:
                    case 303:
                        try {
                            let cartasSorteadas = await axios(request.sorteioCartas(11));
                            cartasSorteadas = cartasSorteadas.data;
                            await axios(request.textMessage(from, "Perfeito! Agora, vamos iniciar a leitura das cartas. 🔍"));
                            for (let i = 0; i < cartasSorteadas.maiores.length; i++) {
                                combinacoes += `${i + 1}ª posição ` + ' -> ' + cartasSorteadas.maiores[i] + '\n'
                            }
                            await axios(request.textMessage(from, '*Suas cartas sorteadas são*\n' + combinacoes));
                            await axios(request.textMessage(from, 'Com base nas cartas reveladas na Cruz Celta, posso lhe fornecer insights valiosos sobre a sua questão. 🎴💫'));
                            const response = await axios(request.completion(usuario.question, cartasSorteadas, combinacoes));
                            if (response.status !== 200) {
                                await axios(request.textMessage(from,
                                    'Ocorreu um erro ao tentar interpretar sua pergunta, tente novamente mais tarde'));
                                // await axios(request.textMessage(from, 'Você quer saber mais alguma coisa?', ['Sim', 'Não'], 0))
                                await axios(request.updateState(from, 0));
                                await axios(request.updateQuestion(from, ''));
                                res.status(200);
                            } else {
                                await axios(request.textMessage(from, response.data.result));
                                await axios(request.textMessage(from,
                                    'Espero que essa mensagem tenha feito sentido para você e te ajude a clarear sua dúvida 💫 Lembre-se de que o futuro é moldado por suas escolhas e intenções. Confie em sua intuição e siga o caminho que ressoa com seu coração. 🔮'));
                                await axios(request.textMessage(from,
                                    '🌟 Se você deseja explorar mais aspectos de sua vida ou fazer outras perguntas, estou aqui para auxiliá-lo. O conhecimento do Tarot é vasto e podemos desvendar juntos muitos segredos ocultos 🔮'));
                                await axios(request.updateTokens(from, -10));
                                await axios(request.interactiveMessage(from, 'Você quer saber mais alguma coisa?', ['Sim', 'Não'], 0));
                                await axios(request.updateQuestion(from, ''));
                                res.status(200);
                            }

                        } catch (err) {
                            console.log('deu ruim ', err);
                            res.sendStatus(400);
                        };
                        return;
                        // break;
                    case 400:
                    case 401:
                    case 402:
                    case 403:   
                        try {
                            let cartasSorteadas = await axios(request.sorteioCartas(10));
                            cartasSorteadas = cartasSorteadas.data;
                            await axios(request.textMessage(from, "Perfeito! Agora, vamos iniciar a leitura das cartas. 🔍"));
                            for (let i = 0; i < cartasSorteadas.maiores.length; i++) {
                                combinacoes += `${i + 1}ª posição ` + ' -> ' + cartasSorteadas.maiores[i] + '\n'
                            }
                            await axios(request.textMessage(from, 'Agora vou revelar suas cartas dos Arcanos Maiores, que são os arcanos principais e trazem uma visão ampla e simbólica da situação. \n' + combinacoes));
                            combinacoes = '';
                            for (let i = 0; i < cartasSorteadas.menores.length; i++) {
                                combinacoes += `${i + 1}ª posição ` + ' -> ' + cartasSorteadas.menores[i] + '\n'
                            }
                            await axios(request.textMessage(from, 'agora vou te mostrar o caminho através dos Arcanos Menores. São eles que apontam a tendência da situação, mostrando os detalhes mais específicos e práticos.\n' + combinacoes));
                            const response = await axios(request.completion(usuario.question, cartasSorteadas));
                            if (response.status !== 200) {
                                await axios(request.textMessage(from,
                                    'Ocorreu um erro ao tentar interpretar sua pergunta, tente novamente mais tarde'));
                                // await axios(request.textMessage(from, 'Você quer saber mais alguma coisa?', ['Sim', 'Não'], 0))
                                await axios(request.updateState(from, 0));
                                await axios(request.updateQuestion(from, ''));
                                res.status(200);
                            } else {
                                await axios(request.textMessage(from, response.data.result));
                                await axios(request.textMessage(from,
                                    'Espero que essa leitura tenha trazido clareza à sua pergunta objetiva. Se você tiver mais dúvidas ou quiser explorar outros aspectos da sua vida, estou aqui para ajudar. 🔮'));
                                await axios(request.textMessage(from,
                                    '🌟 Se você deseja explorar mais aspectos de sua vida ou fazer outras perguntas, estou aqui para auxiliá-lo. O conhecimento do Tarot é vasto e podemos desvendar juntos muitos segredos ocultos 🔮'));
                                await axios(request.updateTokens(from, -10));
                                await axios(request.interactiveMessage(from, 'Você quer saber mais alguma coisa?', ['Sim', 'Não'], 0));
                                await axios(request.updateQuestion(from, ''));
                                res.status(200);
                            }
                        } catch (err) {
                            console.log('deu ruim ', err);
                            res.sendStatus(400);
                        };
                        return;
                        // break;
                }
                // try {
                //     if (state >= 4 && state <= 12) {
                //         let cartasSorteadas = await axios(request.sorteioCartas(possibilidades[state - 4]));
                //         cartasSorteadas = cartasSorteadas.data;
                //         if (cartasSorteadas.menores) {
                //             for (let i = 0; i < cartasSorteadas.menores.length; i++) {
                //                 combinacoes += `${i + 1}ª combinação` + ' -> ' + cartasSorteadas.maiores[i] +
                //                     ' e ' + cartasSorteadas.menores[i] + '\n'
                //             }
                //             await axios(request.textMessage(from, "*Suas cartas são*\n" +
                //                 combinacoes + "\n```Sua pergunta será respondida em alguns momentos!!```"));
                //             const response = await axios(request.completion(usuario.question, cartasSorteadas));
                //             if (response.status !== 200) {
                //                 await axios(request.textMessage(from, `Não foi possível responder sua pergunta, tente novamente mais tarde`));
                //             } else {
                //                 await axios(request.textMessage(from, response.data.result));
                //                 await axios(request.textMessage(from, 'Obrigado por utilizar o nosso serviço'));
                //                 await axios(request.updateState(from, 0));
                //                 await axios(request.updateQuestion(from, ''));
                //                 await axios(request.updateTokens(from, usuario.tokens - state + 4));
                //             }
                //             // let response = await axios(request.interactiveMessage(from))
                //         } else {
                //             for (let i = 0; i < cartasSorteadas.maiores.length; i++) {
                //                 combinacoes += `${i + 1}ª carta` + ' -> ' + cartasSorteadas.maiores[i] + '\n'
                //             }
                //             await axios(request.textMessage(from, "*Suas cartas são*\n" +
                //                 combinacoes + "\n```Sua pergunta será respondida em alguns momentos!!```"));
                //             const response = await axios(request.completion(usuario.question, cartasSorteadas));
                //             if (response.status !== 200) {
                //                 await axios(request.textMessage(from, `Não foi possível responder sua pergunta, tente novamente mais tarde`));
                //             } else {
                //                 await axios(request.textMessage(from, response.data.result));
                //                 await axios(request.textMessage(from, 'Obrigado por utilizar o nosso serviço'));
                //                 await axios(request.updateState(from, 0));
                //                 await axios(request.updateQuestion(from, ''));
                //             }
                //         }
                //     }
                // } catch (err) {
                //     console.log("Deu ruim ", err);
                //     res.sendStatus(400);
                // }
            } // extract the message text from the webhook payload
        }
    } else {
        // Return a '404 Not Found' if event is not from a WhatsApp API
        res.sendStatus(404);
    }
    return;
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