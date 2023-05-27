const router = require('express').Router();
const stripeController = require('../controller/stripeController');

router.post('/', stripeController.webHook);
// router.post('/moderation', aiController.moderation);
// router.post('/verifica', aiController.verificaAfirmacoes);

module.exports = router;