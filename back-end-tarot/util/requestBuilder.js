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
                },
                action: {
                    buttons: [
                        // {
                        //     type: "reply",
                        //     reply: {
                        //         id: 20,
                        //         title: 'Encerrar interação.'
                        //     }
                        // },
                        // {
                        //     type: "reply",
                        //     reply: {
                        //         id: 21,
                        //         title: 'Sortear outra carta'
                        //     }
                        // }
                    ]
                }
            },
            
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

exports.interactiveListMessage = (from, message, buttons, token, number, i) => {

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
                type: "list",
                body: {
                    text: message
                },
                action: {
                    button: "BUTTON_TEXT",
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

exports.postUser = (from, name) => {
    let body = {
        method: "POST",
        url: facebook.postUser(),
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            phone: from,
            name: name,
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

exports.completion = (pergunta, cartasSorteadas) => {
    let body = {
        method: "POST",
        url: facebook.url(number, token),
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            cartasSorteadas,
            pergunta: pergunta,
        }
    }
    return body;
} 