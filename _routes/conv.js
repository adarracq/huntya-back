const express = require('express');
const router = express.Router();

const convCtrl = require('../_controllers/conv');
const auth = require('../_middlewares/auth');

router.get('/senderId=:senderId&receiverId=:receiverId', auth,convCtrl.getConv);
router.get('/user/:userId',auth, convCtrl.getUserConvs);
router.get('/read/:convId',auth, convCtrl.readConv);
router.post('/message',auth, convCtrl.sendMessage);
router.put('/report',auth, convCtrl.reportConv);

module.exports = router;