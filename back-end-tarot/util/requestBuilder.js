const facebook = require('./urls');


exports.textMessage = (from, message, token, number) => {
    let body = {
        method: "POST",
        url: facebook.url(number, token),
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        data: {
            messaging_product: "whatsapp",
            to: from,
            type: "text",
            text: {
                preview_url: false,
                body: message,
            },

            // text: { body: "Ack: " + followUp },
        },
    }
    return body;

}

exports.fullMessage = (from, message, token, number) => {
    let body = {
        method: "POST",
        url: facebook.url(number, token),
        headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        },
        data: {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: from,
            type: "interactive",
            interactive: {
                type: "button",
                header: {
                    type: 'text',
                    text: message.header
                },
                body: {
                    text: message.body,
                },
                footer: {
                    text: message.footer,
                }
            }
        }
    }
    return body;
}


exports.interactiveMessage = (from, message, buttons, token, number, i) => {
    if (message instanceof Object) {
        let body = {
            method: "POST",
            url: facebook.url(number, token),
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
            },
            data: {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: from,
                type: "interactive",
                interactive: {
                    type: "button",
                    header: {
                        type: 'text',
                        text: message.header
                    },
                    body: {
                        text: message.body,
                    },
                    action: {
                        buttons: buttons.map((name, index) => {
                            return {
                                type: "reply",
                                reply: {
                                    id: index + i,
                                    title: name,
                                },
                            };
                        })
                    },
                },

                // text: { body: "Ack: " + followUp },
            },
        }
        return body;
    } else {
        let body = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: from,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: {
                        text: message
                    },
                    action: {
                        buttons: buttons.map((name, index) => {
                            return {
                                type: 'reply',
                                reply: {
                                    id: index + i,
                                    title: name
                                }
                            }
                        })
                    }
                }
            },
        }
        return body;
    }
}

exports.getTokens = async (from) => {
    let body = {
        method: "GET",
        url: await facebook.getUser(from),
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            phone: from,
        }
    }
    console.log(body)
    return body;
}

exports.sorteioCartas = (number) => {
    let body = {
        method: "GET",
        url: facebook.sorteio(number),
        headers: {
            "Content-Type": "application/json",
        }
    }
    return body;
}

exports.completion = (pergunta) => {
    let body = {
        method: "POST",
        url: facebook.url(number, token),
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            pergunta: "whatsapp",
        }
    }
}