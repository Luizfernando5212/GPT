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

let metodos3 = {
    m1: 'Espelho do amor',
    m2: 'Cruz Celta',
    m3: 'Péladan',
    m4: 'tres'
}

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

const cards = {
    'O Mago': [1, 'a01'],
    'A Sacerdotisa': [2, 'a02'],
    'A Imperatriz': [3, 'a03'],
    'O Imperador': [4, 'a04'],
    'O Papa': [5, 'a05'],
    'Os Enamorados': [6, 'a06'],
    'O Carro': [7, 'a07'],
    'A Justiça': [8, 'a08'],
    'O Eremita': [9, 'a09'],
    'A Roda da Fortuna': [10, 'a10'],
    'A Força': [11, 'a11'],
    'O Enforcado': [12, 'a12'],
    'A Morte': [13, 'a13'],
    'A Temperança': [14, 'a14'],
    'O Diabo': [15, 'a15'],
    'A Torre': [16, 'a16'],
    'A Estrela': [17, 'a17'],
    'A Lua': [18, 'a18'],
    'O Sol': [19, 'a19'],
    'O Julgamento': [20, 'a20'],
    'O Mundo': [21, 'a21'],
    'O Louco': [22, 'a22'],
    'Ás de paus': [1, 'b01'],
    '2 de paus': [2, 'b02'],
    '3 de paus': [3, 'b03'],
    '4 de paus': [4, 'b04'],
    '5 de paus': [5, 'b05'],
    '6 de paus': [6, 'b06'],
    '7 de paus': [7, 'b07'],
    '8 de paus': [8, 'b08'],
    '9 de paus': [9, 'b09'],
    '10 de paus': [10, 'b10'],
    'Valete de paus': [11, 'b11'],
    'Cavaleiro de paus': [12, 'b12'],
    'Rainha de paus': [13, 'b13'],
    'Rei de paus': [14, 'b14'],
    'Ás de copas': [1, 'c01'],
    '2 de copas': [2, 'c02'],
    '3 de copas': [3, 'c03'],
    '4 de copas': [4, 'c04'],
    '5 de copas': [5, 'c05'],
    '6 de copas': [6, 'c06'],
    '7 de copas': [7, 'c07'],
    '8 de copas': [8, 'c08'],
    '9 de copas': [9, 'c09'],
    '10 de copas': [10, 'c10'],
    'Valete de copas': [11, 'c11'],
    'Cavaleiro de copas': [12, 'c12'],
    'Rainha de copas': [13, 'c13'],
    'Rei de copas': [14, 'c14'],
    'Ás de ouros': [1, 'd01'],
    '2 de ouros': [2, 'd02'],
    '3 de ouros': [3, 'd03'],
    '4 de ouros': [4, 'd04'],
    '5 de ouros': [5, 'd05'],
    '6 de ouros': [6, 'd06'],
    '7 de ouros': [7, 'd07'],
    '8 de ouros': [8, 'd08'],
    '9 de ouros': [9, 'd09'],
    '10 de ouros': [10, 'd10'],
    'Valete de ouros': [11, 'd11'],
    'Cavaleiro de ouros': [12, 'd12'],
    'Rainha de ouros': [13, 'd13'],
    'Rei de ouros': [14, 'd14'],
    'Ás de espadas': [1, 'e01'],
    '2 de espadas': [2, 'e02'],
    '3 de espadas': [3, 'e03'],
    '4 de espadas': [4, 'e04'],
    '5 de espadas': [5, 'e05'],
    '6 de espadas': [6, 'e06'],
    '7 de espadas': [7, 'e07'],
    '8 de espadas': [8, 'e08'],
    '9 de espadas': [9, 'e09'],
    '10 de espadas': [10, 'e10'],
    'Valete de espadas': [11, 'e11'],
    'Cavaleiro de espadas': [12, 'e12'],
    'Rainha de espadas': [13, 'e13'],
    'Rei de espadas': [14, 'e14']
}

module.exports = {
    cristais,
    posicoes,
    metodos,
    metodos2,
    metodos3,
    espelho,
    cards
}