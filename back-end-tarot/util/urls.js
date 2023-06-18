exports.url = (numberId) => {

    return "https://graph.facebook.com/v16.0/" +
    numberId + "/messages/";
}

exports.getUser =  (phone) => {
    return 'https://tarotai.onrender.com/user/' + phone + '/'
}

exports.postUser = () => {
    return 'https://tarotai.onrender.com/user/'
}

exports.updateUser = (phone) => {
    return 'https://tarotai.onrender.com/user/' + phone + '/'
}

exports.updateTokens = (phone) => {
    return 'https://tarotai.onrender.com/user/token/' + phone + '/'
}

// exports.updateTokens = (phone) => {
//     return 'http://localhost:3000/user/token/' + phone
// }

exports.updateState = (phone) => {
    return 'https://tarotai.onrender.com/user/state/' + phone + '/'
}

exports.updateQuestion = (phone) => {
    return 'https://tarotai.onrender.com/user/question/' + phone + '/'
}

exports.completion = (id) => {
    return 'https://tarotai.onrender.com/user/' + id + '/'
}

exports.sorteio = (num) => {
    return `https://tarotai.onrender.com/card/sorteio/${num}/`
}

exports.completion = () => {
    return `https://tarotai.onrender.com/ai/whats/`
}

exports.insertOrder = () => {
    return `https://tarotai.onrender.com/order/`
}

// exports.insertOrder = () => {
//     return `http://localhost:3000/order`
// }

exports.updateOrder = (id) => {
    return `https://tarotai.onrender.com/order/${id}/`
};

// exports.updateOrder = (id) => {
//     return `http://localhost:3000/order/${id}`
// }