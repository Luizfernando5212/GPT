const service = require('../service/cardService');

cardController = {

    cardsList: async (req, res) => {
        service.getCards(req, res);
    },

    cardDetail: async (req, res) => {
        service.getCardById(req, res);
    },

    insertCard: async (req, res) => {
        service.insertCard(req, res);
    },

    updateCard: async (req, res) => {
        service.updateCard(req, res);
    },

    deleteCard: async (req, res) => {
        service.deleteCard(req, res);
    },

    sorteioCartas: async (req, res) => {
        service.sorteioCartas(req, res);
    },
    boardCard: async (req, res) =>{
        service.boardCard(req, res);
    }
}

module.exports = cardController;