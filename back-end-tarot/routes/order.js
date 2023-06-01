const router = require('express').Router();
const orderController = require('../controller/orderController');

router.post('/', orderController.insertOrder);
router.put('/:id', orderController.updateOrder);
router.get('/', orderController.getOrders);
router.get("/:id", orderController.getOrderById);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;