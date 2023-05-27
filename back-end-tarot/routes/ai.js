const router = require('express').Router();
const aiController = require('../controller/aiController');

router.post('/', aiController.responseCompletion);
router.post('/moderation', aiController.moderation);
router.post('/verifica', aiController.verificaAfirmacoes);

module.exports = router;