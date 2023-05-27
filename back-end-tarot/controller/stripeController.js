const service = require("../service/stripeService");

stripeController = {

    webHook: async (req, res) => {
        service.webHook(req, res);
    },

}

module.exports = stripeController;