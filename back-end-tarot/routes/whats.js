const router = require('express').Router();
const whatsController = require('../controller/whatsController');

router.post('/', whatsController.webHook);
router.get('/', whatsController.getAccess);

module.exports = router;