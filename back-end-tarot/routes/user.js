const router = require('express').Router();

const userController = require('../service/userService');
const auth = require('../authentication/auth');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/login', userController.verifyUser);

router.post('/', userController.newUser);

router.put('/:id', userController.updateUser);

router.put('/token/:phone', userController.updateTokens);

router.put('/state/:phone', userController.updateState);

router.put('/question/:phone', userController.updateQuestion);

router.get('/', userController.getUsers);

router.get('/:phone', userController.getUserByPhone);

module.exports = router;