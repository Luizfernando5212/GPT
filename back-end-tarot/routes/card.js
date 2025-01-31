const router = require('express').Router();
const cardController = require('../controller/cardController');

// var upload = multer({ storage: storage });

router.delete('/:id', cardController.deleteCard);
router.put('/:id', cardController.updateCard);
router.post('/', cardController.insertCard);
router.get("/:id", cardController.cardDetail);
router.get('/', cardController.cardsList);
router.get('/sorteio/:num', cardController.sorteioCartas);
router.get('/board/*', cardController.boardCard);
router.get('/image/*', cardController.boardNew);

module.exports = router;