exports.url = (numberId, token) => {
    "https://graph.facebook.com/v12.0/" +
        numberId +
        "/messages?access_token=" +
        token
}