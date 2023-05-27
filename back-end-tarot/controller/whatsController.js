const service = require("../service/whatsService");

whatsController = {

    webHook: async (req, res) => {
        service.webHook(req, res);
    },

    getAccess: async (req, res) => {
        service.getAccess(req, res);
    },

}

module.exports = whatsController;