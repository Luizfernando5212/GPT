const service = require("../service/orderService");

orderController = {
    insertOrder: async (req, res) => {
        service.insertOrder(req, res);
    },
    updateOrder: async (req, res) => {
        service.updateOrder(req, res);
    },
    getOrders: async (req, res) => {
        service.getOrders(req, res);
    },
    getOrderById: async (req, res) => {
        service.getOrderById(req, res);
    },
    deleteOrder: async (req, res) => {
        service.deleteOrder(req, res);
    },
    getOrdersById: async (req, res) => {
        service.getOrdersByUser(req, res);
    }
}

module.exports = orderController;