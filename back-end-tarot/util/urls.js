exports.url = (numberId, token) => {

    return "https://graph.facebook.com/v12.0/" +
    numberId + "/messages";
}

exports.getUser = async (phone) => {
    return 'https://tarotai.onrender.com/user/' + phone
}

exports.sorteio = async(num) => {
    return `https://tarotai.onrender.com/card/sorteio/${num}`
}

exports.completion = async () => {
    return `https://tarotai.onrender.com/ai/whats`
}