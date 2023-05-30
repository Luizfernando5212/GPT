exports.url = (numberId, token) => {

    return "https://graph.facebook.com/v12.0/" +
    numberId + "/messages";
}

exports.getUser =  (phone) => {
    return 'https://tarotai.onrender.com/user/' + phone
}

exports.postUser = () => {
    return 'https://tarotai.onrender.com/user'
}

exports.updateState = (phone) => {
    return 'https://tarotai.onrender.com/user/state/' + phone
}

exports.updateQuestion = (phone) => {
    return 'https://tarotai.onrender.com/user/question/' + phone
}

exports.completion = (id) => {
    return 'https://tarotai.onrender.com/user/' + id
}

exports.sorteio = (num) => {
    return `https://tarotai.onrender.com/card/sorteio/${num}`
}

exports.completion = () => {
    return `https://tarotai.onrender.com/ai/whats`
}