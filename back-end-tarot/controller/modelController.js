const service = require('../service/modelService');

modelController = {

    modelsList: async (req, res) => {
        service.getModels(req, res);
    },

    modelDetail: async (req, res) => {
        service.getModelById(req, res);
    },

    insertModel: async (req, res) => {
        service.insertModel(req, res);
    },

    updateModel: async (req, res) => {
        service.updateModel(req, res);
    },

    deleteModel: async (req, res) => {
        service.deleteModel(req, res);
    }
}

module.exports = modelController;