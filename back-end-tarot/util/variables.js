let cristais = [
    '💛 Citrino',
    '💖 Quartzo Rosa',
    '💚 Quartzo Verde',
    '🤎 Olho de Tigre'
]

let posicoes = [
    'passado',
    'presente',
    'futuro'
]

let metodos = {
    'Espelho do amor': 7,
    'Cruz Celta': 10,
    'Péladan': 10,
    // 'Péladan': 10
}

let metodos2 = [
    'Espelho do amor',
    'Cruz Celta',
    'Péladan',
    // 'Péladan'
]

let espelho = (cartas, nome) => {
    let combinacoes = '';
    combinacoes += `${cartas[0]} saiu na posição 1 e revela o que voce *pensa* sobre ${nome}.\n`;
    combinacoes += `${cartas[3]} saiu na posição 4 e revela o que ${nome} *pensa* sobre você.\n`;
    combinacoes += `${cartas[1]} saiu na posição 2 e revela o que voce *sente* por ${nome}.\n`;
    combinacoes += `${cartas[4]} saiu na posição 5 e revela o que ${nome} *sente* por você.\n`;
    combinacoes += `${cartas[2]} saiu na posição 3 e revela o plano físico e sua *atração sexual* por ${nome}.\n`;
    combinacoes += `${cartas[5]} saiu na posição 6 e revela se ${nome} se sente atraído sexualmente por você.\n`;
    combinacoes += `${cartas[6]} na última posição temos aqui o panorama geral do relacionamento e como se desdobra em um *futuro próximo*.\n`;
    return combinacoes;
}
module.exports = {
    cristais,
    posicoes,
    metodos,
    metodos2,
    espelho
}