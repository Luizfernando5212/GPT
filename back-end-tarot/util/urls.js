exports.url = (numberId, token) => {

    return "https://graph.facebook.com/v12.0/" +
    numberId + "/messages?access_token=";
}