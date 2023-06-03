exports.textPath = async (from, state, usuario, token, phone_number_id) => {
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


exports.buttonPath = (state, usuario, token, phone_number_id) => {
}


exports.listPath = (state, usuario, token, phone_number_id) => {
}