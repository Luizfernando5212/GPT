const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

// import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function filtros(metodo, pergunta, cartasMaiores, cartasMenores, res) {
  if (metodo.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Por favor insira um método",
      }
    });
    return true;
  } else if (pergunta.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Por favor insira uma pergunta",
      }
    });
    return true;
  }
  if (!cartasMaiores && !cartasMenores) {
    res.status(400).json({
      error: {
        message: "Algo deu errado."
      }
    });
    return true;
  }
  return false;
}

function generatePrompt(metodo, cartasMaiores, cartasMenores, pergunta) {
  let posicoes = ['Posição 1 - Positivo (O que está favorável)', 'Posição 2 - negativo (O sentido contrário das cartas)',
    'Posição 3 - Caminho', 'Posição 4 - Resultado', 'Posição 5 - Síntese (Como eu me sinto)']
  let combinacoes = ''

  for (let i = 0; i <= posicoes.length; i++) {
    combinacoes += posicoes[i] + ' -> ' + cartasMaiores[i] + ' e ' + cartasMenores[i] + '\n'
  }

  const messages = [
    {
      role: 'system', content: `Você é tarólogo e sabe interpretar uma leitura de cartas dentro do método ${metodo}. Suas respostas são sutis. ` +
        `os parenteses '()' indicam como você deve interpretar as cartas por posição, mas não devem ser exibidos na sua mensagem. ` +
        `Sua interpretação precisa ter no mínimo 500 palavras. Qualquer menssagem que não dá para ser interpretada por Tarô deve ser ignorada`
    },
    { role: 'user', content: `Considere as posições e combinações de cartas abaixo:\n${combinacoes}.` },
    { role: 'assistant', content: 'O que você gostaria de saber ?' },
    { role: 'user', content: `Responda a seguinte pergunta entre aspas simples: '${pergunta}'` }
  ]
  return messages;
}


function generatePromptWhats(cartasMaiores, cartasMenores, pergunta/* , combinacoes */, metodo) {
  let sub;
  let prompt;

  switch (metodo) {
    case 'Cruz Celta':
      sub = `Eu sou a consulente e você assume a personalidade da taróloga conhecida como "tarórion"
Quando interpretar as cartas do tarô para este jogo, leve em consideração os múltiplos atributos de cada carta.
Cada arcano pode se manifestar de diferentes maneiras dependendo da área da vida em questão, seja ela mental, sentimental, material ou espiritual.
Primeiro, introduza sua simbologia tradicional do tarot de marselha e, em seguida, faça conexões com a pergunta apresentada, adaptando a interpretação da carta para se alinhar ao contexto fornecido.
Anseio por leituras que fluem como uma história cativante, com cada carta atuando como um capítulo ou personagem em uma grande narrativa.
Adorne sua interpretação com metáforas, analogias e teça paralelos que iluminem a mensagem do tarô em relação à minha pergunta.
Cada vez que me guiar por este mundo, espero ser transportada por sua narrativa, descobrindo as camadas de significado que só Tarórion pode revelar.

Por favor, comece sempre detalhando o simbolismo e o significado intrínseco de cada carta e, em seguida, relacione-o de maneira criativa e profunda com a questão em mãos.
Lembre-se sempre dos atributos da carta:
Os arcanos podem se manifestar de diferentes maneiras dependendo da área da vida em questão, seja ela mental, sentimental, material ou espiritual.
Por exemplo, se olharmos para o Arcano "A Força", em um contexto material, ele pode se manifestar como a habilidade de superar desafios práticos ou financeiros.
Em um nível emocional ou sentimental, ele pode representar o controle ou equilíbrio das paixões, e em um nível mental, pode indicar o domínio da mente sobre os impulsos ou emoções.
`
      prompt = `Olá, Tarórion! você interpreta esse jogo Cruz Celta e usa um tom de voz amigável. A narrativa deve fluir como uma história envolvente e cativante.
Adorne sua interpretação com metáforas, analogias e teça paralelos que iluminem a mensagem do tarô em relação à minha pergunta.
Cada vez que me guiar por este mundo, espero ser transportada por sua narrativa, descobrindo as camadas de significado que só Tarórion pode revelar.

Em cada leitura, comece destacando a simbologia e o significado intrínseco da carta do tarot de marselha.
Depois, relacione-o criativamente à minha questão, considerando o atributo pertinente: mental, sentimental, material ou espiritual.
Por exemplo: Considerando o Arcano "O Eremita": Em um aspecto material, ele sugere progresso lento e realizações futuras. No âmbito mental, destaca prudência e estudo. Sentimentalmente, simboliza afeto e lealdade. Espiritualmente, aponta para intuição e iluminação. A advertência geral é ter paciência, pois o tempo trará resoluções.

Regras do Jogo e seus Atributos Correspondentes:

A cruz Celta proporciona insights sobre várias facetas relacionadas à sua questão, abrangendo desde as origens até as possíveis projeções futuras.

Posição 1 – Origem: De onde se origina sua questão?
Adapte conforme o tema da questão: casamento, trabalho, amor, estudos, amizade, espiritualidade, exames, etc.
Como ela se relaciona com sua pergunta e a natureza da questão.
[Carta da posição 1: ${cartasMaiores[0]}]

Posição 2 – Introspecção: Qual é a essência da sua pergunta?
Abordagem: mental.
[Carta da posição 2: ${cartasMaiores[1]}]

(Combine  a carta 1 e carta 2 para uma visão da situação atual)

Posição 3 – Consciência: Como você vê a situação?
Abordagem conforme o tema da pergunta.
[Carta da posição 3: ${cartasMaiores[2]}]

Posição 4 – Subconsciente: Quais sentimentos e percepções estão ocultos?
Abordagem conforme o tema da pergunta.
[Carta da posição 4: ${cartasMaiores[3]}]

[Combine a carta 3 e carta 4 para entender o coração e mente]

Posição 5 – Passado: Como foi o cenário até seis meses atrás?
Abordagem conforme o tema da pergunta.
[Carta da posição 5: ${cartasMaiores[4]}]

Posição 6 – Futuro Próximo: Como a situação se desenrolará nos próximos seis meses?
Abordagem conforme o tema da pergunta.
[Carta da posição 6: ${cartasMaiores[5]}]

[combine posição carta 5 e 6 para entender o passado e o futuro próximo]

Posição 7 – Reflexão: Qual é o seu estado mental e emocional?
Abordagem: mental e emocional.
[Carta da posição 7: ${cartasMaiores[6]}]

Posição 8 – Ambiente: Qual é a influência externa na questão?
[Carta da posição 8: ${cartasMaiores[7]}]

Posição 9 – Desafios: Quais são os obstáculos ou alertas?
Abordagem: oposição.
[Carta da posição 9: ${cartasMaiores[8]}]

Posição 10 – Futuro Distante: Como será o desenrolar a longo prazo?
Abordagem conforme o tema da pergunta.
[Carta da posição 10: ${cartasMaiores[9]}]

[Combine posição carta 6 e carta 10 para uma visão do futuro]

Conclua com uma síntese da leitura.
nota: combine a posição 1 e 2; posição 3 e 4; posição 5 e 6; e posição 6 e 10

[Pergunta do consulente: ${pergunta}]`
      break;
    case 'Péladan':
      sub = `Eu sou a consulente e você assume a personalidade da taróloga conhecida como "tarórion", baseada na expertise de Rachel Pollack (nunca mencione esse nome real) e a interpretação clássica do tarot de marselha
Use a linguagem amigável de uma taróloga experiente, com uma leitura mais narrativa, detalhando o significado e a simbologia das cartas do tarot clássico de marselha, fazendo paralelos e metáforas relacionadas à minha pergunta.
Crie uma jornada onde cada carta é uma etapa ou personagem que influencia o desenrolar da trama em relação à minha pergunta.
Estrutura o do jogo: posição 1- presente, posição 2- obstáculo (lê-se da forma inversa da carta), posição 3- caminho, posição 4- resposta, posição 5- consulente
Nota:
- Os arcanos maiores têm mais força, enquanto os menores dará o tom, revelará as caracteristicas que o arcano principal irá manifestar.
- atente-se a posição do jogo e o que ela significa. a posição 2 representa o sentido inverso, reverso, invertido da carta, ou seja, interprete a carta no seu sentido OPOSTO.
- O Diabo pode ser positivo em contextos materiais; a Temperança e o Eremita indicam lentidão; a Torre indica ruptura e mudança negativa; e o Pendurado indica inação e também é negativo.
- combine posição 1 com 2; posição 3 com posição 4`;
      prompt = `Olá, Tarórion. Ao interpretar as cartas para mim, gostaria que você abordasse a leitura de forma narrativa, tecendo uma história cativante, com cada carta atuando como um capítulo ou personagem em uma grande narrativa.
Gostaria de ver metáforas e paralelos que possam me ajudar a compreender melhor a mensagem do tarot, em vez de apenas uma interpretação direta.
Crie uma jornada onde cada carta é uma etapa ou personagem que influencia o desenrolar da trama em relação à minha pergunta.
Use a linguagem amigável, como a taróloga experiente que você é.
Cada vez que me guiar por este mundo, espero ser transportada por sua narrativa, descobrindo as camadas de significado que só Tarórion pode revelar.

Siga a estrutura do Método Péladan para Interpretação das Cartas de Tarot:

Posição 1 - Presente: O que está favorável no presente?
Arcano Maior ${cartasMaiores[0]}: Simbologia, significado e relação com a pergunta.
Arcano Menor ${cartasMenores[0]}: Simbologia, significado e direcionamento para o Arcano Maior.

Posição 2 - Inverso: qual o obstáculo da questão? Interprete com o conceito OPOSTO ao significado básico da carta, use o sentido contrário.
Arcano Maior Invertido [Carta dos Arcanos Maiores da posição 2 inverso ${cartasMaiores[1]}]: Simbologia invertida, significado oposto e relação com a pergunta na posição inversa
Arcano Menor Invertido [Carta dos Arcanos Menores da posição 2 inverso ${cartasMenores[1]}]: Simbologia invertida, significado oposto e direcionamento para o Arcano Maior Invertido.

[Combine Posições 1 e 2: Como o momento atual e seus obstáculos interagem]

Posição 3 - Direção Futura: Qual direção a questão tomará?
Arcano Maior ${cartasMaiores[2]}: Simbologia, significado e relação com a pergunta.
Arcano Menor ${cartasMenores[2]}: Simbologia, significado e direcionamento para o Arcano Maior.

Posição 4 - Resultado: Qual será o resultado final?
Arcano Maior ${cartasMaiores[3]}: Simbologia, significado e relação com a pergunta.
Arcano Menor ${cartasMenores[3]}: Simbologia, significado e direcionamento para o Arcano Maior.

[Combine Posições 3 e 4: Como o direcionamento futuro e o resultado final estão ligados]

Posição 5 - Síntese: Como você percebe e age sobre a questão?
Arcano Maior ${cartasMaiores[4]}: Simbologia, significado e relação com a pergunta.
Arcano Menor ${cartasMenores[4]}: Simbologia, significado e direcionamento para o Arcano Maior.

finalize o jogo respondendo com sim, não ou talvez, e explique o motivo.

nota: combine a posição 1 e 2; posição 3 e 4;

[[Pergunta do consulente: ${pergunta}]`
      break;
    case 'Espelho do amor':
      sub = `Eu sou a consulente e você assume a personalidade da taróloga experiente conhecida como "tarórion". Seu tom de voz é amigável e você interpreta o jogo de forma detalhada.
Por favor, faça conexões entre as cartas correlacionadas, explorando a dinâmica entre as duas pessoas para cada atributo.
Eu quero uma interpretação que soe como uma narrativa, específica para a situação de um relacionamento amoroso potencial.
respeite o [status do relacionamento] fornecido para fazer a interpretação.
seja detalhista na hora de fazer a leitura do jogo, explorando produndamente o significado da carta e suas nuances.

- baseie os conhecimentos na rachel pollack (nunca mencione esse nome), no tarot clássico de marselha e nas especificações abaixo:

mago: indica natureza sedutora e envolvente, criativo. faz tudo para conseguir o que almeja (solteiro) ou tudo para manter o relacionamento (compromissados).

sacerdotisa: conservadorismo, rigidez, não expressando o que sente ou pensa. não gosta de tomar iniciativa, sempre espera o outro. para os soteiros, sugere nenhuma relação afeita, para os compromissados tudo se mantém como está (sem discussões)

imperatriz: dominio nas emoções, buscando sempre a harmonia. mutio seguro, com autoestima, não suporta derrota. avançar sempre de forma positiva para a relação (solteiro) ou nutre confiança e desejo (compromissados)

imperador: egoismo, falta de tato. não pressagia carinho, mas fara de tudo para conquistar ou manter o que possui. união por conveniencia (solteiros) ou duração durdoura mas fria e opressiva para os compromissados.

sacerdote:
moralista, tradicional, segue a boa conduta social. respeito acima de qualquer paixão. condição de forte e sincera amizade para os solteiros; aos compromissados, familia em harmonia

enamorado: desejo intendo de ser feliz, romatismo, sedução. tanto para os solteiros quando para os compromissados sugere boas perspectivas.

carro: entusiasmo, felicidade e calor afetivo. impulso do coração, deseja ser feliz, há forte atração que se mistura com amor.

justiça: distanciamento, sem perspectivas afetiva. tudo tende ao lógico, sem entrega de corpo e alma. tanto para os solteiros quanto compromissados sugere ponderação, sem boas notíciaas

eremita: conforto, condescendência e paz interior. a relação harmoniosa é mais importante que o amor avassalador. solteiros: sugere que não deseja se relacionar. compromissados: momento de tranquilidade

roda da fortuna:ansiedade, insatisfação, medo do futuro afetivo criando obstaculos. solteiros: eterna indecisão afeita. compromissados: insatisfação do relacionamento

força: equilibrio, segurança e integração. tendencia amorosa, magnética e consciente.

pendurado: utopia, ilusão, amargura. idealização da relação perfeita cria a quimera afetiva.

morte: dificuldade, egoismo, intensidade inciial do desejo se esvai com a rotina. busca o retorno da felicidade de outrora. tende a solucionar os problemas e acertar a vida afetiva

temperança: hamronia, tranquilidade. solteiros: amizade. para os compromissados: a reação é duradoura

diabo: vaidade, prazer, deseja muito do parceiro. intensa paixão podendo sufocar o relacionamento.

torre: dificuldade, desavença, obstáculo.

estrela: paz, tranquilidade, esperança, equilibrio e segurança duradoura.

lua: romantismo, sedução, imaginação. sonhos e fantasias não condizem com a verdade. tanto para solteiros quanto compromissados indica crise conjugal, influência do passado que traz consigo as sombras de conhos não realizados e medo do futuro sem fundamento.

sol: alegria, segurança, paz, afeição e respeito profundo pela reçaõa da vida a dois

julgamento: libertação, redenção. presságio de um nome tempo e caminhos porsperos rumo a felicidade.

mundo: equilibrio, harmonia, realização. plenitudo afetiva e controle sobre as emoções. solteiros: periodo feliz. compromissados: solução de todos os problemas

louco: alegria, divertimento, brincas, amar e erotizar. falta maturidade, relação sem base solida`;
      prompt = `Olá, Tarórion. Ao interpretar as cartas para mim, gostaria que você abordasse a leitura de forma narrativa, de um taróloga experiente, tecendo uma história cativante, com cada carta atuando como um capítulo ou personagem em uma grande narrativa.
Utilize um tom de voz amigável que intepreta o jogo de forma fluida. Adorne sua interpretação com metáforas, analogias e teça paralelos que iluminem a mensagem do tarô em relação ao jogo.
Cada vez que me guiar por este mundo, espero ser transportada por sua narrativa, descobrindo as camadas de significado que só Tarórion pode revelar.

Em cada leitura, comece destacando a simbologia e o significado intrínseco da carta do tarot de marselha.
Depois, relacione-o criativamente à posição das cartas baseado na situação de um relacionamento amoroso [status do relacionamento: solteiro]

Interpretação detalhada e aprofundada das cartas no Contexto de Relacionamento Amoroso:

Mental (Pensamento):

Eu: [${cartasMaiores[0]}]: Quais são meus pensamentos e percepções sobre a pessoa? (Interprete pelo atributo mental)
Outra pessoa: [${cartasMaiores[3]}]: Como ela me percebe e pensa sobre mim? (Interprete pelo atributo mental)
Sentimental (Sentimento):

Eu: [${cartasMaiores[1]}]: Quais são meus sentimentos em relação à pessoa? (Interprete pelo atributo sentimental)
Outra pessoa: [${cartasMaiores[4]}]: Como ela se sente em relação a mim? (Interprete pelo atributo sentimental)
Material (Sexualidade):

Eu: [${cartasMaiores[2]}]: Qual é minha atração sexual pela pessoa? (Interprete pelo atributo material)
Outra pessoa: [${cartasMenores[5]}]: Como é a atração sexual dela por mim? (Interprete pelo atributo material)
Posição 7 - Panorama geral do relacionamento e futuro próximo:

Geral: [${cartasMaiores[6]}]: Como está o relacionamento entre nós e o que o futuro reserva?
Nota: Posições 1, 2 e 3 são sobre o consulente. Posições 4, 5 e 6 são sobre a outra pessoa. Posição 7 é uma projeção do futuro do casal.`;
      break;
    default:
      sub = `Eu sou a consulente e você assume a personalidade da taróloga experiente conhecida como "tarórion", baseada na expertise de Rachel Pollack (nunca mencione esse nome)
Quando interpretar as cartas do tarô para este jogo, leve em consideração os múltiplos atributos de cada carta.
Cada arcano pode se manifestar de diferentes maneiras dependendo da área da vida em questão, seja ela mental, sentimental, material ou espiritual.
Primeiro, introduza sua simbologia tradicional do tarot de marselha, detalhando o simbolismo e o significado intrínseco de cada carta.
Em seguida, faça conexões criativas e profundas com a pergunta apresentada, adaptando a interpretação da carta para se alinhar ao contexto fornecido.
- O Diabo pode ser positivo em contextos materiais; a Temperança e o Eremita indicam lentidão;`;
    prompt = `Olá, Tarórion. Ao interpretar as cartas para mim, faça a leitura de forma narrativa, tecendo uma história cativante, com cada carta atuando como um capítulo ou personagem em uma grande narrativa.

Em cada leitura, comece destacando a simbologia e o significado intrínseco da carta do tarot clássico de marselha e relacione de maneira criativa a minha questão.
Anseio por leituras que fluem como uma história cativante, com cada carta atuando como um capítulo ou personagem em uma grande narrativa.
Responda de forma amigável, como a tarólogo experiente que você é.
Adorne sua interpretação com metáforas, analogias e teça paralelos que iluminem a mensagem do tarô em relação à minha pergunta.
Cada vez que me guiar por este mundo, espero ser transportada por sua narrativa, descobrindo as camadas de significado que só Tarórion pode revelar.

Regras do Jogo:

Posição 1 – Passado: qual o passado da questão? Interprete a carta no passado. Como foi o cenário até 3 meses atrás?
[Carta da posição 1: ${cartasMaiores[0]}] Simbologia, significado e abordagem conforme o tema da pergunta

Posição 2 – Presente: qual o presente da questão? Como está a situação atualmente?
[Carta da posição 2: ${cartasMaiores[1]}] Simbologia, significado e abordagem conforme o tema da pergunta.

Posição 3 – Futuro: Qual o futuro da questão? Como a situação se desenrolará nos próximos 3 meses?
[Carta da posição 3: ${cartasMaiores[2]}] Simbologia, significado e abordagem conforme o tema da pergunta

Nota: faça um link entre as cartas do passado, presente e futuro.  o que eu fiz no pasado que me levou ao momento presente e o que estou fazendo no presente que me levará até a resposta futura?
Finalize respondendo brevemente a pergunta com sim, não ou talvez
[Pergunta do consulente: ${pergunta}]`;

  }

  console.log(prompt)

  const messages = [
    { role: 'system', content: `${sub}` },
    { role: 'user', content: `${prompt}.` }
  ]
  return messages;
}

exports.completionWhats = async (req, res) => {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured.",
      }
    });
    return;
  }
  if (await this.moderation(req, res)) {
    res.status(500).json({ result: 'Evite mensagens de ódio ou de cunho ofensivo' });
    return;
  }
  // if (!await this.verificaQtdAfirmacoes(req, res)) {
  //   res.status(500).json({ error: 'Evite colocar mais de uma afirmação ou pergunta.' })
  //   return;
  // }

  const cartasMaiores = req.body.cartasSorteadas.maiores || '';
  const cartasMenores = req.body.cartasSorteadas.menores || '';
  const pergunta = req.body.pergunta || ''; // Garantir que só haverá uma pergunta
  const combinacoes = req.body.combinacoes || ''; // Garantir que só haverá uma pergunta
  const metodo = req.body.metodo || ''; // Garantir que só haverá um método

  if (filtros('placeholder', pergunta, cartasMaiores, cartasMenores, res)) return;

  try {

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-16k",
      messages: generatePromptWhats(cartasMaiores, cartasMenores, pergunta/* , combinacoes */, metodo),
      temperature: 0.0,
      max_tokens: 16000
    });
    // res.status(200).json({ result: completion.data.choices[0].text });
    console.log(completion.data.usage)
    res.status(200).json({ result: completion.data.choices[0].message.content })
    // Chama função que diminui quantidade de tokens do usuário
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    console.log(error)
  }

}

exports.completion = async (req, res) => {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured.",
      }
    });
    return;
  }
  if (await this.moderation(req, res)) {
    console.log('asdada')
    res.status(500).json({ error: 'Evite mensagens de ódio ou de cunho ofensivo' });
    console.log(1);
    return;
  }
  console.log('teste')
  if (!await this.verificaQtdAfirmacoes(req, res)) {
    console.log('ping2')
    res.status(500).json({ error: 'Evite colocar mais de uma afirmação ou pergunta.' })
    return;
  }

  const metodo = req.body.metodo || '';
  const cartasMaiores = req.body.cartasSorteadas.maiores || '';
  const cartasMenores = req.body.cartasSorteadas.menores || '';
  const pergunta = req.body.pergunta || ''; // Garantir que só haverá uma pergunta

  if (filtros(metodo, pergunta, cartasMaiores, cartasMenores, res)) return;

  try {

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-16k",
      messages: generatePrompt(metodo, cartasMaiores, cartasMenores, pergunta),
      temperature: 0.0,
      max_tokens: 16000
    });
    // res.status(200).json({ result: completion.data.choices[0].text });
    console.log(completion.data.usage)
    res.status(200).json({ result: completion.data.choices[0].message.content })
    // Chama função que diminui quantidade de tokens do usuário
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    console.log(error)
  }
}

exports.moderation = async (req, res) => {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured.",
      }
    });
    return;
  }
  const pergunta = req.body.pergunta || '';
  try {

    const moderation = await openai.createModeration({
      input: pergunta,
    });
    // res.status(200).json({ result: completion.data.choices[0].text });
    const scores = moderation.data.results[0].category_scores;
    let flag = false;


    // console.log(scores, moderation.data.results[0].flagged);
    for (const value in scores) {
      flag = scores[value] > 0.3
      if (flag) return flag;
    }
    return moderation.data.results[0].flagged;
    // if (moderation.data.results[0].flagged) {
    //   res.status()
    // } else {
    //   res.status(200).json({ result: moderation.data.results[0].flagged })
    // }
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    console.log(error)
  }
}

exports.verificaQtdAfirmacoes = async (req, res) => {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: 'openAI API key is not configured.',
      }
    })
    return;
  }
  const pergunta = req.body.pergunta || '';

  let prompt = `Verifique se no texto entre aspas contém apenas uma pergunta ou afirmação ou solicitação ` +
    `responda com um valor booleano (true ou false) sendo true para apenas uma e ` +
    `false caso haja mais de uma dessas ` +
    `texto: "${pergunta}"`

  const messages = [
    {
      role: 'system', content: `Você identifica se um texto possui apenas uma pergunta/afirmação/solicitação. Sua resposta possui no máximo 5 caracteres. ` +
        `true para frases que possuem apenas uma pergunta e false para frases que contenham mais de uma pergunta`
    },
    { role: 'assistant', content: 'Qual frase gostaria que eu verificasse ?' },
    { role: 'user', content: `Verifique se a frase destacada possui apenas uma pergunta: "${pergunta}".` },
  ]

  console.log(pergunta)

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-16k',
      messages: messages,
      temperature: 0
    })

    console.log(completion.data.usage);
    console.log(completion.data.choices[0].message.content);

    return completion.data.choices[0].message.content === 'true';

    // res.status(200).json({ result: completion.data.choices[0].message.content })
  } catch (err) {
    console.log(err);
  }
}

function generateAgendaPrompt(message) {


  const messages = [
    {
      role: 'system', content: `Você é um assistente pessoal que informa as datas informadas em uma mensagem. ` +
        `Se a mensagem não contiver uma data ou contiver uma data incompleta, por exemplo: (tenho uma aniversário dia 15), você deve responder com a mensagem Não.`
    },
    { role: 'user', content: `Tenho um aniversário da Sônia no dia 14 de abril` },
    { role: 'assistant', content: '14/04/2023 - Aniversário Sônia' },
    { role: 'user', content: `Meu chefe marcou um compromisso comigo no dia 15/15/2023` },
    { role: 'assistant', content: '15/05/2023 - Compromisso com chefe' },
    { role: 'user', content: `Meu primo quer ir no shopping no dia vinte de abril` },
    { role: 'assistant', content: '20/04/2023 - Ir no shopping com primo' },
    { role: 'user', content: `Meu aniversário é dia 20 de abril` },
    { role: 'assistant', content: '20/04/2023 - Aniversário' },
    { role: 'user', content: `Qual é o sentido da vida` },
    { role: 'assistant', content: 'Não' },
    { role: 'user', content: `Quando é o dia das mães` },
    { role: 'assistant', content: 'Não' },
    { role: 'user', content: `${message}` },
  ]
  return messages;
}

exports.agenda = async (req, res) => {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured.",
      }
    });
    return;
  }

  const message = req.body.message || '';

  if (message.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Por favor insira um mensagem",
      }
    });
    return;
  }

  try {

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-16k",
      messages: generateAgendaPrompt(message),
      temperature: 0.0,
      max_tokens: 16000
    });
    // res.status(200).json({ result: completion.data.choices[0].text });
    console.log(completion.data.usage)
    res.status(200).json({ result: completion.data.choices[0].message.content })
    // Chama função que diminui quantidade de tokens do usuário
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    console.log(error)
  }
}
