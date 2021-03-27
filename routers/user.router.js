const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.ctrl');

router.post('/create', userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/profile/:userId', userCtrl.getUser);

module.exports = router;