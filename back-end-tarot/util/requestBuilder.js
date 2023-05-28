
exports.textMessage = (from, message, user) => {
    if (user === undefined) {
        let body = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            data: {
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
        return body;
    } else {
        let body = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                messaging_product: "whatsapp",
                to: from,
                type: "text",
                text: {
                    preview_url: true,
                    body: message + ' ' + user,
                },
    
                // text: { body: "Ack: " + followUp },
            },
        }
        return body;
    }
    
}

exports.interactiveMessage = (from, message, user, buttons) => {
    if (message instanceof Object) {
        let body = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                messaging_product: "whatsapp",
                to: from,
                type: "interactive",
                interactive: {
                    type: "button",
                    header: {
                        type: 'text',
                        text: message.header + ' ' + user
                    },
                    body: {
                        text: message.body,
                    },
                    action: {
                        buttons: buttons.map((name, index) => {
                            return {
                                type: 'reply',
                                reply: {
                                    id: index,
                                    title: name
                                }
                            }
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
                                    id: index,
                                    title: name
                                }
                            }
                        })
                    },
                },
            },
        }

        return body;
    }
}