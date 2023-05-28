
exports.textMessage = (from, message) => {
    let body = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: {
            messaging_product: "whatsapp",
            to: from,
            type: "text",
            text: {
                preview_url: true,
                body: message,
            },

            // text: { body: "Ack: " + followUp },
        },
    }

    console.log(body);

    return body;

}

exports.interactiveMessage = (from, message, buttons) => {
    console.log(message);
    console.log(buttons)
    console.log(buttons.map((name, index) => {
        return {
            type: 'reply',
            reply: {
                id: index + 1,
                title: name
            }
        }
    }))
    if (message instanceof Object) {
        let body = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: {
                messaging_product: "whatsapp",
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
                                    id: index + 1,
                                    title: name
                                }
                            }
                        })
                    },
                },

                // text: { body: "Ack: " + followUp },
            },
        }
        console.log(body.body.interactive.action);
        console.log(body)
        return body;
    } else {
        let body = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: {
                messaging_product: "whatsapp",
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
                                    id: index + 1,
                                    title: name
                                }
                            }
                        })
                    },
                },
            },
        }
        console.log(body.body.interactive.action.buttons);
        return body;
    }
}