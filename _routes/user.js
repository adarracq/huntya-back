const express = require('express');
const router = express.Router();

const userCtrl = require('../_controllers/user');
const multer = require('../_middlewares/multer-config');

router.post('/loginOrSignup', userCtrl.loginOrSignup);
router.post('/code', userCtrl.verifyEmailCode);
router.get('/:email', userCtrl.getUserByEmail);
router.get('/id/:id', userCtrl.getUserById);
router.get('/agents/all', userCtrl.getAllAgents);
router.put('/', userCtrl.updateUser);

module.exports = router;