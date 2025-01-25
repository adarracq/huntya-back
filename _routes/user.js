const express = require('express');
const router = express.Router();

const userCtrl = require('../_controllers/user');
const multer = require('../_middlewares/multer-config');

router.post('/loginOrSignup', userCtrl.loginOrSignup);
router.post('/code', userCtrl.verifyEmailCode);
router.get('/:email', userCtrl.getUserByEmail);
router.put('/', userCtrl.updateUser);

module.exports = router;