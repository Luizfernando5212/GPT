const router = require('express').Router();
const modelController = require('../controller/modelController');


router.delete('/:id', modelController.deleteModel);
router.put('/:id', modelController.updateModel);
router.post('/', modelController.insertModel);
router.get("/:id", modelController.modelDetail);
router.get('/', modelController.modelsList);

module.exports = router;
