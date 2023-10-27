const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const msgController = require('../controllers/msg-controller');
const Jwt = require('../verifyJWT');

/* GET users listing. */
router.get('/:username', Jwt.verify, userController.view_user);

router.post('/:username', Jwt.verify, userController.edit_user);

router.post(
  '/:username/threads/messages',
  Jwt.verify,
  msgController.new_message
);

router.post(
  '/:username/threads',
  Jwt.verify,
  msgController.new_thread_and_message
);

module.exports = router;
