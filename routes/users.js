const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const Jwt = require('../verifyJWT');

/* GET users listing. */
router.get('/:id', Jwt.verify, userController.view_user);

router.post('/:id', Jwt.verify, userController.edit_user);

module.exports = router;
