const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller.jsx');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/log-in', authController.log_in);

router.post('/sign-up', authController.sign_up);

module.exports = router;
