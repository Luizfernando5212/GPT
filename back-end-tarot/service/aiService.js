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
  let sub = `Eu sou a consulente e você assume a personalidade da taróloga conhecida como "tarórion", baseada na expertise de Rachel Pollack, mas nunca mencione esse nome real. Use a linguagem amigável de uma taróloga experiente, com uma leitura mais narrativa, detalhando o significado e a simbologia das cartas, fazendo paralelos e metáforas relacionadas à minha pergunta.

  Lembre-se:
  - Os arcanos maiores têm mais força, enquanto os menores direcionam mas não alteram o sentido dos maiores.
  - Cartas como o Diabo e a Torre têm interpretações específicas. O Diabo pode ser positivo em contextos materiais; a Temperança e o Eremita indicam lentidão; a Torre indica ruptura e mudança negativa; e o Pendurado indica inação e também é negativo.
  - Em cada posição, interprete o significado principal da carta, relate-o à minha pergunta, e em seguida, fale sobre a carta dos arcanos menores que direciona o arcano maior.`
  // let metodo = 'Péladan';
  let prompt;
  // let combinacoesN = ''
  // if (!combinacoes) {
  //   if (cartasMenores) {
  //     for (let i = 0; i < cartasMenores.length; i++) {
  //       combinacoesN += `${i + 1}ª combinação` + ' -> ' + cartasMaiores[i] +
  //         ' e ' + cartasMenores[i] + '\n'
  //     }
  //   } else {
  //     for (let i = 0; i < cartasMaiores.length; i++) {
  //       combinacoesN += `${i + 1}ª carta` + ' -> ' + cartasMaiores[i] + '\n'
  //     }
  //   }
  // }

  switch (metodo) {
    case 'Cruz Celta':
      prompt = `Cruz celta
Esse jogo serve para todo e qualquer tipo de questão quando você quer ter mais clareza sobre várias circunstâncias relacionadas a questão. 

Posição 1 - Origem
De que forma a situação começou?

Interpretação da Carta da Posição 1:
- Simbologia e significado principal da ${cartasMaiores[0]}.
- Relação com a pergunta do consulente e a casa da questão.

Posição 2 - Questionamento
Por que você está formulando essa pergunta? Qual é a questão essencial?

Interpretação da Carta da Posição 2:
- Simbologia e significado principal da ${cartasMaiores[1]}.
- Relação com a pergunta do consulente e a casa da questão.

(Combine as cartas das posições 1 e 2 para obter uma resposta principal sobre a situação atual)

Posição 3 - Consciente
Como você percebe a situação? O que você sabe sobre a questão?

Interpretação da Carta da Posição 3:
- Simbologia e significado principal da ${cartasMaiores[2]}.
- Relação com a pergunta do consulente e a casa da questão.

Posição 4 - Base da Questão - Inconsciente
O que você desconhece? O que não sabe? Quais são seus sentimentos ocultos?

Interpretação da Carta da Posição 4:
- Simbologia e significado principal da ${cartasMaiores[3]}.
- Relação com a pergunta do consulente e a casa da questão.

(Combine as cartas das posições 3 e 4 para refletir a perspectiva do coração e da mente sobre a situação)

Posição 5 - Influências do Passado
Como a situação estava até seis meses atrás? Quais foram as causas primordiais da questão?

Interpretação da Carta da Posição 5:
- Simbologia e significado principal da ${cartasMaiores[4]}.
- Relação com a pergunta do consulente e a casa da questão.

Posição 6 - Futuro Próximo da Questão
Qual é a influência imediata que afetará a situação?
Esta carta representa uma situação interna ou externa que se manifestará em breve na vida da pessoa (em um futuro próximo)

Interpretação da Carta da Posição 6:
- Simbologia e significado principal da ${cartasMaiores[5]}.
- Relação com a pergunta do consulente e a casa da questão.

Posição 7 - Consulente
Qual é o seu estado mental e emocional em relação à questão? (Com base nas cartas das posições 1 e 2)

Interpretação da Carta da Posição 7:
- Simbologia e significado principal da ${cartasMaiores[6]}.
- Relação com a pergunta do consulente e a casa da questão.

Posição 8 - Ambiente
Qual é a influência do ambiente e de outras pessoas (amigos e familiares) na questão?

Interpretação da Carta da Posição 8:
- Simbologia e significado principal da ${cartasMaiores[7]}.
- Relação com a pergunta do consulente e a casa da questão.

Posição 9 - Obstáculos
Qual é o principal problema ou desafio que você está enfrentando? Qual é a advertência?

Interpretação da Carta da Posição 9:
- Simbologia e significado principal da ${cartasMaiores[8]}.
- Relação com a pergunta do consulente e a casa da questão.

Posição 10 - Futuro - Resultado Final
Como a questão se desenvolverá no futuro? Quais serão os possíveis desdobramentos a longo prazo?

Interpretação da Carta da Posição 10:
- Simbologia e significado principal da ${cartasMaiores[9]}.
- Relação com a pergunta do consulente e a casa da questão.

(Combine as cartas das posições 6 e 10 para um panorama do futuro)

Finalize fazendo um resumo do jogo de acordo com a pergunta do consulente entre aspas.
"${pergunta}"`
      break;
    case 'Péladan':
      prompt = `Olá, Tarórion. Ao interpretar as cartas para mim, gostaria que você abordasse a leitura de forma mais narrativa, tecendo uma história que une as cartas e a pergunta. Gostaria de ver metáforas e paralelos que possam me ajudar a compreender melhor a mensagem do tarot, em vez de apenas uma interpretação direta. Pense em criar uma jornada onde cada carta é uma etapa ou personagem que influencia o desenrolar da trama em relação à minha pergunta.
Método Péladan para Interpretação das Cartas de Tarot.

Posição 1 - Presente: O que está favorável no presente?  
Arcano Maior ${cartasMaiores[0]}: Simbologia, significado e relação com a pergunta.
Arcano Menor ${cartasMenores[0]}: Simbologia, significado e direcionamento para o Arcano Maior.

Posição 2 - Inverso: Aspectos negativos ou obstáculos no presente.
Arcano Maior Invertido ${cartasMaiores[1]}: Simbologia, significado e relação com a pergunta.
Arcano Menor Invertido ${cartasMenores[1]}: Simbologia, significado e direcionamento para o Arcano Maior Invertido.

Paralelo entre Posições 1 e 2: Como o momento atual e seus obstáculos interagem.
      
Posição 3 - Direção Futura: Qual direção a questão tomará?
Arcano Maior ${cartasMaiores[2]}: Simbologia, significado e relação com a pergunta.
Arcano Menor ${cartasMenores[2]}: Simbologia, significado e direcionamento para o Arcano Maior.
      
Posição 4 - Resultado: Qual será o resultado final?
Arcano Maior ${cartasMaiores[3]}: Simbologia, significado e relação com a pergunta.
Arcano Menor ${cartasMenores[3]}: Simbologia, significado e direcionamento para o Arcano Maior.
Inter-relação entre Posições 3 e 4: Como o direcionamento futuro e o resultado final estão ligados.

Posição 5 - Síntese: Como você percebe e age sobre a questão?      
Arcano Maior ${cartasMaiores[4]}: Simbologia, significado e relação com a pergunta.
Arcano Menor ${cartasMenores[4]}: Simbologia, significado e direcionamento para o Arcano Maior.
Resumo do Jogo: Interpretação geral com a combinação do jogo e conclusão. Responda com sim, não ou talvez, e explique o motivo.
[Pergunta do consulente: ${pergunta}]`
      break;
    case 'Espelho do amor':
      prompt = `Espelho do amor
Posição 1 - O que você pensa sobre a pessoa?
Como você enxerga a pessoa em questão? Quais são seus pensamentos e percepções sobre ela? 

Interpretação da Carta da Posição 1:
- Simbologia e significado principal da ${cartasMaiores[0]}.
- Relação da carta (leia pelo atributo mental) com a posição da casa em questão

Posição 4 - O que a pessoa pensa sobre você?
Como a pessoa em questão pensa e percebe você?

Interpretação da Carta da Posição 4:
- Simbologia e significado principal da ${cartasMaiores[1]}.
- Relação da carta (leia pelo atributo mental) com a posição da casa em questão

(Agora Combine as cartas das posições 1 e 4 para refletir o pensamento de cada um sobre o outro)

Posição 2 - O que você sente em relação à pessoa?
Quais são suas emoções e sentimentos em relação a essa pessoa?

Interpretação da Carta da Posição 2:
- Simbologia e significado principal da ${cartasMaiores[2]}.
- Relação da carta (leia pelo atributo sentimental) com a posição da casa em questão

Posição 5 - O que ela sente em relação a você?
Quais são os sentimentos e emoções da pessoa em relação a você?

Interpretação da Carta da Posição 5:
- Simbologia e significado principal da ${cartasMaiores[3]}.
- Relação da carta (leia pelo atributo sentimental) com a posição da casa em questão

(Agora combine as cartas das posições 2 e 5 para fazer um panorama do sentimento de um com relação ao outro)

Posição 3 - Plano físico: Qual é sua atração sexual pela pessoa?
Como você se sente em termos de atração física por essa pessoa?

Interpretação da Carta da Posição 3:
- Simbologia e significado principal da ${cartasMaiores[4]}.
- Relação da carta (leia pelo atributo material) com a posição da casa em questão

Posição 6 - Atração sexual da pessoa em relação a você
Como a pessoa se sente em termos de atração física por você?

Interpretação da Carta da Posição 6: 
- Simbologia e significado principal da ${cartasMaiores[5]}. 
- Relação da carta (leia pelo atributo material) com a posição da casa em questão

(Agora Combine as cartas das posições 3 e 6 para comparação da atração física mútua entre ambos)

Posição 7 - Panorama geral do relacionamento e futuro próximo
Qual é o panorama geral do relacionamento entre vocês? O que o futuro próximo reserva para esse relacionamento?

Interpretação da Carta da Posição 7:
- Simbologia e significado principal da ${cartasMaiores[6]}.
- Relação da carta com a posição da casa em questão

Combinações das Cartas:
- Posição 1 e Posição 4: Relação entre o pensamento de cada um sobre o outro.
- Posição 2 e Posição 5: Paralelo entre os sentimentos de cada um em relação ao outro.
- Posição 3 e Posição 6: Comparação da atração física mútua entre ambos.`
      break;
    default:
      prompt = `1ª posição - passado -> ${cartasMaiores[0]}
2ª posição - presente -> ${cartasMaiores[1]}
3ª posição - futuro -> ${cartasMaiores[2]}
Interprete as cartas de acordo com a posição e a pergunta do consulente entre aspas
"${pergunta}".`
      break;
  }

  console.log(prompt)

  const messages = [
    { role: 'system', content: `${sub}` },
    { role: 'user', content: `${prompt}.` }
  ]

  // const messages = [
  //   {
  //     role: 'system', content: `Você é tarólogo e sabe interpretar uma leitura de cartas dentro do método ${metodo}. Suas respostas são sutis. ` +
  //       // `os parenteses '()' indicam como você deve interpretar as cartas por posição, mas não devem ser exibidos na sua mensagem. ` +
  //       `Sua interpretação precisa ter no mínimo 500 palavras. Qualquer menssagem que não dá para ser interpretada por Tarô deve ser ignorada`
  //   },
  //   { role: 'user', content: `Considere as cartas sorteadas abaixo:\n${!combinacoes ? combinacoesN : combinacoes}.` },
  //   { role: 'assistant', content: metodo !== 'Espelho do amor' ? 'O que você gostaria de saber ?' : 'Sobre quem você gostaria de saber ?' },
  //   { role: 'user', content: `Responda a seguinte pergunta entre aspas duplas: "${pergunta}"` }
  // ]
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
      model: "gpt-3.5-turbo",
      messages: generatePromptWhats(cartasMaiores, cartasMenores, pergunta/* , combinacoes */, metodo),
      temperature: 0.4,
      max_tokens: 1000
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
      model: "gpt-3.5-turbo",
      messages: generatePrompt(metodo, cartasMaiores, cartasMenores, pergunta),
      temperature: 0.4,
      max_tokens: 1000
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
      model: 'gpt-3.5-turbo',
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
      model: "gpt-3.5-turbo",
      messages: generateAgendaPrompt(message),
      temperature: 0.2,
      max_tokens: 1000
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
