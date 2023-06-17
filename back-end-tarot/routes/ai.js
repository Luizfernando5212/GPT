const router = require('express').Router();
const aiController = require('../controller/aiController');

router.post('/', aiController.responseCompletion);
router.post('/moderation', aiController.moderation);
router.post('/verifica', aiController.verificaAfirmacoes);
router.post('/whats', aiController.responseCompletionWhats);
// router.post('/agenda', aiController.agenda);

module.exports = router;