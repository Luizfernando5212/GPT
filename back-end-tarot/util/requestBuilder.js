require('dotenv').config();
const facebook = require('./urls');
const token = process.env.WHATSAPP_TOKEN;
const phoneNumber = process.env.PHONE_NUMBER_ID;


exports.textMessage = (from, message) => {
    let body = {
        method: "POST",
        url: facebook.url(phoneNumber),
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

exports.fullMessage = (from, message, buttons, i) => {
    let body = {
        method: "POST",
        url: facebook.url(phoneNumber),
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
                },
                action: {
                    buttons: buttons.map((name, index) => {
                        console.log(index)
                        return {
                            type: "reply",
                            reply: {
                                id: index + i,
                                title: name,
                            },
                        };
                    })
                }
            },

        }
    }
    return body;
}


exports.interactiveMessage = (from, message, buttons, i) => {
    if (message instanceof Object) {
        let body = {
            method: "POST",
            url: facebook.url(phoneNumber),
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
            url: facebook.url(phoneNumber),
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
                    body: {
                        text: message,
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

exports.interactiveListMessage = (from, message, buttons, name, i) => {

    let body = {
        method: "POST",
        url: facebook.url(phoneNumber),
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
                type: "list",
                body: {
                    text: message
                },
                action: {
                    button: name,
                    sections: [
                        {
                            title: "SECTION_1_TITLE",
                            rows: buttons.map((name, index) => {
                                return {
                                    id: index + i,
                                    title: name,
                                }
                            })
                        }
                    ]
                }
            }
        }
    }
    return body;
}

exports.mediaMessage = (from, img) => {
    let body = {
        method: "POST",
        url: facebook.url(phoneNumber),
        headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        },
        data: {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: from,
            type: "image",
            image: {
                link: img,
            },
        },
    }
    return body;
}

exports.getUser = (from) => {
    let body = {
        method: "GET",
        url: facebook.getUser(from),
        headers: {
            "Content-Type": "application/json",
        }
    }
    return body;
}

exports.postUser = (from, nome, whatsapp) => {
    let body = {
        method: "POST",
        url: facebook.postUser(),
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            phone: from,
            nome: nome,
            whatsapp: whatsapp,
        },
    }
    return body;
}

exports.updateUser = (from, nome, whatsapp) => {
    let body = {
        method: "PUT",
        url: facebook.updateUser(from),
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            nome: nome,
            whatsapp: whatsapp,
        },
    }
    return body;
}

exports.updateState = (from, state) => {
    let body = {
        method: "PUT",
        url: facebook.updateState(from),
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            state: state,
        },
    }
    return body;
}

exports.updateQuestion = (from, question) => {
    let body = {
        method: "PUT",
        url: facebook.updateQuestion(from),
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            question: question,
        },
    }

    return body;
}

exports.updateTokens = (phone, tokens) => {
    let body = {
        method: "PUT",
        url: facebook.updateTokens(phone),
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            token: tokens,
        },
    }
    return body;
}

exports.sorteioCartas = (number) => {
    console.log(number)
    let body = {
        method: "GET",
        url: facebook.sorteio(number),
        headers: {
            "Content-Type": "application/json",
        }
    }
    return body;
}

exports.completion = (pergunta, cartasSorteadas, combinacoes) => {
    let body = {
        method: "POST",
        url: facebook.completion(),
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            cartasSorteadas,
            pergunta: pergunta,
            combinacoes: combinacoes
        }
    }
    return body;
}

exports.insertOrder = (order, phone) => {
    let body = {
        method: "POST",
        url: facebook.insertOrder(),
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            order: order,
            phone: phone,
        }
    }
    return body;
}

exports.updateOrder = (id, order, phone) => {
    let body = {
        method: "PUT",
        url: facebook.updateOrder(id),
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            order: order,
            phone: phone,
        }
    }
    return body;
}