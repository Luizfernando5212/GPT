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

router.get('/', userController.getUsers);

module.exports = router;