const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

// import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function filtros(req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured.",
      }
    });
    return true;
  }
  if (await this.moderation(req, res)) {
    console.log('asdada')
    res.status(500).json({ error: 'Evite mensagens de ódio ou de cunho ofensivo' });
    console.log(1);
    return true;
  }
  console.log('teste')
  if (!await this.verificaQtdAfirmacoes(req, res)) {
    console.log('ping2')
    res.status(500).json({ error: 'Evite colocar mais de uma afirmação ou pergunta.' })
    return true;
  }
  return false
}

async function filtros2(metodo, pergunta, cartasMairoes, cartasMenores, res) {
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
  if (!cartasMaiores || !cartasMenores) {
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


async function generatePromptWhats(cartasMaiores, cartasMenores, pergunta) {
  let combinacoes = '';
  if (cartasMenores) {
    for (let i = 0; i <= cartasMenores.length; i++) {
      combinacoes += `${i + 1}ª combinação` + ' -> ' + cartasSorteadas.maiores[i] +
        ' e ' + cartasSorteadas.menores[i] + '\n'
    }
  } else {
    for (let i = 0; i <= cartasMaiores.length; i++) {
      combinacoes += `${i + 1}ª carta` + ' -> ' + cartasMaiores[i] + '\n'
    }
  }

  const messages = [
    {
      role: 'system', content: `Você é tarólogo e sabe interpretar uma leitura de cartas dentro do método ${metodo}. Suas respostas são sutis. ` +
        `os parenteses '()' indicam como você deve interpretar as cartas por posição, mas não devem ser exibidos na sua mensagem. ` +
        `Sua interpretação precisa ter no mínimo 500 palavras. Qualquer menssagem que não dá para ser interpretada por Tarô deve ser ignorada`
    },
    { role: 'user', content: `Considere as cartas sorteadas abaixo:\n${combinacoes}.` },
    { role: 'assistant', content: 'O que você gostaria de saber ?' },
    { role: 'user', content: `Responda a seguinte pergunta entre aspas simples: '${pergunta}'` }
  ]
  return messages;
}

exports.completionWhats = async (req, res) => {
  if (filtros(req, res)) return;

  const cartasMaiores = req.body.cartasSorteadas.maiores || '';
  const cartasMenores = req.body.cartasSorteadas.menores || '';
  const pergunta = req.body.pergunta || ''; // Garantir que só haverá uma pergunta

  if (filtros2('placeholder', pergunta, cartasMaiores, cartasMenores, res)) return;

  try {

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: generatePromptWhats(cartasMaiores, cartasMenores, pergunta),
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
  if (filtros(req, res)) return;

  const metodo = req.body.metodo || '';
  const cartasMaiores = req.body.cartasSorteadas.maiores || '';
  const cartasMenores = req.body.cartasSorteadas.menores || '';
  const pergunta = req.body.pergunta || ''; // Garantir que só haverá uma pergunta

  if (filtros2(metodo, pergunta, cartasMaiores, cartasMenores, res)) return;

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
      flag = scores[value] > 0.5
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


