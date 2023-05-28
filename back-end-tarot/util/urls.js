exports.url = (numberId, token) => {

    return "https://graph.facebook.com/v12.0/" +
    numberId + "/messages";
}

exports.getUser = async (req, res) => {
    return 'https://tarotai.onrender.com/user'
}