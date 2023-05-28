const service = require("../service/aiService");

aiController = {

    responseCompletion: async (req, res) => {
        service.completion(req, res);
    },

    moderation: async (req, res ) => {
        service.moderation(req, res);
    },
    verificaAfirmacoes: async (req, res) => {
        service.verificaQtdAfirmacoes(req, res);
    },
    responseCompletionWhats: async (req, res) => {
        service.completionWhats(req, res);
    }
}

module.exports = aiController;